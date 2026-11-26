# =====================================================================
#  DSP Learning Platform - Full AWS Infrastructure (ملف واحد)
#
#  اللي بيتعمل:
#   VPC  ->  Public Subnet  ->  Internet Gateway  ->  Route Table
#   Security Group  ->  EC2 (Ubuntu + Nginx + React build)  ->  Elastic IP
#   (اختياري) IAM Role للدخول بـ Session Manager من غير SSH
#
#  التشغيل:   terraform init   ثم   terraform apply
#  المسح:     terraform destroy
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
#  Variables
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
  default = "t3.micro" # لو الأكونت مش بيقبلها جرّبي t2.micro
}

# سيبيها فاضية = Terraform يعرف الـ IP بتاعك لوحده ويفتح SSH ليه بس
variable "my_ip_cidr" {
  type    = string
  default = ""
}

# اسم Key Pair موجود على AWS لو عايزة SSH، أو سيبيه فاضي
variable "key_name" {
  type    = string
  default = ""
}

# true = يعمل IAM Role عشان تدخلي بـ Session Manager (محتاج صلاحيات IAM)
variable "enable_ssm" {
  type    = bool
  default = false
}

# قيم Supabase: Terraform هيسألك عليهم وقت apply (من بتاع الباك / التيم ليدر)
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
#  Provider + Data
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

# اكتشاف الـ IP بتاعك تلقائيًا
data "http" "my_ip" {
  url = "https://checkip.amazonaws.com"
}

locals {
  ssh_cidr = var.my_ip_cidr != "" ? var.my_ip_cidr : "${chomp(data.http.my_ip.response_body)}/32"
}

# أول Availability Zone متاحة
data "aws_availability_zones" "available" {
  state = "available"
}

# أحدث Ubuntu 24.04
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }
}

# ---------------------------------------------------------------------
#  1) VPC = الشبكة الخاصة بيكم
# ---------------------------------------------------------------------
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = { Name = "${var.project_name}-vpc" }
}

# ---------------------------------------------------------------------
#  2) Public Subnet = جزء من الشبكة بيطلع على الإنترنت
# ---------------------------------------------------------------------
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = { Name = "${var.project_name}-public-subnet" }
}

# ---------------------------------------------------------------------
#  3) Internet Gateway = بوابة الإنترنت للـ VPC
# ---------------------------------------------------------------------
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = { Name = "${var.project_name}-igw" }
}

# ---------------------------------------------------------------------
#  4) Route Table = بتقول "أي traffic للإنترنت يعدّي من الـ IGW"
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
#  5) Security Group = الفايروول
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
#  6) (اختياري) IAM Role لـ Session Manager
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
#  7) EC2 = السيرفر + user-data
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
    http_tokens   = "required" # IMDSv2
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

# --- swap (السيرفر الصغير رامه 1GB والـ build محتاج أكتر) ---
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# --- تسطيب الحاجات ---
apt-get update -y
apt-get install -y git nginx curl ca-certificates gnupg
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# --- تحميل المشروع ---
rm -rf $APP_DIR
git clone --branch ${var.repo_branch} --depth 1 ${var.repo_url} $APP_DIR
cd $APP_DIR

# --- ملف env بتاع Supabase (راجعي الأسماء مع .env.example) ---
cat > .env <<'ENVEOF'
VITE_SUPABASE_URL=${var.supabase_url}
VITE_SUPABASE_ANON_KEY=${var.supabase_anon_key}
ENVEOF

# --- build ---
export NODE_OPTIONS="--max-old-space-size=1024"
npm ci || npm install
npm run build

# --- نشر الموقع ---
mkdir -p $WEB_ROOT
rm -rf $WEB_ROOT/*
cp -r dist/* $WEB_ROOT/
chown -R www-data:www-data $WEB_ROOT

# --- إعداد nginx (try_files عشان React Router يشتغل مع refresh) ---
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
#  8) Elastic IP = IP ثابت
# ---------------------------------------------------------------------
resource "aws_eip" "web" {
  instance = aws_instance.web.id
  domain   = "vpc"

  tags = { Name = "${var.project_name}-eip" }

  depends_on = [aws_internet_gateway.igw]
}

# ---------------------------------------------------------------------
#  Outputs
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
