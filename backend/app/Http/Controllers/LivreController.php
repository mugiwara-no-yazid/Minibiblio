<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Livre;
use Illuminate\Validation\Rule;

class LivreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
         $livres = Livre::all();
        foreach ($livres as $livre) {
            $livre->exemplaires_disponibles = $livre->exemplairesDisponibles();
        }

        return response()->json($livres, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $data = $request->validate([
            'titre' => 'required|string|max:255',
            'auteur' => 'required|string|max:255',
            'isbn' => 'required|string|max:20|unique:livres,isbn',
            'nombre_exemplaires' => 'required|integer|min:1',
        ]);

        $livre = Livre::create($data);

        return response()->json($livre, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $livre->exemplaires_disponibles = $livre->exemplairesDisponibles();

        return response()->json($livre, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $data = $request->validate([
            'titre' => 'required|string|max:255',
            'auteur' => 'required|string|max:255',
            'isbn' => ['required', 'string', 'max:20', Rule::unique('livres', 'isbn')->ignore($livre->id)],
            'nombre_exemplaires' => 'required|integer|min:1',
        ]);
        if ($data['nombre_exemplaires'] < $livre->empruntsEnCours()) {
            return response()->json([
                'message' => 'Le nombre d\'exemplaires ne peut pas etre inferieur au nombre d\'emprunt en cour.'
            ], 422);
        }

        $livre->update($data);

        return response()->json($livre, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        if ($livre->empruntsEnCours() > 0) {
            return response()->json([
                'message' => 'Ce livre a des emprunts en cours, il ne peut pas etre supprime.'
            ], 409);
        }

       
        if ($livre->emprunts()->count() > 0) {
            return response()->json([
                'message' => 'Pour une cohrence des donnes, ce livre ne peut pas tre supprime.'
            ], 409);
        }

        $livre->delete();

        return response()->noContent();
    }
}
