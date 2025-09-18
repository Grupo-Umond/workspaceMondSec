<?php

namespace App\Http\Controllers;

use App\Models\Ocorrencia;
use App\Models\TipoOcorrencia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OcorrenciaController extends Controller
{

    public function index(Request $request) {
        $usuario = auth()->user();

        $ocorrencias = Ocorrencia::with('tipoOcorrencia')
            ->where('idUsuario', $usuario->id)
            ->get()
            ->map(function ($ocorrencias) {
                return [
                    'titulo' => $ocorrencias->titulo,
                    'longitude' => $ocorrencias->longitude,
                    'latitude' => $ocorrencias->latitude,
                    'data' => $ocorrencias->data,
                    'descricao' => $ocorrencias->tipoOcorrencia->descricao ?? 'Sem descrição',
                ];
            });
            return response()->json(['ocorrencias' => $ocorrencias, 'mensagem' => 'Ocorrencias encontradas com sucesso']);

    }

    public function store(Request $request) {
        $usuario = auth()->user();

        $dados = $request->validate([
            'titulo' => 'required|string',
            'latitude' => 'required',
            'longitude' => 'required',
            'tbTipoOcorrencia.tipo' => 'required|string',
            'tbTipoOcorrencia.descricao' => 'nullable|string',
        ]);

        $tipo = TipoOcorrencia::firstOrCreate(
            ['categoria' => $dados['tbTipoOcorrencia']['tipo']],
            ['descricao' => $dados['tbTipoOcorrencia']['descricao'] ?? null]
        );

        $ocorrencia = Ocorrencia::create([
            'titulo' => $dados['titulo'],
            'latitude' => $dados['latitude'],
            'longitude' => $dados['longitude'],
            'idTipoOcorrencia' => $tipo->id,
            'idUsuario' => $usuario->id,
        ]);


        return response()->json([
            'mensagem' => 'Ocorrência registrada com sucesso!',
            'ocorrencia' => $ocorrencia
        ]);
    }

}

