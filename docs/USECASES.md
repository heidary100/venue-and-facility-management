# Use Case Diagrams | نمودارهای مورد کاربرد

**سامانه ارزیابی و نظارت و مدیریت اماکن** — فاز ۲  
**نسخه:** 1.0.0 · **تاریخ:** ۱۴۰۵/۰۳/۰۴

این سند دو نمودار مورد کاربرد اصلی اکوسیستم را پوشش می‌دهد: **چرخه رزرو** و **چرخه ارزیابی کیفیت**.  
مرجع نقش‌ها: [PHASE2-DOCUMENTATION.md](./PHASE2-DOCUMENTATION.md) § ۴

> **نسخه Mermaid:** نمودارهای `usecaseDiagram` به Mermaid جدید (مثلاً [mermaid.live](https://mermaid.live) با آخرین نسخه) نیاز دارند. از `system { }` برای مرز سیستم و `include:` / `extend:` برای روابط UML استفاده شده است.

---

## ۱. چرخه کامل رزرو (Full Booking Cycle)

### شرح

دانشجو درخواست رزرو ثبت می‌کند؛ مدیر ورزش دانشگاه (و در صورت نیاز دبیر منطقه‌ای یا مدیر ملی) تأیید یا رد می‌کند. پس از تأیید، رزرو در بازه زمانی **فعال** است و در پایان به **تکمیل‌شده** می‌رسد. لغو و رد مسیرهای جایگزین هستند.

### نمودار

```mermaid
usecaseDiagram
    direction TB

    actor "دانشجو" as Student
    actor "مدیر ورزش دانشگاه" as UnivMgr
    actor "دبیر منطقه‌ای" as Regional
    actor "مدیر ملی" as National

    system "سامانه مدیریت اماکن — رزرو" {
        usecase "جستجوی مکان ورزشی" as UC_Search
        usecase "مشاهده تقویم و ظرفیت" as UC_Calendar
        usecase "رزرو از نقشه" as UC_MapBook
        usecase "ثبت درخواست رزرو" as UC_Create
        usecase "بررسی تداخل زمانی" as UC_Conflict
        usecase "مشاهده رزروهای من" as UC_MyBookings
        usecase "لغو رزرو" as UC_Cancel
        usecase "بررسی درخواست‌های در انتظار" as UC_Review
        usecase "تأیید رزرو" as UC_Approve
        usecase "رد رزرو" as UC_Reject
        usecase "مشاهده تقویم مدیریتی" as UC_AdminCal
        usecase "مشاهده KPI رزرو" as UC_KPI
        usecase "گزارش استفاده منطقه‌ای" as UC_RegReport
        usecase "گزارش ملی اماکن" as UC_NatReport
    }

    Student --> UC_Search
    Student --> UC_Calendar
    Student --> UC_MapBook
    Student --> UC_Create
    Student --> UC_MyBookings
    Student --> UC_Cancel

    UnivMgr --> UC_Review
    UnivMgr --> UC_Approve
    UnivMgr --> UC_Reject
    UnivMgr --> UC_AdminCal
    UnivMgr --> UC_KPI

    Regional --> UC_RegReport
    Regional --> UC_Review
    Regional --> UC_Approve
    Regional --> UC_Reject

    National --> UC_NatReport
    National --> UC_KPI

    include: UC_Create --> UC_Conflict
    include: UC_MapBook --> UC_Create
    include: UC_Approve --> UC_Review
    include: UC_Reject --> UC_Review
```

### جدول موارد کاربرد

| شناسه | مورد کاربرد | بازیگر اصلی | اولویت |
|-------|-------------|-------------|--------|
| UC-B01 | ثبت درخواست رزرو | دانشجو | P0 |
| UC-B02 | بررسی تداخل زمانی | سیستم / دانشجو | P0 |
| UC-B03 | تأیید / رد رزرو | مدیر ورزش دانشگاه | P0 |
| UC-B04 | لغو رزرو (قانون ۲۴ ساعت) | دانشجو | P0 |
| UC-B05 | گزارش KPI ملی / منطقه‌ای | مدیر ملی / دبیر منطقه‌ای | P1 |

---

## ۲. چرخه ارزیابی کیفیت (Quality Evaluation Cycle)

### شرح

پس از **تکمیل** رزرو، کاربر (معمولاً دانشجو) کیفیت مکان را در ابعاد نظافت، تجهیزات، روشنایی، ایمنی و امتیاز کلی ثبت می‌کند. سیستم میانگین‌ها را برای داشبورد و صفحه مکان تجمیع می‌کند.

### نمودار

```mermaid
usecaseDiagram
    direction TB

    actor "دانشجو" as Student
    actor "مدیر ورزش دانشگاه" as UnivMgr
    actor "دبیر منطقه‌ای" as Regional
    actor "مدیر ملی" as National

    system "سامانه مدیریت اماکن — ارزیابی کیفیت" {
        usecase "دریافت یادآور ارزیابی" as UC_Remind
        usecase "ثبت امتیاز چندبعدی" as UC_Rate
        usecase "افزودن نظر و تصویر" as UC_Comment
        usecase "مشاهده تاریخچه ارزیابی‌های من" as UC_History
        usecase "مشاهده میانگین کیفیت مکان" as UC_VenueMetrics
        usecase "مقایسه اماکن دانشگاه" as UC_Compare
        usecase "شناسایی افت کیفیت" as UC_Alert
        usecase "گزارش رضایت منطقه‌ای" as UC_RegSat
        usecase "گزارش رضایت ملی" as UC_NatSat
        usecase "خروجی برای انبار داده" as UC_Export
    }

    Student --> UC_Remind
    Student --> UC_Rate
    Student --> UC_Comment
    Student --> UC_History

    UnivMgr --> UC_VenueMetrics
    UnivMgr --> UC_Compare

    Regional --> UC_RegSat
    Regional --> UC_Alert

    National --> UC_NatSat
    National --> UC_Export

    extend: UC_Rate --> UC_Remind
    extend: UC_Comment --> UC_Rate
    include: UC_VenueMetrics --> UC_Rate
```

### جدول موارد کاربرد

| شناسه | مورد کاربرد | بازیگر اصلی | وابستگی |
|-------|-------------|-------------|---------|
| UC-E01 | ثبت امتیاز چندبعدی | دانشجو | رزرو `completed` |
| UC-E02 | مشاهده میانگین کیفیت | مدیر ورزش دانشگاه | API `GET /venues/:id/quality-metrics` |
| UC-E03 | گزارش رضایت ملی | مدیر ملی | داشبورد فاز ۲ |

---

## پیوند با سایر مستندات

| سند | ارتباط |
|-----|--------|
| [STATE-DIAGRAM.md](./STATE-DIAGRAM.md) | وضعیت‌های رزرو (pending → completed) |
| [BPMN.md](./BPMN.md) | گردش فرآیند گام‌به‌گام |
| [USER-STORIES.md](./USER-STORIES.md) | نیازمندی‌های کاربری به زبان ساده |
| [API-SPEC.md](./API-SPEC.md) | `POST /bookings`، `POST /evaluations` |

---

*برای ویرایش نمودارها، بلوک Mermaid را در [mermaid.live](https://mermaid.live) paste کنید.*
