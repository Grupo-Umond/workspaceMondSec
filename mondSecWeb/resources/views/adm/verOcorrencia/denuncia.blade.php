@extends('adm.layouts.admin')

@section('content')

    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
        }

        th {
            background: #333;
            color: white;
        }

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }

        .modal {
            background: white;
            /* background-color: blue; */
            width: 600px;
            max-width: 95%;
            padding: 20px;
            border-radius: 10px;
            animation: fadeIn .3s ease;
            position: relative;
            display: flex;
            flex-direction: column;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .modal-header {
            font-size: 20px;
            font-weight: bold;
        }

        #modalClose {
            font-size: 2rem;
        }

        .close-btn {
            position: absolute;
            top: 10px;
            right: 12px;
            font-size: 20px;
            cursor: pointer;
            font-weight: bold;
            color: #444;
        }

        /* Spinner */
        .spinner {
            width: 32px;
            height: 32px;
            border: 4px solid #ddd;
            border-top-color: #333;
            border-radius: 50%;
            animation: spin 1s infinite linear;
            margin: auto;
        }

        .ocorrenciasAcoesIcones {
            width: 100%;
            display: flex;
            justify-content: center;
            gap: 20px;
        }

        #olhoOcorrencia, #aprovadoOcorrencia, #negadoOcorrencia {
            font-size: 1.3rem;
            cursor: pointer;
        }

        #olhoOcorrencia {
            color: blue;
        }

        #aprovadoOcorrencia {
            color: green;
        }

        #negadoOcorrencia {
            color: red;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
    </style>

    <div class="container py-4">

        <h1 class="mb-4 text-center">Ocorrências Denunciadas</h1>

        <table class="table table-bordered table-hover">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Descrição</th>
                    <th>Tipo</th>
                    <th>Usuário</th>
                    <th>Postada em</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>

            <tbody>
                @forelse ($ocorrencias as $o)
                    <tr>
                        <td>{{ $o->id }}</td>

                        <td>{{ $o->titulo }}</td>

                        <td style="max-width: 250px;">
                            {{ Str::limit($o->descricao, 555) }}
                        </td>

                        <td>{{ $o->tipo }}</td>

                        <td>
                            {{ $o->usuario->nome ?? 'Desconhecido' }}
                        </td>

                        <td>{{ date('d/m/Y H:i', strtotime($o->dataPostagem)) }}</td>

                        <td>
                            <span class="badge bg-danger">{{ $o->status }}</span>
                        </td>

                        <td class="ocorrenciasAcoes">
                            <div class="ocorrenciasAcoesIcones">
                                <div class="btn btn-primary btn-sm btn-ver" data-id="{{ $o->id }}">
                                    <i class="fa-regular fa-eye" id="olhoOcorrencia"></i>
                                </div>


                                <form method="POST" action="{{ route('adm.ocorrencia.aprovar', $o->id) }}">
                                    @csrf
                                    @method('PUT')
                                    <button class="btn btn-success w-100" onclick="return confirm('Aprovar esta ocorrência?')">
                                        <i class="fa-solid fa-check" id="aprovadoOcorrencia"></i>
                                    </button>
                                </form>

                                <form method="POST" action="{{ route('adm.ocorrencia.negar', $o->id) }}">
                                    @csrf
                                    @method('PUT')
                                    <button class="btn btn-danger w-100" onclick="return confirm('Negar esta ocorrência?')">
                                        <i class="fa-solid fa-x" id="negadoOcorrencia"></i>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="8" class="text-center p-4">
                            Nenhuma ocorrência denunciada encontrada.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <div class="d-flex justify-content-center">
            {{ $ocorrencias->links() }}
        </div>

        <div class="botoesFinais">
            <a href="{{ route('adm.ocorrencia.index') }}" class="link-btn">
                <div id="btnVoltar" class="botao mt-4">Voltar</div>
            </a>
        </div>
    </div>

    <div id="modalOverlay" class="modal-overlay">
        <div class="modal">
            <span class="close-btn" id="modalClose">&times;</span>

            <div class="modal-header">Detalhes da Ocorrência</div>

            <div id="loadingArea" class="text-center py-3">
                <div class="spinner"></div>
            </div>

            <div id="contentArea" style="display:none;">
                <div class="dadosModal">
                    <p><strong>ID:</strong> <span id="o_id"></span></p>
                    <p><strong>Título:</strong> <span id="o_titulo"></span></p>
                    <p><strong>Descrição:</strong> <span id="o_descricao"></span></p>
                    <p><strong>Tipo:</strong> <span id="o_tipo"></span></p>
                    <p><strong>Usuário:</strong> <span id="o_usuario"></span></p>
                    <p><strong>Email:</strong> <span id="o_email"></span></p>
                    <p><strong>Latitude:</strong> <span id="o_latitude"></span></p>
                    <p><strong>Longitude:</strong> <span id="o_longitude"></span></p>
                    <p><strong>Data Acontecimento:</strong> <span id="o_dataAcontecimento"></span></p>
                    <p><strong>Data Postagem:</strong> <span id="o_dataPostagem"></span></p>
                    <p><strong>Status:</strong> <span id="o_status"></span></p>
                </div>

                <div class="botoesFinais">
                    <a href="{{ route('adm.ocorrencia.denuncia') }}" class="link-btn">
                        <div id="btnVoltar" class="botao mt-4">Voltar</div>
                    </a>
                </div>
            </div>

        </div>
    </div>

    <style>
        .dadosModal {
            border-top: 1px solid gray;
            border-bottom: 1px solid gray;
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin: 20px 0; /* top e bottom */
            padding: 10px 0; /* opcional: espaçamento interno */
        }
    </style>
    <script>
document.addEventListener("DOMContentLoaded", () => {

    const overlay = document.getElementById("modalOverlay");
    const closeBtn = document.getElementById("modalClose");

    function openModal() {
        overlay.style.display = "flex";
    }
    function closeModal() {
        overlay.style.display = "none";
    }

    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", e => {
        if (e.target === overlay) closeModal();
    });

    document.querySelectorAll('.btn-ver').forEach(btn => {
        btn.addEventListener('click', async () => {

            const id = btn.getAttribute('data-id');

            document.getElementById('contentArea').style.display = 'none';
            document.getElementById('loadingArea').style.display = 'block';

            openModal();

            try {
                const response = await fetch(`/adm/ocorrencias/selecionada/${id}`);
                if (!response.ok) throw new Error("Erro ao buscar dados");

                const o = await response.json();

                document.getElementById('o_id').textContent = o.id;
                document.getElementById('o_titulo').textContent = o.titulo;
                document.getElementById('o_descricao').textContent = o.descricao;
                document.getElementById('o_tipo').textContent = o.tipo;
                document.getElementById('o_usuario').textContent = o.usuario?.nome ?? 'Desconhecido';
                document.getElementById('o_email').textContent = o.usuario?.email ?? '';
                document.getElementById('o_latitude').textContent = o.latitude;
                document.getElementById('o_longitude').textContent = o.longitude;
                document.getElementById('o_dataAcontecimento').textContent = o.dataAcontecimento;
                document.getElementById('o_dataPostagem').textContent = o.dataPostagem;
                document.getElementById('o_status').textContent = o.status;

            } catch (e) {
                alert("Erro ao carregar os dados: " + e.message);
            }

            document.getElementById('loadingArea').style.display = 'none';
            document.getElementById('contentArea').style.display = 'block';
        });
    });

});

    </script>
@endsection