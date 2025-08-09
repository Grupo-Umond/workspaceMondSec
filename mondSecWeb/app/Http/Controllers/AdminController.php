<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;

class AdminController extends Controller
{


    public function loginScreen()
    {
        return view('siteAdm.login');
    }

    public function cadastroScreen()
    {
        return view("siteAdm.cadastro");
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'senha' => ['required'],
        ]);

        $admin = Admin::where('email', $credentials['email'])->first();

        if($admin && Hash::check($credentials['senha'], $admin['senha'])) {
            Auth::guard('admin')->login($admin);
            $request->session()->regenerate();
            return redirect()->route('siteAdm.index');
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
        return redirect()->route('siteAdm.login');
    }

    public function store(Request $request) {

        $dados = $request->validate([
            'nome' => 'required|max:225|string',
            'email' => 'required|max:225|string',
            'senha' => 'required|max:225|min:8|string',
            'nivelAdmin' => 'required|string',
        ]);


        $usuario = Admin::create([
            'nome' => $dados['nome'],
            'email' => $dados['email'],
            'senha' => Hash::make($dados['senha']),
            'nivelAdmin' => $dados['nivelAdmin'],
        ]);

        return redirect()->route('adm.cadastro')->with('success', 'Adm cadastrado com sucesso!');
    }
    


}

