# Avora Includes

هذا الفولدر مخصص للأجزاء الجاهزة والمركبة من مكوّنات Avora Design System.

- `Components`: قطع صغيرة مستقلة مثل Button وCard وModal.
- `resources/js/includes`: أقسام أو شاشات كاملة ركّبنا فيها هذه القطع معًا، وهي خارج فولدر الديزاين سيستم.
- `resources/js/Layouts`: أغلفة الصفحات وتركيبها العام، وهي أيضًا خارج الديزاين سيستم.

## الملفات

- `NavbarInclude.tsx`: شريط تنقل كامل للكمبيوتر والموبايل.
- `HeroInclude.tsx`: Hero Section جاهز.
- `ProductCardInclude.tsx`: كارت منتج مركب وقابل لإعادة الاستخدام.
- `ProductGridInclude.tsx`: سيكشن منتجات كامل ومتجاوب.
- `DashboardInclude.tsx`: مجموعة إحصائيات Dashboard.
- `DashboardHomeInclude.tsx`: الصفحة الرئيسية للوحة التحكم كاملة.
- `DashboardModuleInclude.tsx`: صفحات أقسام لوحة التحكم.
- `SidebarLayoutInclude.tsx`: صفحة مركبة من Sidebar ومحتوى.

استورد أي جزء جاهز من ملف واحد:

```tsx
import { NavbarInclude, HeroInclude, ProductGridInclude } from "@/includes";

export default function Page() {
    return (
        <>
            <NavbarInclude />
            <HeroInclude />
            <ProductGridInclude />
        </>
    );
}
```

عدّل ملف الـ Include عندما تريد تغيير تركيب قسم كامل، وعدّل ملف الـ component عندما تريد تغيير القطعة في كل الأماكن التي تستخدمها.
