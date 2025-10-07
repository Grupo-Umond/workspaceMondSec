{{-- resources/views/home.blade.php --}}
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Umond</title>

    {{-- CSS --}}
    <link rel="stylesheet" href="{{ asset('css/00style.css') }}">
    <link rel="stylesheet" href="{{ asset('css/01navBar.css') }}">
    <link rel="stylesheet" href="{{ asset('css/02inicio.css') }}">
    <link rel="stylesheet" href="{{ asset('css/03quemSomos.css') }}">
    <link rel="stylesheet" href="{{ asset('css/04nossaEquipe.css') }}">
    <link rel="stylesheet" href="{{ asset('css/05nossosProjetos.css') }}">
    <link rel="stylesheet" href="{{ asset('css/06nossosParceiros.css') }}">
    <link rel="stylesheet" href="{{ asset('css/07faleConosco.css') }}">
    <link rel="stylesheet" href="{{ asset('css/08footer.css') }}">

    {{-- Font Awesome --}}
    <link rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>

{{-- HEADER --}}
<header class="cabecalho" data-aos="fade">
  <nav class="cabecalho__menu">
    <div class="cabecalho__menu__logo">
      <a href="#apresentacao1">
        <img src="{{ asset('Imagens/Logos/umondlogobranco.png') }}" class="logo" alt="Logo">
      </a>
    </div>

    <!-- Links desktop -->
    <div class="cabecalho__menu__itens">
      <a href="#apresentacao1">Início</a>
      <a href="#apresentacao2">Quem Somos</a>
      <a href="#apresentacao3">Nossa Equipe</a>
      <a href="#apresentacao4">Nossos Projetos</a>
      <a href="#apresentacao5">Parceiros</a>
      <a href="#apresentacao6">Fale Conosco</a>
    </div>

    <!-- Botão hamburguer / fechar -->
    <div class="icons__menu" id="botaoMenu">
      <i class="fa-solid fa-bars" id="iconAbrir"></i>
      <i class="fa-solid fa-xmark" id="iconFechar"></i>
    </div>

    <!-- Menu mobile -->
    <div class="cabecalho__menu__itens__mobile" id="menuMobile">
      <a href="#apresentacao1">Início</a>
      <a href="#apresentacao2">Quem Somos</a>
      <a href="#apresentacao3">Nossa Equipe</a>
      <a href="#apresentacao4">Nossos Projetos</a>
      <a href="#apresentacao5">Parceiros</a>
      <a href="#apresentacao6">Fale Conosco</a>
    </div>
  </nav>
</header>


{{-- INÍCIO --}}
<section class="inicio" id="apresentacao1">
    <video controls autoplay muted loop>
        <source src="{{ asset('Videos/video3.mp4') }}" type="video/mp4">
    </video>
    <div class="inicio_texto">
        <h1 class="titulo"> Umond conectando você com o mundo!</h1>
    </div>
    <div class="botao">
        <a href="#apresentacao2">
            <button><i class="fa-solid fa-arrow-down"></i></button>
        </a>
    </div>
</section>

{{-- QUEM SOMOS --}}
<section id="apresentacao2" class="quemSomos">
    <div class="inicio_texto">
        <h2 class="titulo"> Quem <span class="span">Somos </span> </h2>
    </div>
    <div class="quemSomos_conteudo">
        <div class="quemSomos_identificacao">
            <img src="{{ asset('Imagens/Logos/etec.jpg') }}" alt="">
        </div>
        <div class="cards_quemSomos">
            <div class="card">
                <i class="fa-solid fa-graduation-cap"></i>
                <h3>Alunos</h3>
                <p>Somos alunos da ETEC de Guaianazes que criamos essa empresa para colocar nossas ideias em prática.</p>
            </div>
            <div class="card">
                <i class="fa-solid fa-lock"></i>
                <h3>Segurança</h3>
                <p>Oferecemos soluções digitais confiáveis para proteger seus dados e usuários.</p>
            </div>
            <div class="card">
                <i class="fa-solid fa-users"></i>
                <h3>Tecnologia</h3>
                <p>Sites modernos e sistemas inteligentes com alto desempenho</p>
            </div>
            <div class="card">
                <i class="fa-solid fa-person-running"></i>
                <h3>Acessibilidade</h3>
                <p>Plataformas inclusivas, pensadas para todos os públicos.</p>
            </div>
            <div class="card">
                <i class="fa-brands fa-uncharted"></i>
                <h3>Softwares</h3>
                <p>Aplicações personalizadas, práticas e de fácil utilização.</p>
            </div>
            <div class="card">
                <i class="fa-solid fa-star"></i>
                <h3>Qualidade</h3>
                <p>Projetos robustos, ágeis e feitos para gerar resultados.</p>
            </div>
        </div>
</section>

@include('siteEmpresa.partials.equipe')

@include('siteEmpresa.partials.projetos')

@include('siteEmpresa.partials.parceiros')

@include('siteEmpresa.partials.faleConosco')

@include('siteEmpresa.partials.footer')

<script>
  const botaoMenu = document.getElementById("botaoMenu");
  const menuMobile = document.getElementById("menuMobile");
  const iconAbrir = document.getElementById("iconAbrir");
  const iconFechar = document.getElementById("iconFechar");
  const cabecalho = document.querySelector(".cabecalho");
const secaoInicio = document.getElementById("apresentacao1"); // sua seção inicial

  botaoMenu.addEventListener("click", () => {
    const isOpen = menuMobile.classList.toggle("abrir");

    if (isOpen) {
      iconAbrir.style.display = "none";
      iconFechar.style.display = "inline-block";
    } else {
      iconAbrir.style.display = "inline-block";
      iconFechar.style.display = "none";
    }
  });

  // Fecha o menu quando clica em algum link
  document.querySelectorAll("#menuMobile a").forEach(link => {
    link.addEventListener("click", () => {
      menuMobile.classList.remove("abrir");
      iconAbrir.style.display = "inline-block";
      iconFechar.style.display = "none";
    });

    window.addEventListener("scroll", () => {
    const alturaSecao = secaoInicio.offsetHeight;
    
    if (window.scrollY >= alturaSecao) {
        cabecalho.classList.add("scrolled");
    } else {
        cabecalho.classList.remove("scrolled");
    }
    });
  });
</script>


</body>
</html>
