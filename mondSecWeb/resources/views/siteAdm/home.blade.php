<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8" />
    <title>Painel de Redirecionamento</title>

    <link rel="stylesheet" href="{{ asset('css/10dashboardADM.css') }}">

    <link rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />

    <!-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" /> -->
</head>
<body>
    <header>
        <nav>
            <a href=""> <i class="fa-solid fa-house"></i> DashBoard</a>
            <a href=""> <i class="fa-solid fa-chart-simple"></i> Avaliações</a>
            <a href=""> <i class="fa-solid fa-comments"></i> Chat</a>
            <a href=""> <i class="fa-solid fa-magnifying-glass"></i> Status</a>
            <a href=""> <i class="fa-solid fa-magnifying-glass"></i> Views</a>
            <a href=""> <i class="fa-solid fa-magnifying-glass"></i> Transações</a>
            <a href="{{ route('adm.showadm') }}" class="btn btn-primary btn-lg flex-fill">Adiministradores</a>
            <a href="{{ route('adm.showuser') }}" class="btn btn-secondary btn-lg flex-fill">Usuários</a>
            <a href=""> <i class="fa-solid fa-gear"></i> Configurações</a>
        </nav>
    </header>
    <!-- <div class="container py-5">
        <h1>Painel Administrativo</h1>
        <h1 class="mb-4">Escolha para onde deseja ir:</h1>

        <div class="d-flex gap-3">
            <a href="{{ route('adm.showadm') }}" class="btn btn-primary btn-lg flex-fill">Ver Adms Cadastrados</a>
            <a href="{{ route('adm.showuser') }}" class="btn btn-secondary btn-lg flex-fill">Ver Usuários Cadastrados</a>
        </div>
    </div> -->
</body>
</html>
