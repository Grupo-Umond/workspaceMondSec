<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8" />
    <title>Painel de Redirecionamento</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
</head>
<body class="bg-light">
    <div class="container py-5">
        <h1>Painel Administrativo</h1>
        <h1 class="mb-4">Escolha para onde deseja ir:</h1>

        <div class="d-flex gap-3">
            <a href="{{ route('adm.showadm') }}" class="btn btn-primary btn-lg flex-fill">Ver Adms Cadastrados</a>
            <a href="{{ route('adm.showuser') }}" class="btn btn-secondary btn-lg flex-fill">Ver Usuários Cadastrados</a>
        </div>
        
    </div>
@include('siteAdm.dashboard')
</body>

</html>
