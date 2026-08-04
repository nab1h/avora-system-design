# توثيق Avora Design System

هذا الملف يشرح نظام التصميم خطوة بخطوة لشخص يستخدمه لأول مرة. لا تحتاج أن تعرف كل التفاصيل الداخلية لكي تبدأ؛ انسخ الأمثلة أولًا، وبعد أن تعمل عدّل القيم بالتدريج.

## 1. ما هو نظام التصميم؟

نظام التصميم هو مجموعة مكونات وقواعد جاهزة تساعدنا على بناء الصفحات بنفس الشكل والأسلوب، بدل كتابة تصميم جديد في كل صفحة.

المكونات المتاحة حاليًا:

- `Button`: الأزرار وأشكالها وأحجامها.
- `Card`: الكارت وأجزاؤه مثل الصورة والعنوان والوصف والسعر.
- `Grid`: تقسيم الصفحات وعرض الكروت بشكل متجاوب.
- `Container`: يتحكم في عرض محتوى الصفحة ومسافاته وشكله العام.
- `Navbar`: شريط تنقل متجاوب للكمبيوتر والموبايل.
- `LanguageButton`: تغيير اللغة بين العربية والإنجليزية.
- `ModeButton`: تغيير الوضع بين الفاتح والداكن.
- `ThemeProvider`: يوفر ألوان الوضع الحالي.
- `LanguageProvider`: يوفر اللغة والاتجاه والترجمة.

> هذا الفولدر هو الديزاين سيستم فقط. الصفحات و`Layouts` و`includes` موجودة خارجه وتستخدم مكوّناته.

## 2. معنى الكلمات التي ستراها كثيرًا

- **Component**: مكوّن يمكن استخدامه أكثر من مرة، مثل `Card`.
- **Props**: خيارات نرسلها للمكوّن، مثل `variant="elevated"`.
- **children**: المحتوى المكتوب بين بداية المكوّن ونهايته.
- **variant**: شكل جاهز للمكوّن.
- **className**: كلاسات Tailwind إضافية لتعديل حالة معينة.
- **Provider**: مكوّن عام يوفر بيانات لكل الصفحات مثل اللغة والثيم.

مثال بسيط على `props` و`children`:

```tsx
<Button variant="primary" size="lg">
    حفظ
</Button>
```

هنا `variant` و`size` هما Props، وكلمة `حفظ` هي children.

## 3. هيكل فولدر Avora

```text
avora/
├── Components/
│   ├── Button.tsx
│   ├── LanguageButton.tsx
│   ├── Card/
│   │   ├── Card.tsx
│   │   ├── CardImage.tsx
│   │   ├── CardHeader.tsx
│   │   ├── CardTitle.tsx
│   │   ├── CardDescription.tsx
│   │   ├── CardContent.tsx
│   │   ├── CardFooter.tsx
│   │   ├── CardMeta.tsx
│   │   ├── CardPrice.tsx
│   │   └── index.ts
│   ├── Container/
│   │   ├── Container.tsx
│   │   └── index.ts
│   ├── Grid/
│   │   ├── Grid.tsx
│   │   ├── GridItem.tsx
│   │   └── index.ts
│   └── Navbar/
│       ├── Navbar.tsx
│       ├── NavbarContainer.tsx
│       ├── NavbarBrand.tsx
│       ├── NavbarDesktop.tsx
│       ├── NavbarLinks.tsx
│       ├── NavbarLink.tsx
│       ├── NavbarLogo.tsx
│       ├── NavbarActions.tsx
│       ├── NavbarToggle.tsx
│       ├── NavbarMobileMenu.tsx
│       ├── NavbarOverlay.tsx
│       └── index.ts
├── providers/
│   ├── LanguageProvider.tsx
│   ├── ThemeProvider.tsx
│   └── ModeButton.tsx
├── styles/
│   ├── buttonVariants.ts
│   ├── cardVariants.ts
│   ├── containerVariants.ts
│   └── gridVariants.ts
└── tokens/
    ├── colors.ts
    ├── getColors.ts
    └── theme.ts
```

القاعدة البسيطة:

- عدّل JSX وسلوك المكوّن داخل `Components`.
- عدّل الأشكال والأحجام الجاهزة داخل `styles`.
- عدّل الألوان والمسافات العامة داخل `tokens`.

## 4. تشغيل المشروع

من Terminal داخل المشروع:

```bash
npm run dev
```

صفحة العرض والتجربة موجودة في:

```text
resources/js/Pages/Welcome.tsx
```

وللتأكد أن TypeScript والبناء سليمين:

```bash
npm run build
```

## 5. إعداد اللغة والثيم

تمت إضافة الـ Providers بالفعل داخل `resources/js/app.tsx` بهذا الشكل:

```tsx
<LanguageProvider>
    <ThemeProvider>
        <App {...props} />
    </ThemeProvider>
</LanguageProvider>
```

لا تكرر هذا الكود داخل كل صفحة. نكتبه مرة واحدة فقط حول التطبيق.

## 6. العربي والإنجليزي

استخدم `useLanguage` داخل أي مكوّن يحتاج نصوصًا مترجمة:

```tsx
import { useLanguage } from "@/avora/providers/LanguageProvider";

export default function Example() {
    const { translate } = useLanguage();

    return (
        <h1>
            {translate({
                ar: "مرحبًا بك",
                en: "Welcome",
            })}
        </h1>
    );
}
```

زر تغيير اللغة:

