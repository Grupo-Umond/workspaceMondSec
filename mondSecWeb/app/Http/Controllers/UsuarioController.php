<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;


class UsuarioController extends Controller
{
    



    public function store(Request $request)
    {
        $dados = $request->validate([
            'nome'   => 'required|string|max:255',
            'genero' => 'required|string',
            'email'  => 'required|email|unique:tbUsuario,email',
            'telefone' => 'required|unique:tbUsuario,telefone',
            'senha'  => 'required|string|min:6',
        ]);

        $telefone = preg_replace('/\D/', '', $dados['telefone']);

        if (!str_starts_with($telefone, '55')) {
            $telefone = '55' . $telefone;
        }

        $telefone = '+' . $telefone;

        $usuario = Usuario::create([
            'nome' => $dados['nome'],
            'genero' => $dados['genero'],
            'email' => $dados['email'],
            'telefone' => $telefone,
            'senha' => Hash::make($dados['senha']),
            'status' => 'ativo',
            'data' => now(),
        ]);

        return response()->json(['mensagem' => 'Cadastro realizado com sucesso'], 200);
    }

    public function login(Request $request) 
    {
        $request->validate([
            'login' => 'required',
            'senha' => 'required'
        ]);

        if(filter_var($request->login, FILTER_VALIDATE_EMAIL))
            $campo = 'email';
        else{
            $campo = 'telefone';
        }

        $usuario = Usuario::where($campo, $request->login)->first();
        if(!$usuario){
            return response()->json(['mensagem' => 'Usuario não encontrado, credenciais invalidas'], 404);
        }
            if ($usuario->status === 'Inativo') {
        return response()->json([
            'mensagem' => 'Sua conta está desativada. Entre em contato com o suporte.'
        ], 403); 
    }
        if (!$usuario || !Hash::check($request->senha, $usuario->senha)) {
            return response()->json(['error' => 'Credenciais inválidas'], 401);
        }
        $token = $usuario->createToken('userToken')->accessToken;

        return response()->json([
            'tokenUser' => $token,
            'tokenTipo' => 'Bearer',
            'expiraEm' => 3600,
            'mensagem' => 'Usuario logado com sucesso',
        ]);
    }

    public function updateUsuario(Request $request) {
        
        $usuario = $request->user();

        if($request->nome) {
            $usuario->nome = $request->nome;
        }
        if($request->email) {
            $usuario->email = $request->email;
        }
        if($request->telefone) {
            $telefone = preg_replace('/\D/', '', $request->telefone);

            if (!str_starts_with($telefone, '55')) {
                $telefone = '55' . $telefone;
            }

            $telefone = '+' . $telefone;

            $usuario->telefone = $telefone;
        }

        if($request->genero) {
            $usuario->genero = $request->genero;
        }

        $usuario->save();

        return response()->json(['mensagem' => 'Dados atualizados com sucesso']);
    }

    public function updateSenha(Request $request)
    {
        $request->validate([
            'tokenTemp' => 'required',
            'novaSenhaConfirma' => 'required|min:6',
        ]);

        $login = Cache::get("token_{$request->tokenTemp}");
        
        if (!$login) {
            return response()->json(['mensagem' => 'Token inválido ou expirado'], 400);
        }

        $campo = 'email';

        if(!$request->direcao){
            $campo = 'telefone';
        }

        $usuario = Usuario::where($campo, $login)->firstOrFail();

        if ($request->novaSenhaConfirma) {
            $usuario->senha = Hash::make($request->novaSenhaConfirma);
        }

        $usuario->save();
        Cache::forget("token_{$request->tokenTemp}");

        return response()->json(['message' => 'Dados atualizados com sucesso']);
    }

    
       public function delete(Request $request)
    {
        $senha = $request->senha;

        if (!$senha) {
            return response()->json(['mensagem' => 'Senha não recebida'], 400);
        }

        $usuario = $request->user();

        if (!$usuario) {
            return response()->json(['mensagem' => 'Usuário não encontrado.'], 404);
        }

        if (!Hash::check($senha, $usuario->senha)) {
            return response()->json(['mensagem' => 'Senha incorreta'], 401);
        }
        $usuarioP = Usuario::find($usuario->id);

        if (!$usuarioP) {
            return response()->json(['mensagem' => 'Usuário não encontrado no banco.'], 404);
        }


        $usuarioP->status = 'inativo';
        $usuarioP->save();

        return response()->json([
            'mensagem' => "Usuário ({$usuario->nome}) deletado com sucesso."
        ], 200);
    }

    public function check(Request $request)
    {
        $request->validate([
            'login' => 'required|string',
            'campo' => 'required|string'
        ]);

        $login = $request->login;
        $campo = $request->campo;

        $usuario = Usuario::where($campo, $login)->first();

        if (!$usuario) {
            return response()->json(['mensagem' => 'denied']);
        }

        return response()->json([
            'mensagem' => 'granted',
            'usuario' => $usuario
        ]);
    }



   public function uploadFoto(Request $request) {
    $request->validate([
        'foto' => 'required|image|max:2048'
    ]);

    $file = $request->file('foto');
    $nome = time().'_'.$file->getClientOriginalName();
    
    // Salva no storage
    $caminho = $file->storeAs('public/fotos', $nome);
    
    // Converte caminho para URL acessível
    $urlPublica = Storage::url($caminho);
    
    $usuario = auth()->user();
    $usuario->foto = $urlPublica; // Isso salva como '/storage/fotos/...'
    $usuario->save();

    // Retorna a URL completa
    $urlCompleta = asset(Storage::url($caminho)); // asset() gera URL completa
    
    return response()->json([
        'success' => true,
        'foto' => $urlCompleta // URL completa: http://dominio.com/storage/fotos/...
    ]);
}

    // Adicione este método no UsuarioController.php
public function buscarUsuario(Request $request)
{
    try {
        $usuario = $request->user();
        
        if (!$usuario) {
            return response()->json(['error' => 'Usuário não autenticado'], 401);
        }
        
        // Se tiver foto, converte para URL completa
        $foto = $usuario->foto;
        if ($foto && !str_starts_with($foto, 'http')) {
            $foto = asset($foto); // Converte para URL completa
        }
        
        return response()->json([
            'usuario' => [
                'id' => $usuario->id,
                'nome' => $usuario->nome,
                'email' => $usuario->email,
                'telefone' => $usuario->telefone,
                'genero' => $usuario->genero,
                'foto' => $foto, // URL completa
                'status' => $usuario->status,
                'data' => $usuario->data,
            ]
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Erro ao buscar usuário',
            'message' => $e->getMessage()
        ], 500);
    }
}


}

    