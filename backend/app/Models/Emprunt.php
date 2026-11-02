<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Emprunt extends Model
{
    //

protected $table = 'emprunts';

    protected $fillable = [
        'livre_id',
        'membre_id',
        'date_emprunt',
        'date_retour_prevue',
        'date_retour_effective',
    ];

    protected $casts = [
        'date_emprunt' => 'date:Y-m-d',
        'date_retour_prevue' => 'date:Y-m-d',
        'date_retour_effective' => 'date:Y-m-d',
    ];

    public function livre()
    {
        return $this->belongsTo(Livre::class);
    }

    public function membre()
    {
        return $this->belongsTo(Membre::class);
    }
}
