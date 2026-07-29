<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            [
                'name_ar' => 'نوار آي وير',
                'name_en' => 'Noir Eyewear',
                'desc_ar' => 'نظارات شمسية كلاسيكية بإطار أسود أنيق وعدسات داكنة للحماية اليومية.',
                'desc_en' => 'Classic black-frame sunglasses with dark lenses for refined everyday protection.',
                'image' => 'brands/noir-eyewear.png',
            ],
            [
                'name_ar' => 'روز أوبتيكس',
                'name_en' => 'Rose Optics',
                'desc_ar' => 'تصاميم نسائية عصرية بإطارات كات آي بلون التورتويز الدافئ.',
                'desc_en' => 'Modern cat-eye frames in warm tortoiseshell tones for a distinctive look.',
                'image' => 'brands/rose-optics.png',
            ],
            [
                'name_ar' => 'أزور آي وير',
                'name_en' => 'Azure Eyewear',
                'desc_ar' => 'نظارات دائرية شفافة وخفيفة بتصميم عصري مستوحى من ألوان السماء.',
                'desc_en' => 'Lightweight translucent round frames with a contemporary sky-blue finish.',
                'image' => 'brands/azure-eyewear.png',
            ],
        ];

        foreach ($brands as $brand) {
            Brand::updateOrCreate(
                ['name_en' => $brand['name_en']],
                $brand,
            );
        }
    }
}
