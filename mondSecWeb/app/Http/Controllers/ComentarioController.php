<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comentario;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class ComentarioController extends Controller
{

    public function getByOcorrencia($idOcorrencia)
    {
        if (!is_numeric($idOcorrencia)) {
            return response()->json([], 400);
        }

        $comentarios = Comentario::where('idOcorrencia', $idOcorrencia)
            ->with(['usuario:id,nome,email'])
            ->orderBy('data', 'desc')
            ->get()
            ->map(function ($c) {
                if ($c->data instanceof Carbon) {
                    $c->data = $c->data->toIso8601String();
                } elseif ($c->data) {
                    try {
                        $c->data = Carbon::parse($c->data)->toIso8601String();
                    } catch (\Exception $e) {
  
                    }
                }
                return $c;
            });

        return response()->json($comentarios, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mensagem' => 'required|string',
            'idOcorrencia' => 'required|integer|exists:tbOcorrencia,id',
            'data' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $userId = auth()->id();
        if (!$userId) {
            return response()->json(['error' => 'Usuário não autenticado'], 401);
        }

        $data = $request->input('data')
            ? Carbon::parse($request->input('data'))
            : Carbon::now();

        $comentario = Comentario::create([
            'mensagem' => $request->mensagem,
            'idOcorrencia' => $request->idOcorrencia,
            'idUsuario' => $userId,
            'status' => 'espera',
            'data' => $data,
        ]);

        $comentario->load('usuario:id,nome,email');
        if ($comentario->data instanceof Carbon) {
            $comentario->data = $comentario->data->toIso8601String();
        }

        return response()->json($comentario, 201);
    }
        public function upleite(Request $request)
    {
        $comentario = Comentario::find($request->idco);

        if (!$comentario) {
            return response()->json(['erro' => 'Comentário não encontrado'], 404);
        }

        $comentario->mensagem = $request->textoAt;
        $comentario->save();

        return response()->json(['mensagem' => 'Comentário atualizado com sucesso']);
    }

    public function delete(Request $request)
    {
        $comentario = Comentario::find($request->idco);

        if (!$comentario) {
            return response()->json(['erro' => 'Comentário não encontrado'], 404);
        }

        $comentario->status = 'inativo';
        $comentario->save();

        return response()->json(['mensagem' => 'Comentário deletado com sucesso']);
    }
}
