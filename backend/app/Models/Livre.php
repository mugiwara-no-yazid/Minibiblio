<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Livre extends Model
{
    protected $table = 'livres';

    protected $fillable = ['titre', 'auteur', 'isbn', 'nombre_exemplaires'];

    public function emprunts()
    {
        return $this->hasMany(Emprunt::class);
    }

    public function empruntsEnCours()
    {
        return $this->emprunts()->whereNull('date_retour_effective')->count();
    }

    public function exemplairesDisponibles()
    {
        return $this->nombre_exemplaires - $this->empruntsEnCours();
    }
}
