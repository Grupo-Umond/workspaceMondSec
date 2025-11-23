@extends('adm.layouts.admin')

@section('content')
<div class="container py-4">

    <h2 class="mb-4">Ocorrências Denunciadas</h2>

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
                    <br>
                    <small>{{ $o->usuario->email ?? '' }}</small>
                </td>

                <td>{{ date('d/m/Y H:i', strtotime($o->dataPostagem)) }}</td>

                <td>
                    <span class="badge bg-danger">{{ $o->status }}</span>
                </td>

                <td>
                    <button class="btn btn-primary btn-sm btn-ver" data-id="{{ $o->id }}">
                        Ver
                    </button>

                    <a href="#" class="btn btn-success btn-sm">Aprovar</a>
                    <a href="#" class="btn btn-warning btn-sm">Arquivar</a>
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

    <a href="{{ route('adm.ocorrencia.index') }}" class="link-btn">
        <div id="btnVoltar" class="botao mt-4">Voltar</div>
    </a>
</div>


<div class="modal fade" id="modalVerOcorrencia" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">Detalhes da Ocorrência</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">

                <div id="carregandoOcorrencia" class="text-center py-3">
                    <div class="spinner-border"></div>
                </div>

                <div id="conteudoOcorrencia" style="display:none;">
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

            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            </div>

        </div>
    </div>
</div>


<script>
document.addEventListener("DOMContentLoaded", () => {
    const modalEl = document.getElementById('modalVerOcorrencia');
    const modal = new bootstrap.Modal(modalEl);

    document.querySelectorAll('.btn-ver').forEach(btn => {
        btn.addEventListener('click', async () => {

            const id = btn.getAttribute('data-id');

            document.getElementById('conteudoOcorrencia').style.display = 'none';
            document.getElementById('carregandoOcorrencia').style.display = 'block';

            modal.show();

            try {
                const response = await fetch(`/adm/ocorrencias/selecionada/${id}`);

                if (!response.ok) {
                    throw new Error("Erro ao buscar dados");
                }

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
                alert("Erro ao carregar a ocorrência.");
            }

            document.getElementById('carregandoOcorrencia').style.display = 'none';
            document.getElementById('conteudoOcorrencia').style.display = 'block';
        });
    });
});
</script>

@endsection
