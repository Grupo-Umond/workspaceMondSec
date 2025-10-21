<?php

namespace App\Http\Controllers;

use App\Models\Ocorrencia;
use App\Models\TipoOcorrencia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OcorrenciaController extends Controller
{
    public function allOcorencias(Request $request) {
        $ocorrencias = Ocorrencia::all();

        return response()->json(['ocorrencias' => $ocorrencias]);
    }
    public function index(Request $request) {
        $usuario = auth()->user();

        $ocorrencias = Ocorrencia::where('idUsuario', $usuario->id)
            ->get()
            ->map(function ($ocorrencias) {
                return [
                    'titulo' => $ocorrencias->titulo,
                    'longitude' => $ocorrencias->longitude,
                    'latitude' => $ocorrencias->latitude,
                    'dataPostagem' => $ocorrencias->dataPostagem,
                    'dataAcontecimento' => $ocorrencias->dataAcontecimento,

                    'tipo' => $ocorrencias->tipo,
                    'descricao' => $ocorrencias->descricao,
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
            'tipo' => 'required|string',
            'descricao' => 'nullable|string',
            'dataAcontecimento' => 'nullable',
        ]);


        Ocorrencia::create([
            'titulo' => $dados['titulo'],
            'latitude' => $dados['latitude'],
            'longitude' => $dados['longitude'],
            'descricao' => $dados['descricao'],
            'dataAcontecimento' => $dados['dataAcontecimento'],
            'tipo' => $dados['tipo'],
            'idUsuario' => $usuario->id,
        ]);


        return response()->json([
            'mensagem' => 'Ocorrência registrada com sucesso!',
        ]);
    }

}

