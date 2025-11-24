<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Umond</title>

    <!-- Links_CSS -->
    <link rel="stylesheet" href="{{ asset('css/00style.css') }}">
    <link rel="stylesheet" href="{{ asset('css/01navBar.css') }}">
    <link rel="stylesheet" href="{{ asset('css/02inicio.css') }}">
    <link rel="stylesheet" href="{{ asset('css/03quemSomos.css') }}">
    <link rel="stylesheet" href="{{ asset('css/04nossaEquipe.css') }}">
    <link rel="stylesheet" href="{{ asset('css/05nossosProjetos.css') }}">
    <link rel="stylesheet" href="{{ asset('css/06nossosParceiros.css') }}">
    <link rel="stylesheet" href="{{ asset('css/07faleConosco.css') }}">
    <link rel="stylesheet" href="{{ asset('css/08footer.css') }}">

    <!-- Link_FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>

<body>

    <!-- Navbar -->
    <header class="cabecalho" data-aos="fade">
        <nav class="cabecalho__menu">
            <div class="cabecalho__menu__logo">
                <a href="#apresentacao1">
                    <img src="{{ asset('Imagens/Logos/umondlogobranco.png') }}" class="logo" alt="Logo">
                </a>
            </div>

            <!-- Navbar_Principal -->
            <div class="cabecalho__menu__itens">
                <a href="#apresentacao1" class="active">Início</a>
                <a href="#apresentacao2">Quem Somos</a>
                <a href="#apresentacao3">Nossa Equipe</a>
                <a href="#apresentacao4">Nossos Projetos</a>
                <a href="#apresentacao5">Parceiros</a>
                <a href="#apresentacao6">Fale Conosco</a>
            </div><!-- Fim_Navbar_Principal -->

            <!-- Menu_Hamburguer -->
            <div class="icons__menu" id="botaoMenu">
                <div class="botao_menu1"></div>
                <div class="botao_menu2"></div>
                <div class="botao_menu3"></div>
            </div><!-- Fim_Menu_Hamburguer -->

            <!-- Navbar_Mobile -->
            <div class="cabecalho__menu__itens__mobile" id="menuMobile">
                <a href="#apresentacao1">Início</a>
                <a href="#apresentacao2">Quem Somos</a>
                <a href="#apresentacao3">Nossa Equipe</a>
                <a href="#apresentacao4">Nossos Projetos</a>
                <a href="#apresentacao5">Parceiros</a>
                <a href="#apresentacao6">Fale Conosco</a>
            </div><!-- Fim_Navbar_Mobile -->
        </nav>
    </header><!-- Fim_Navbar -->

    <!-- Inicio -->
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
    </section><!-- Fim_Inicio -->

    <!-- Quem_Somos -->
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
                    <p>Somos alunos da ETEC de Guaianazes que criamos essa empresa para colocar nossas ideias em
                        prática.</p>
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
    </section><!-- Fim_Quem_Somos -->

    <!-- Nossa_Equipe -->
    @include('siteEmpresa.partials.equipe')

    <!-- Nossos_Projetos -->
    @include('siteEmpresa.partials.projetos')

    <!-- Nossos_Parceiros -->
    @include('siteEmpresa.partials.parceiros')

    <!-- Fale_Conosco -->
    @include('siteEmpresa.partials.faleConosco')

    <!-- Footer -->
    @include('siteEmpresa.partials.footer')

    <script>
        const body = document.querySelector('body')
        const botaoMenu = document.querySelector('#botaoMenu');
        const linha1 = document.querySelector('.botao_menu1')
        const linha2 = document.querySelector('.botao_menu2')
        const linha3 = document.querySelector('.botao_menu3')
        const menuMobile = document.querySelector('#menuMobile');
        const iconAbrir = document.getElementById("iconAbrir");
        const iconFechar = document.getElementById("iconFechar");
        const cabecalho = document.querySelector(".cabecalho");
        const secaoInicio = document.getElementById("apresentacao1");

        // Animacao_Menu_Hamburguer
        botaoMenu.addEventListener("click", () => {
            linha1.classList.toggle('ativo1')
            linha2.classList.toggle('ativo2')
            linha3.classList.toggle('ativo3')
            menuMobile.classList.toggle('abrir')
            body.classList.toggle('no-overflow')
        })

        document.querySelectorAll("#menuMobile a").forEach(link => {
            link.addEventListener("click", () => {
                menuMobile.classList.remove("abrir");
                body.classList.remove("no-overflow");
                linha1.classList.remove("ativo1");
                linha2.classList.remove("ativo2");
                linha3.classList.remove("ativo3");
            });
        });// FIm_Animacao_Menu_Hamburguer
        document.querySelectorAll("#menuMobile a").forEach(link => {
            link.addEventListener("click", () => {
                menuMobile.classList.remove("abrir");
                iconAbrir.style.display = "inline-block";
                iconFechar.style.display = "none";
            });
        });
            // Animacao_Scroll
            window.addEventListener("scroll", () => {
                const alturaSecao = secaoInicio.offsetHeight;


                if (window.scrollY >= alturaSecao - 10) {
                    cabecalho.classList.add("scrolled");
                } else {
                    cabecalho.classList.remove("scrolled");
                }
            });// Fim_Animacao_Scroll

            // Setas_Carousel
            document.getElementById('next').onclick = function () {
                let lists = document.querySelectorAll('.item');
                document.getElementById('slide').appendChild(lists[0]);
            }
            document.getElementById('prev').onclick = function () {
                let lists = document.querySelectorAll('.item');
                document.getElementById('slide').prepend(lists[lists.length - 1]);
            }// Fim_Setas_Carousel


            // Primeiro_Carousel
            const wrapper = document.querySelector(".wrapper");
            const carousel = document.querySelector(".carousel");
            const arrowBtns = document.querySelectorAll(".wrapper i");
            const firstCardWidth = carousel.querySelector(".card").offsetWidth;
            const carouselChildrens = [...carousel.children];
            let isDragging = false, startX, startScrollLeft, timeoutId;

            let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

            carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
                carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
            });

            carouselChildrens.slice(0, cardPerView).forEach(card => {
                carousel.insertAdjacentHTML("beforeend", card.outerHTML);
            });

            arrowBtns.forEach(btn => {
                btn.addEventListener("click", () => {
                    carousel.scrollLeft += btn.id === "left" ? - firstCardWidth : firstCardWidth;
                });
            });

            const dragStart = (e) => {
                isDragging = true;
                carousel.classList.add("dragging");
                startX = e.pageX;
                startScrollLeft = carousel.scrollLeft;
            }

            const dragging = (e) => {
                if (!isDragging) return;
                carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
            }

            dragStop = () => {
                isDragging = false;
                carousel.classList.remove("dragging");
            }

            const autoPlay = () => {
                if (window.innerWidth < 800) return;
                timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 3000);
            }

            autoPlay();

            const infiniteScroll = () => {
                if (carousel.scrollLeft === 0) {
                    carousel.classList.add("no-transition");
                    carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
                    carousel.classList.remove("no-transition");
                } else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
                    carousel.classList.add("no-transition");
                    carousel.scrollLeft = carousel.offsetWidth;
                    carousel.classList.remove("no-transition");
                }

                clearTimeout(timeoutId);
                if (!wrapper.matches(":hover")) autoPlay();
            }

            carousel.addEventListener("mousedown", dragStart);
            carousel.addEventListener("mousemove", dragging);
            document.addEventListener("mouseup", dragStop);
            carousel.addEventListener("scroll", infiniteScroll);
            wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
            wrapper.addEventListener("mouseleave", autoPlay);// Fim_Eventos_Carousel

            let sections = document.querySelectorAll("section");
            let navLinks = document.querySelectorAll(".cabecalho__menu__itens a");

            window.addEventListener("scroll", () => {
                let top = window.scrollY + 150;

                sections.forEach(sec => {
                    let offset = sec.offsetTop;
                    let height = sec.offsetHeight;
                    let id = sec.id;

                    if (top >= offset && top < offset + height) {

                        navLinks.forEach(link => link.classList.remove("active"));

                        let activeLink = document.querySelector(`.cabecalho__menu__itens a[href*="${id}"]`);

                        if (activeLink) {
                            activeLink.classList.add("active");
                        }
                    }
                });
            });
    </script>
>>>>>>> pedro
</body>

</html>