import type { UserRole, RegionId } from '@/lib/types';

export const roleLabels: Record<UserRole, string> = {
  admin_national: 'مدیر ملی',
  admin_regional: 'دبیر منطقه‌ای',
  university_manager: 'مدیر ورزش دانشگاه',
  facility_staff: 'کارمند تأسیسات',
  student: 'دانشجو',
  athlete: 'ورزشکار',
};

export const regionLabels: Record<RegionId, string> = {
  region_tehran: 'منطقه تهران و البرز',
  region_center: 'منطقه مرکزی',
  region_south: 'منطقه جنوب',
  region_northwest: 'منطقه شمال‌غرب',
};

export const fa = {
  appName: 'ورزش دانشگاهی',
  appSubtitle: 'سامانه مدیریت اماکن',
  dashboard: {
    title: 'داشبورد فاز ۲',
    subtitle: 'نمای کلی اماکن، رزروها و شاخص‌های عملکرد',
    studentTitle: 'پنل دانشجو',
    studentSubtitle: 'رزرو سالن و پیگیری درخواست‌های شما',
    filters: {
      region: 'منطقه',
      university: 'دانشگاه',
      dateRange: 'بازه زمانی',
      allRegions: 'همه مناطق',
      allUniversities: 'همه دانشگاه‌ها',
      apply: 'اعمال فیلتر',
      reset: 'بازنشانی',
    },
    kpis: {
      totalVenues: 'کل اماکن',
      avgUtilization: 'میانگین بهره‌برداری',
      activeBookingsToday: 'رزروهای فعال امروز',
      avgSatisfaction: 'میانگین رضایت',
      openMaintenance: 'تیکت‌های نگهداری باز',
    },
    charts: {
      occupancy: 'نرخ اشغال در زمان',
      bookingByType: 'توزیع رزرو بر اساس نوع مکان',
      satisfaction: 'روند رضایت کاربران',
      topVenues: 'پنج مکان پراستفاده',
    },
    activity: 'فعالیت‌های اخیر',
    scopeHint: 'محدوده داده بر اساس نقش شما',
  },
  nav: {
    dashboard: 'داشبورد',
    venues: 'اماکن ورزشی',
    bookings: 'رزرو',
    map: 'نقشه',
    maintenance: 'نگهداری',
    reports: 'گزارش‌ها',
    users: 'کاربران',
    audit: 'گزارش ممیزی',
    settings: 'تنظیمات',
  },
  audit: {
    title: 'گزارش ممیزی',
    subtitle: 'ثبت و پیگیری فعالیت‌های سیستم (در حال توسعه)',
    placeholder: 'این بخش پس از اتصال به API بک‌اند فعال می‌شود.',
  },
  common: {
    loading: 'در حال بارگذاری...',
    error: 'خطایی رخ داد',
    retry: 'تلاش مجدد',
    save: 'ذخیره',
    cancel: 'لغو',
    noData: 'داده‌ای یافت نشد',
    success: 'عملیات با موفقیت انجام شد',
  },
  roles: {
    switchUser: 'تغییر نقش (نمایشی)',
    nationalScope: 'دسترسی به تمام دانشگاه‌های کشور',
    regionalScope: 'دسترسی به دانشگاه‌های منطقه شما',
    universityScope: 'دسترسی به اماکن دانشگاه شما',
    studentScope: 'فقط رزرو و مشاهده رزروهای شخصی',
  },
} as const;
