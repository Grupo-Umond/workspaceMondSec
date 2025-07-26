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
            ->where('idUsuario', $usuario->idUsuario)
            ->get()
            ->map(function ($ocorrencias) {
                return [
                    'tituloOcorrencia' => $ocorrencias->tituloOcorrencia,
                    'longitudeOcorrencia' => $ocorrencias->longitudeOcorrencia,
                    'latitudeOcorrencia' => $ocorrencias->latitudeOcorrencia,
                    'dataRegistradaOcorrencia' => $ocorrencias->dataRegistradaOcorrencia,
                    'descricaoTipo' => $ocorrencias->tbTipoOcorrencia->descricaoTipo ?? 'Sem descrição',
                ];
            });
            return response()->json($ocorrencias);

    }

    public function store(Request $request) {
        $usuario = auth()->user();

        $dados = $request->validate([
            'tituloOcorrencia' => 'required|string',
            'descricaoTipo' => 'nullable|string',
            'latitudeOcorrencia' => 'required|numeric',
            'longitudeOcorrencia' => 'required|numeric',
            'tbTipoOcorrencia.tipoOcorrencia' => 'required|string',
            'tbTipoOcorrencia.descricaoOcorrencia' => 'nullable|string',
        ]);

        // Primeiro cria o tipoOcorrencia (se necessário
        $tipo = \App\Models\TipoOcorrencia::firstOrCreate(
            ['nomeTipo' => $dados['tbTipoOcorrencia']['tipoOcorrencia']],
            ['descricaoTipo' => $dados['tbTipoOcorrencia']['descricaoOcorrencia'] ?? null]
        );

        // Agora cria a ocorrência vinculando o tipoOcorrencia
        $ocorrencia = Ocorrencia::create([
            'tituloOcorrencia' => $dados['tituloOcorrencia'],
            'latitudeOcorrencia' => $dados['latitudeOcorrencia'],
            'longitudeOcorrencia' => $dados['longitudeOcorrencia'],
            'idTipo' => $tipo->idTipo,
            'idUsuario' => $usuario->idUsuario,
        ]);


        return response()->json([
            'mensagem' => 'Ocorrência registrada com sucesso!',
            'ocorrencia' => $ocorrencia
        ]);
    }

}

