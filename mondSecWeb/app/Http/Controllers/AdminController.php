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

    public function homeScreen() {
        return view('siteAdm.home');
    }

    public function cadastroScreen()
    {
        return view('siteAdm.cadastro');
    }

    public function vizualisarAdmsScreen()
    {
       
        $admins = Admin::all();
        return view('siteAdm.vizuAdms', compact('admins'));

    }

    public function vizualisarUsersScreen()
    {
        return view('siteAdm.vizuUsers');
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
            return redirect()->route('adm.home');
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
    
    public function alterarAdmScreen($id) {
        $admin = Admin::findOrFail($id);
        return view('siteAdm.alterarAdm', compact('admin'));
    }

    public function updateAdm(Request $request, $id) {
        $dados = $request->validate([
            'nome' => 'required|max:225|string',
            'email' => 'required|max:225|string|unique:tbAdmin,email,' . $id . ',id',
            'nivelAdmin' => 'required|string',
        ]);

        $admin = Admin::findOrFail($id);

        $admin->update($dados);

        return redirect()->route('adm.vizuAdms')->with('success','Adm alterado com sucesso');
    }

}

