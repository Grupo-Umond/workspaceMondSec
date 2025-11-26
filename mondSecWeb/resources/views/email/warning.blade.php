<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Aviso Importante</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f5f6fa;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        h2 {
            color: #d63031;
            text-align: center;
        }

        p {
            font-size: 16px;
            color: #2d3436;
            line-height: 1.6;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #636e72;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Aviso de Segurança</h2>

        <p>Olá <strong>{{ $usuario->nome }}</strong>,</p>

        <p>{{ $mensagem }}</p>

        <p>Se você tiver dúvidas, estamos à disposição umond@contato.com</p>

        <div class="footer">
            Mondsec © {{ date('Y') }}
        </div>
    </div>
</body>
</html>
