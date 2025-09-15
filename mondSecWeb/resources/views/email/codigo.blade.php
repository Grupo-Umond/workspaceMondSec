<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Código de Verificação</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <h2 style="color: #003366;">Seu código de verificação</h2>
        <p style="font-size: 16px; color: #333;">
            Use o código abaixo para confirmar sua conta ou redefinir sua senha:
        </p>
        <h1 style="font-size: 32px; color: #003366; letter-spacing: 5px;">
            {{ $codigo }}
        </h1>
        <p style="margin-top: 20px; font-size: 14px; color: #777;">
            Esse código expira em 10 minutos.
        </p>
    </div>
</body>
</html>
