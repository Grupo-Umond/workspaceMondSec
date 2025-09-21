<body class="bg-light">
    <header>
        <nav>
            <a href="{{ route('adm.dashboard.index') }}"> <i class="fa-solid fa-house"></i> DashBoard</a>
            <a href=""> <i class="fa-solid fa-chart-simple"></i> Avaliações</a>
            <a href=""> <i class="fa-solid fa-comments"></i> Chat</a>
            <a href=""> <i class="fa-solid fa-magnifying-glass"></i> Status</a>
            <a href=""> <i class="fa-solid fa-magnifying-glass"></i> Views</a>
            <a href=""> <i class="fa-solid fa-magnifying-glass"></i> Transações</a>
            <a href="{{ route('adm.admins.index') }}" class="btn btn-primary btn-lg flex-fill">Adiministradores</a>
            <a href="{{ route('adm.users.index') }}" class="btn btn-secondary btn-lg flex-fill">Usuários</a>
            <a href=""> <i class="fa-solid fa-gear"></i> Configurações</a>
        </nav>
    </header>
</body>