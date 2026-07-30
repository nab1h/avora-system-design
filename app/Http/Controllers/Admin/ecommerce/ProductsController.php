<?php

namespace App\Http\Controllers\admin\ecommerce;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\AttributeValue;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Classes;
use App\Models\Color;
use App\Models\Offer;
use App\Models\Product;
use App\Models\SubCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProductsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'section' => 'products',

            'products' => Product::with([
                'category:id,name_ar,name_en',
                'brand:id,name_ar,name_en',

                // فئة الرجال والنساء والأطفال
                'productClass:id,name_ar,name_en',

                'subCategory:id,categories_id,name_ar,name_en',
                'offer:id,name_ar,name_en,type,value',
                'images:id,product_id,image,type',
                'features:id,product_id,feature',
                'attributes:id,product_id,attribute_value_id',
                'attributes.value:id,attribute_id,value',
                'attributes.value.attribute:id,name,name_en',
                'colors:id,name_ar,name_en,hex',
            ])
                ->latest()
                ->get(),

            'categories' => Category::query()
                ->select('id', 'name_ar', 'name_en')
                ->orderBy('name_ar')
                ->get(),

            'brands' => Brand::query()
                ->select('id', 'name_ar', 'name_en', 'image')
                ->orderBy('name_ar')
                ->get(),

            // صححنا clasess إلى classes
            'classes' => Classes::query()
                ->select('id', 'name_ar', 'name_en')
                ->where('status', true)
                ->orderBy('name_ar')
                ->get(),

            'subCategories' => SubCategory::query()
                ->select(
                    'id',
                    'categories_id',
                    'name_ar',
                    'name_en'
                )
                ->orderBy('name_ar')
                ->get(),

            'offers' => Offer::query()
                ->select(
                    'id',
                    'name_ar',
                    'name_en',
                    'type',
                    'value'
                )
                ->get(),

            'attributes' => Attribute::with([
                'values:id,attribute_id,value',
            ])->get(),

            'colors' => Color::query()->select('id', 'name_ar', 'name_en', 'hex')->orderBy('name_ar')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateProduct($request);

        DB::transaction(function () use ($request, $data) {
            $product = Product::create(
                $this->productData($data)
            );

            $this->syncRelations(
                $request,
                $product,
                $data
            );
        });

        return back()->with(
            'success',
            'Product created successfully.'
        );
    }

    public function update(
        Request $request,
        Product $product
    ): RedirectResponse {
        $data = $this->validateProduct(
            $request,
            $product
        );

        DB::transaction(function () use (
            $request,
            $product,
            $data
        ) {
            $product->update(
                $this->productData($data)
            );

            $this->syncRelations(
                $request,
                $product,
                $data,
                true
            );
        });

        return back()->with(
            'success',
            'Product updated successfully.'
        );
    }

    public function destroy(
        Product $product
    ): RedirectResponse {
        DB::transaction(function () use ($product) {
            $product->load('images');

            foreach ($product->images as $image) {
                if (
                    $image->image &&
                    Storage::disk('public')->exists(
                        $image->image
                    )
                ) {
                    Storage::disk('public')->delete(
                        $image->image
                    );
                }
            }

            $product->delete();
        });

        return back()->with(
            'success',
            'Product deleted successfully.'
        );
    }

    private function validateProduct(
        Request $request,
        ?Product $product = null
    ): array {
        return $request->validate([
            'category_id' => [
                'required',
                'integer',
                'exists:categories,id',
            ],

            'brand_id' => [
                'required',
                'integer',
                'exists:brands,id',
            ],

            // العلاقة الجديدة مع جدول classes
            'class_id' => [
                'required',
                'integer',
                'exists:classes,id',
            ],

            'sub_category_id' => [
                'required',
                'integer',

                Rule::exists(
                    'sub_categories',
                    'id'
                )->where(
                    fn ($query) => $query->where(
                        'categories_id',
                        $request->integer('category_id')
                    )
                ),
            ],

            'offer_id' => [
                'nullable',
                'integer',
                'exists:offers,id',
            ],

            'name_ar' => [
                'required',
                'string',
                'max:255',
            ],

            'name_en' => [
                'required',
                'string',
                'max:255',
            ],

            'slug_ar' => [
                'nullable',
                'string',
                'max:255',

                Rule::unique(
                    'products',
                    'slug_ar'
                )->ignore($product?->id),
            ],

            'slug_en' => [
                'nullable',
                'string',
                'max:255',

                Rule::unique(
                    'products',
                    'slug_en'
                )->ignore($product?->id),
            ],

            'desc_ar' => [
                'nullable',
                'string',
            ],

            'desc_en' => [
                'nullable',
                'string',
            ],

            'price' => [
                'required',
                'numeric',
                'min:0',
            ],

            'stock' => [
                'required',
                'integer',
                'min:0',
            ],

            'has_custom_color_stock' => ['required', 'boolean'],

            'colors' => ['nullable', 'array'],
            'colors.*.id' => ['required', 'integer', 'distinct', 'exists:colors,id'],
            'colors.*.stock' => ['nullable', 'integer', 'min:0'],

            'is_active' => [
                'required',
                'boolean',
            ],

            'features' => [
                'nullable',
                'array',
            ],

            'features.*' => [
                'nullable',
                'string',
                'max:255',
            ],

            'attributes' => [
                'nullable',
                'array',
            ],

            'attributes.*.attribute_id' => [
                'required',
                'integer',
                'distinct',
                'exists:attributes,id',
            ],

            'attributes.*.value' => [
                'required',
                'string',
                'max:255',
            ],

            'main_image' => [
                $product ? 'nullable' : 'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:4096',
            ],

            'gallery_images' => [
                'nullable',
                'array',
                'max:10',
            ],

            'gallery_images.*' => [
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:4096',
            ],

            'remove_image_ids' => [
                'nullable',
                'array',
            ],

            'remove_image_ids.*' => [
                'integer',

                Rule::exists(
                    'product_images',
                    'id'
                )->where(
                    fn ($query) => $query->where(
                        'product_id',
                        $product?->id ?? 0
                    )
                ),
            ],
        ]);
    }

    private function productData(array $data): array
    {
        return collect($data)->only([
            'category_id',
            'brand_id',
            'class_id',
            'sub_category_id',
            'offer_id',
            'name_ar',
            'name_en',
            'slug_ar',
            'slug_en',
            'desc_ar',
            'desc_en',
            'price',
            'stock',
            'has_custom_color_stock',
            'is_active',
        ])->all();
    }

    private function syncRelations(
        Request $request,
        Product $product,
        array $data,
        bool $updating = false
    ): void {
        if (
            $updating &&
            ! empty($data['remove_image_ids'])
        ) {
            $images = $product
                ->images()
                ->whereIn(
                    'id',
                    $data['remove_image_ids']
                )
                ->get();

            foreach ($images as $image) {
                if (
                    $image->type === 'main' &&
                    ! $request->hasFile('main_image')
                ) {
                    continue;
                }

                if (
                    $image->image &&
                    Storage::disk('public')->exists(
                        $image->image
                    )
                ) {
                    Storage::disk('public')->delete(
                        $image->image
                    );
                }

                $image->delete();
            }
        }

        $product->features()->delete();

        $product->features()->createMany(
            collect($data['features'] ?? [])
                ->filter(
                    fn ($feature) => filled($feature)
                )
                ->map(
                    fn ($feature) => [
                        'feature' => trim($feature),
                    ]
                )
                ->values()
                ->all()
        );

        $product->attributes()->delete();

        $attributeRows = collect(
            $data['attributes'] ?? []
        )->map(function (array $item) {
            $value = AttributeValue::firstOrCreate([
                'attribute_id' => $item['attribute_id'],
                'value' => trim($item['value']),
            ]);

            return [
                'attribute_value_id' => $value->id,
            ];
        })->all();

        $product
            ->attributes()
            ->createMany($attributeRows);

        $colors = collect($data['colors'] ?? [])->values();
        if ($colors->isEmpty()) {
            $product->colors()->detach();
        } else {
            $customStock = (bool) $data['has_custom_color_stock'];
            $product->colors()->sync(
                $colors->mapWithKeys(function (array $color) use ($customStock) {
                    return [$color['id'] => [
                        'stock' => $customStock
                            ? (int) ($color['stock'] ?? 0)
                            : null,
                    ]];
                })->all()
            );

        }

        if ($request->hasFile('main_image')) {
            if ($updating) {
                $oldMain = $product
                    ->images()
                    ->where('type', 'main')
                    ->first();

                if ($oldMain) {
                    if (
                        $oldMain->image &&
                        Storage::disk('public')->exists(
                            $oldMain->image
                        )
                    ) {
                        Storage::disk('public')->delete(
                            $oldMain->image
                        );
                    }

                    $oldMain->delete();
                }
            }

            $product->images()->create([
                'image' => $request
                    ->file('main_image')
                    ->store('products', 'public'),

                'type' => 'main',
            ]);
        }

        foreach (
            $request->file('gallery_images', [])
            as $image
        ) {
            $product->images()->create([
                'image' => $image->store(
                    'products',
                    'public'
                ),

                'type' => 'gallery',
            ]);
        }
    }
}
