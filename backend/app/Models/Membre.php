<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Membre extends Model
{
    protected $table = 'membres';

    protected $fillable = ['nom', 'email'];
    public function emprunts()
    {
        return $this->hasMany(Emprunt::class);
    }
    public function empruntsEnCours()
    {
        return $this->emprunts()->whereNull('date_retour_effective')->count();
    }
    public function empruntsEnRetard()
    {
        return $this->emprunts()
            ->whereNull('date_retour_effective')
            ->whereDate('date_retour_prevue', '<', today())
            ->count();
    }
}
