<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use App\Models\Usuario;

class AdminController extends Controller
{


    public function loginScreen()
    {
        return view('siteAdm.login');
    }

    public function homeScreen() {
        return view('siteAdm.home');
    }

    public function storeScreen()
    {
        return view('siteAdm.cadastro');
    }

    public function showAdmScreen()
    {
       
        $admins = Admin::all();
        return view('siteAdm.verAdm.index', compact('admins'));

    }

    public function showUserScreen()
    {
        $usuario = Usuario::all();
        return view('siteAdm.verUser.index', compact('usuario'));
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

            return redirect()->route('adm.dashboard');
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
            'telefone' => 'required|max:225|string',
            'senha' => 'required|max:225|min:8|string',
            'nivelAdmin' => 'required|string',
        ]);


        $usuario = Admin::create([
            'nome' => $dados['nome'],
            'email' => $dados['email'],
            'telefone' => $dados['telefone'],
            'senha' => Hash::make($dados['senha']),
            'nivelAdmin' => $dados['nivelAdmin'],
        ]);

        return redirect()->route('adm.store')->with('success', 'Adm cadastrado com sucesso!');
    }
    
    public function updateAdmScreen($id) {
        $admin = Admin::findOrFail($id);
        return view('siteAdm.verAdm.update', compact('admin'));
    }

    public function updateAdm(Request $request, $id) {
        $dados = $request->validate([
            'nome' => 'nullable|max:225|string',
            'email' => 'nullable|max:225|string',
            'telefone' => 'nullable|max:255|string',
            'nivelAdmin' => 'nullable|string',
        ]);

        $admin = Admin::findOrFail($id);
        if($request->nome) {
            $admin->nome = $request->nome;
        }

        if($request->email) {
            $admin->email = $request->email;
        }
        
        if($request->telefone) {
            $telefone = preg_replace('/\D/', '', $request->telefone);

            if (!str_starts_with($telefone, '55')) {
                $telefone = '55' . $telefone;
            }

            $telefone = '+' . $telefone;

            $admin->telefone = $telefone;
        }

        $admin->save();

        return redirect()->route('adm.showadm')->with('success','Adm alterado com sucesso');
    }

    public function updateUserScreen($id) {
        $usuario = Usuario::findOrFail($id);
        return view('siteAdm.verUser.update', compact('usuario'));
    }

    public function updateUser(Request $request, $id) {
        $dados = $request->validate([
            'nome' => 'nullable|max:225|string',
            'email' => 'nullable|max:225|string',
            'telefone' => 'nullable|string',
            'genero' => 'nullable',
        ]);

        $usuario = Usuario::findOrFail($id);
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

        return redirect()->route('adm.showuser')->with('success','Usuario alterado com sucesso');
    }

    public function deleteAdm($id) {
        $admin = Admin::find($id);
        if(!$admin) {
            return redirect()->back()->with('Error','O adm não encontrado');
        }
        $admin->delete();

        return redirect()->route('adm.showadm')->with('success','Adm deletado com sucesso');
    }

    public function deleteUser($id) {
        $usuario = Usuario::find($id);
        if(!$usuario) {
            return redirect()->back()->with('Error','O usuario não encontrado');
        }
        $usuario->delete();

        return redirect()->route('adm.showuser')->with('success','Usuario deletado com sucesso');
    }

}

