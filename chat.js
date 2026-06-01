(function () {
  // ── STYLES ──────────────────────────────────────────────────
  const css = `
    #chatWidget { position:fixed; bottom:24px; right:24px; z-index:50; font-family:'Inter',sans-serif; }

    .chat-toggle {
      width:52px; height:52px; border-radius:50%;
      background:#0a0a0a; border:none; cursor:pointer;
      display:flex; align-items:center; justify-content:center;
      box-shadow: 0 4px 24px rgba(0,0,0,.22);
      transition: transform .2s, background .15s;
      position: relative; color:#fff;
    }
    .chat-toggle:hover  { transform:scale(1.07); background:#1c1c1c; }
    .chat-toggle.active { background:#16a34a; }

    .chat-pulse {
      position:absolute; top:-1px; right:-1px;
      width:13px; height:13px; border-radius:50%;
      background:#22c55e; border:2px solid #080808;
      animation: chatPulse 2.2s ease infinite;
    }
    @keyframes chatPulse {
      0%,100% { opacity:1; transform:scale(1); }
      50%      { opacity:.55; transform:scale(1.35); }
    }

    .chat-panel {
      position:absolute; bottom:64px; right:0;
      width:340px; background:#0f0f0f; border-radius:16px;
      border: 1px solid rgba(255,255,255,.1);
      box-shadow: 0 20px 60px rgba(0,0,0,.7), 0 4px 16px rgba(0,0,0,.4);
      overflow:hidden;
      transform: translateY(10px) scale(.97);
      opacity:0; pointer-events:none;
      transition: transform .28s cubic-bezier(.22,1,.36,1), opacity .22s ease;
    }
    .chat-panel.open { transform:none; opacity:1; pointer-events:all; }

    .chat-header {
      background:#0a0a0a; padding:16px 18px;
      display:flex; align-items:center; gap:12px;
    }
    .chat-bot-icon {
      width:36px; height:36px; border-radius:50%;
      background:#16a34a; color:#fff;
      display:flex; align-items:center; justify-content:center;
      font-size:15px; flex-shrink:0; font-weight:600;
    }
    .chat-header-text  { flex:1; }
    .chat-bot-name     { font-size:14px; font-weight:600; color:#fff; letter-spacing:-.2px; }
    .chat-bot-status   { font-size:11px; color:#6b6b6b; display:flex; align-items:center; gap:5px; margin-top:2px; }
    .status-dot        { width:6px; height:6px; border-radius:50%; background:#16a34a; }
    .chat-close        {
      background:none; border:none; cursor:pointer; color:#555; padding:4px;
      display:flex; align-items:center; justify-content:center;
      border-radius:6px; transition: background .15s, color .15s;
    }
    .chat-close:hover { background:rgba(255,255,255,.1); color:#fff; }

    .chat-messages {
      height:280px; overflow-y:auto;
      padding:16px; display:flex; flex-direction:column; gap:10px;
      scroll-behavior:smooth; background:#0f0f0f;
    }
    .chat-messages::-webkit-scrollbar       { width:3px; }
    .chat-messages::-webkit-scrollbar-thumb { background:#2a2a2a; border-radius:3px; }

    .chat-msg            { display:flex; gap:8px; align-items:flex-end; }
    .chat-msg.bot        { justify-content:flex-start; }
    .chat-msg.user       { justify-content:flex-end; }

    .msg-avatar {
      width:24px; height:24px; border-radius:50%;
      background:#0a0a0a; color:#fff; font-size:10px; font-weight:600;
      display:flex; align-items:center; justify-content:center;
      flex-shrink:0; margin-bottom:2px;
    }
    .msg-bubble {
      max-width:236px; padding:10px 13px;
      border-radius:14px; font-size:13px; line-height:1.55;
    }
    .chat-msg.bot  .msg-bubble { background:#1a1a1a; color:#e0e0e0; border-bottom-left-radius:3px; border:1px solid rgba(255,255,255,.06); }
    .chat-msg.user .msg-bubble { background:#22c55e; color:#000; border-bottom-right-radius:3px; }

    .chat-typing .msg-bubble {
      display:flex; gap:4px; align-items:center; padding:12px 14px;
    }
    .typing-dot {
      width:6px; height:6px; border-radius:50%; background:#9ca3af;
      animation: typingAnim .9s ease infinite;
    }
    .typing-dot:nth-child(2) { animation-delay:.15s; }
    .typing-dot:nth-child(3) { animation-delay:.30s; }
    @keyframes typingAnim {
      0%,80%,100% { transform:scale(1); opacity:.35; }
      40%          { transform:scale(1.25); opacity:1; }
    }

    .chat-suggestions {
      padding:10px 14px 6px;
      display:flex; gap:6px; flex-wrap:wrap;
      border-top:1px solid #1a1a1a; background:#0c0c0c;
    }
    .chat-sugg {
      padding:5px 11px;
      border:1px solid rgba(255,255,255,.08); border-radius:20px;
      background:#161616; font-family:inherit; font-size:11px; color:#888;
      cursor:pointer; transition: all .15s; white-space:nowrap;
    }
    .chat-sugg:hover { border-color:#22c55e; color:#22c55e; background:rgba(34,197,94,.06); }

    .chat-input-row {
      display:flex; align-items:center; gap:10px;
      padding:12px 14px; border-top:1px solid #1a1a1a; background:#0c0c0c;
    }
    #chatInput {
      flex:1; border:none; outline:none;
      font-family:inherit; font-size:13px; color:#e0e0e0; background:transparent;
    }
    #chatInput::placeholder { color:#444; }
    .chat-send {
      width:32px; height:32px; border-radius:50%;
      background:#0a0a0a; color:#fff; border:none;
      cursor:pointer; display:flex; align-items:center; justify-content:center;
      flex-shrink:0; transition: background .15s, transform .1s;
    }
    .chat-send:hover  { background:#16a34a; }
    .chat-send:active { transform:scale(.9); }

    @keyframes msgIn { from { opacity:0; transform:translateY(5px) } to { opacity:1; transform:none } }
    .chat-msg { animation:msgIn .2s ease both; }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── BOT BRAIN ───────────────────────────────────────────────
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim();

  const RULES = [
    {
      test: t => /^(oi|ola|hey|hi|eai|tudo|bom dia|boa tarde|boa noite)\b/.test(t),
      reply: 'Olá! Sou a **Iris**, assistente da Lista Cursos BR. 👋\n\nPosso te ajudar com dúvidas sobre criadores, métricas, plataformas e muito mais. O que você quer saber?'
    },
    {
      test: t => /\bmrr\b|receita mensal|o que (e|eh|é) mrr|significa mrr/.test(t),
      reply: '**MRR** (Monthly Recurring Revenue) é a receita mensal recorrente de um criador. Os valores exibidos são estimativas baseadas em dados públicos ou reportados voluntariamente.'
    },
    {
      test: t => /(como funciona|como usar|como navegar|sobre o site|o que (e|eh|é) (isso|esse site)|para que serve)/.test(t),
      reply: 'A **Lista Cursos BR** é um ranking de criadores de cursos digitais brasileiros.\n\nVocê pode:\n• Ordenar por receita, alunos ou crescimento\n• Ocultar/mostrar produtos anônimos\n• Clicar num criador para ver os detalhes completos'
    },
    {
      test: t => /(melhores?|maiores?|top|mais rico|mais ganha|numero 1|#1|lider)/.test(t) && /(curso|criador|canal|produto|lista|ranking)/.test(t),
      reply: 'Os **3 maiores** por receita mensal:\n\n1. Fórmula Negócio Online — R$ 512K (+12%)\n2. Empiricus Academy — R$ 420K (+8%)\n3. DevSuperior — R$ 118K (+31%)'
    },
    {
      test: t => /(programa(cao)?|codi(go)?|dev|desenvolv|react|python|java\b|javascript|typescript|next\.?js|front.?end|back.?end)/.test(t),
      reply: 'Cursos de **Programação** na lista:\n\n• DevSuperior — Java & Spring Boot (+31%)\n• Curso em Vídeo — HTML, CSS, Python (+5%)\n• React na Prática — React & Next.js (+56%)\n• 1 produto anônimo (+88%)'
    },
    {
      test: t => /(marketing|afiliado|trafego|meta ads|google ads|social media|vendas online)/.test(t),
      reply: 'Cursos de **Marketing Digital**:\n\n• Fórmula Negócio Online — líder geral (R$ 512K/mês)\n• Tráfego Pago Pro — Google & Meta Ads (+22%)\n• 1 produto anônimo com +115% de crescimento'
    },
    {
      test: t => /(financ|invest|bolsa|acao|renda passiva|dinheiro|tesouro|criptos?)/.test(t),
      reply: 'Cursos de **Finanças**:\n\n• Empiricus Academy — 2º maior da lista (+8%)\n• 2 produtos anônimos nessa categoria\n\nDica: ordene por "Crescimento" para ver os mais promissores.'
    },
    {
      test: t => /(design|canva|figma|photoshop|ilustra(cao)?)/.test(t),
      reply: 'Cursos de **Design**:\n\n• Canva do Zero — para não-designers (+42%)\n• 1 produto anônimo com crescimento de **+200%** 🚀'
    },
    {
      test: t => /(fitness|yoga|academia|emagrec|treino|saude|bem.estar|culinaria|receita)/.test(t),
      reply: 'Cursos de **Saúde & Bem-estar**:\n\n• Yoga & Bem-estar — +33% este mês\n• Culinária Fit Brasil — +9%\n• 1 produto anônimo de fitness (-8%)'
    },
    {
      test: t => /hotmart/.test(t),
      reply: '**Hotmart** é a maior plataforma de infoprodutos do Brasil. Na lista, **10 dos 20 criadores** usam Hotmart — incluindo o 1º e 2º colocados.'
    },
    {
      test: t => /kiwify/.test(t),
      reply: '**Kiwify** é popular pela simplicidade e taxas menores. **6 criadores** da lista usam Kiwify, incluindo React na Prática e Canva do Zero.'
    },
    {
      test: t => /eduzz/.test(t),
      reply: '**Eduzz** tem 3 criadores na lista: Excel Expert, Yoga & Bem-estar e um produto anônimo de fitness.'
    },
    {
      test: t => /monetizze/.test(t),
      reply: '**Monetizze** tem 2 criadores: Tráfego Pago Pro e Coaching de Carreira BR. Focada em checkout otimizado e alta conversão.'
    },
    {
      test: t => /(anonimo|anon|sem nome|escondido|oculto)/.test(t),
      reply: '**Produtos anônimos** são criadores que escolheram não revelar o nome. Há **6 anônimos** na lista — alguns com crescimento impressionante (+200%). Use o toggle "Mostrar anônimos" para exibi-los ou ocultá-los.'
    },
    {
      test: t => /(crescimento|cresceu|maior alta|explosao|disparou|subiu mais)/.test(t),
      reply: '**Maiores crescimentos** do mês:\n\n1. Produto Anônimo (Design) → **+200%**\n2. Produto Anônimo (Mkt) → +115%\n3. Produto Anônimo (Dev) → +88%\n\nEntre os identificados: React na Prática lidera com +56%.'
    },
    {
      test: t => /(queda|caindo|caiu|diminuiu|negativo|perdeu|decresceu)/.test(t),
      reply: 'Cursos em **queda** este mês:\n\n• Produto Anônimo (Finanças) → -15%\n• Produto Anônimo (Fitness) → -8%\n• Excel Expert → -3%\n\nQuedas pontuais são normais — o importante é a tendência de longo prazo.'
    },
    {
      test: t => /(enviar|cadastrar|adicionar|incluir|meu curso|minha escola|aparecer na lista)/.test(t),
      reply: 'Para adicionar seu curso, clique em **"Enviar curso"** no rodapé da página. Preencha o formulário com os dados do seu produto e aguarde a revisão.'
    },
    {
      test: t => /(obrigad|valeu|thanks|muito bom|otimo|legal|incrivel|show|top demais)/.test(t),
      reply: 'Fico feliz em ajudar! 😊 Se surgir mais dúvidas sobre os cursos ou a plataforma, pode perguntar.'
    },
  ];

  function getBotReply(text) {
    const t = norm(text);
    for (const r of RULES) if (r.test(t)) return r.reply;
    return 'Hmm, não tenho essa informação. Tente perguntar sobre:\n\n• Cursos de programação, marketing ou finanças\n• Plataformas (Hotmart, Kiwify)\n• Maiores crescimentos\n• O que é MRR';
  }

  // ── DOM ─────────────────────────────────────────────────────
  document.body.insertAdjacentHTML('beforeend', `
    <div id="chatWidget">
      <div id="chatPanel" class="chat-panel">
        <div class="chat-header">
          <div class="chat-bot-icon">✦</div>
          <div class="chat-header-text">
            <div class="chat-bot-name">Iris</div>
            <div class="chat-bot-status"><span class="status-dot"></span>Online agora</div>
          </div>
          <button id="chatClose" class="chat-close" aria-label="Fechar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div id="chatMessages" class="chat-messages"></div>
        <div class="chat-suggestions" id="chatSuggs">
          <button class="chat-sugg" data-q="Como funciona o site?">Como funciona?</button>
          <button class="chat-sugg" data-q="Cursos de programação">Programação</button>
          <button class="chat-sugg" data-q="Maiores crescimentos">Crescimento</button>
          <button class="chat-sugg" data-q="O que é MRR?">O que é MRR?</button>
        </div>
        <div class="chat-input-row">
          <input id="chatInput" type="text" placeholder="Pergunte sobre os cursos..." autocomplete="off" />
          <button id="chatSendBtn" class="chat-send" aria-label="Enviar">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="12" y1="19" x2="12" y2="5"/>
              <polyline points="5 12 12 5 19 12"/>
            </svg>
          </button>
        </div>
      </div>
      <button id="chatToggle" class="chat-toggle" aria-label="Abrir assistente">
        <span class="chat-pulse" id="chatPulse"></span>
        <span id="chatIconChat">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </span>
        <span id="chatIconX" style="display:none">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </span>
      </button>
    </div>
  `);

  // ── EVENTS ──────────────────────────────────────────────────
  const panel    = document.getElementById('chatPanel');
  const toggle   = document.getElementById('chatToggle');
  const closeBtn = document.getElementById('chatClose');
  const msgArea  = document.getElementById('chatMessages');
  const inputEl  = document.getElementById('chatInput');
  const sendEl   = document.getElementById('chatSendBtn');
  const pulse    = document.getElementById('chatPulse');
  const iconChat = document.getElementById('chatIconChat');
  const iconX    = document.getElementById('chatIconX');
  let   open     = false;
  let   welcomed = false;

  function addMsg(role, text) {
    const div      = document.createElement('div');
    div.className  = `chat-msg ${role}`;
    const html     = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    div.innerHTML  = role === 'bot'
      ? `<div class="msg-avatar">✦</div><div class="msg-bubble">${html}</div>`
      : `<div class="msg-bubble">${html}</div>`;
    msgArea.appendChild(div);
    msgArea.scrollTop = msgArea.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg bot chat-typing';
    div.innerHTML = `<div class="msg-avatar">✦</div><div class="msg-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;
    msgArea.appendChild(div);
    msgArea.scrollTop = msgArea.scrollHeight;
    return div;
  }

  function send(text) {
    text = text.trim();
    if (!text) return;
    inputEl.value = '';
    const suggs = document.getElementById('chatSuggs');
    if (suggs) suggs.style.display = 'none';
    addMsg('user', text);
    const t = showTyping();
    setTimeout(() => { t.remove(); addMsg('bot', getBotReply(text)); }, 650 + Math.random() * 350);
  }

  function openPanel() {
    open = true;
    panel.classList.add('open');
    toggle.classList.add('active');
    iconChat.style.display = 'none';
    iconX.style.display = 'inline';
    pulse.style.display = 'none';
    if (!welcomed) {
      welcomed = true;
      setTimeout(() => addMsg('bot', 'Olá! Sou a **Iris**, assistente da Lista Cursos BR. 👋\n\nPosso te ajudar com dúvidas sobre criadores, métricas e plataformas. O que você quer saber?'), 200);
    }
    setTimeout(() => inputEl.focus(), 320);
  }

  function closePanel() {
    open = false;
    panel.classList.remove('open');
    toggle.classList.remove('active');
    iconChat.style.display = 'inline';
    iconX.style.display = 'none';
  }

  toggle.addEventListener('click', () => open ? closePanel() : openPanel());
  closeBtn.addEventListener('click', closePanel);
  sendEl.addEventListener('click', () => send(inputEl.value));
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') send(inputEl.value); });
  document.querySelectorAll('.chat-sugg').forEach(b => b.addEventListener('click', () => send(b.dataset.q)));
})();
