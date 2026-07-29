<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ShoppingPageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Shopping');
    }
}