```tsx
import { LanguageButton } from "@/avora/Components/LanguageButton";

<LanguageButton />;
```

عند تغيير اللغة يقوم النظام تلقائيًا بـ:

- تغيير `lang` إلى `ar` أو `en`.
- تغيير اتجاه الصفحة إلى `rtl` أو `ltr`.
- حفظ اللغة في `localStorage` حتى لا تضيع بعد تحديث الصفحة.

يمكنك الوصول إلى اللغة أو الاتجاه الحالي:

```tsx
const { language, direction } = useLanguage();
```

## 7. الوضع الفاتح والداكن

زر تغيير الوضع:

```tsx
import ModeButton from "@/avora/providers/ModeButton";

<ModeButton />;
```

للوصول إلى الألوان الحالية:

```tsx
import { useTheme } from "@/avora/providers/ThemeProvider";

const { colors } = useTheme();

<div style={{ color: colors.text, backgroundColor: colors.background }}>
    Content
</div>;
```

الألوان الأساسية موجودة في:

```text
resources/js/avora/tokens/colors.ts
```

ستجد `lightColors` و`darkColors`. تغيير قيمة مثل `primary` يغيّر اللون الأساسي الذي تستخدمه المكونات المرتبطة بالثيم.

`ThemeProvider` يطبّق `colors.background` و`colors.text` على `html` و`body` تلقائيًا، لذلك أي صفحة بخلفية شفافة ترث الوضع الفاتح أو الداكن. إذا وضعت خلفية بيضاء ثابتة مثل `bg-white` على عنصر، ستظل بيضاء؛ استخدم ألوان الثيم بدلًا منها:

```tsx
const { colors } = useTheme();

<main style={{ backgroundColor: colors.background, color: colors.text }}>
    Page content
</main>;
```

## 8. Button

الاستيراد:

```tsx
import { Button } from "@/avora/Components/Button";
```

أبسط استخدام:

```tsx
<Button>حفظ</Button>
```

### أشكال الزر

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

### أحجام الزر

```tsx
<Button size="xs">Extra small</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

خيارات إضافية:

```tsx
<Button fullWidth rounded="full">
    زر بعرض كامل
</Button>
```

قيم `rounded` المتاحة: `md` و`lg` و`full`.

لتغيير تصميم كل الأزرار عدّل:

```text
resources/js/avora/styles/buttonVariants.ts
```

لتعديل زر واحد فقط استخدم `className`:

```tsx
<Button className="h-14 px-8">Custom button</Button>
```

## 9. Card

الكارت الأساسي هو حاوية. الصورة والعنوان والوصف والسعر أجزاء اختيارية نركبها داخله حسب الحاجة.

استورد الأجزاء التي تحتاجها:

```tsx
import {
    Card,
    CardImage,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    CardMeta,
    CardPrice,
} from "@/avora/Components/Card";
```

مثال كارت منتج كامل:

```tsx
<Card variant="elevated" className="max-w-sm overflow-hidden">
    <CardImage src="/images/product.jpg" alt="اسم المنتج" />

    <CardHeader>
        <CardMeta>منتج جديد</CardMeta>
        <CardTitle>اسم المنتج</CardTitle>
        <CardDescription>وصف مختصر للمنتج.</CardDescription>
    </CardHeader>

    <CardContent>أي معلومات إضافية.</CardContent>

    <CardFooter>
        <CardMeta>20 يونيو 2026</CardMeta>
        <CardPrice>500 ج.م</CardPrice>
    </CardFooter>
</Card>
```

### وظيفة كل جزء

| المكوّن           | وظيفته                                 |
| ----------------- | -------------------------------------- |
| `Card`            | الحاوية الأساسية والحدود والظل         |
| `CardImage`       | صورة الكارت                            |
| `CardHeader`      | منطقة العنوان والوصف والمعلومة الصغيرة |
| `CardTitle`       | العنوان الرئيسي                        |
| `CardDescription` | الوصف القصير                           |
| `CardContent`     | أي محتوى إضافي                         |
| `CardFooter`      | الجزء السفلي للسعر أو التاريخ أو الزر  |
| `CardMeta`        | معلومة صغيرة مثل النوع أو التاريخ      |
| `CardPrice`       | السعر بلون الثيم الأساسي               |

### أشكال Card

```tsx
<Card variant="default">...</Card>
<Card variant="elevated">...</Card>
<Card variant="outlined">...</Card>
<Card variant="ghost">...</Card>
```

خيارات المسافات والحواف:

```tsx
<Card padding="lg" rounded="lg">
    Simple content
</Card>
```

- `padding`: `none` أو `sm` أو `md` أو `lg`.
- `rounded`: `none` أو `sm` أو `md` أو `lg`.

ملاحظة: عند استخدام `CardHeader` و`CardContent` و`CardFooter` فهي تضيف مسافاتها الداخلية بنفسها؛ غالبًا لا تحتاج `padding` على `Card` الأساسي.

لتغيير تصميم كل الكروت عدّل:

```text
resources/js/avora/styles/cardVariants.ts
```

## 10. Grid

`Grid` مسؤول عن توزيع العناصر والكروت بشكل متجاوب.

الاستيراد:

```tsx
import { Grid, GridItem } from "@/avora/Components/Grid";
```

### Grid كروت تلقائي

هذا هو الاختيار المفضل عندما لا تعرف عدد الأعمدة المناسب لكل شاشة:

```tsx
<Grid minItemWidth="260px" gap="lg">
    <Card>Card 1</Card>
    <Card>Card 2</Card>
    <Card>Card 3</Card>
    <Card>Card 4</Card>
