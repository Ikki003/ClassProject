<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function proyectos() {
        return $this->belongsToMany(Proyecto::class, 'usuarios_proyectos');
    }

    public function tareas() {
        return $this->belongsToMany(Tarea::class);
    }

    public function notificationsSent() {
        return $this->hasMany(Notificacion::class, 'user_sender_id');
    }

    public function proyectosAdmin() {
        return $this->hasMany(Proyecto::class);
    }

    public function notificationsReceived() {
        return $this->hasMany(Notificacion::class, 'user_receiver_id');
    }

    public function getUnread() {
        return $this->with('notificationsSent', 'notificationsReceived')
            ->join('notificaciones', function ($join) {
                $join->on('notificaciones.user_sender_id', '=', 'users.id')
                    ->where('notificaciones.read', 0);
            })
            ->count();
    }

}
