<link rel="stylesheet" href="{{ asset('css/13dashboard.css') }}">

<div class="bg-light">
    <header>
        <nav>
            <div class="itens_nav">

                <div class="itens_nav_logo">
                    <img src="{{ asset('Imagens/Logos/mondseclogoBranca.png') }}" class="logo" alt="Logo">
                </div>

                <div class="itens_nav_btns">
                    <a href="{{ route('adm.dashboard.index') }}"
                        class="btn btn-primary btn-lg flex-fill btn-nav {{ request()->routeIs('adm.dashboard.index') ? 'active' : '' }}">
                        <i class="fa-solid fa-house"></i> DashBoard
                    </a>

                    <a href="{{ route('adm.ocorrencia.index') }}"
                        class="btn btn-primary btn-lg flex-fill btn-nav {{ request()->routeIs('adm.chart.ocorrencia') ? 'active' : '' }}">
                        <i class="fa-solid fa-circle-exclamation"></i> Ocorrencias
                    </a>

                    <a href="{{ route('adm.admins.index') }}"
                        class="btn btn-primary btn-lg flex-fill btn-nav {{ request()->routeIs('adm.chart.admin') ? 'active' : '' }}">
                        <i class="fa-solid fa-user-tie"></i> Administradores
                    </a>

                    <a href="{{ route('adm.users.index') }}"
                        class="btn btn-secondary btn-lg flex-fill btn-nav {{ request()->routeIs('adm.chart.usuario') ? 'active' : '' }}">
                        <i class="fa-solid fa-user"></i> Usuários
                    </a>

                    <a href="{{ route('adm.comentario.index') }}"
                        class="btn btn-secondary btn-lg flex-fill btn-nav {{ request()->routeIs('adm.comentario.index') ? 'active' : '' }}">
                        <i class="fa-solid fa-user"></i> Comentarios
                    </a>
                </div>

            </div>
            <div class="itens_nav_sair">
                <a href="{{ route('adm.auth.login') }}" class="btn btn-secondary btn-lg flex-fill btn-sair"> <i
                        class="fa-solid fa-right-from-bracket"></i> Sair </a>
            </div>
        </nav>
    </header>

    <script>
        const menuItem = document.querySelectorAll('.btn-nav');

        const savedActive = localStorage.getItem("activeLink");
        if (savedActive) {
            const activeLink = document.querySelector(`.btn-nav[href="${savedActive}"]`);
            if (activeLink) activeLink.classList.add('active');
        }

        function selectLink() {
            menuItem.forEach(item => item.classList.remove('active'));
            this.classList.add('active');

            localStorage.setItem("activeLink", this.getAttribute("href"));
        }

        menuItem.forEach(item => item.addEventListener('click', selectLink));
    </script>

</div>
    </div>
