<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comentario;
use App\Models\Usuario;
use App\Models\Ocorrencia;
use Carbon\Carbon;
use Validator;

class ComentarioController extends Controller
{
   
    public function getByOcorrencia($idOcorrencia)
    {
        if (!is_numeric($idOcorrencia)) {
            return response()->json([], 400);
        }

        $comentarios = Comentario::where('ocorrencia_id', $idOcorrencia)
            ->with(['usuario:id,name']) 
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($comentarios, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mensagem' => 'required|string',
            'idOcorrencia' => 'required|exists:ocorrencias,id',
            'idUsuario' => 'required|exists:users,id',
            'data' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $mensagem = $request->input('mensagem');
        $idOcorrencia = $request->input('idOcorrencia');
        $idUsuario = $request->input('idUsuario');
        $data = $request->input('data') ? Carbon::parse($request->input('data')) : Carbon::now();


        $comentario = Comentario::create([
            'mensagem' => $mensagem,
            'data' => $data,
            'idOcorrencia' => $idOcorrencia,
            'idUsuario' => $idUsuario,
        ]);

        $comentario->load('usuario:id,name');

        return response()->json($comentario, 201);
        }}