<link rel="stylesheet" href="{{ asset('css/13dashboard.css') }}">

<body class="bg-light">
    <header>
        <nav>
            <div class="itens_nav">

                <div class="itens_nav_logo">
                    <img src="{{ asset('Imagens/Logos/mondseclogoBranca.png') }}" class="logo" alt="Logo">
                </div>

                <div class="itens_nav_btns">
                    <a href="{{ route('adm.dashboard.index') }}" class="btn btn-primary btn-lg flex-fill active"> <i class="fa-solid fa-house"></i> DashBoard </a>
                    <a href="{{ route('adm.ocorrencia.index') }}" class="btn btn-primary btn-lg flex-fill"> <i class="fa-solid fa-circle-exclamation"></i> Ocorrencias </a>
                    <a href="{{ route('adm.admins.index') }}" class="btn btn-primary btn-lg flex-fill"> <i class="fa-solid fa-user-tie"></i> Adiministradores </a>
                    <a href="{{ route('adm.users.index') }}" class="btn btn-secondary btn-lg flex-fill"> <i class="fa-solid fa-user"></i> Usuários </a>
                </div>

            </div>
            <div class="itens_nav_sair">
                <a href="{{ route('adm.auth.login') }}" class="btn btn-secondary btn-lg flex-fill btn-sair"> <i class="fa-solid fa-right-from-bracket"></i> Sair </a>
            </div>
        </nav>
    </header>
</body>