<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Membre;
use Illuminate\Validation\Rule;

class MembreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return response()->json(Membre::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:membres,email',
        ]);

        $membre = Membre::create($data);

        return response()->json($membre, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //

        return response()->json($membre, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
         $data = $request->validate([
            'nom' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('membres', 'email')->ignore($membre->id)],
        ]);

        $membre->update($data);

        return response()->json($membre, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        if ($membre->emprunts()->count() > 0) {
            return response()->json([
                'message' => 'Ce membre ne peut pas etre supprime.'
            ], 409);
        }

        $membre->delete();

        return response()->noContent();
    }
    
}
