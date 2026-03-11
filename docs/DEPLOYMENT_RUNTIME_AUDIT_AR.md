# تدقيق DevOps + Vercel Deployment لمشروع World Monitor

## النطاق

تمت مراجعة:

- `package.json`
- `vercel.json`
- `.env.example`
- `.npmrc` (تمت إضافته ضمن هذا التحديث)

---

## 1) Local Dev Audit

### 1.1 إدارة الحزم (EPERM/Windows file locking)

**الملاحظة**

- المشروع يستخدم `npm` بشكل أساسي، وهذا قد يتأثر أكثر بمشاكل قفل الملفات على Windows عند تضخم `node_modules`.

**الإجراء المضاف**

- إضافة سكربت اختياري لاستخدام pnpm:
  - `npm run install:pnpm`

**التوصية التشغيلية**

- اعتماد `pnpm` محليًا على Windows عند تكرار مشاكل `EPERM`.
- قبل إعادة التثبيت:
  1. إغلاق VS Code terminals و watchers.
  2. إيقاف أي `vite` أو `vercel dev` قيد العمل.
  3. حذف `node_modules` ثم التثبيت مجددًا.

### 1.2 محاكاة Edge Functions محليًا (vercel dev)

**الملاحظة**

- تشغيل عدد كبير من الدوال محليًا قد يسبب ضغط CPU/RAM.

**الإجراء المضاف**

- سكربتات تشغيل واضحة للمنافذ والذاكرة:
  - `npm run dev:vercel`
  - `npm run dev:vercel:4173`
  - `npm run dev:vercel:mem`

**أفضل ممارسة**

- استخدم `--listen` دائمًا لتجنب تضارب المنافذ.
- عند ثقل المحاكي: استخدم `NODE_OPTIONS=--max-old-space-size=4096`.

---

## 2) Runtime Audit على Vercel

### 2.1 التوافق مع Edge Runtime

**النتيجة**

- الإعداد الحالي متوافق مع نمط Edge.

**قاعدة حوكمة مستقبلية (مقترحة)**

- أي مكتبة جديدة يجب أن تكون:
  - Web Standard API compatible
  - بدون اعتماد Node C++ addons
  - بدون استخدام `eval`/dynamic code execution غير المدعوم

### 2.2 Build & Caching Strategy

**الملاحظة**

- تعدد الدوال يرفع زمن البناء على CI.

**التوصية**

- إذا تحول المشروع إلى multi-package أو monorepo موسع، فعّل Remote Caching عبر Turbo (`npx turbo`) لتقليل إعادة البناء للدوال غير المتغيرة.

---

## 3) Deployment Roadmap (Install & Run Hardening)

### أ) CI/CD reliability

- حافظ على `postinstall` الحالي لكن أضف مراقبة فشل أو timeout في CI.
- في الشبكات المقيدة استخدم `.npmrc` المضاف لتقليل فشل الجلب.

### ب) Bundle optimization

- المكتبات الثقيلة (مثل ArcGIS/AmCharts إن استُخدمت لاحقًا) يجب تحميلها lazy/dynamic import وعدم تمريرها ضمن مسارات edge handlers.
- راقب حجم bundles في كل build.

### ج) تطابق البيئات

- وحّد منفذ `vercel dev --listen` عبر `.env.local` وقوالب الفريق.
- تأكد من نفس متغيرات الـ runtime الحرجة بين local/staging/prod.

### د) معالجة 403/registry issues

- تمت إضافة `.npmrc` بقيم retry/timeout/registry.
- يمكن ضبط proxy محليًا دون تخزين أسرار في المستودع.

---

## Prompt جاهز للتدقيق المستقبلي

```text
بصفتك خبيراً في الـ DevOps و Vercel Deployments، قم بفحص ملفات package.json و vercel.json و .env.example لمشروع (worldmonitor) للتأكد من:

1) سلامة عملية الـ Build:
- هل هناك سكربتات Pre-install/Post-install قد تفشل في CI/CD؟
- هل يوجد fallback واضح عند فشل bootstrap scripts؟

2) تحسين الحجم (Bundle Optimization):
- هل يتم استيراد المكتبات الثقيلة بطريقة تؤدي إلى تضخم Edge Functions؟
- اقترح lazy-loading و code-splitting عند الحاجة.

3) تطابق البيئات:
- هل إعدادات vercel dev تحاكي بيئة production (ports, env vars, caching headers, runtime assumptions)؟

4) معالجة 403/registry:
- اقترح إعدادات .npmrc مناسبة لبيئات الشبكات المقيدة (retries/timeouts/proxy/registry).
```
