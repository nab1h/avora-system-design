<?php
namespace App\Http\Controllers\Admin\ecommerce;
use App\Http\Controllers\Controller; use App\Models\Size; use App\Models\Weight; use App\Models\Material; use Illuminate\Http\Request; use Inertia\Inertia;
class ProductOptionController extends Controller {
 private function model(string $type): string { return ['sizes'=>Size::class,'weights'=>Weight::class,'materials'=>Material::class][$type]; }
 public function index(string $type){ $model=$this->model($type); return Inertia::render('Dashboard',['section'=>$type,$type=>$model::query()->withCount('products')->orderBy('name_ar')->get()]); }
 public function store(Request $request,string $type){ $model=$this->model($type); $model::create($this->data($request)); return back(); }
 public function update(Request $request,string $type,int $option){ $model=$this->model($type); $model::findOrFail($option)->update($this->data($request)); return back(); }
 public function destroy(string $type,int $option){ $model=$this->model($type); $item=$model::findOrFail($option); if($item->products()->exists()) return back()->withErrors(['option'=>'Cannot delete an option assigned to products.']); $item->delete(); return back(); }
 private function data(Request $request): array { return $request->validate(['name_ar'=>['required','string','max:255'],'name_en'=>['required','string','max:255']]); }
}
