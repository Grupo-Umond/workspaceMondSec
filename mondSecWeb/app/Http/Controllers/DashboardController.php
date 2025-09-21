<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $usuariosHomem = Usuario::where('genero', 'Masculino')->count();
        $usuariosMulher = Usuario::where('genero', 'Feminino')->count();
        $usuariosNaoInformar = Usuario::where('genero', 'Prefiro não informar')->count();

        // Busca total por mês
        $dados = Usuario::select(
                DB::raw('MONTH(data) as mes'),
                DB::raw('COUNT(*) as total')
            )
            ->whereYear('data', now()->year) // só do ano atual
            ->groupBy(DB::raw('MONTH(data)'))
            ->orderBy('mes')
            ->pluck('total', 'mes'); // retorna algo tipo: [1 => 10, 2 => 20, 3 => 5]

        // Cria o array formatado para o gráfico
        $usuariosPorMes = [
            'labels' => [],
            'data'   => []
        ];

        setlocale(LC_TIME, 'pt_BR');
        for ($i = 1; $i <= 12; $i++) {
            $usuariosPorMes['labels'][] = ucfirst(strftime('%B', mktime(0,0,0,$i,1)));
            $usuariosPorMes['data'][] = $dados[$i] ?? 0;
        }

        $usuariosComOcorrencia = Usuario::has('ocorrencia')->count();

        $usuariosSemOcorrencia = Usuario::doesntHave('ocorrencia')->count();

        return view('adm.dashboard.index', compact(
            'usuariosHomem',
            'usuariosMulher',
            'usuariosNaoInformar',
            'usuariosPorMes',
            'usuariosComOcorrencia',
            'usuariosSemOcorrencia'
        ));
    }
}
