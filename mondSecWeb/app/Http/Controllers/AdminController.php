<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use App\Models\Ocorrencia;
use App\Models\Usuario;

class AdminController extends Controller
{
    // =======================
    //  AUTH
    // =======================

    public function loginScreen()
    {
        return view('adm.auth.login');
    }

    public function storeScreen()
    {
        return view('adm.auth.cadastro');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'senha' => ['required'],
        ]);

        $admin = Admin::where('email', $credentials['email'])->first();

        if ($admin && Hash::check($credentials['senha'], $admin['senha'])) {
            Auth::guard('admin')->login($admin);
            $request->session()->regenerate();

            return redirect()->route('adm.dashboard.index');
        }

        return back()->withErrors([
            'email' => 'As credenciais fornecidas não são válidas.',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('adm.auth.login');
    }

    public function store(Request $request)
    {
        $dados = $request->validate([
            'nome' => 'required|max:225|string',
            'email' => 'required|max:225|string',
            'telefone' => 'required|max:225|string',
            'senha' => 'required|max:225|min:8|string',
            'nivelAdmin' => 'required|string',
        ]);

        Admin::create([
            'nome' => $dados['nome'],
            'email' => $dados['email'],
            'telefone' => $dados['telefone'],
            'senha' => Hash::make($dados['senha']),
            'nivelAdmin' => $dados['nivelAdmin'],
        ]);

        return redirect()->route('adm.auth.register')->with('success', 'Adm cadastrado com sucesso!');
    }

    // =======================
    //  DASHBOARD
    // =======================

    public function homeScreen()
    {
        return view('adm.home');
    }

    // =======================
    //  ADMINS
    // =======================

    public function showAdmScreen()
    {
        
        return redirect()->route('adm.chart.admin');
    }

    public function updateAdmScreen($id)
    {
        $admin = Admin::findOrFail($id);
        return view('adm.verAdm.update', compact('admin'));
    }

    public function updateAdm(Request $request, $id)
    {
        $dados = $request->validate([
            'nome' => 'nullable|max:225|string',
            'email' => 'nullable|max:225|string',
            'telefone' => 'nullable|max:255|string',
            'nivelAdmin' => 'nullable|string',
        ]);

        $admin = Admin::findOrFail($id);

        if ($request->nome) $admin->nome = $request->nome;
        if ($request->email) $admin->email = $request->email;

        if ($request->telefone) {
            $telefone = preg_replace('/\D/', '', $request->telefone);
            if (!str_starts_with($telefone, '55')) $telefone = '55' . $telefone;
            $admin->telefone = '+' . $telefone;
        }

        $admin->save();

        return redirect()->route('adm.admins.index')->with('success', 'Adm alterado com sucesso');
    }

    public function deleteAdm($id)
    {
        $admin = Admin::find($id);
        if (!$admin) {
            return redirect()->back()->with('Error', 'O adm não foi encontrado');
        }
        $admin->delete();

        return redirect()->route('adm.admins.index')->with('success', 'Adm deletado com sucesso');
    }

    // =======================
    //  USERS
    // =======================

    public function showUserScreen()
    {
        return redirect()->route('adm.chart.usuario');
    }

    public function updateUserScreen($id)
    {
        $usuario = Usuario::findOrFail($id);
        return view('adm.verUsuario.update', compact('usuario'));
    }

    public function updateUser(Request $request, $id)
    {
        $dados = $request->validate([
            'nome' => 'nullable|max:225|string',
            'email' => 'nullable|max:225|string',
            'telefone' => 'nullable|string',
            'genero' => 'nullable',
        ]);

        $usuario = Usuario::findOrFail($id);

        if ($request->nome) $usuario->nome = $request->nome;
        if ($request->email) $usuario->email = $request->email;

        if ($request->telefone) {
            $telefone = preg_replace('/\D/', '', $request->telefone);
            if (!str_starts_with($telefone, '55')) $telefone = '55' . $telefone;
            $usuario->telefone = '+' . $telefone;
        }

        if ($request->genero) $usuario->genero = $request->genero;

        $usuario->save();

        return redirect()->route('adm.users.index')->with('success', 'Usuário alterado com sucesso');
    }

    public function deleteUser($id)
    {
        $usuario = Usuario::find($id);
        if (!$usuario) {
            return redirect()->back()->with('Error', 'O usuário não foi encontrado');
        }
        $usuario->delete();

        return redirect()->route('adm.users.index')->with('success', 'Usuário deletado com sucesso');
    }

    // =======================
    //  OCORRENCIAS
    // =======================

    public function showOcorrenciaScreen() {

        return redirect()->route('adm.chart.ocorrencia');
    }

     public function updateOcorrenciaScreen($id)
    {
        $ocorrencia = Ocorrencia::findOrFail($id);
        return view('adm.verOcorrencia.update', compact('ocorrencia'));
    }

    public function updateOcorrencia(Request $request, $id)
    {
        $dados = $request->validate([
            'titulo' => 'nullable|max:225|string',
            'latitude' => 'nullable|max:225|string',
            'longitude' => 'nullable|string',
            'data' => 'nullable',
            'descricao' => 'nullable|string',
            'tipo' => 'nullable|string',
        ]);

        $ocorrencia = Ocorrencia::findOrFail($id);

        if ($request->titulo) $ocorrencia->titulo = $request->titulo;
        if ($request->latitude) $ocorrencia->latitude = $request->latitude;
        if ($request->longitude) $ocorrencia->longitude = $request->longitude;
        if ($request->descricao) $ocorrencia->descricao = $request->descricao;
        if ($request->tipo) $ocorrencia->tipo = $request->tipo;
        if ($request->data) $ocorrencia->data = $request->data;

        $ocorrencia->save();

        return redirect()->route('adm.ocorrencia.index')->with('success', 'Usuário alterado com sucesso');
    }

    public function deleteOcorrencia($id) {
        $ocorrencia = Usuario::find($id);
        if (!$ocorrencia) {
            return redirect()->back()->with('Error', 'O usuário não foi encontrado');
        }
        $ocorrencia->delete();

        return redirect()->route('adm.ocorrencia.index')->with('success', 'Usuário deletado com sucesso');
    }

}
