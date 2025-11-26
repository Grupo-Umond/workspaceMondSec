<link rel="stylesheet" href="{{ asset('css/13dashboard.css') }}">


<body class="bg-light">

    <header>
        <nav>
            <div class="itens_nav">

                <div class="itens_nav_logo">
                    <img src="{{ asset('Imagens/Logos/mondseclogoBranca.png') }}" class="logo" alt="Logo">
                </div>

                <div class="itens_nav_btns">]
                    <a href="{{ route('adm.dashboard.index') }}" class="btn btn-primary btn-lg flex-fill btn-nav 
                        {{ request()->routeIs('adm.dashboard.*') ? 'active' : '' }}">
                        <i class="fa-solid fa-house"></i> DashBoard
                    </a>

                    <a href="{{ route('adm.ocorrencia.index') }}" class="btn btn-primary btn-lg flex-fill btn-nav 
                            {{ request()->routeIs('adm.ocorrencia.*')
                            || request()->routeIs('adm.chart.ocorrencia')
                            || request()->routeIs('adm.ocorrencia.selecionada')
                            || request()->routeIs('adm.ocorrencia.denuncia')
                            ? 'active' : '' }}">
                        <i class="fa-solid fa-circle-exclamation"></i> Ocorrencias
                    </a>

                   @if(Auth::check() && Auth::user()->nivelAdmin === 'Ouro')
                        <a href="{{ route('adm.admins.index') }}" class="btn btn-primary btn-lg flex-fill btn-nav 
                                {{ request()->routeIs('adm.admins.*')
                                || request()->routeIs('adm.chart.admin')
                                ? 'active' : '' }}">
                            <i class="fa-solid fa-user-tie"></i> Administradores
                        </a>
                    @endif


                    <a href="{{ route('adm.users.index') }}" class="btn btn-secondary btn-lg flex-fill btn-nav 
                            {{ request()->routeIs('adm.users.*')
                            || request()->routeIs('adm.chart.usuario')
                            ? 'active' : '' }}">
                        <i class="fa-solid fa-user"></i> Usuários
                    </a>


                    <a href="{{ route('adm.comentario.index') }}" class="btn btn-secondary btn-lg flex-fill btn-nav 
                            {{ request()->routeIs('adm.comentario.*')
                            || request()->routeIs('adm.comentario.denuncia')
                            || request()->routeIs('adm.comentario.selecionado')
                            ? 'active' : '' }}">
                        <i class="fa-solid fa-comment"></i> Comentários
                    </a>



                </div>

            </div>
            <div class="itens_nav_sair">

                <a href="{{ route('adm.auth.login') }}" class="btn btn-secondary btn-lg flex-fill btn-sair"> <i
                        class="fa-solid fa-right-from-bracket"></i> Sair </a>
            </div>
        </nav>
    </header>
</div>
</div>