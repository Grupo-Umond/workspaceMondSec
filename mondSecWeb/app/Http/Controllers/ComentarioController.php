<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comentario;
use Carbon\Carbon;

class ComentarioController extends Controller
{
    // Exibe a página de comentários de uma ocorrência
    public function edit($idOcorrencia)
    {
        $comentarios = Comentario::where('idOcorrencia', $idOcorrencia)
            ->with(['usuario:id,nome,email'])
            ->orderBy('data', 'desc')
            ->get();

        return view('adm.verComentario.update', compact('comentarios', 'idOcorrencia'));
    }

    // Atualiza um comentário
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

    // Deleta (inativa) um comentário
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