</Grid>
```

معنى `minItemWidth="260px"`: لا تجعل عرض الكارت أقل من 260px. إذا لم توجد مساحة كافية، ينزل الكارت إلى صف جديد تلقائيًا.

### التخطيطات الجاهزة

```tsx
<Grid layout="one">...</Grid>
<Grid layout="two">...</Grid>
<Grid layout="three">...</Grid>
<Grid layout="four">...</Grid>
<Grid layout="cards">...</Grid>
<Grid layout="dashboard">...</Grid>
```

كل Layout يبدأ بعمود واحد على الشاشات الصغيرة ثم يزيد الأعمدة حسب مساحة الشاشة.

### Sidebar ومحتوى الصفحة

```tsx
<Grid layout="sidebarStart" gap="lg">
    <aside>Sidebar</aside>
    <main>Page content</main>
</Grid>
```

استخدم `sidebarStart` و`sidebarEnd` بدل التفكير في يمين ويسار؛ لأن `start` يتغير تلقائيًا مع العربي والإنجليزي.

### المسافات والعرض والمحاذاة

```tsx
<Grid gap="lg" padding="lg" width="wide" align="center" rounded="lg">
    ...
</Grid>
```

الخيارات:

- `gap`: `none`, `xs`, `sm`, `md`, `lg`, `xl`.
- `padding`: `none`, `sm`, `md`, `lg`, `xl`.
- `width`: `full`, `content`, `wide`.
- `align`: `start`, `center`, `end`, `stretch`.
- `rounded`: `none`, `sm`, `md`, `lg`.

### خلفيات Grid الجاهزة

```tsx
<Grid background="transparent">...</Grid>
<Grid background="surface">...</Grid>
<Grid background="muted">...</Grid>
<Grid background="primary">...</Grid>
<Grid background="gradient">...</Grid>
```

### صورة خلفية للـ Grid

ضع الصورة داخل `public`، مثل:

```text
public/images/background.jpg
```

ثم استخدم المسار من بداية `/images`:

```tsx
<Grid
    padding="xl"
    background="muted"
    backgroundImage="/images/background.jpg"
    backgroundImageOpacity={0.25}
    backgroundImageSize="cover"
    backgroundImagePosition="center"
    backgroundImageRepeat="no-repeat"
    backgroundImageAttachment="fixed"
    rounded="lg"
>
    Content
</Grid>
```

خيارات الصورة:

| الخاصية                     | مثال               | معناها                   |
| --------------------------- | ------------------ | ------------------------ |
| `backgroundImage`           | `"/images/bg.jpg"` | مسار الصورة              |
| `backgroundImageOpacity`    | `{0.25}`           | شفافية الصورة من 0 إلى 1 |
| `backgroundImageSize`       | `"cover"`          | طريقة ملء المساحة        |
| `backgroundImagePosition`   | `"center"`         | مكان الصورة              |
| `backgroundImageRepeat`     | `"no-repeat"`      | هل تتكرر الصورة؟         |
| `backgroundImageAttachment` | `"fixed"`          | هل تثبت عند السكرول؟     |

قيم شائعة:

```tsx
backgroundImageSize = "cover"; // تملأ المساحة وقد يتم قص جزء منها
backgroundImageSize = "contain"; // تظهر الصورة كاملة
backgroundImageRepeat = "repeat"; // تكرار الصورة كنمط
backgroundImageAttachment = "fixed"; // الصورة ثابتة أثناء السكرول
backgroundImageAttachment = "scroll"; // الصورة تتحرك مع القسم
```

شفافية الصورة لا تغيّر شفافية النصوص أو الكروت؛ لأن الصورة موجودة في طبقة مستقلة خلف المحتوى.

### GridItem والعناصر الكبيرة

استخدم `GridItem` عندما تريد عنصرًا يأخذ أكثر من عمود أو صف:

```tsx
<Grid layout="dashboard">
    <GridItem mdSpan="two">
        <Card>Large card</Card>
    </GridItem>

    <GridItem>
        <Card>Small card</Card>
    </GridItem>
</Grid>
```

الخيارات:

- `span`: الامتداد الأساسي.
- `mdSpan`: الامتداد من الشاشات المتوسطة.
- `lgSpan`: الامتداد من الشاشات الكبيرة.
- `rowSpan`: عدد الصفوف التي يأخذها العنصر.

مثال عنصر يأخذ عرض الجريد بالكامل:

```tsx
<GridItem span="full">Full-width content</GridItem>
```

لتغيير Layouts أو المسافات الافتراضية عدّل:

```text
resources/js/avora/styles/gridVariants.ts
```

## 11. Container

`Container` يحدد عرض محتوى الصفحة والمسافات الجانبية والرأسية. استخدمه حول محتوى الصفحة أو حول Section يحتاج عرضًا ومسافات موحّدة.

الاستيراد:

```tsx
import { Container } from "@/avora/Components/Container";
```

أبسط استخدام:

```tsx
<Container>Page content</Container>
```

القيم الافتراضية هي:

- عرض `wide` يساوي `max-w-7xl`.
- توسيط تلقائي في الصفحة.
- مسافة جانبية `gutter="md"` متجاوبة.
- بدون مسافة رأسية أو خلفية أو ظل.

### الفرق بين Container وGrid وNavbarContainer

- `Container`: يحدد عرض ومسافات المحتوى العام.
- `Grid`: يوزع العناصر الداخلية على أعمدة وصفوف.
- `NavbarContainer`: مخصص فقط لترتيب عناصر Navbar وارتفاعه.

يمكن وضع Grid داخل Container:

```tsx
<Container width="wide" gutter="md" paddingY="lg">
    <Grid minItemWidth="260px" gap="lg">
        <Card>...</Card>
        <Card>...</Card>
    </Grid>
