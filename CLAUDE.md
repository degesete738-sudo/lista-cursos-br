# Lista Cursos BR — Instruções do Projeto

## Deploy automático

Sempre que o usuário pedir para **subir**, **publicar**, **atualizar** ou **deployar** o site, executar automaticamente:

```bash
cd "C:\Users\Davi oliveira\projeto code"
git add .
git commit -m "<descrição das mudanças feitas>"
git push origin main
```

A Vercel está conectada ao GitHub e faz o deploy automaticamente após o push.

- **Repositório:** https://github.com/degesete738-sudo/lista-cursos-br
- **Site ao vivo:** https://lista-cursos-br.vercel.app
- **Branch principal:** main

## Estrutura do projeto

- `index.html` — Página principal com ranking de criadores
- `produto.html` — Página de detalhe do produto/curso
- `contabilidade.html` — Plataforma Contábil (€15/mês)
- `crescimento.html` — Plataforma de Crescimento (€15/mês)
- `data.js` — Dados dos criadores/produtos
- `chat.js` — Widget de chat flutuante
- `vercel.json` — Configuração de rotas da Vercel
