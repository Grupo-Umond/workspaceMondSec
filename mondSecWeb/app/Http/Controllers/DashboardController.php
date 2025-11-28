<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use App\Models\Admin;
use App\Models\Ocorrencia;
use App\Models\Comentario;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Totais
        $totalUsuarios = Usuario::count();
        $totalAdmins = Admin::count();
        $totalOcorrencias = Ocorrencia::count();
        $totalComentarios = Comentario::count();

        // Usuários por mês
        $usuariosPorMes = Usuario::selectRaw('MONTH(data) as mes, COUNT(*) as total')
            ->groupBy('mes')
            ->orderBy('mes')
            ->get();

        // 📌 Gráfico: ocorrências por mês
        $ocorrenciasPorMes = Ocorrencia::selectRaw('MONTH(dataAcontecimento) as mes, COUNT(*) as total')

            ->groupBy('mes')
            ->orderBy('mes')
            ->get();

        // Ocorrências por tipo

        $ocorrenciasPorTipo = Ocorrencia::selectRaw('tipo, COUNT(*) as total')
            ->groupBy('tipo')
            ->get();


        $comentariosPorStatus = Comentario::selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->get();


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
            'adminsPorNivel','ocorrenciasPorMes'
        ));
    }
}