</Container>
```

### اختيار عرض Container

```tsx
<Container width="sm">...</Container>
<Container width="md">...</Container>
<Container width="lg">...</Container>
<Container width="xl">...</Container>
<Container width="2xl">...</Container>
<Container width="content">...</Container>
<Container width="wide">...</Container>
<Container width="full">...</Container>
```

| القيمة    | الاستخدام المناسب             |
| --------- | ----------------------------- |
| `sm`      | Form أو محتوى صغير جدًا       |
| `md`      | مقال أو Form متوسط            |
| `lg`      | صفحة محتوى متوسطة             |
| `xl`      | صفحة كبيرة                    |
| `2xl`     | شاشة واسعة                    |
| `content` | محتوى بعرض `max-w-5xl`        |
| `wide`    | Layout رئيسي بعرض `max-w-7xl` |
| `full`    | العرض الكامل بدون حد أقصى     |

التوسيط يعمل افتراضيًا. لتعطيله:

```tsx
<Container width="md" centered={false}>
    Content aligned to the page start
</Container>
```

### المسافات الجانبية Gutter

`gutter` هو المسافة بين المحتوى وحواف الشاشة:

```tsx
<Container gutter="none">...</Container>
<Container gutter="xs">...</Container>
<Container gutter="sm">...</Container>
<Container gutter="md">...</Container>
<Container gutter="lg">...</Container>
<Container gutter="xl">...</Container>
```

القيم متجاوبة تلقائيًا؛ مثلًا `md` يبدأ بمسافة مناسبة للموبايل ثم يزيدها على التابلت والكمبيوتر.

### المسافات الرأسية Padding

```tsx
<Container paddingY="none">...</Container>
<Container paddingY="xs">...</Container>
<Container paddingY="sm">...</Container>
<Container paddingY="md">...</Container>
<Container paddingY="lg">...</Container>
<Container paddingY="xl">...</Container>
<Container paddingY="section">...</Container>
```

استخدم `section` للسيكشنات الكبيرة؛ يعطي مسافة رأسية واسعة ومتجاوبة.

### المسافات الخارجية Margin

```tsx
<Container marginY="none">...</Container>
<Container marginY="xs">...</Container>
<Container marginY="sm">...</Container>
<Container marginY="md">...</Container>
<Container marginY="lg">...</Container>
<Container marginY="xl">...</Container>
```

### الخلفيات

```tsx
<Container background="transparent">...</Container>
<Container background="surface">...</Container>
<Container background="muted">...</Container>
<Container background="primary">...</Container>
<Container background="gradient">...</Container>
```

الخلفيات تستخدم ألوان `ThemeProvider`، لذلك تتغير تلقائيًا مع الوضع الفاتح والداكن.

### الحواف والظل والحدود

```tsx
<Container background="surface" rounded="lg" shadow="md" bordered>
    Content
</Container>
```

القيم:

- `rounded`: `none`, `sm`, `md`, `lg`, `full`.
- `shadow`: `none`, `sm`, `md`, `lg`.
- `bordered`: `true` أو `false`.

### أقل ارتفاع

```tsx
<Container minHeight="auto">...</Container>
<Container minHeight="content">...</Container>
<Container minHeight="screen">...</Container>
<Container minHeight="viewport">...</Container>
```

- `screen`: يستخدم `min-h-screen`.
- `viewport`: يستخدم `min-h-dvh` وهو أنسب غالبًا لشاشات الموبايل الحديثة.

مثال صفحة تملأ الشاشة:

```tsx
<Container as="main" width="full" minHeight="viewport" paddingY="lg">
    Page content
</Container>
```

### التحكم في Overflow

```tsx
<Container overflow="visible">...</Container>
<Container overflow="hidden">...</Container>
<Container overflow="clip">...</Container>
<Container overflow="auto">...</Container>
```

استخدم `hidden` أو `clip` عندما توجد صورة أو Animation يجب ألا تخرج خارج الحواف الدائرية.

### تغيير نوع العنصر HTML

النوع الافتراضي هو `div`. استخدم `as` للحصول على HTML أوضح:

```tsx
<Container as="main">Main content</Container>
<Container as="section">Section content</Container>
<Container as="article" width="md">Article</Container>
<Container as="footer">Footer content</Container>
```

### مثال Section كاملة

```tsx
<Container
    as="section"
    width="wide"
    gutter="lg"
    paddingY="section"
    marginY="lg"
    background="gradient"
    rounded="lg"
    shadow="sm"
    bordered
>
    <h2 className="text-3xl font-bold">Section title</h2>
    <p className="mt-3">Section description</p>
</Container>
```

### استخدام مقاس مخصص

لو الخيارات الجاهزة لا تكفي، استخدم `className` أو `style`:

```tsx
<Container width="full" className="max-w-[1440px] px-5 lg:px-16">
    Custom container
</Container>
```

```tsx
<Container style={{ maxWidth: 1380, paddingInline: 30 }}>
    Custom container
