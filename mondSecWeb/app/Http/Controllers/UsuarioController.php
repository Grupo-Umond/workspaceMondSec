<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;

class UsuarioController extends Controller
{
    
    public function informationProfile(Request $request)
    {
        return response()->json([
            'usuario' => $request->user()
        ]);
    }

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
            'dataCadastro' => now(),
        ]);

        $token = $usuario->createToken('userToken')->accessToken;

        
        return response()->json([
            'tokenUser' => $token,
            'tokenTipo' => 'Bearer',
            'expiraEm' => 3600,
        ]);
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

        if (!$usuario || !Hash::check($request->senha, $usuario->senha)) {
            return response()->json(['error' => 'Credenciais inválidas'], 401);
        }
    }

    public function updateUsuario(Request $request) {
        $request->validate([
            'nome' => 'max:100',
            'email'  => 'email|unique:tbUsuario,emailUsuario',
            'telefone' => 'unique:tbUsuario,telefoneUsuario',
        ]);
        
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

        return response()->json(['message' => 'Dados atualizados com sucesso']);
    }

    public function updateSenha(Request $request)
    {
        $request->validate([
            'tokenTemp' => 'required',
            'novaSenhaConfirma' => 'nullable|min:6',
        ]);

        $email = Cache::get("token_{$request->tokenTemp}");
        if (!$email) {
            return response()->json(['message' => 'Token inválido ou expirado'], 400);
        }

        $usuario = Usuario::where('email', $email)->firstOrFail();

        if ($request->novaSenhaConfirma) {
            $usuario->senha = bcrypt($request->novaSenhaConfirma);
        }

        $user->save();
        Cache::forget("token_{$request->tokenTemp}");

        return response()->json(['message' => 'Dados atualizados com sucesso']);
    }

    
    public function delete(Request $request)
    {
        $senha = $request->header('senha');
        if(!$senha) {
            return response()->json(['message' => 'Senha não recebida']);
        }

        

        $usuario = $request->user();

        if (!$usuario ) {
            return response()->json(['mensagem' => 'Usuário não encontrado.'], 404);
        }

        if(!Hash::check($senha, $usuario->senha)) {
            return response()->json(['mensagem' => 'Senha Incorreta'], 401);
        }

        $usuario->delete();

        return response()->json(['mensagem' => "Usuário ({$usuario->nome}) deletado com sucesso."], 200);
    }


}

    