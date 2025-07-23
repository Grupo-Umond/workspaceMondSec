<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    /**
     * Criar usuário.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomeUsuario'   => 'required|string|max:255',
            'generoUsuario' => 'required|string|max:50',
            'emailUsuario'  => 'required|email|unique:tbUsuario,emailUsuario',
            'senhaUsuario'  => 'required|string|min:6',
        ]);

        $usuario = Usuario::create([
            'nomeUsuario'         => $validated['nomeUsuario'],
            'generoUsuario'       => $validated['generoUsuario'],
            'emailUsuario'        => $validated['emailUsuario'],
            'senhaUsuario'        => Hash::make($validated['senhaUsuario']),
            'dataCadastroUsuario' => now(),
        ]);

        return response()->json($usuario, 201);
    }

    //Aqui é pra listar usuario
    public function index()
    {
        return response()->json(Usuario::all());
    }

    //Aqui é pra buscar os usuario por id papai
    public function show($id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['mensagem' => 'Usuário não encontrado (idUsuario)'], 404);
        }

        return response()->json($usuario);
    }

    //Aqui é buscar usuario por email
    public function buscarPorEmail($email)
    {
        if (!$email) {
            return response()->json(['error' => 'Parâmetro email é obrigatório'], 400);
        }

        $usuario = Usuario::where('emailUsuario', $email)->first();

        if (!$usuario) {
            return response()->json(['error' => 'Usuário não encontrado (emailUsuario)'], 404);
        }

        return response()->json($usuario);
    }

    //Aqui é pra atualizar usuario
    public function update(Request $request, $id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['mensagem' => 'Usuário não encontrado para atualização'], 404);
        }

        $validated = $request->validate([
            'nomeUsuario'   => 'sometimes|string|max:255',
            'generoUsuario' => 'sometimes|string|max:50',
            'emailUsuario'  => 'sometimes|email|unique:tbUsuario,emailUsuario,' . $usuario->idUsuario . ',idUsuario',
            'senhaUsuario'  => 'sometimes|string|min:6',
        ]);

        
        if (isset($validated['senhaUsuario'])) {
            $validated['senhaUsuario'] = Hash::make($validated['senhaUsuario']);
        }

        $usuario->fill($validated)->save();

        return response()->json($usuario);
    }

    //Aqui é pra deletar os usuario safado
    public function delete($id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['mensagem' => 'Usuário não encontrado.'], 404);
        }

        $usuario->delete();

        return response()->json(['mensagem' => "Usuário ({$usuario->nomeUsuario}) deletado com sucesso."], 200);
    }

    
    public function cadastrarViaGoogle(Request $request)
{
    $request->validate([
        'nomeUsuario' => 'required|string',
        'emailUsuario' => 'required|email',
        'avatar' => 'nullable|string',
    ]);

    
    $usuario = Usuario::firstOrCreate(
        ['emailUsuario' => $request->emailUsuario],
        [
            'nomeUsuario' => $request->nomeUsuario,
            'generoUsuario' => 'Não informado',
            'senhaUsuario' => bcrypt(str()->random(16)), 
            'avatar' => $request->avatar,
            'authGoogle' => true,
        ]
    );

    return response()->json($usuario, 201);
}

}

    