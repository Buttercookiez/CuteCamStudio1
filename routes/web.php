<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PhotoboothController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Landing page
Route::get('/', function () {
    return view('landing');
})->name('home');

// Photobooth routes
Route::prefix('photobooth')->name('photobooth.')->group(function () {
    // Main photobooth interface
    Route::get('/', [PhotoboothController::class, 'index'])->name('index');
    
    // Photo capture handling
    Route::post('/capture', [PhotoboothController::class, 'capture'])->name('capture');
    
    // Customization flow
    Route::get('/customize', [PhotoboothController::class, 'showCustomize'])
         ->name('customize.show');
    Route::post('/customize/save', [PhotoboothController::class, 'saveCustomizedPhoto'])
         ->name('customize.save');
    
    // Download handling
    Route::get('/download', [PhotoboothController::class, 'download'])
         ->name('download');
    
    // Gallery and success pages
    Route::get('/gallery', [PhotoboothController::class, 'gallery'])
         ->name('gallery');
    Route::get('/success/{filename}', [PhotoboothController::class, 'success'])
         ->name('success');
    
    // Asset endpoints
    Route::get('/assets/stickers/{category}', [PhotoboothController::class, 'getStickers'])
         ->name('assets.stickers');
    Route::get('/assets/frames/{category?}', [PhotoboothController::class, 'getFrames'])
         ->name('assets.frames');
});

// Redirect /customize to /photobooth/customize
Route::get('/customize', function () {
    return redirect()->route('photobooth.customize.show');
});

// Add this route
Route::post('/photobooth/generate-frame', [PhotoboothController::class, 'generateFramedPhoto'])
     ->name('generate.frame');