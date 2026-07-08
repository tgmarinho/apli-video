# 🎬 Amplify IT — Video Challenge

> **Crie o melhor vídeo de marketing da Amplify IT com Remotion e ganhe R$350.**
> O vencedor leva tudo.

---

## O Desafio

A **Amplify IT** é uma plataforma de recrutamento com IA para engenheiros de software da América Latina. Precisamos de um vídeo de marketing que venda nossa plataforma — e queremos que a comunidade brasileira de devs nos ajude a construir isso.

**Sua missão:** criar um vídeo curto (~15–30 segundos) em **inglês**, feito 100% em código com **Remotion**, que venda o nosso ATS para empresas de tech que querem contratar engenheiros LATAM.

O melhor vídeo ganha **R$350** pagos via PIX.

---

## O Produto: Amplify ATS

O que você precisa vender no vídeo:

- **AI-native ATS** — plataforma de recrutamento com IA nativa, não um CRM adaptado
- **Talent pool LATAM** — banco de engenheiros pré-selecionados no Brasil, Argentina, Colômbia, México (UTC-3 a UTC-6)
- **Chat com agente IA** — o hiring manager descreve em linguagem natural quem quer contratar → o agente retorna os 3 melhores candidatos com warm intros personalizadas
- **Pipeline visual** — Kanban de candidatos com drag & drop entre etapas
- **Candidatos de empresas top** — ex-Nubank, iFood, Rappi, Mercado Livre, Kavak
- **Faixa salarial** — $60K–$120K USD (vs $300K–$450K em San Francisco)
- **Velocity** — posições fechadas em ~12 dias

Site: [amplifyit.io](https://amplifyit.io)

---

## Regras

1. **Remotion obrigatório** — o vídeo deve ser gerado 100% em código com [Remotion](https://remotion.dev). Sem After Effects, Premiere, CapCut ou ferramentas de edição de vídeo.
2. **Inglês** — o vídeo deve ter copy/narração/texto em inglês (é o mercado que queremos atingir).
3. **Duração** — entre 15 e 35 segundos.
4. **Open source** — o código precisa estar em um repositório **público** no GitHub até a data de submissão.
5. **Vídeo renderizado** — suba o `.mp4` junto ao repositório ou num link público (YouTube unlisted, Google Drive, etc).
6. **Build in public** — faça um post no X/LinkedIn/Twitter contando que você participou, com o link do repo e do vídeo. Use a hashtag `#AmplifyChallenge`.
7. **Trabalho original** — pode usar nosso repo como base, mas o vídeo precisa ser substancialmente diferente. Não é para fazer um fork com ajustes mínimos.
8. **Uma submissão por pessoa.**
9. O vídeo pode incluir IA generativa (assets, áudio, etc.) desde que o código Remotion seja o que orquestra tudo.
10. Submissões com conteúdo ofensivo, discriminatório ou que viole direitos de terceiros serão desqualificadas.

---

## Critérios de Avaliação

Cada submissão será avaliada de 0 a 10 em cada critério abaixo. O vencedor tem a maior soma.

| # | Critério | Peso | O que avaliamos |
|---|----------|------|-----------------|
| 1 | **Narrativa & storytelling** | 25% | O vídeo tem um arco claro? Existe tensão (problema) → resolução (produto)? O espectador entende o produto nos primeiros 5 segundos? |
| 2 | **Design visual & animação** | 25% | Qualidade das animações com `spring()` e `interpolate()`. Uso do espaço. Tipografia. Coerência visual. Nada de elementos genéricos ou placeholders. |
| 3 | **Copy & mensagem** | 20% | O texto é memorável? Direto? Tem uma frase que fica na cabeça (punchline)? Vende o produto com clareza em inglês? |
| 4 | **Criatividade técnica** | 20% | Uso criativo das APIs do Remotion. Transições customizadas. Physics-based animations. Interatividade com props/schema. Qualquer coisa que mostre domínio da ferramenta além do básico. |
| 5 | **Sound design** | 10% | O áudio complementa o vídeo? Transições com som, trilha, SFX que fazem sentido com a cena. |

**Critério de desempate:** o post de Build in Public com mais engajamento (reações + comentários) na data de encerramento.

---

## Como Participar

```bash
# 1. Fork este repositório
gh repo fork amplifyit-io/video --clone

# 2. Instale as dependências
cd video && npm install

# 3. Rode o Remotion Studio
npx remotion studio

# 4. Crie sua composição em src/compositions/
#    (pode modificar MarketingVideo ou criar uma nova)

# 5. Renderize o vídeo final
npx remotion render src/index.ts MarketingVideo out/submission.mp4

# 6. Suba tudo no GitHub (código + vídeo ou link)
```

### Submissão

Abra uma **Issue** neste repositório com o título `[SUBMISSION] Seu Nome` contendo:

- 🔗 Link do seu repositório GitHub
- 🎬 Link do vídeo renderizado (YouTube unlisted, Drive, ou o `.mp4` no próprio repo)
- 🐦 Link do seu post de Build in Public
- ✍️ Em 2–3 frases: qual foi sua abordagem narrativa e técnica

---

## Datas

| Marco | Data |
|-------|------|
| 🚀 Abertura das submissões | 26 de junho de 2025 |
| ⏰ Prazo final | 11 de julho de 2025 (23h59 BRT) |
| 🏆 Anúncio do vencedor | 14 de julho de 2025 |
| 💸 Pagamento via PIX | Até 48h após anúncio |

---

## Recursos

### Este repositório já inclui

- Composição base com 9 atos (`src/compositions/MarketingVideo/`)
- Componentes prontos: `SlackUI`, `DragKanban`, `CandidateListRow`, `ChatMessage`, `AgentTypingDots`, `StatCard`, `KanbanColumn`, `PipelineFunnel` e mais
- Sistema de design B&W (`src/lib/theme.ts`) com tokens de tipografia, bordas, cores
- Transições customizadas (`premiumFade`, `transition-hard`, `transition-soft`)
- SVG avatars de engenheiros LATAM (`public/avatars/`)
- Logos de empresas LATAM (`public/brand/companies/`)
- SFX gerados com ElevenLabs (`public/sounds/`)

### Você pode (e deve) ir além

- Usar outras paletas de cor (não precisa seguir o B&W)
- Criar personagens diferentes
- Usar voiceover com ElevenLabs, OpenAI TTS, etc.
- Integrar assets externos via `staticFile()`
- Criar composições completamente do zero
- Usar `@remotion/transitions`, `@remotion/motion-blur`, `@remotion/noise` ou qualquer pacote do ecossistema Remotion

---

## Sobre a Amplify IT

Somos uma startup brasileira que conecta empresas de tech com engenheiros de software de alta performance da América Latina. Nossa plataforma usa IA para matching, ranking e warm intros — o que transforma um processo de 3 meses num ciclo de 12 dias.

Acreditamos em **build in public** e que os melhores produtos são feitos por comunidades, não em silos. Por isso esse desafio existe.

Dúvidas? Abre uma [Issue](https://github.com/amplifyit-io/video/issues) ou fala com a gente no [LinkedIn](https://linkedin.com/company/amplifyit-io).

---

<div align="center">

**R$350 · PIX · O vencedor leva tudo**

*Feito por devs. Para devs. Com código.*

</div>
