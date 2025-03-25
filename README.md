# EventosFisio

Sistema para gerenciamento de eventos de fisioterapia.

## Funcionalidades

- Gerenciamento completo de eventos
- Controle de prestadores e itens necessários
- Visualização em calendário
- Acompanhamento de tarefas em formato kanban
- Gráficos e análises de dados
- Responsivo para dispositivos móveis

## Tecnologias

- React
- TypeScript
- TailwindCSS
- Chart.js
- React Router
- React Beautiful DnD

## Como instalar

1. Clone o repositório:
```bash
git clone https://github.com/SEU_USUARIO/eventosfisio.git
```

2. Instale as dependências:
```bash
cd eventosfisio
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse o sistema em:
```
http://localhost:5173
```

## Como usar

1. Faça login na aplicação
2. Navegue entre as abas de Eventos e Tarefas
3. Adicione novos eventos através do dashboard
4. Gerencie prestadores e itens na página de detalhes do evento
5. Visualize eventos no calendário ou em cards
6. Organize tarefas arrastando entre colunas

## Build para produção

Para gerar os arquivos de produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist`.

## Deploy

Este projeto está configurado para ser facilmente implantado no Netlify. Basta conectar seu repositório GitHub ao Netlify, e ele detectará automaticamente as configurações de build. 