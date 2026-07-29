<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Classes;
use App\Models\Product;
use App\Models\SubCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SubCategoryProductSeeder extends Seeder
{
    public function run(): void
    {
        $brandId = Brand::query()->value('id');
        $classId = Classes::query()->value('id');

        SubCategory::query()->where('is_active', true)->each(function (SubCategory $subCategory) use ($brandId, $classId) {
            $slug = 'sample-'.$subCategory->id.'-'.Str::slug($subCategory->name_en);

            Product::firstOrCreate(
                ['slug_en' => $slug],
                [
                    'category_id' => $subCategory->categories_id,
                    'sub_category_id' => $subCategory->id,
                    'brand_id' => $brandId,
                    'class_id' => $classId,
                    'name_ar' => 'منتج مميز من '.$subCategory->name_ar,
                    'name_en' => 'Premium '.$subCategory->name_en.' Selection',
                    'slug_ar' => 'منتج-مميز-'.$subCategory->id,
                    'desc_ar' => 'اختيار عملي وأنيق من قسم '.$subCategory->name_ar.'، مصنوع للاستخدام اليومي بجودة عالية.',
                    'desc_en' => 'A practical, refined everyday essential selected from our '.$subCategory->name_en.' collection.',
                    'price' => 799 + ($subCategory->id * 50),
                    'stock' => 12,
                    'is_active' => true,
                ],
            );
        });
    }
}
