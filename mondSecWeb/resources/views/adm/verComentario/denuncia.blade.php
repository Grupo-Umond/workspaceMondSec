@extends('adm.layouts.admin')

@section('content')
    <div class="container py-4">

        <h2 class="mb-4">Comentários Denunciados</h2>

        <table class="table table-bordered table-hover">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Mensagem</th>
                    <th>Usuário</th>
                    <th>Ocorrência</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>

            <tbody>
                @forelse ($comentarios as $c)
                    <tr>
                        <td>{{ $c->id }}</td>

                        <td style="max-width: 250px;">
                            {{ Str::limit($c->mensagem, 120) }}
                        </td>

                        <td>
                            {{ $c->usuario->nome ?? 'Desconhecido' }}<br>
                            <small>{{ $c->usuario->email ?? '' }}</small>
                        </td>

                        <td>
                            {{ $c->ocorrencia->titulo ?? 'Sem ocorrência' }}
                        </td>

                        <td>{{ date('d/m/Y H:i', strtotime($c->data)) }}</td>

                        <td>
                            <span class="badge bg-danger">{{ $c->status }}</span>
                        </td>

                        <td>
                            <button class="btn btn-primary btn-sm btn-ver" data-id="{{ $c->id }}">
                                Ver
                            </button>

                            <a href="#" class="btn btn-success btn-sm">Aprovar</a>
                            <a href="#" class="btn btn-warning btn-sm">Arquivar</a>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="8" class="text-center p-4">
                            Nenhum comentário denunciado encontrado.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <div class="d-flex justify-content-center">
            {{ $comentarios->links() }}
        </div>

        <div class="botoesFinais">
            <a href="{{ route('adm.comentario.index') }}" class="link-btn">
                <div id="btnVoltar" class="botao mt-4">Voltar</div>
            </a>
        </div>
    </div>



    <div class="modal fade" id="modalVerComentario" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">

                <!-- <div class="modal-header">
                    <h5 class="modal-title">Detalhes do Comentário</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div> -->

                <div class="modal-body">

                    <div id="carregandoComentario" class="text-center py-3">
                        <div class="spinner-border"></div>
                    </div>

                    <div id="conteudoComentario" style="display:none;">
                        <p><strong>ID:</strong> <span id="c_id"></span></p>
                        <p><strong>Mensagem:</strong> <span id="c_mensagem"></span></p>
                        <p><strong>Usuário:</strong> <span id="c_usuario"></span></p>
                        <p><strong>Email:</strong> <span id="c_email"></span></p>
                        <hr>
                        <h6 class="mt-3">Ocorrência Relacionada</h6>
                        <p><strong>ID Ocorrência:</strong> <span id="c_idOcorrencia"></span></p>
                        <p><strong>Título Ocorrência:</strong> <span id="c_ocorrenciaTitulo"></span></p>
                        <p><strong>Descrição:</strong> <span id="c_ocorrenciaDescricao"></span></p>
                        <hr>
                        <p><strong>Data:</strong> <span id="c_data"></span></p>
                        <p><strong>Status:</strong> <span id="c_status"></span></p>
                    </div>

                </div>

                <!-- <div class="modal-footer">

                    <button id="fecharDenuncia" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                </div> -->

            </div>
        </div>
    </div>


    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const modalEl = document.getElementById('modalVerComentario');
            const modal = new bootstrap.Modal(modalEl);

            document.querySelectorAll('.btn-ver').forEach(btn => {
                btn.addEventListener('click', async () => {

                    const id = btn.getAttribute('data-id');

                    document.getElementById('conteudoComentario').style.display = 'none';
                    document.getElementById('carregandoComentario').style.display = 'block';

                    modal.show();

                    try {
                        const response = await fetch(`/adm/comentarios/selecionado/${id}`);

                        if (!response.ok) {
                            throw new Error("Erro ao buscar dados");
                        }

                        const c = await response.json();

                        document.getElementById('c_id').textContent = c.id;
                        document.getElementById('c_mensagem').textContent = c.mensagem;

                        document.getElementById('c_usuario').textContent = c.usuario?.nome ?? 'Desconhecido';
                        document.getElementById('c_email').textContent = c.usuario?.email ?? '';

                        document.getElementById('c_data').textContent = c.data;
                        document.getElementById('c_status').textContent = c.status;

                        document.getElementById('c_idOcorrencia').textContent = c.ocorrencia?.id ?? '-';
                        document.getElementById('c_ocorrenciaTitulo').textContent = c.ocorrencia?.titulo ?? '-';
                        document.getElementById('c_ocorrenciaDescricao').textContent = c.ocorrencia?.descricao ?? '-';

                    } catch (e) {
                        alert("Erro ao carregar o comentário.");
                    }

                    document.getElementById('carregandoComentario').style.display = 'none';
                    document.getElementById('conteudoComentario').style.display = 'block';
                });
            });
        });
    </script>


@endsection