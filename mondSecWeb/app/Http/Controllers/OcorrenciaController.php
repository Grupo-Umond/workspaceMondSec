<?php

namespace App\Http\Controllers;

use App\Models\Ocorrencia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OcorrenciaController extends Controller
{

    public function index(Request $request) {
        $usuario = auth()->user();

        $ocorrencias = Ocorrencia::with('tbTipoOcorrencia')
            ->where('idUsuario', $usuario->idUsuario)
            ->get()
            ->map(function ($ocorrencias) {
                return [
                    'tituloOcorrencia' => $ocorrencias->tituloOcorrencia,
                    'longitudeOcorrencia' => $ocorrencias->longitudeOcorrencia,
                    'latitudeOcorrencia' => $ocorrencias->latitudeOcorrencia,
                    'dataRegistradaOcorrencia' => $ocorrencias->dataRegistradaOcorrencia,
                    'descricao' => $ocorrencias->tbTipoOcorrencia->descricaoOcorrencia ?? 'Sem descrição',
                ];
            });
            return response()->json($ocorrencias);

    }
}
