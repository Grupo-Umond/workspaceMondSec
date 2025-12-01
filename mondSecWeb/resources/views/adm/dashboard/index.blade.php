@extends('adm.layouts.admin')

@section('title', 'Dashboard')

@section('content')

<style>
    .card-custom {
        border-radius: 18px;
        padding: 25px;
        background: #ffffff;
        box-shadow: 0 4px 18px rgba(0,0,0,0.08);
        transition: .2s;
    }

    .card-custom:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 26px rgba(0,0,0,0.15);
    }

    h5 {
        font-weight: 600;
        color: #444;
    }

    h2 {
        font-size: 2.7rem;
        font-weight: 700;
        color: #2d70d9;
    }

    /* 🔥 AUMENTEI A ALTURA DOS CARDS DE GRÁFICOS */
    .chart-card {
        height: 430px; /* antes 350px */
        overflow: hidden; /* evita transbordar */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    #chartUsuarios, 
    #chartOcorrencias, 
    #chartOcorrenciasPizza,
    #chartOcorrenciasMes,
    #chartComentarios,
    #chartAdmins {
        height: 100% !important;
    }
    
    .cardsSuperior{
        width: 100%;
        display: flex;
        gap: 10px;
        padding-bottom: 2%;
    }

    .cardsInferiores {
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding-bottom: 2%;
    }

    .col-md-3 {
        width: 25%;
    }
</style>


<div class="container py-4">

    {{-- CARDS --}}
    <div class="row g-4 mb-4 cardsSuperior">

        <div class="col-md-3">
            <div class="card-custom text-center">

                <h5>Usuários</h5>
                <h2>{{ $totalUsuarios }}</h2>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card-custom text-center">

                <h5>Admins</h5>
                <h2>{{ $totalAdmins }}</h2>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card-custom text-center">

                <h5>Ocorrências</h5>
                <h2>{{ $totalOcorrencias }}</h2>
            </div>
        </div>

        <div class="col-md-3">
            <div class="card-custom text-center">

                <h5>Comentários</h5>
                <h2>{{ $totalComentarios }}</h2>
            </div>
        </div>
    </div>


    {{-- GRÁFICOS --}}
    <div class="row g-4 cardsInferiores">

        <div class="col-md-6">
            <div class="card-custom chart-card">
                <h5 class="text-center mb-3">Usuários cadastrados por mês</h5>

                <div id="chartUsuarios"></div>
            </div>
        </div>

        <div class="col-md-6">
            <div class="card-custom chart-card">
                <h5 class="text-center mb-3">Ocorrências por tipo</h5>

                <div id="chartOcorrencias"></div>
            </div>
        </div>

        {{-- Pizza --}}
        <div class="col-md-6">
            <div class="card-custom chart-card">
                <h5 class="text-center mb-3">Distribuição de Ocorrências (Pizza)</h5>
                <div id="chartOcorrenciasPizza"></div>
            </div>
        </div>

        {{-- Ocorrências por mês --}}
        <div class="col-md-6">
            <div class="card-custom chart-card">
                <h5 class="text-center mb-3">Ocorrências por mês</h5>
                <div id="chartOcorrenciasMes"></div>
            </div>
        </div>

        <div class="col-md-6">
            <div class="card-custom chart-card">
                <h5 class="text-center mb-3">Comentários por status</h5>

                <div id="chartComentarios"></div>
            </div>
        </div>

        <div class="col-md-6">
            <div class="card-custom chart-card">
                <h5 class="text-center mb-3">Admins por nível</h5>

                <div id="chartAdmins"></div>
            </div>
        </div>

    </div>

</div>


<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>

<script>

    // Usuários por mês
    new ApexCharts(document.querySelector("#chartUsuarios"), {
        chart: { type: 'line', height: 350 },
        series: [{ name: "Usuários", data: @json($usuariosPorMes->pluck('total')) }],
        xaxis: { categories: @json($usuariosPorMes->pluck('mes')) }
    }).render();

    // Ocorrências por tipo
    new ApexCharts(document.querySelector("#chartOcorrencias"), {
        chart: { type: 'bar', height: 350 },
        plotOptions: { bar: { distributed: true } },
        series: [{ name: "Ocorrências", data: @json($ocorrenciasPorTipo->pluck('total')) }],
        xaxis: { categories: @json($ocorrenciasPorTipo->pluck('tipo')) }
    }).render();

    // Ocorrências Pizza
    new ApexCharts(document.querySelector("#chartOcorrenciasPizza"), {
        chart: { type: 'donut', height: 350 },
        series: @json($ocorrenciasPorTipo->pluck('total')),
        labels: @json($ocorrenciasPorTipo->pluck('tipo'))
    }).render();

    // Ocorrências por mês
    new ApexCharts(document.querySelector("#chartOcorrenciasMes"), {
        chart: { type: 'area', height: 350 },
        series: [{ name: "Ocorrências", data: @json($ocorrenciasPorMes->pluck('total')) }],
        xaxis: { categories: @json($ocorrenciasPorMes->pluck('mes')) }
    }).render();

    // Comentários por status
    new ApexCharts(document.querySelector("#chartComentarios"), {
        chart: { type: 'area', height: 350 },
        series: [{ name: "Comentários", data: @json($comentariosPorStatus->pluck('total')) }],
        xaxis: { categories: @json($comentariosPorStatus->pluck('status')) }
    }).render();

    // Admins por nível
    new ApexCharts(document.querySelector("#chartAdmins"), {
        chart: { type: 'pie', height: 350 },
        series: @json($adminsPorNivel->pluck('total')),
        labels: @json($adminsPorNivel->pluck('nivelAdmin'))
    }).render();


</script>

@endsection
