# Convite de casamento · Rafael & Vitória

Site estático do casamento (repositório **privado**). Hospede onde preferir — não depende do GitHub Pages.

**Data:** 23 de janeiro de 2027 · **Local:** Chácara Barberino · Serrinha

## Onde editar
- **Data da contagem regressiva**: `js/main.js`, constante `WEDDING_DATE` (topo do arquivo). Atual: `2027-01-23T16:00:00-03:00`.
- **Confirmação de presença**: `js/main.js`, constante `RSVP_ENDPOINT` (URL do Web App do Google Apps Script). Vazio = confirmação simulada.
- **Chave Pix e titular**: `index.html`, seção `#presentes` (`<code id="pix-key" data-pix="...">`). Os botões copiam os dígitos de `data-pix`.
- **Valores das cotas Pix**: `index.html`, cards `.pix-card`.
- **Lista de presentes**: `index.html`, seção `#lista-presentes`.
- **Local, mapa e horários**: `index.html`, seção `#local` (iframe do mapa, botões Google Maps/Waze, timeline).
- **Logo do topo**: `img/logo-rv.png`.
- **Fotos**: pasta `img/`.

⚠️ **Nunca** coloque a lista de convidados neste repositório.

## Confirmação de presença (RSVP)

A confirmação é **livre**: qualquer nome digitado no site vira uma linha nova na aba `Convidados` da planilha (status `confirmado`, data/hora e nome). Não há conferência com lista.

O código do Apps Script fica em `docs/rsvp-apps-script.gs`. Depois de colar no Apps Script da planilha: Implantar → Gerenciar implantações → lápis → Nova versão → Implantar. A URL do App da Web vai em `RSVP_ENDPOINT` no `js/main.js`.
