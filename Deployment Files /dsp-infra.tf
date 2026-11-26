# =====================================================================
#  DSP Learning Platform - AWS Infrastructure
#
#  Resources created by this configuration:
#   VPC -> Public Subnet -> Internet Gateway -> Route Table
#   Security Group -> Ubuntu EC2 (Nginx + React build) -> Elastic IP
#   Optional: IAM Role for connecting through AWS Systems Manager Session Manager
#
#  Deploy: terraform init, then terraform apply
#  Remove all managed resources: terraform destroy
# =====================================================================

terraform {
  required_version = ">= 1.3"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    http = {
      source  = "hashicorp/http"
      version = "~> 3.0"
    }
  }
}

# ---------------------------------------------------------------------
#  Input Variables
# ---------------------------------------------------------------------
variable "region" {
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  type    = string
  default = "dsp"
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  type    = string
  default = "10.0.1.0/24"
}

variable "instance_type" {
  type    = string
  default = "t3.micro" # Use t2.micro if t3.micro is unavailable for your account.
}

# Leave empty to detect the current public IP automatically and allow SSH only from that IP.
variable "my_ip_cidr" {
  type    = string
  default = ""
}

# Name of an existing AWS EC2 Key Pair. Leave empty if SSH access is not required.
variable "key_name" {
  type    = string
  default = ""
}

# Set to true to create an IAM Role for Session Manager access (requires IAM permissions).
variable "enable_ssm" {
  type    = bool
  default = false
}

# Supabase project URL and public anon key. Provide the values when Terraform prompts during apply.
variable "supabase_url" {
  type        = string
  description = "Supabase project URL"
}

variable "supabase_anon_key" {
  type        = string
  description = "Supabase anon/public key"
  sensitive   = true
}

variable "repo_url" {
  type    = string
  default = "https://github.com/MostafaTamer55/DSP_Project.git"
}

variable "repo_branch" {
  type    = string
  default = "main"
}

# ---------------------------------------------------------------------
#  Provider Configuration and Data Sources
# ---------------------------------------------------------------------
provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Project   = var.project_name
      ManagedBy = "terraform"
    }
  }
}

# Detect the current public IP address.
data "http" "my_ip" {
  url = "https://checkip.amazonaws.com"
}

locals {
  ssh_cidr = var.my_ip_cidr != "" ? var.my_ip_cidr : "${chomp(data.http.my_ip.response_body)}/32"
}

# Retrieve the available Availability Zones in the selected region.
data "aws_availability_zones" "available" {
  state = "available"
}

# Find the latest Ubuntu 24.04 LTS AMI.
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical (official Ubuntu image publisher).

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }
}

# ---------------------------------------------------------------------
#  1) VPC - Isolated virtual network
# ---------------------------------------------------------------------
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = { Name = "${var.project_name}-vpc" }
}

# ---------------------------------------------------------------------
#  2) Public Subnet - Subnet with a route to the internet
# ---------------------------------------------------------------------
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = { Name = "${var.project_name}-public-subnet" }
}

# ---------------------------------------------------------------------
#  3) Internet Gateway - Provides internet connectivity for the VPC
# ---------------------------------------------------------------------
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = { Name = "${var.project_name}-igw" }
}

# ---------------------------------------------------------------------
#  4) Route Table - Routes internet-bound traffic through the Internet Gateway
# ---------------------------------------------------------------------
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = { Name = "${var.project_name}-public-rt" }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# ---------------------------------------------------------------------
#  5) Security Group - Firewall rules for the EC2 instance
# ---------------------------------------------------------------------
resource "aws_security_group" "web" {
  name        = "${var.project_name}-web-sg"
  description = "HTTP for everyone, SSH from my IP only"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH (my IP only)"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [local.ssh_cidr]
  }

  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-web-sg" }
}

# ---------------------------------------------------------------------
#  6) Optional IAM Role - Enables access through Systems Manager Session Manager
# ---------------------------------------------------------------------
resource "aws_iam_role" "ssm" {
  count = var.enable_ssm ? 1 : 0
  name  = "${var.project_name}-ec2-ssm-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Action    = "sts:AssumeRole"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ssm" {
  count      = var.enable_ssm ? 1 : 0
  role       = aws_iam_role.ssm[0].name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ssm" {
  count = var.enable_ssm ? 1 : 0
  name  = "${var.project_name}-ec2-ssm-profile"
  role  = aws_iam_role.ssm[0].name
}

# ---------------------------------------------------------------------
#  7) EC2 Instance - Ubuntu server bootstrapped with User Data
# ---------------------------------------------------------------------
resource "aws_instance" "web" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.web.id]
  associate_public_ip_address = true
  key_name                    = var.key_name != "" ? var.key_name : null
  iam_instance_profile        = var.enable_ssm ? aws_iam_instance_profile.ssm[0].name : null

  user_data_replace_on_change = true

  metadata_options {
    http_tokens   = "required" # Require IMDSv2 for instance metadata access.
    http_endpoint = "enabled"
  }

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
    encrypted   = true
  }

  user_data = <<TFUSERDATA
#!/bin/bash
set -ex
exec > >(tee -a /var/log/user-data.log) 2>&1

export DEBIAN_FRONTEND=noninteractive
APP_DIR=/opt/dsp-app
WEB_ROOT=/var/www/dsp

# Configure swap space to help the build run on a small-memory instance.
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Install system packages and Node.js.
apt-get update -y
apt-get install -y git nginx curl ca-certificates gnupg
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Clone the application repository and selected branch.
rm -rf $APP_DIR
git clone --branch ${var.repo_branch} --depth 1 ${var.repo_url} $APP_DIR
cd $APP_DIR

# Create the frontend environment file using the variable names from .env.example.
cat > .env <<'ENVEOF'
VITE_SUPABASE_URL=${var.supabase_url}
VITE_SUPABASE_ANON_KEY=${var.supabase_anon_key}
ENVEOF

# Install dependencies and build the React application.
export NODE_OPTIONS="--max-old-space-size=1024"
npm ci || npm install
npm run build

# Publish the generated static files to the Nginx web root.
mkdir -p $WEB_ROOT
rm -rf $WEB_ROOT/*
cp -r dist/* $WEB_ROOT/
chown -R www-data:www-data $WEB_ROOT

# Configure Nginx, including the fallback required by React Router on page refresh.
cat > /etc/nginx/sites-available/dsp <<'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root /var/www/dsp;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/dsp /etc/nginx/sites-enabled/dsp
nginx -t
systemctl enable nginx
systemctl restart nginx

echo "DONE"
TFUSERDATA

  tags = { Name = "${var.project_name}-web-server" }

  depends_on = [aws_internet_gateway.igw]
}

# ---------------------------------------------------------------------
#  8) Elastic IP - Static public IP address for the EC2 instance
# ---------------------------------------------------------------------
resource "aws_eip" "web" {
  instance = aws_instance.web.id
  domain   = "vpc"

  tags = { Name = "${var.project_name}-eip" }

  depends_on = [aws_internet_gateway.igw]
}

# ---------------------------------------------------------------------
#  Terraform Outputs
# ---------------------------------------------------------------------
output "website_url" {
  value = "http://${aws_eip.web.public_ip}"
}

output "public_ip" {
  value = aws_eip.web.public_ip
}

output "vpc_id" {
  value = aws_vpc.main.id
}

output "subnet_id" {
  value = aws_subnet.public.id
}