</Container>
```

لتغيير الخيارات الافتراضية لكل المشروع عدّل:

```text
resources/js/avora/styles/containerVariants.ts
```

سلوك المكوّن وربطه بألوان الثيم موجود في:

```text
resources/js/avora/Components/Container/Container.tsx
```

## 12. Navbar

`Navbar` هو شريط التنقل الموجود غالبًا أعلى الصفحة. تم تقسيمه إلى أجزاء صغيرة حتى تستطيع تغيير شكل وترتيب كل مشروع بدون إعادة كتابة السلوك الخاص بالموبايل.

### استيراد أجزاء Navbar

```tsx
import {
    Navbar,
    NavbarContainer,
    NavbarBrand,
    NavbarDesktop,
    NavbarLinks,
    NavbarLink,
    NavbarLogo,
    NavbarActions,
    NavbarToggle,
    NavbarMobileMenu,
    NavbarOverlay,
} from "@/avora/Components/Navbar";
```

لا يجب استخدام أجزاء مثل `NavbarToggle` أو `NavbarLink` خارج `Navbar`؛ لأنها تعتمد على حالة القائمة الموجودة بداخله.

### وظيفة كل جزء

| المكوّن            | وظيفته                                             |
| ------------------ | -------------------------------------------------- |
| `Navbar`           | الحاوية الرئيسية وحالة فتح قائمة الموبايل          |
| `NavbarContainer`  | يحدد أقصى عرض وارتفاع ومسافات المحتوى              |
| `NavbarBrand`      | مكان الشعار واسم المشروع ورابط الرئيسية            |
| `NavbarDesktop`    | محتوى يظهر من الشاشات المتوسطة ويختفي على الموبايل |
| `NavbarLinks`      | يجمع روابط التنقل ويرتبها                          |
| `NavbarLink`       | رابط تنقل يدعم حالة `active`                       |
| `NavbarLogo`       | يعرض لوجو المشروع كصورة                            |
| `NavbarActions`    | مكان الأزرار واللغة والثيم وحساب المستخدم          |
| `NavbarToggle`     | زر فتح وإغلاق قائمة الموبايل                       |
| `NavbarMobileMenu` | المحتوى الذي يظهر على الموبايل عند فتح القائمة     |
| `NavbarOverlay`    | طبقة داكنة اختيارية خلف قائمة الموبايل             |

### مثال Navbar كامل

```tsx
<Navbar position="sticky" background="glass" shadow="sm" bordered>
    <NavbarContainer width="wide" height="md">
        <NavbarBrand>
            <NavbarLogo href="/" src="/logo.svg" alt="Project logo" />
        </NavbarBrand>

        <NavbarDesktop>
            <NavbarLinks>
                <NavbarLink href="/" active>
                    الرئيسية
                </NavbarLink>
                <NavbarLink href="/products">المنتجات</NavbarLink>
                <NavbarLink href="/about">من نحن</NavbarLink>
            </NavbarLinks>

            <NavbarActions>
                <ModeButton />
                <LanguageButton />
                <Button size="sm">تسجيل الدخول</Button>
            </NavbarActions>
        </NavbarDesktop>

        <NavbarToggle />
    </NavbarContainer>

    <NavbarMobileMenu placement="end" motion="slide" duration="normal">
        <NavbarLinks className="flex-col items-stretch">
            <NavbarLink href="/" active>
                الرئيسية
            </NavbarLink>
            <NavbarLink href="/products">المنتجات</NavbarLink>
            <NavbarLink href="/about">من نحن</NavbarLink>
        </NavbarLinks>

        <NavbarActions className="mt-4 border-t pt-4">
            <ModeButton />
            <LanguageButton />
            <Button size="sm" fullWidth>
                تسجيل الدخول
            </Button>
        </NavbarActions>
    </NavbarMobileMenu>

    <NavbarOverlay opacity="medium" />
</Navbar>
```

لاحظ أن روابط الموبايل مكتوبة داخل `NavbarMobileMenu`، وروابط الكمبيوتر مكتوبة داخل `NavbarDesktop`. هذا يسمح لك بتغيير ترتيب أو محتوى كل نسخة بشكل مستقل.

### استخدام اللوجو كصورة

ضع صورة اللوجو داخل `public`، مثل:

```text
public/images/logo.svg
```

ثم استخدم:

```tsx
<NavbarBrand>
    <NavbarLogo href="/" src="/images/logo.svg" alt="اسم المشروع" />
</NavbarBrand>
```

لتغيير ارتفاع الصورة في مشروع معين:

```tsx
<NavbarLogo
    href="/"
    src="/images/logo.png"
    alt="اسم المشروع"
    imageClassName="h-12"
/>
```

الارتفاع الافتراضي هو `h-10`، والعرض يُحسب تلقائيًا حتى لا تتشوّه الصورة. يجب كتابة `alt` لوصف اللوجو لقارئات الشاشة.

### خيارات Navbar الرئيسية

#### مكان Navbar

```tsx
<Navbar position="static">...</Navbar>
<Navbar position="sticky">...</Navbar>
<Navbar position="fixed">...</Navbar>
```

- `static`: يتحرك طبيعيًا مع الصفحة.
- `sticky`: يثبت أعلى الشاشة بعد الوصول إليه.
- `fixed`: يظل ثابتًا دائمًا أعلى الشاشة.

إذا استخدمت `fixed`، أضف مسافة أعلى محتوى الصفحة حتى لا يغطي Navbar المحتوى:

```tsx
<main className="pt-20">...</main>
```

#### خلفية Navbar

```tsx
<Navbar background="transparent">...</Navbar>
<Navbar background="surface">...</Navbar>
<Navbar background="muted">...</Navbar>
<Navbar background="primary">...</Navbar>
<Navbar background="glass">...</Navbar>
```

- `surface`: لون خلفية الثيم الحالي.
- `muted`: خلفية هادئة وشفافة قليلًا.
- `primary`: اللون الأساسي مع نص أبيض.
- `glass`: خلفية زجاجية مناسبة مع `sticky` أو `fixed`.

#### الظل والحدود والحواف

```tsx
<Navbar shadow="md" bordered rounded="lg">
    ...
