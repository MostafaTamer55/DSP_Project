# 👥 DSP Learning Platform — Team Collaboration Guide

دليل التعاون وتقسيم المهام بين أعضاء الفريق (UI/UX - Frontend - Backend) لضمان العمل التفرعي بدون أي Merge Conflicts.

---

## 🏗️ 1. التقسيم العام للمشروع (Role Division)

```text
src/
├── components/                 # 🎨 UI/UX System (الأزرار، الكروت، الفورمز، الليأوت)
│   ├── common/                 # Primitives: Button, Badge, Card, ProgressBar
│   ├── forms/                  # Inputs: Input, SearchBar
│   └── layout/                 # Shells: Sidebar, Header, MobileNav
│
├── layouts/                    # إطارات الصفحات الرئيسية
│   ├── AppLayout.jsx           # الإطار الرئيسي للمنصة (Sidebar + Header)
│   ├── AuthLayout.jsx          # إطار شاشات تسجيل الدخول والترحيب
│   └── ExamLayout.jsx          # وضع ملء الشاشة للامتحانات
│
├── features/                   # ⭐ مساحة عمل مطوري الـ Frontend (Feature Modules)
│   ├── auth/                   # [Dev 1] صفحات الدخول والتسجيل
│   ├── settings/               # [Dev 1] إعدادات الحساب والملف الشخصي
│   ├── dashboard/              # [Dev 2] الداشبورد الرئيسي والإحصائيات
│   ├── progress/               # [Dev 2] تتبع تقدم الطالب ومصفوفة المهارات
│   ├── lectures/               # [Dev 3] كتالوج المحاضرات، مشغل الفيديو، والـ PDF
│   ├── sections/               # [Dev 3] كتالوج السكاشن والمعامل والمذكرات
│   └── exams/                  # [Dev 4] بنك الامتحانات والكويزات والنتائج
│
├── lib/                        # 🗄️ Backend Integration (Supabase)
│   ├── supabase.js             # إعداد عميل Supabase
│   └── userData.js             # دوال قراءة وحفظ داتا المستخدمين
│
└── supabase/                   # ملفات الـ Database للـ Backend
    └── schema.sql              # جداول الـ SQL وقواعد الـ Row Level Security (RLS)
```

---

## 🎯 2. مهام كل تيم ومطور (Feature Ownership)

| التيم / المسؤول | المجلد الخاص به في الكود | الصفحات والراوتس (Routes) |
|---|---|---|
| **🎨 UI / UX** | `src/components/`<br>`src/layouts/`<br>`tailwind.config.js` | نظام التصميم، الألوان، الأزرار، الكروت، والهيدر والسايدبار |
| **💻 Dev 1 (Frontend - Auth)** | `src/features/auth/`<br>`src/features/settings/` | `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/settings` |
| **💻 Dev 2 (Frontend - Dashboard)** | `src/features/dashboard/`<br>`src/features/progress/` | `/dashboard`, `/progress` |
| **💻 Dev 3 (Frontend - Lectures)** | `src/features/lectures/`<br>`src/features/sections/` | `/lectures`, `/lectures/:id`, `/sections`, `/sections/:id` |
| **💻 Dev 4 (Frontend - Exams)** | `src/features/exams/` | `/exams`, `/exams/:id`, `/exams/:id/results` |
| **🗄️ Backend Team (Supabase)** | `supabase/`<br>`src/lib/` | إعداد الجداول، سياسات الأمان RLS، وحفظ داتا الطالب |

---

## 🌟 3. القواعد الذهبية لمنع الـ Merge Conflicts

1. **اشتغل داخل مجلدك فقط:**
   * لو إنت **Dev 3** شغال على المحاضرات والسكاشن، كل شغلك يكون داخل `src/features/lectures/` و `src/features/sections/`.
   * لو محتاج زرار أو كارت، استخدم المكونات الجاهزة من `src/components/common/` بدل ما تعمل واحد من الصفر.
2. **لا تعدل كود مطور تاني مباشرة:**
   * إذا احتجت داتا أو دالة من فيتشر تانية، استوردها منها فقط (Import).
3. **التصميم والألوان:**
   * استخدم كلاسات Tailwind الموجودة في المشروع (مثل `bg-[#15313C]`, `text-slate-900`, `bg-[#CCEB74]`) وتجنب الألوان العشوائية.
4. **المفاتيح والحسابات:**
   * لا ترفع ملف `.env.local` إطلاقاً (مدرج في `.gitignore`)، واستخدم `.env.example` كدليل للمفاتيح المطلوبة.

---

## 💻 4. خطوات البدء لأي مبرمج جديد (Quick Workflow)

```bash
# 1. اسحب أحدث نسخة من الكود
git pull origin main

# 2. أنشئ فرع جديد خاص بشغلك
git checkout -b feature/your-feature-name

# 3. ثبّت الحزم وشغّل السيرفر
npm install
npm run dev

# 4. بعد ما تخلص شغلك، ارفع الفرع الخاص بيك
git add .
git commit -m "feat: your descriptive commit message"
git push origin feature/your-feature-name
```
