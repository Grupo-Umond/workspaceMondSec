<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class DBController extends Controller
{
    public function indexAsc()
    {
        return response()->json(
            DB::table('tbUsuario')->orderBy('nomeUsuario', 'asc')->get()
        );
    }

    public function indexDesc()
    {
        return response()->json(
            DB::table('tbUsuario')->orderBy('nomeUsuario', 'desc')->get()
        );
    }
}