</Navbar>
```

- `shadow`: `none`, `sm`, `md`.
- `bordered`: `true` أو `false`.
- `rounded`: `none`, `md`, `lg`, `full`.

### خيارات NavbarContainer

```tsx
<NavbarContainer width="wide" padding="md" height="lg">
    ...
</NavbarContainer>
```

- `width`: `full`, `content`, `wide`.
- `padding`: `none`, `sm`, `md`, `lg`.
- `height`: `sm`, `md`, `lg`.

### الرابط النشط

`NavbarLink` يكتشف الرابط الحالي تلقائيًا من عنوان الصفحة. هذا يعمل مع روابط الصفحات ومع روابط الأقسام التي تبدأ بـ `#`:

```tsx
<NavbarLink href="#cards">الكروت</NavbarLink>
<NavbarLink href="#dashboard">الداشبورد</NavbarLink>
```

عند الضغط على `#cards` يصبح رابط الكروت Active تلقائيًا.

إذا كنت تدير التنقل بطريقة خاصة وتريد التحكم اليدوي، استخدم `active`:

```tsx
<NavbarLink href="/products" active>
    المنتجات
</NavbarLink>
```

يضيف المكوّن تلقائيًا `aria-current="page"` لمساعدة قارئات الشاشة.

عند الضغط على أي `NavbarLink` يتم إغلاق قائمة الموبايل تلقائيًا. لمنع ذلك في حالة معينة:

```tsx
<NavbarLink href="#filters" closeMenuOnClick={false}>
    الفلاتر
</NavbarLink>
```

### تغيير أيقونة Hamburger

يوجد شكل افتراضي لأيقونة الفتح والإغلاق. تستطيع استبدال أي منهما بأي SVG أو Icon Component.

```tsx
<NavbarToggle
    menuIcon={
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="h-6 w-6"
        >
            <path d="M5 8h14M9 16h10" />
        </svg>
    }
    closeIcon={
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="h-6 w-6"
        >
            <path d="M7 7l10 10M17 7 7 17" />
        </svg>
    }
/>
```

لو تستخدم مكتبة Icons:

```tsx
<NavbarToggle menuIcon={<MenuIcon />} closeIcon={<CloseIcon />} />
```

لتغيير حجم زر أو خلفية الأيقونة نفسها:

```tsx
<NavbarToggle className="h-12 w-12 rounded-full bg-slate-100" />
```

### اتجاه وأنيميشن قائمة الموبايل

تستطيع تحديد مكان ظهور القائمة:

```tsx
<NavbarMobileMenu placement="top">...</NavbarMobileMenu>
<NavbarMobileMenu placement="left">...</NavbarMobileMenu>
<NavbarMobileMenu placement="right">...</NavbarMobileMenu>
<NavbarMobileMenu placement="start">...</NavbarMobileMenu>
<NavbarMobileMenu placement="end">...</NavbarMobileMenu>
```

- `top`: قائمة بعرض Navbar تظهر من الأعلى.
- `left`: Side menu من يسار الشاشة دائمًا.
- `right`: Side menu من يمين الشاشة دائمًا.
- `start`: بداية اتجاه اللغة؛ يمين في العربي ويسار في الإنجليزي.
- `end`: نهاية اتجاه اللغة؛ يسار في العربي ويمين في الإنجليزي.

الأفضل للمشاريع العربية والإنجليزية استخدام `start` أو `end` لأنهما يتغيران تلقائيًا مع `RTL/LTR`.

شكل الحركة:

```tsx
<NavbarMobileMenu motion="slide">...</NavbarMobileMenu>
<NavbarMobileMenu motion="fade">...</NavbarMobileMenu>
<NavbarMobileMenu motion="scale">...</NavbarMobileMenu>
```

سرعة الحركة:

```tsx
<NavbarMobileMenu duration="fast">...</NavbarMobileMenu>
<NavbarMobileMenu duration="normal">...</NavbarMobileMenu>
<NavbarMobileMenu duration="slow">...</NavbarMobileMenu>
```

مثال Side menu كاملة:

```tsx
<NavbarMobileMenu
    placement="end"
    motion="slide"
    duration="normal"
>
    <NavbarLinks className="flex-col items-stretch">
        ...
    </NavbarLinks>
</NavbarMobileMenu>

<NavbarOverlay opacity="medium" />
```

أيقونة Hamburger تعمل بأنيميشن دوران وتصغير تلقائيًا عند الفتح والإغلاق، سواء استخدمت الأيقونات الافتراضية أو مررت `menuIcon` و`closeIcon` خاصين بك.

حركة الـ Side menu يتم قصها داخل مساحة Navbar المخصصة للموبايل، لذلك لن تضيف Horizontal Scroll للصفحة أثناء وجودها خارج الشاشة.

### التحكم في Overlay

