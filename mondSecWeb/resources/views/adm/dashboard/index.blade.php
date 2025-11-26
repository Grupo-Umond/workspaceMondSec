@extends('adm.layouts.admin')

@section('title', 'Dashboard')

@section('content')

<div class="container py-4">

    {{-- CARDS --}}
    <div class="row g-4 mb-4">

        <div class="col-md-3">
            <div class="card shadow p-3 text-center">
                <h5>Usuários</h5>
                <h2>{{ $totalUsuarios }}</h2>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card shadow p-3 text-center">
                <h5>Admins</h5>
                <h2>{{ $totalAdmins }}</h2>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card shadow p-3 text-center">
                <h5>Ocorrências</h5>
                <h2>{{ $totalOcorrencias }}</h2>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card shadow p-3 text-center">
                <h5>Comentários</h5>
                <h2>{{ $totalComentarios }}</h2>
            </div>
        </div>

    </div>


    {{-- GRÁFICOS --}}
    <div class="row g-4">

        <div class="col-md-6">
            <div class="card shadow p-3">
                <h5 class="text-center mb-2">Usuários cadastrados por mês</h5>
                <div id="chartUsuarios"></div>
            </div>
        </div>

        <div class="col-md-6">
            <div class="card shadow p-3">
                <h5 class="text-center mb-2">Ocorrências por tipo</h5>
                <div id="chartOcorrencias"></div>
            </div>
        </div>

        <div class="col-md-6">
            <div class="card shadow p-3">
                <h5 class="text-center mb-2">Comentários por status</h5>
                <div id="chartComentarios"></div>
            </div>
        </div>

        <div class="col-md-6">
            <div class="card shadow p-3">
                <h5 class="text-center mb-2">Admins por nível</h5>
                <div id="chartAdmins"></div>
            </div>
        </div>

    </div>

</div>


{{-- ApexCharts CDN --}}
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>

<script>
    // -------- GRÁFICO DE USUÁRIOS --------
    var chartUsuarios = new ApexCharts(document.querySelector("#chartUsuarios"), {
        chart: { type: 'line', height: 300 },
        series: [{
            name: "Usuários",
            data: @json($usuariosPorMes->pluck('total'))
        }],
        xaxis: {
            categories: @json($usuariosPorMes->pluck('mes'))
        }
    });
    chartUsuarios.render();


    // -------- GRÁFICO DE OCORRÊNCIAS --------
    var chartOcorrencias = new ApexCharts(document.querySelector("#chartOcorrencias"), {
        chart: { type: 'donut', height: 300 },
        series: @json($ocorrenciasPorTipo->pluck('total')),
        labels: @json($ocorrenciasPorTipo->pluck('tipo'))
    });
    chartOcorrencias.render();


    // -------- GRÁFICO DE COMENTÁRIOS --------
    var chartComentarios = new ApexCharts(document.querySelector("#chartComentarios"), {
        chart: { type: 'bar', height: 300 },
        series: [{
            name: "Comentários",
            data: @json($comentariosPorStatus->pluck('total'))
        }],
        xaxis: {
            categories: @json($comentariosPorStatus->pluck('status'))
        }
    });
    chartComentarios.render();


    // -------- GRÁFICO DE ADMINS --------
    var chartAdmins = new ApexCharts(document.querySelector("#chartAdmins"), {
        chart: { type: 'pie', height: 300 },
        series: @json($adminsPorNivel->pluck('total')),
        labels: @json($adminsPorNivel->pluck('nivelAdmin'))
    });
    chartAdmins.render();

</script>

@endsection
