@component('mail::message')
# Novo contato do site

**Nome:** {{ $dados['nome'] }}  
**E-mail:** {{ $dados['email'] }}  
**Assunto:** {{ $dados['assunto'] }}  

**Mensagem:**  
{{ $dados['mensagem'] }}

@endcomponent