الـ Overlay يظهر تحت Navbar وخلف قائمة الموبايل، لذلك لن يغطي القائمة أو زر Hamburger.

```tsx
<NavbarOverlay opacity="light" />
<NavbarOverlay opacity="medium" />
<NavbarOverlay opacity="dark" />
```

### قائمة موبايل بدون Overlay

`NavbarOverlay` اختياري. احذفه إذا كنت لا تريد الطبقة الداكنة:

```tsx
<Navbar>
    ...
    <NavbarMobileMenu>...</NavbarMobileMenu>
</Navbar>
```

القائمة تُغلق أيضًا عند:

- الضغط على `NavbarToggle` مرة أخرى.
- الضغط على `NavbarLink`.
- الضغط على `NavbarOverlay`.
- الضغط على زر `Escape` في لوحة المفاتيح.

### التحكم في فتح القائمة من مكوّن خارجي

في معظم الحالات لا تحتاج ذلك؛ Navbar يدير حالته بنفسه. إذا احتجت تحكمًا كاملًا:

```tsx
const [menuOpen, setMenuOpen] = useState(false);

<Navbar open={menuOpen} onOpenChange={setMenuOpen}>
    ...
</Navbar>;
```

أو اجعل القائمة مفتوحة أول مرة فقط:

```tsx
<Navbar defaultOpen>...</Navbar>
```

لتعطيل الإغلاق بزر Escape:

```tsx
<Navbar closeOnEscape={false}>...</Navbar>
```

### دعم العربي والإنجليزي

Navbar يرث `rtl` و`ltr` تلقائيًا من `LanguageProvider`. اكتب نصوص الروابط باستخدام `translate`:

```tsx
<NavbarLink href="/about">
    {translate({ ar: "من نحن", en: "About us" })}
</NavbarLink>
```

زر Hamburger يترجم `aria-label` تلقائيًا، لذلك سيقول "فتح القائمة" بالعربية و`Open menu` بالإنجليزية.

### تعديل Navbar لكل المشروع

الأشكال العامة والمقاسات موجودة في:

```text
resources/js/avora/styles/navbarVariants.ts
```

سلوك Navbar وحالة قائمة الموبايل موجودان في:

```text
resources/js/avora/Components/Navbar/Navbar.tsx
```

شكل زر Hamburger الافتراضي موجود في:

```text
resources/js/avora/Components/Navbar/NavbarToggle.tsx
```

الأفضل أن تستخدم `menuIcon` و`closeIcon` عندما تريد شكلًا مختلفًا لمشروع واحد، وأن تعدّل `NavbarToggle.tsx` فقط عندما تريد تغيير الشكل الافتراضي لكل المشاريع.

## 13. تغيير نوع الخط

نوع الخط الأساسي موجود في:

```text
tailwind.config.js
```

مثال:

```js
fontFamily: {
    sans: ['Cairo', ...defaultTheme.fontFamily.sans],
},
```

يجب استيراد الخط أولًا في `resources/css/app.css` أو إضافته محليًا داخل المشروع.

بعد ذلك استخدم:

```tsx
<div className="font-sans">نص عربي وEnglish text</div>
```

## 14. كيف أعدّل مكوّنًا بطريقة صحيحة؟

قبل التعديل اسأل نفسك: هل التغيير لحالة واحدة أم لكل المشروع؟

### تعديل حالة واحدة فقط

استخدم `className` أو `style`:

```tsx
<Card className="max-w-md" style={{ minHeight: 300 }}>
    Content
</Card>
```

### تعديل كل المكونات من نفس النوع

- كل الأزرار: عدّل `styles/buttonVariants.ts`.
- كل الكروت: عدّل `styles/cardVariants.ts`.
- كل الـ Containers: عدّل `styles/containerVariants.ts`.
- كل الجريد: عدّل `styles/gridVariants.ts`.
- ألوان المشروع: عدّل `tokens/colors.ts`.
- المسافات والحواف وأحجام الخط: عدّل `tokens/theme.ts`.

### إضافة Variant جديد

مثال إضافة شكل جديد للكارت داخل `cardVariants.ts`:

```ts
variant: {
    default: 'border shadow-sm',
    elevated: 'border-transparent shadow-lg',
    featured: 'border-2 border-amber-400 shadow-xl',
},
```

بعدها يصبح متاحًا تلقائيًا في TypeScript:

```tsx
<Card variant="featured">...</Card>
```

## 15. أخطاء شائعة

### خطأ: وضع مكوّن داخل Tag مغلق ذاتيًا

خطأ:

```tsx
<Card
    <CardImage />
/>
```

صحيح:

```tsx
<Card>
    <CardImage src="/image.jpg" alt="Description" />
</Card>
```

استخدم `<Card />` فقط عندما يكون الكارت بدون محتوى.

### خطأ: وضع مسار صورة في background

خطأ:

```tsx
<Grid background="./logo.png" />
```

صحيح:

```tsx
<Grid background="muted" backgroundImage="/logo.png" />
```

`background` يختار لونًا أو Gradient، و`backgroundImage` يستقبل مسار الصورة.

### الصورة لا تظهر

إذا كانت الصورة في:

```text
public/logo.png
```

اكتب:

```tsx
backgroundImage = "/logo.png";
```

لا تكتب `./logo.png` عند استخدام ملفات `public`.

### العربي لا يغيّر الاتجاه

تأكد أن الصفحة موجودة داخل `LanguageProvider`. الإعداد موجود حاليًا في `resources/js/app.tsx`، فلا تحذفه.

