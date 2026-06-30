const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>G•LAB Mobile App</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          background: #000;
          color: #fff;
        }
        .container {
          text-align: center;
          padding: 20px;
        }
        h1 { font-size: 32px; margin-bottom: 20px; }
        p { font-size: 16px; margin: 15px 0; }
        .link { 
          display: inline-block;
          margin: 20px 0;
          padding: 15px 30px;
          background: #fff;
          color: #000;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          font-size: 18px;
        }
        .link:hover { background: #f0f0f0; }
        .qr { margin: 20px 0; }
        .info { font-size: 14px; color: #999; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>G•LAB Mobile</h1>
        <p>Aplicativo de Gerenciamento de Assistência Técnica</p>
        
        <p style="margin-top: 30px;">Para acessar o app, você precisa de:</p>
        <p>1. Instalar <strong>Expo Go</strong> (App Store/Google Play)</p>
        <p>2. Clique no botão abaixo</p>
        
        <a href="exp://localhost:19000" class="link">Abrir no Expo Go</a>
        
        <p style="margin-top: 30px; font-size: 14px; color: #999;">
          Se está em outro dispositivo, use:
          <br><strong>exp://seu-servidor:19000</strong>
        </p>
        
        <div class="info">
          <p>Dashboard | Ordens | Técnico | Estoque | Perfil</p>
          <p>Sincronizado com https://www.glabcursos.com.br</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Link do app disponível em: http://localhost:3000');
});
