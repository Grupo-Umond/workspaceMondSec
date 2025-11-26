<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuario;
use App\Models\Admin;
use Carbon\Carbon;
use App\Models\Ocorrencia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{

    public function index()
    {
        // 📌 Totais para os cards
        $totalUsuarios = Usuario::count();
        $totalAdmins = Admin::count();
        $totalOcorrencias = Ocorrencia::count();
        $totalComentarios = Comentario::count();

        // 📌 Gráfico: usuários cadastrados por mês (últimos 12)
        $usuariosPorMes = Usuario::selectRaw('MONTH(dataCadastro) as mes, COUNT(*) as total')
            ->groupBy('mes')
            ->orderBy('mes')
            ->get();

        // 📌 Gráfico: ocorrências por tipo
        $ocorrenciasPorTipo = Ocorrencia::selectRaw('tipo, COUNT(*) as total')
            ->groupBy('tipo')
            ->get();

        // 📌 Gráfico: comentários por status
        $comentariosPorStatus = Comentario::selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->get();

        // 📌 Gráfico: admins por nível
        $adminsPorNivel = Admin::selectRaw('nivelAdmin, COUNT(*) as total')
            ->groupBy('nivelAdmin')
            ->get();

        return view('adm.dashboard.index', compact(
            'totalUsuarios',
            'totalAdmins',
            'totalOcorrencias',
            'totalComentarios',
            'usuariosPorMes',
            'ocorrenciasPorTipo',
            'comentariosPorStatus',
            'adminsPorNivel'
        ));
    }
}

}