### خطأ useTheme أو useLanguage

إذا ظهر:

```text
useTheme must be used inside ThemeProvider
```

أو:

```text
useLanguage must be used inside LanguageProvider
```

فهذا يعني أن المكوّن يُستخدم خارج الـ Provider الخاص به. راجع تركيب `app.tsx` الموجود في قسم الإعداد.

## 16. مثال صفحة صغيرة كاملة

```tsx
import { Button } from "@/avora/Components/Button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardPrice,
    CardTitle,
} from "@/avora/Components/Card";
import { Grid } from "@/avora/Components/Grid";
import { LanguageButton } from "@/avora/Components/LanguageButton";
import { useLanguage } from "@/avora/providers/LanguageProvider";
import ModeButton from "@/avora/providers/ModeButton";

export default function ProductsPage() {
    const { translate } = useLanguage();

    return (
        <main className="mx-auto max-w-7xl space-y-8 p-6">
            <header className="flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">
                    {translate({ ar: "المنتجات", en: "Products" })}
                </h1>

                <div className="flex gap-2">
                    <ModeButton />
                    <LanguageButton />
                </div>
            </header>

            <Grid
                minItemWidth="260px"
                gap="lg"
                padding="lg"
                background="muted"
                rounded="lg"
            >
                {[1, 2, 3].map((item) => (
                    <Card key={item} variant="elevated">
                        <CardHeader>
                            <CardTitle>
                                {translate({
                                    ar: `منتج ${item}`,
                                    en: `Product ${item}`,
                                })}
                            </CardTitle>
                            <CardDescription>
                                {translate({
                                    ar: "وصف مختصر للمنتج.",
                                    en: "A short product description.",
                                })}
                            </CardDescription>
                        </CardHeader>

                        <CardFooter>
                            <CardPrice>500 EGP</CardPrice>
                            <Button size="sm">
                                {translate({ ar: "التفاصيل", en: "Details" })}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </Grid>
        </main>
    );
}
```

## 17. من أين أبدأ؟

إذا كنت تستخدم النظام لأول مرة، اتبع هذا الترتيب:

1. شغّل المشروع باستخدام `npm run dev`.
2. افتح صفحة `Welcome` وشاهد الأمثلة.
3. انسخ أقرب مثال إلى الصفحة التي تريدها.
4. غيّر النصوص والصور أولًا.
5. غيّر Props مثل `variant` و`gap` و`background`.
6. استخدم `className` للتعديلات الصغيرة.
7. لا تعدّل ملفات `styles` أو `tokens` إلا إذا كنت تريد تغييرًا عامًا في المشروع كله.
8. شغّل `npm run build` بعد الانتهاء للتأكد من عدم وجود أخطاء.

بهذا الأسلوب ستتعلم النظام جزءًا جزءًا بدون الحاجة إلى حفظ كل الخيارات من البداية.

## 18. أجزاء جاهزة Copy/Paste الجاهزة

فولدر الأجزاء الجاهزة موجود هنا:

```text
resources/js/includes
```

ويحتوي على:

| الملف                      | المحتوى الجاهز                          |
| -------------------------- | --------------------------------------- |
| `NavbarInclude.tsx`        | Navbar كاملة للكمبيوتر والموبايل        |
| `HeroInclude.tsx`          | Hero Section بعنوان ووصف وأزرار ومعاينة |
| `ProductCardInclude.tsx`   | كارت منتج يستقبل البيانات عن طريق Props |
| `ProductGridInclude.tsx`   | سيكشن منتجات متجاوب مع بيانات تجريبية   |
| `DashboardInclude.tsx`     | Grid إحصائيات Dashboard                 |
| `SidebarLayoutInclude.tsx` | صفحة مقسمة إلى Sidebar ومحتوى           |

كل ملف يحتوي على تعليقات إنجليزية بسيطة مثل:

```ts
// Change this image path and alt text.
// Replace this array with products from your backend or API.
// Change placement to top, left, right, start, or end.
```

هذه التعليقات تحدد الأماكن التي تحتاج تعديلها غالبًا عند استخدام القالب في مشروع جديد.

### الاستيراد المباشر

يمكن استخدام الأجزاء الجاهزة كما هي:

```tsx
import { NavbarInclude, HeroInclude, ProductGridInclude } from "@/includes";

export default function HomePage() {
    return (
        <>
            <NavbarInclude />
            <HeroInclude />
            <ProductGridInclude />
        </>
    );
}
```

مثال Dashboard:

```tsx
import { DashboardInclude } from "@/includes";

<DashboardInclude />;
```

مثال Sidebar Layout:

```tsx
import { SidebarLayoutInclude } from "@/includes";

<SidebarLayoutInclude>
    <h1>Page content</h1>
</SidebarLayoutInclude>;
```

### النسخ والتعديل

إذا كان المشروع يحتاج تصميمًا مختلفًا:

1. افتح الملف الأقرب لما تريد.
2. انسخ محتواه إلى فولدر الصفحة أو المشروع.
3. غيّر اسم المكوّن.
4. ابحث عن تعليقات `Change` و`Replace`.
5. غيّر الصور والنصوص والروابط والبيانات.
6. عدّل Props الجاهزة مثل `gap` و`background` و`placement`.
7. استخدم `className` للتعديلات الخاصة بهذا المشروع.
8. شغّل `npm run build` بعد الانتهاء.

يوجد شرح مختصر داخل الفولدر نفسه في:

```text
resources/js/includes/README.md
```
