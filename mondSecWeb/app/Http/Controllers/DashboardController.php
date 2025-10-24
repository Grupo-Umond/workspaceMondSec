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
    $usuariosHomem = Usuario::where('genero', 'Masculino')->count();
    $usuariosMulher = Usuario::where('genero', 'Feminino')->count();
    $usuariosNaoInformar = Usuario::where('genero', 'Prefiro não informar')->count();

    $dados = Usuario::select(
        DB::raw('MONTH(data) as mes'),
        DB::raw('COUNT(*) as total')
    )
    ->whereYear('data', now()->year)
    ->groupBy(DB::raw('MONTH(data)'))
    ->orderBy('mes')
    ->pluck('total', 'mes');

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

    public function viewAdmins()
{
    $adminsPorMes = Admin::selectRaw('MONTH(created_at) as mes, COUNT(*) as total')
        ->where('created_at', '>=', Carbon::now()->subMonths(11)->startOfMonth())
        ->groupBy('mes')
        ->orderBy('mes')
        ->get();

    $dadosPorMes = [];
    for ($i = 0; $i < 12; $i++) {
        $mes = Carbon::now()->subMonths(11 - $i)->format('m');
        $nomeMes = Carbon::now()->subMonths(11 - $i)->translatedFormat('M');
        $total = $adminsPorMes->firstWhere('mes', $mes)?->total ?? 0;
        $dadosPorMes[] = [
            'mes' => ucfirst($nomeMes),
            'total' => $total
        ];
    }

    $distribuicaoNivel = Admin::selectRaw('nivelAdmin, COUNT(*) as total')
        ->groupBy('nivelAdmin')
        ->pluck('total', 'nivelAdmin');

    return view('adm.verAdm.index', [
        'admins' => Admin::all(),
        'dadosPorMes' => $dadosPorMes,
        'distribuicaoNivel' => $distribuicaoNivel
    ]);
}
public function viewUsuarios()
{
    $usuario = Usuario::all();

    $dadosPorMes = Usuario::selectRaw('MONTH(data) as mes, COUNT(*) as total')
        ->whereYear('data', now()->year)
        ->groupBy('mes')
        ->orderBy('mes')
        ->get()
        ->map(function ($item) {
            return [
                'mes' => Carbon::create()->month($item->mes)->format('F'),
                'total' => $item->total
            ];
        });

    $dadosGenero = \App\Models\Usuario::selectRaw('genero, COUNT(*) as total')
        ->groupBy('genero')
        ->get();

    return view('adm.verUsuario.index', compact('usuario', 'dadosPorMes', 'dadosGenero'));
}

public function viewOcorrencias()
{
    // traz todas as ocorrências com usuário
    $ocorrencias = Ocorrencia::with('usuario')->get();

    // consulta com mês (1..12) e total
    $counts = DB::table('tbOcorrencia')
        ->select(DB::raw('MONTH(dataPostagem) as mes'), DB::raw('COUNT(*) as total'))
        ->whereYear('dataPostagem', Carbon::now()->year)
        ->groupBy(DB::raw('MONTH(dataPostagem)'))
        ->orderBy(DB::raw('MONTH(dataPostagem)'))
        ->pluck('total', 'mes')
        ->toArray();

    // monta array com 12 meses garantindo 0 quando não houver ocorrências
    $mesesFull = array_fill(1, 12, 0); // keys 1..12
    foreach ($counts as $mes => $total) {
        $mesesFull[(int)$mes] = (int)$total;
    }
    // converte para array zero-indexado [mes1, mes2, ..., mes12] para facilitar no JS
    $ocorrenciasPorMes = array_values($mesesFull);

    // zonas (ajuste limites se quiseres maior precisão)
    $zonas = [
        'Leste 1 (Central)' => [
            'lat_min' => -23.55, 'lat_max' => -23.50,
            'lng_min' => -46.55, 'lng_max' => -46.45,
        ],
        'Leste 2 (Alta)' => [
            'lat_min' => -23.55, 'lat_max' => -23.45,
            'lng_min' => -46.45, 'lng_max' => -46.40,
        ],
        'Leste 3 (Extremo)' => [
            'lat_min' => -23.60, 'lat_max' => -23.55,
            'lng_min' => -46.50, 'lng_max' => -46.35,
        ],
        'Leste 4 (Nordeste)' => [
            'lat_min' => -23.55, 'lat_max' => -23.45,
            'lng_min' => -46.50, 'lng_max' => -46.40,
        ],
    ];

    $ocorrenciasPorZona = [];
    foreach ($zonas as $zona => $limites) {
        $count = DB::table('tbOcorrencia')
            ->whereBetween('latitude', [$limites['lat_min'], $limites['lat_max']])
            ->whereBetween('longitude', [$limites['lng_min'], $limites['lng_max']])
            ->count();
        $ocorrenciasPorZona[$zona] = (int)$count;
    }

    return view('adm.verOcorrencia.index', compact('ocorrencias', 'ocorrenciasPorMes', 'ocorrenciasPorZona'));
}
}


