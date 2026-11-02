<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Emprunt;
use App\Models\Livre;
use App\Models\Membre;

class EmpruntController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'membre_id' => 'nullable|integer|exists:membres,id',
        ]);

        $requete = Emprunt::with(['livre', 'membre'])
            ->whereNull('date_retour_effective');

        if ($request->filled('membre_id')) {
            $requete->where('membre_id', $request->membre_id);
        }

        $emprunts = $requete->orderBy('date_retour_prevue')->get();
        foreach ($emprunts as $emprunt) {
            $emprunt->en_retard = $emprunt->date_retour_prevue->lt(today());
        }

        return response()->json($emprunts, 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'membre_id' => 'required|integer|exists:membres,id',
            'livre_id' => 'required|integer|exists:livres,id',
        ]);
        $membre = Membre::find($data['membre_id']);
        $livre = Livre::find($data['livre_id']);
        if ($membre->empruntsEnRetard() > 0) {
            return response()->json([
                'message' => 'Ce membre a un emprunt en retard, il ne peut pas emprunte.'
            ], 409);
        }
        if ($membre->empruntsEnCours() >= 3) {
            return response()->json([
                'message' => 'Ce membre deja 3 empruns en cours.'
            ], 409);
        }
        if ($livre->exemplairesDisponibles() <= 0) {
            return response()->json([
                'message' => 'Aucun exemplaire disponible pour ce livre.'
            ], 409);
        }
        $emprunt = Emprunt::create([
            'membre_id' => $membre->id,
            'livre_id' => $livre->id,
            'date_emprunt' => today(),
            'date_retour_prevue' => today()->addDays(14),
        ]);

        return response()->json($emprunt->load(['livre', 'membre']), 201);
    }

    public function retourner(Emprunt $emprunt)
    {
        if ($emprunt->date_retour_effective != null) {
            return response()->json([
                'message' => 'Cet emprunt a deja ete retourne.'
            ], 409);
        }

        $emprunt->date_retour_effective = today();
        $emprunt->save();

        return response()->json($emprunt->load(['livre', 'membre']), 200);
    }
}
