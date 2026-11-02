<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LivreController;
use App\Http\Controllers\MembreController;
use App\Http\Controllers\EmpruntController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::apiResource('livres', LivreController::class);
Route::apiResource('membres', MembreController::class);
Route::get('emprunts', [EmpruntController::class, 'index']);
Route::post('emprunts', [EmpruntController::class, 'store']);
Route::post('emprunts/{emprunt}/retourner', [EmpruntController::class, 'retourner']);