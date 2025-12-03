<section class="faleConosco" id="apresentacao6">
    <div class="inicio_texto">
        <h2 class="titulo">Fale <span>Conosco</span></h2>
    </div>
    <div class="conteudo_faleConosco">
        <div class="cards_faleConosco">
            <div class="card">
                <div class="icon-container">
                    <i class="fa-solid fa-location-dot"></i>
                </div>
                <h3>Endereço</h3>
                <p>R. Feliciano de Mendonça, 290</p>
            </div>
            <div class="card">
                <div class="icon-container">
                    <i class="fa-solid fa-phone"></i>
                </div>
                <h3>Telefone</h3>
                <p>+55 (11) 91609-7470</p>
            </div>
            <div class="card">
                <div class="icon-container">
                    <i class="fa-solid fa-envelope"></i>
                </div>
                <h3>E-mail</h3>
                <p>contato@umond.com.br</p>
            </div>
            <div class="card">
                <div class="icon-container">
                    <i class="fa-brands fa-whatsapp"></i>
                </div>
                <h3>WhatsApp</h3>
                <p>(11) 2551-7900</p>
            </div>
        </div>

        <div class="form_faleConosco">
            <form action="{{ route('email.enviar') }}" method="POST">
                @csrf
                <h3>Contato</h3>
                <div class="input-group">
                    <label>Nome</label>
                    <input type="text" name="nome" placeholder="Nome" required>
                </div>
                <div class="input-group">
                    <label>E-mail</label>
                    <input type="email" name="email" placeholder="E-mail" required>
                </div>
                <div class="input-group">
                    <label>Assunto</label>
                    <input type="text" name="assunto" placeholder="Assunto" required>
                </div>
                <div class="input-group">
                    <label>Mensagem</label>
                    <textarea name="mensagem" placeholder="Mensagem" required></textarea>
                </div>
                <input type="submit" value="Enviar" id="enviar">
            </form>
        </div>
    </div>
</section>

<script>
    document.getElementById('contatoForm').addEventListener('submit', function(e) {
        alert('Mensagem enviada!');
    });
</script>

@if(session('success'))
    <script>
        alert('{{ session('success') }}');
    </script>
@endif