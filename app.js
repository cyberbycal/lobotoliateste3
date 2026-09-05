/* ============================================================
   APP — renderização + interações + localStorage
   ============================================================ */
(function(){
  "use strict";

  /* ---------- STORAGE HELPERS ---------- */
  const STORE_KEYS = { training: "lobotolinda_training_v1", skins: "lobotolinda_skins_v1" };
  function loadJSON(key, fallback){
    try{
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }catch(e){ return fallback; }
  }
  function saveJSON(key, value){
    try{ localStorage.setItem(key, JSON.stringify(value)); }catch(e){ /* localStorage indisponível — segue sem salvar */ }
  }

  const HEART_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.2-4.6-10-9.3C.4 8.6 1.6 5 5.1 4.1 7.4 3.5 9.7 4.5 12 7c2.3-2.5 4.6-3.5 6.9-2.9 3.5.9 4.7 4.5 3.1 7.6C19.2 16.4 12 21 12 21z"/></svg>';
  const STAR_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1z"/></svg>';
  const LEAF_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-1 3-3 4-3 7a3 3 0 006 0c0-3-2-4-3-7z"/></svg>';
  const CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>';

  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }

  /* ============ CARREGAMENTO SEGURO DE IMAGENS ============
     Qualquer <img> que falhar em qualquer lugar do site cai aqui.
     Nunca mostramos o ícone de imagem quebrada do navegador. */
  const FALLBACK_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23D98BAE'%3E%3Cpath d='M12 2c-1 3-3 4-3 7a3 3 0 006 0c0-3-2-4-3-7zM6 21c3-1 5-3 6-6-3 1-5 2-6 6zm12 0c-3-1-5-3-6-6 3 1 5 2 6 6z'/%3E%3C/svg%3E";
  document.addEventListener("error", function(e){
    const t = e.target;
    if(t && t.tagName === "IMG" && !t.dataset.fallbackApplied){
      t.dataset.fallbackApplied = "1";
      t.src = FALLBACK_ICON;
      t.classList.add("img-fallback");
    }
  }, true);

  /* ============ PATCH DISPLAY ============ */
  document.querySelectorAll(".js-patch").forEach(function(el){ el.textContent = CURRENT_PATCH; });

  /* ============ GATE ============ */
  const gate = document.getElementById("gate");
  const gateBtn = document.getElementById("gateBtn");
  let gateClicks = 0;
  gateBtn.addEventListener("click", function(){
    gateClicks++;
    if(gateClicks === 1){
      gate.classList.add("gate-hidden");
      document.body.style.overflow = "auto";
      spawnBurst(18);
      tryPlayChime();
      updateNavState();
      setTimeout(function(){
        document.getElementById("desculpas").scrollIntoView({behavior:"smooth"});
      }, 350);
    } else {
      const msgs = [
        "Júlia, vai treinar Nidalee.",
        "Não adianta clicar aqui. Vai farmar.",
        "VOCÊ ESTÁ IGNORANDO O ROADMAP.",
        "tá bom, mais um coraçãozinho não faz mal. ♡"
      ];
      const idx = Math.min(gateClicks - 2, msgs.length - 1);
      showEggToast(msgs[idx]);
      spawnBurst(4);
    }
  });

  function tryPlayChime(){
    try{
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [660, 880, 990];
      notes.forEach(function(freq, i){
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.value = 0.0001;
        osc.connect(gain).connect(ctx.destination);
        const t = ctx.currentTime + i * 0.14;
        gain.gain.exponentialRampToValueAtTime(0.05, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
        osc.start(t);
        osc.stop(t + 0.45);
      });
    }catch(e){ /* autoplay/áudio bloqueado — segue sem som */ }
  }

  /* ============ PARTICLES ============ */
  const particleLayer = document.getElementById("particles");
  function spawnBurst(n){ for(let i=0;i<n;i++){ setTimeout(spawnOne, i * 90); } }
  function spawnOne(){
    const el = document.createElement("div");
    el.className = "floaty";
    const isHeart = Math.random() > 0.4;
    el.innerHTML = isHeart ? HEART_SVG : LEAF_SVG;
    const size = 10 + Math.random() * 16;
    el.style.width = size + "px";
    el.style.height = size + "px";
    el.style.left = (Math.random() * 100) + "vw";
    el.style.bottom = "-40px";
    el.style.color = isHeart ? "var(--rose-400)" : "var(--rose-300)";
    const dur = 4 + Math.random() * 3;
    el.style.animationDuration = dur + "s";
    particleLayer.appendChild(el);
    setTimeout(function(){ el.remove(); }, dur * 1000 + 200);
  }
  setInterval(function(){
    if(document.hidden) return;
    if(Math.random() > 0.6) spawnOne();
  }, 3200);

  /* ============ NAV ============ */
  const nav = document.getElementById("nav");
  const hamburger = document.getElementById("hamburger");
  const navInner = document.getElementById("navInner");
  function updateNavState(){
    const gateHidden = gate.classList.contains("gate-hidden");
    if(!gateHidden){ nav.classList.remove("nav-visible"); return; }
    nav.classList.add("nav-visible");
    if(window.scrollY > 40){ nav.classList.add("nav-solid"); } else { nav.classList.remove("nav-solid"); }
  }
  window.addEventListener("scroll", updateNavState, {passive:true});
  hamburger.addEventListener("click", function(){
    const open = navInner.classList.toggle("mobile-open");
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.querySelectorAll("[data-nav]").forEach(function(a){
    a.addEventListener("click", function(){ navInner.classList.remove("mobile-open"); hamburger.setAttribute("aria-expanded","false"); });
  });
  document.addEventListener("click", function(e){
    if(navInner.classList.contains("mobile-open") && !e.target.closest("#nav")){
      navInner.classList.remove("mobile-open");
      hamburger.setAttribute("aria-expanded","false");
    }
  });

  /* ============ HERO SPLASH ============ */
  const heroSplash = document.getElementById("heroSplash");
  if(heroSplash){ heroSplash.style.backgroundImage = "url('" + NIDALEE_SPLASH_HERO + "')"; }

  /* ============ RENDER: ABILITIES (com toggle humana/puma) ============ */
  const abilityGrid = document.getElementById("abilityGrid");
  abilityGrid.innerHTML = ABILITIES.map(function(a){
    const hasForm = !!(a.humanDesc && a.pumaDesc);
    const bodyHtml = hasForm
      ? '<div class="form-toggle" data-key="' + a.key + '">'
        + '<button type="button" class="form-btn active" data-form="human">🧍 Humana</button>'
        + '<button type="button" class="form-btn" data-form="puma">🐆 Puma</button>'
        + '</div>'
        + '<p class="form-desc form-human active">' + a.humanDesc + '</p>'
        + '<p class="form-desc form-puma">' + a.pumaDesc + '</p>'
      : '<p style="margin:0; color:var(--ink-soft); font-size:.92rem;">' + a.desc + '</p>';
    return '<div class="ability-card">'
      + '<div class="ability-icon-wrap"><img class="ability-icon-img" src="' + a.icon + '" alt="Ícone ' + a.key + '" loading="lazy"><span class="ability-key-badge">' + a.key + '</span></div>'
      + '<div>'
      + '<h4>' + a.name + '</h4>'
      + '<div class="ability-meta">' + a.meta + '</div>'
      + bodyHtml
      + '<div class="ability-grid-inner">'
      + '<div class="ability-box"><b>Quando usar</b>' + a.when + '</div>'
      + '<div class="ability-box"><b>Erro comum</b>' + a.mistake + '</div>'
      + '</div>'
      + '<div class="ability-box" style="margin-top:10px;"><b>Dica</b>' + a.tip + '</div>'
      + '</div></div>';
  }).join("");
  abilityGrid.addEventListener("click", function(e){
    const btn = e.target.closest(".form-btn");
    if(!btn) return;
    const wrap = btn.closest(".form-toggle");
    wrap.querySelectorAll(".form-btn").forEach(function(b){ b.classList.toggle("active", b === btn); });
    const card = wrap.closest(".ability-card");
    card.querySelectorAll(".form-desc").forEach(function(p){ p.classList.remove("active"); });
    card.querySelector(".form-" + btn.dataset.form).classList.add("active");
  });

  /* ============ ABILITY ICON LOOKUP (p/ combos) ============ */
  const ABILITY_ICON = {};
  ABILITIES.forEach(function(a){ ABILITY_ICON[a.key] = a.icon; });

  /* ============ RENDER: COMBOS COM TABS ============ */
  const comboTabs = document.getElementById("comboCategoryTabs");
  const comboGrid = document.getElementById("comboGrid");
  let activeCategory = "todos";
  function renderComboTabs(){
    const cats = ["todos"].concat(Object.keys(COMBO_CATEGORIES));
    comboTabs.innerHTML = cats.map(function(c){
      const label = c === "todos" ? "Todos" : COMBO_CATEGORIES[c];
      return '<button type="button" class="combo-tab' + (c === activeCategory ? " active" : "") + '" data-cat="' + c + '">' + label + '</button>';
    }).join("");
  }
  function renderCombos(){
    const list = activeCategory === "todos" ? COMBOS : COMBOS.filter(function(c){ return c.category === activeCategory; });
    comboGrid.innerHTML = list.map(function(c){
      const dots = [1,2,3,4,5].map(function(n){ return '<span class="dot' + (n<=c.difficulty ? ' on' : '') + '"></span>'; }).join("");
      const seq = c.steps.map(function(s, i){
        const icon = ABILITY_ICON[s];
        const chip = icon
          ? '<span class="combo-step" title="' + s + '"><img src="' + icon + '" alt="' + s + '"><b>' + s + '</b></span>'
          : '<span class="combo-step"><b>' + s + '</b></span>';
        return (i>0 ? '<span class="combo-arrow">→</span>' : '') + chip;
      }).join("");
      return '<div class="combo-card">'
        + '<span class="tag" style="margin-bottom:8px; display:inline-block;">' + (COMBO_CATEGORIES[c.category]||"") + '</span>'
        + '<div class="combo-diff">' + dots + '</div>'
        + '<h4 style="margin:0 0 6px; font-size:1.05rem;">' + c.name + '</h4>'
        + '<p style="margin:0; font-size:.88rem; color:var(--ink-soft);"><b>Objetivo:</b> ' + c.goal + '</p>'
        + '<div class="combo-seq">' + seq + '</div>'
        + '<p style="margin:0 0 8px; font-size:.9rem;">' + c.explain + '</p>'
        + '<p style="margin:0; font-size:.85rem; color:var(--rose-600); font-weight:600;">💡 ' + c.tip + '</p>'
        + '</div>';
    }).join("");
  }
  comboTabs.addEventListener("click", function(e){
    const btn = e.target.closest(".combo-tab");
    if(!btn) return;
    activeCategory = btn.dataset.cat;
    renderComboTabs();
    renderCombos();
  });
  renderComboTabs();
  renderCombos();

  /* ============ ACADEMIA — ROADMAP EM NÍVEIS ============ */
  let trainingState = loadJSON(STORE_KEYS.training, {});
  const academyRoot = document.getElementById("academyRoot");
  const TOTAL_TASKS = ACADEMY_LEVELS.reduce(function(sum, lvl){ return sum + lvl.tasks.length; }, 0);

  function levelDone(lvl){ return lvl.tasks.every(function(t){ return !!trainingState[t.id]; }); }
  function levelUnlocked(idx){ return idx === 0 || levelDone(ACADEMY_LEVELS[idx-1]); }

  function renderAcademy(){
    academyRoot.innerHTML = ACADEMY_LEVELS.map(function(lvl, idx){
      const unlocked = levelUnlocked(idx);
      const done = levelDone(lvl);
      const items = lvl.tasks.map(function(t){
        const checked = !!trainingState[t.id];
        return '<div class="day-item' + (checked ? ' done' : '') + '" data-id="' + t.id + '">'
          + '<input type="checkbox" class="day-checkbox" id="chk-' + t.id + '" ' + (checked ? "checked" : "") + (unlocked ? "" : " disabled") + '>'
          + '<label class="day-text" for="chk-' + t.id + '"><b>' + t.title + '</b><span>' + t.desc + '</span></label>'
          + '</div>';
      }).join("");
      return '<div class="level-card' + (unlocked ? '' : ' locked') + (done ? ' level-done' : '') + '">'
        + '<div class="level-head"><span class="level-icon">' + lvl.icon + '</span>'
        + '<div><span class="level-num">NÍVEL ' + (idx+1) + '</span><h4>' + lvl.title + '</h4></div>'
        + (done ? '<span class="level-badge">✓ Completo</span>' : (unlocked ? '' : '<span class="level-badge locked">🔒 Bloqueado</span>'))
        + '</div>'
        + '<div class="day-list">' + items + '</div>'
        + '</div>';
    }).join("");
  }

  function updateMissionBar(){
    const doneCount = Object.keys(trainingState).filter(function(k){ return trainingState[k]; }).length;
    const pct = Math.min(100, Math.round((doneCount / TOTAL_TASKS) * 100));
    const bar = document.getElementById("missionBar");
    const label = document.getElementById("missionLabel");
    if(bar) bar.style.width = pct + "%";
    if(label){
      let stage = "Perdida na jungle";
      if(pct >= 100) stage = "Nidalee main de verdade";
      else if(pct >= 75) stage = "Quase lá";
      else if(pct >= 50) stage = "Pegando o jeito";
      else if(pct >= 25) stage = "Aprendendo a trocar de forma";
      label.textContent = pct + "% — " + stage;
    }
  }

  academyRoot.addEventListener("change", function(e){
    const chk = e.target.closest(".day-checkbox");
    if(!chk) return;
    const item = chk.closest(".day-item");
    trainingState[item.dataset.id] = chk.checked;
    saveJSON(STORE_KEYS.training, trainingState);
    renderAcademy();
    updateMissionBar();
  });
  renderAcademy();
  updateMissionBar();

  /* ============ VIDEOS ============ */
  const CATEGORY_ICON = {
    "Fundamentos":"📘","Jungle":"🌳","Macro":"🗺️","Nidalee":"🐆","Matchups":"🔮"
  };
  const videoGrid = document.getElementById("videoGrid");
  videoGrid.innerHTML = VIDEOS.map(function(v){
    const url = "https://www.youtube.com/results?search_query=" + encodeURIComponent(v.query);
    const icon = CATEGORY_ICON[v.subject] || "🎬";
    return '<a class="video-card" href="' + url + '" target="_blank" rel="noopener">'
      + '<div class="video-thumb"><span style="font-size:2.2rem;">' + icon + '</span></div>'
      + '<div class="video-body">'
      + '<div class="video-meta"><span class="tag">' + v.subject + '</span><span class="tag tag-gold">' + v.difficulty + '</span></div>'
      + '<h4>' + v.topic + '</h4>'
      + '<p>Abre uma busca pronta no YouTube pra você escolher o criador que mais combina com você.</p>'
      + '</div></a>';
  }).join("");

  /* ============ MAPA DA JUNGLE ============
     Data Dragon/CommunityDragon não expõem URLs estáveis e redistribuíveis
     pra arte dos monstros de jungle (só existem pra campeões/itens/runas).
     Pra não arriscar ícone quebrado ou trocado, desenhei um pequeno set de
     glifos vetoriais próprios, coerentes com o resto do sistema de ícones
     do site (mesma técnica dos corações/folhas) — nunca emoji. */
  const CAMP_GLYPH = {
    blue:   '<circle cx="12" cy="12" r="7"/><path d="M12 6c-1.6 2-2.4 3.4-2.4 5A2.4 2.4 0 0012 13.4 2.4 2.4 0 0014.4 11c0-1.6-.8-3-2.4-5z" fill="#fff" opacity=".85"/>',
    red:    '<path d="M12 2c1 3-1 4-1 6.5A2.5 2.5 0 0013.5 11 2.7 2.7 0 0016 8.3c1.6 2 2.5 4 2.5 6.2A6.5 6.5 0 015.5 14.5c0-4 2.8-6.6 6.5-12.5z"/>',
    gromp:  '<ellipse cx="12" cy="14" rx="8" ry="6"/><circle cx="8.5" cy="9" r="1.6"/><circle cx="15.5" cy="9" r="1.6"/><circle cx="8.5" cy="9" r=".6" fill="#3a1424"/><circle cx="15.5" cy="9" r=".6" fill="#3a1424"/>',
    wolves: '<path d="M4 20c1-6 3-9 8-9s7 3 8 9c-2-1-4-2-8-2s-6 1-8 2z"/><path d="M6 11l2-5 2 4M18 11l-2-5-2 4"/>',
    raptors:'<path d="M12 3l2 6 6 1-5 4 2 6-5-4-5 4 2-6-5-4 6-1z"/>',
    krugs:  '<path d="M3 19l4-9 3 5 3-7 3 6 4-8 4 13z"/>',
    scuttle:'<ellipse cx="12" cy="13" rx="6.5" ry="5"/><path d="M4 10l-2-2M20 10l2-2M4 16l-2 2M20 16l2 2M8 8l-1-3M16 8l1-3" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/>',
    dragon: '<path d="M12 2c2.5 2 4 5 4 8 2-1 3-1 4 0-1 3-3 4-5 4.5.6 1.4.4 3-1 4.5-1-1.6-1.6-2.3-2-2.3s-1 .7-2 2.3c-1.4-1.5-1.6-3.1-1-4.5-2-.5-4-1.5-5-4.5 1-1 2-1 4 0 0-3 1.5-6 4-8z"/>',
    herald: '<path d="M2 12c3-4.5 6.5-6.5 10-6.5S19 7.5 22 12c-3 4.5-6.5 6.5-10 6.5S5 16.5 2 12z"/><circle cx="12" cy="12" r="3" fill="#3a1424"/>',
    grubs:  '<ellipse cx="9" cy="12" rx="4.5" ry="3.2"/><ellipse cx="15.5" cy="12" rx="3.6" ry="2.6"/><ellipse cx="19.5" cy="12" rx="2.4" ry="1.8"/>',
    baron:  '<path d="M3 8l4 3 5-6 5 6 4-3-2 10H5z"/><circle cx="12" cy="6" r="1.4"/>'
  };
  function campIconSvg(id, size){
    return '<svg viewBox="0 0 24 24" fill="currentColor" style="width:' + size + 'px;height:' + size + 'px;">' + (CAMP_GLYPH[id]||'') + '</svg>';
  }

  const jungleMapRoot = document.getElementById("jungleMapRoot");
  let activePath = 0;
  function renderJungleMap(){
    const camps = Object.keys(JUNGLE_CAMPS).map(function(key){ return JUNGLE_CAMPS[key]; });
    const pathTabs = JUNGLE_PATHS.map(function(p, i){
      return '<button type="button" class="combo-tab' + (i === activePath ? " active" : "") + '" data-path="' + i + '">' + p.name + '</button>';
    }).join("");
    const path = JUNGLE_PATHS[activePath];
    const routeHtml = path.route.map(function(campId, i){
      const c = JUNGLE_CAMPS[campId];
      return (i>0 ? '<span class="combo-arrow">→</span>' : '') + '<span class="combo-step camp-chip-' + c.id + '">' + campIconSvg(c.id, 18) + '<b>' + c.name + '</b></span>';
    }).join("");
    const campsHtml = camps.map(function(c){
      const onRoute = path.route.indexOf(c.id) !== -1;
      return '<button type="button" class="camp-card camp-tone-' + c.id + (onRoute ? ' on-route' : '') + '" data-camp="' + c.id + '">'
        + '<span class="camp-icon">' + campIconSvg(c.id, 26) + '</span>'
        + '<span class="camp-name">' + c.name + '</span>'
        + '<span class="tag camp-risk-' + c.risk.replace("í","i") + '">' + c.risk + '</span>'
        + '</button>';
    }).join("");
    jungleMapRoot.innerHTML =
      '<div class="rift-schematic">' + riftSvg(path) + '</div>'
      + '<div class="combo-tab-row" style="margin-top:22px;">' + pathTabs + '</div>'
      + '<p class="phase-intro" style="margin-top:14px;">' + path.desc + '</p>'
      + '<div class="jungle-route">' + routeHtml + '</div>'
      + '<div class="camps-grid">' + campsHtml + '</div>'
      + '<div class="camp-detail" id="campDetail"></div>';
  }

  /* Coordenadas aproximadas (não são as coordenadas exatas do mapa oficial —
     é um esquema didático) num viewBox 0–300, formato diamante da Rift. */
  const CAMP_POS = {
    blue:{x:78,y:150}, gromp:{x:48,y:112}, wolves:{x:96,y:96}, raptors:{x:150,y:70},
    red:{x:150,y:150}, krugs:{x:110,y:200}, scuttle:{x:150,y:220}, dragon:{x:210,y:250},
    herald:{x:90,y:50}, grubs:{x:150,y:280}, baron:{x:60,y:40}
  };
  function riftSvg(path){
    const routePts = path.route.map(function(id){ return CAMP_POS[id]; }).filter(Boolean);
    const routeD = routePts.length ? routePts.map(function(p,i){ return (i===0?"M":"L") + p.x + "," + p.y; }).join(" ") : "";
    const markers = Object.keys(CAMP_POS).map(function(id){
      const p = CAMP_POS[id]; const c = JUNGLE_CAMPS[id];
      const onRoute = path.route.indexOf(id) !== -1;
      return '<g class="rift-marker camp-tone-' + id + (onRoute?' on-route':'') + '" data-camp="' + id + '" transform="translate(' + p.x + ',' + p.y + ')" role="button" tabindex="0">'
        + '<circle r="13" class="rift-marker-bg"></circle>'
        + '<foreignObject x="-8" y="-8" width="16" height="16">' + campIconSvg(id, 16) + '</foreignObject>'
        + '</g>';
    }).join("");
    return '<svg viewBox="0 0 300 300" class="rift-svg" xmlns="http://www.w3.org/2000/svg">'
      + '<polygon points="20,150 150,20 280,150 150,280" class="rift-outline"></polygon>'
      + '<path d="M150,20 L280,150 L150,280" class="rift-lane rift-lane-top"></path>'
      + '<path d="M150,20 L20,150 L150,280" class="rift-lane rift-lane-bot"></path>'
      + '<path d="M20,150 L280,150" class="rift-river"></path>'
      + (routeD ? '<path d="' + routeD + '" class="rift-route"></path>' : '')
      + markers
      + '</svg>';
  }

  function showCampDetail(campId){
    const c = JUNGLE_CAMPS[campId];
    const detail = document.getElementById("campDetail");
    if(!c || !detail) return;
    detail.innerHTML = '<div class="camp-detail-inner">'
      + '<div class="camp-detail-head">' + campIconSvg(c.id, 34) + '<h4>' + c.name + '</h4><span class="tag camp-risk-' + c.risk.replace("í","i") + '">risco ' + c.risk + '</span></div>'
      + '<div class="ability-grid-inner">'
      + '<div class="ability-box"><b>O que é</b>' + c.what + '</div>'
      + '<div class="ability-box"><b>Quando fazer</b>' + c.when + '</div>'
      + '</div>'
      + '<div class="ability-box" style="margin-top:10px;"><b>Dica de Nidalee</b>' + c.tip + '</div>'
      + '<div class="ability-box" style="margin-top:10px;"><b>Próximo passo sugerido</b>' + c.next + '</div>'
      + '</div>';
    detail.classList.add("show");
  }
  jungleMapRoot.addEventListener("click", function(e){
    const pathBtn = e.target.closest("[data-path]");
    if(pathBtn){ activePath = parseInt(pathBtn.dataset.path, 10); renderJungleMap(); return; }
    const campBtn = e.target.closest(".camp-card, .rift-marker");
    if(campBtn){ showCampDetail(campBtn.dataset.camp); }
  });
  renderJungleMap();

  /* ============ BUSCA DE CAMPEÃO (reutilizável) ============ */
  function attachChampionSearch(input, resultsEl, nameList, onSelect){
    input.addEventListener("input", function(){
      const q = input.value.trim().toLowerCase();
      if(!q){ resultsEl.classList.remove("open"); resultsEl.innerHTML = ""; return; }
      const matches = nameList.filter(function(n){ return n.toLowerCase().indexOf(q) !== -1; }).slice(0, 8);
      if(!matches.length){ resultsEl.classList.remove("open"); resultsEl.innerHTML = ""; return; }
      resultsEl.innerHTML = matches.map(function(n){
        const icon = champIcon(n);
        const c = CHAMPIONS[n];
        const roleTag = c ? '<em>' + (ROLE_LABEL_PT[c.role]||c.role) + '</em>' : '';
        return '<li><button type="button" data-name="' + esc(n) + '">' + (icon ? '<img src="' + icon + '" alt="" loading="lazy">' : '') + '<span>' + esc(n) + '</span>' + roleTag + '</button></li>';
      }).join("");
      resultsEl.classList.add("open");
    });
    resultsEl.addEventListener("click", function(e){
      const btn = e.target.closest("button[data-name]");
      if(!btn) return;
      onSelect(btn.dataset.name);
      resultsEl.classList.remove("open");
      resultsEl.innerHTML = "";
      input.value = "";
    });
    document.addEventListener("click", function(e){
      if(!e.target.closest(".matchup-search") && !e.target.closest(".slot-search")) resultsEl.classList.remove("open");
    });
  }

  /* ============ RENUAS/BUILD VISUAL (compartilhado) ============ */
  function buildBlockHtml(){
    const b = CURRENT_BUILD;
    const itemsHtml = b.items.map(function(it){
      return '<span class="item-chip" title="' + esc(it.name) + '"><img src="' + itemIcon(it.id) + '" alt="' + esc(it.name) + '"></span>';
    }).join('<span class="combo-arrow">→</span>');
    return '<div class="matchup-block">'
      + '<h5>Runas</h5>'
      + '<div class="rune-row">'
      + '<img class="rune-tree-icon" src="' + b.runesPrimaryTree.icon + '" alt="' + b.runesPrimaryTree.name + '">'
      + '<div><div class="rune-line"><b>' + b.runesPrimaryTree.name + ':</b> ' + b.runesPrimary.join(", ") + '</div>'
      + '<div class="rune-line"><b>' + b.runesSecondaryTree.name + ':</b> ' + b.runesSecondary.join(", ") + '</div>'
      + '<div class="rune-line" style="opacity:.75;">Shards: ' + b.shards.join(", ") + '</div></div>'
      + '</div>'
      + '<h5 style="margin-top:16px;">Build</h5>'
      + '<div class="item-row"><span class="item-chip" title="' + esc(b.startItem.name) + '"><img src="' + itemIcon(b.startItem.id) + '" alt=""></span>'
      + '<span class="combo-arrow">→</span>' + itemsHtml + '</div>'
      + '<p class="patch-note" style="margin-top:10px;">Referência de meta atual (<span class="js-patch">' + CURRENT_PATCH + '</span>), agregado de fontes como op.gg, Mobalytics, U.GG e Lolalytics.</p>'
      + '</div>';
  }

  /* ============ MATCHUPS — ANALISADOR DA JUNGLE ============ */
  const matchupSearch = document.getElementById("matchupSearch");
  const matchupResults = document.getElementById("matchupResults");
  const matchupChips = document.getElementById("matchupChips");
  const matchupPanel = document.getElementById("matchupPanel");

  const FEATURED_JUNGLERS = ["Rengar","Lee Sin","Kha'Zix","Viego","Kayn","Kindred","Graves","Vi","Evelynn","Hecarim"];
  matchupChips.innerHTML = FEATURED_JUNGLERS.map(function(n){
    return '<button type="button" class="matchup-chip" data-name="' + esc(n) + '">' + esc(n) + '</button>';
  }).join("");

  function openMatchup(name){
    const detailed = MATCHUPS[name];
    const champ = CHAMPIONS[name];
    const isJungle = champ && champ.role === "jungle";
    const m = detailed || (champ ? GENERIC_MATCHUP_BY_ROLE[champ.role] : null);
    if(!m) return;
    const icon = champIcon(name);
    const roleNote = (!isJungle && champ)
      ? '<p class="mistake-box" style="background:var(--cream-2); border-left-color:var(--rose-400);"><b>Sobre esse confronto:</b> ' + esc(name) + ' joga na rota de ' + (ROLE_LABEL_PT[champ.role]||champ.role) + ', então esse não é um matchup direto de jungle contra jungle — mas ele ainda impacta sua partida da forma abaixo.</p>'
      : '';
    matchupPanel.innerHTML =
      '<div class="matchup-header">'
      + '<div style="display:flex; align-items:center; gap:14px;">'
      + (icon ? '<img class="matchup-portrait" src="' + icon + '" alt="' + esc(name) + '">' : '')
      + '<div><div class="eyebrow" style="margin:0;">NIDALEE VS</div><h3 class="matchup-title">' + esc(name) + '</h3></div>'
      + '</div>'
      + '<span class="danger-badge danger-' + m.danger + '">' + dangerLabel(m.danger) + '</span>'
      + '</div>'
      + roleNote
      + '<div class="matchup-grid">'
      + '<div class="matchup-block"><h5>Estratégia</h5><ul>' + m.strategy.map(function(s){ return '<li>' + s + '</li>'; }).join("") + '</ul></div>'
      + buildBlockHtml()
      + '</div>'
      + '<div class="matchup-grid" style="margin-top:6px;">'
      + '<div class="matchup-block"><h5>⚠️ Perigos</h5><ul>' + m.dangers.map(function(s){ return '<li>' + s + '</li>'; }).join("") + '</ul></div>'
      + '</div>'
      + '<div class="mistake-box"><b>Erro comum:</b> ' + m.mistakes + '</div>';
    matchupPanel.classList.add("show");
    matchupPanel.scrollIntoView({behavior:"smooth", block:"nearest"});
  }
  function dangerLabel(d){ return d === "alto" ? "DIFICULDADE ALTA" : d === "medio" ? "DIFICULDADE MÉDIA" : "DIFICULDADE BAIXA"; }

  attachChampionSearch(matchupSearch, matchupResults, CHAMPION_NAMES, openMatchup);
  matchupChips.addEventListener("click", function(e){
    const btn = e.target.closest(".matchup-chip");
    if(btn) openMatchup(btn.dataset.name);
  });

  /* ============ CHEAT SHEET RÁPIDO ============ */
  const cheatGrid = document.getElementById("cheatGrid");
  cheatGrid.innerHTML = Object.keys(CHEAT_SHEET).map(function(title){
    const items = CHEAT_SHEET[title].map(function(t){
      return '<li>' + CHECK_SVG.replace("<svg ", '<svg class="cheat-check-icon" ') + '<span>' + t + '</span></li>';
    }).join("");
    return '<div class="cheat-card"><h4>' + title + '</h4><ul>' + items + '</ul></div>';
  }).join("");

  /* ============ DICAS ============ */
  const dicasGrid = document.getElementById("dicasGrid");
  dicasGrid.innerHTML = DICAS.map(function(d){ return '<div class="dica-card">"' + d + '"</div>'; }).join("");

  /* ============ ANALISADOR DE COMPOSIÇÃO — CHEAT SHEET AVANÇADA ============ */
  const ROLE_LABELS = { top:"TOP", jungle:"JUNGLE", mid:"MID", adc:"ADC", support:"SUPPORT" };
  const teamState = { my: {top:null,jungle:"Nidalee",mid:null,adc:null,support:null}, enemy: {top:null,jungle:null,mid:null,adc:null,support:null} };

  const cheatBuilderRoot = document.getElementById("cheatBuilderRoot");
  function slotHtml(side, role){
    const val = teamState[side][role];
    const locked = side === "my" && role === "jungle";
    const icon = val ? champIcon(val) : null;
    return '<div class="team-slot" data-side="' + side + '" data-role="' + role + '">'
      + '<span class="team-slot-label">' + ROLE_LABELS[role] + '</span>'
      + (locked
        ? '<div class="slot-filled"><img src="' + championIcon("Nidalee") + '" onerror="this.style.display=\'none\'" alt=""><span>Nidalee (você)</span></div>'
        : (val
          ? '<div class="slot-filled">' + (icon ? '<img src="' + icon + '" alt="">' : '') + '<span>' + esc(val) + '</span><button type="button" class="slot-clear" data-side="' + side + '" data-role="' + role + '">✕</button></div>'
          : '<div class="slot-search"><input type="text" placeholder="Pesquisar campeão..." data-side="' + side + '" data-role="' + role + '"><ul class="matchup-list slot-results"></ul></div>'))
      + '</div>';
  }
  function renderTeamSlots(){
    const roles = ["top","jungle","mid","adc","support"];
    cheatBuilderRoot.innerHTML =
      '<div class="team-columns">'
      + '<div class="team-col"><h4 class="team-col-title">🩵 Meu time</h4>' + roles.map(function(r){ return slotHtml("my", r); }).join("") + '</div>'
      + '<div class="team-col"><h4 class="team-col-title">🔺 Time inimigo</h4>' + roles.map(function(r){ return slotHtml("enemy", r); }).join("") + '</div>'
      + '</div>'
      + '<button type="button" class="btn" id="analyzeBtn" style="margin-top:22px;">🔮 Analisar partida</button>'
      + '<div id="compositionAnalysis"></div>';
    cheatBuilderRoot.querySelectorAll(".slot-search input").forEach(function(input){
      const resultsEl = input.parentElement.querySelector(".slot-results");
      attachChampionSearch(input, resultsEl, CHAMPION_NAMES, function(name){
        teamState[input.dataset.side][input.dataset.role] = name;
        renderTeamSlots();
      });
    });
  }
  cheatBuilderRoot.addEventListener("click", function(e){
    const clearBtn = e.target.closest(".slot-clear");
    if(clearBtn){ teamState[clearBtn.dataset.side][clearBtn.dataset.role] = null; renderTeamSlots(); return; }
    if(e.target.id === "analyzeBtn"){ renderAnalysis(); }
  });
  renderTeamSlots();

  function filledCount(side){
    return Object.keys(teamState[side]).filter(function(r){ return !!teamState[side][r]; }).length;
  }
  function tagCount(side, tag){
    return Object.keys(teamState[side]).reduce(function(sum, r){
      const name = teamState[side][r];
      if(!name) return sum;
      const c = CHAMPIONS[name];
      return sum + (c && c.tags.indexOf(tag) !== -1 ? 1 : 0);
    }, 0);
  }
  function renderAnalysis(){
    const out = document.getElementById("compositionAnalysis");
    if(filledCount("my") < 2 || filledCount("enemy") < 2){
      out.innerHTML = '<p class="phase-intro" style="margin-top:18px;">Preencha pelo menos alguns campeões dos dois times pra gerar a análise. Quanto mais completo, melhor a leitura.</p>';
      return;
    }
    const insights = [];
    const myAp = tagCount("my","ap"), myAd = tagCount("my","ad");
    const myEngage = tagCount("my","engage"), myTank = tagCount("my","tank");
    const enEngage = tagCount("enemy","engage"), enDive = tagCount("enemy","dive"), enMobi = tagCount("enemy","mobilidade");
    const enJungle = teamState.enemy.jungle;

    if(myAp >= 3) insights.push({c:"🟢", t:"Seu time tem bastante dano mágico — priorize itens mágicos no inimigo e evite lutas onde ele resiste fácil a esse tipo de dano."});
    if(myAd >= 3) insights.push({c:"🟢", t:"Seu time é majoritariamente físico — cuidado com tanques de armadura alta do lado inimigo."});
    if(myTank === 0) insights.push({c:"🔴", t:"Seu time tem pouca frontline — evite entrar em teamfight primeiro, procure flanquear com o combo."});
    if(enEngage + enDive >= 3) insights.push({c:"🔴", t:"O time inimigo tem muito engajamento — jogue mais cauteloso em pick e evite ficar isolada."});
    if(enJungle){
      const m = MATCHUPS[enJungle];
      if(m) insights.push({c: m.danger === "alto" ? "🔴" : m.danger === "baixo" ? "🟢" : "🟡", t: "Jungler inimigo (" + enJungle + "): " + m.strategy[0]});
    }
    if(enMobi >= 3) insights.push({c:"🟡", t:"O time inimigo tem muita mobilidade — tenha cuidado ao tentar perseguir alvos, prefira pegar quem ficar isolado."});
    insights.push({c:"🔵", t:"Priorize objetivos onde seu time tem prioridade de lane, e use a lança pra confirmar visão antes de contestar."});
    insights.push({c:"🟣", t:"Onde jogar: com esse cenário, foque em farmar vantagem cedo e procurar ganks nas lanes com maior prioridade, alternando forma humana/puma conforme a distância do alvo."});

    out.innerHTML = '<div class="analysis-box"><h4 style="margin-top:0;">🔮 Análise da partida</h4>'
      + insights.map(function(i){ return '<div class="analysis-line"><span>' + i.c + '</span><p>' + i.t + '</p></div>'; }).join("")
      + '</div>';
  }

  /* ============ CHECKLIST DE OBSERVAÇÃO ============ */
  const SCOUT_EXPLANATIONS = [
    "Compare os dois junglers no Analisador acima — quem tem clear mais rápido e mais dano cedo costuma sair na frente.",
    "Junglers com habilidades em área (como Raptors/Krugs favoráveis) limpam mais rápido — isso libera tempo pra gankar antes.",
    "Veja o matchup do jungler inimigo: dificuldade alta no Analisador normalmente significa que ele consegue invadir você com segurança.",
    "Olhe as lanes: quem empurra mais rápido ou tem mais dano cedo costuma ter prioridade pra ir ajudar em outro lugar.",
    "Lanes com pouca mobilidade de fuga (sem dash/flash cedo) são mais fáceis de gankar com sucesso.",
    "Composições com muito dano mágico ou físico consistente tendem a escalar melhor pro late game — fique de olho nisso na análise.",
    "A maior ameaça geralmente é quem tem mais engajamento ou mobilidade no time inimigo — o Analisador já aponta isso.",
    "Priorize o objetivo onde seu time tem mais prioridade de lane ou já está com vantagem numérica.",
    "Volte no Analisador da Jungle e veja qual matchup individual está pior avaliado (dificuldade alta) pra pedir ajuda no chat.",
    "Pense no último lugar onde ele foi visto e na direção do desaparecimento — geralmente ele está pathing pro lado oposto.",
    "A lane com prioridade e sem visão do lado inimigo é normalmente a mais segura pra gankar primeiro.",
    "Coloque visão nas entradas da sua jungle e nas moitas do rio — são os pontos mais usados pra invasão.",
    "Só contest o dragão com visão do time inimigo e prioridade de lane — objetivo sem visão costuma virar troca ruim.",
    "As Vastilarvas valem pressão, mas não valem morrer se um dragão real estiver sendo disputado ao mesmo tempo.",
    "Não lute se o time inimigo tem mais engajamento, se você não tem visão do jungler dele, ou se está sozinha sem escape."
  ];
  const scoutRoot = document.getElementById("scoutChecklist");
  if(scoutRoot){
    scoutRoot.innerHTML = SCOUT_CHECKLIST.map(function(q, i){
      return '<div class="scout-item" data-idx="' + i + '">'
        + '<div class="scout-item-head"><span class="scout-box"></span><span class="scout-text">' + q + '</span></div>'
        + '<p class="scout-explain">' + (SCOUT_EXPLANATIONS[i] || "") + '</p>'
        + '</div>';
    }).join("");
    scoutRoot.addEventListener("click", function(e){
      const item = e.target.closest(".scout-item");
      if(!item) return;
      item.classList.toggle("open");
    });
  }

  /* ============ TRIBUNAL DAS SKINS (com splash real) ============ */
  let skinRatings = loadJSON(STORE_KEYS.skins, {});
  const skinsGrid = document.getElementById("skinsGrid");
  const VERDICTS = { 1: "Pode devolver para a loja.", 2: "Não me convenceu.", 3: "Até que vai.", 4: "Muito bonita.", 5: "PERFEITA." };

  function starsMarkup(rating, size){
    let html = "";
    for(let i=1;i<=5;i++){
      html += '<span style="display:inline-flex;">' + STAR_SVG.replace("<svg ", '<svg style="width:' + size + 'px;height:' + size + 'px;color:' + (i<=rating ? "var(--gold-500)" : "var(--line)") + ';" ') + '</span>';
    }
    return html;
  }

  function renderSkins(){
    skinsGrid.innerHTML = SKINS.map(function(s){
      const rating = skinRatings[s.name] || 0;
      const starButtons = [1,2,3,4,5].map(function(n){
        return '<button class="star-btn' + (n<=rating ? ' filled' : '') + '" data-skin="' + encodeURIComponent(s.name) + '" data-value="' + n + '" aria-label="Dar nota ' + n + '">' + STAR_SVG + '</button>';
      }).join("");
      return '<div class="skin-card" data-open="' + encodeURIComponent(s.name) + '">'
        + '<div class="skin-visual"><img src="' + loadingUrl(s.num) + '" alt="' + esc(s.name) + '" loading="lazy"></div>'
        + '<div class="skin-body">'
        + '<h4>' + s.name + '</h4>'
        + '<div class="skin-price">' + (s.price ? s.price + " RP" : "gratuita") + ' · ' + s.year + '</div>'
        + '<div class="stars" data-stars-for="' + encodeURIComponent(s.name) + '">' + starButtons + '</div>'
        + '<div class="skin-verdict">' + (rating ? VERDICTS[rating] : "") + '</div>'
        + '</div></div>';
    }).join("");
    updateTribunalStats();
  }

  function setRating(name, value){
    skinRatings[name] = value;
    saveJSON(STORE_KEYS.skins, skinRatings);
    renderSkins();
    renderRanking();
  }

  skinsGrid.addEventListener("click", function(e){
    const starBtn = e.target.closest(".star-btn");
    if(starBtn){
      e.stopPropagation();
      const name = decodeURIComponent(starBtn.dataset.skin);
      setRating(name, parseInt(starBtn.dataset.value, 10));
      return;
    }
    const card = e.target.closest(".skin-card");
    if(card){ openJudgment(decodeURIComponent(card.dataset.open)); }
  });

  function updateTribunalStats(){
    const names = SKINS.map(function(s){ return s.name; });
    const judged = names.filter(function(n){ return skinRatings[n]; });
    document.getElementById("statJudged").textContent = judged.length + "/" + names.length;
    if(judged.length){
      const avg = judged.reduce(function(sum, n){ return sum + skinRatings[n]; }, 0) / judged.length;
      document.getElementById("statAvg").textContent = avg.toFixed(1) + " ★";
      let favName = judged[0], favVal = skinRatings[favName];
      judged.forEach(function(n){ if(skinRatings[n] > favVal){ favVal = skinRatings[n]; favName = n; } });
      document.getElementById("statFav").textContent = favName;
    } else {
      document.getElementById("statAvg").textContent = "—";
      document.getElementById("statFav").textContent = "—";
    }
  }

  function renderRanking(){
    const rankBox = document.getElementById("rankingList");
    const rated = SKINS.filter(function(s){ return skinRatings[s.name]; })
      .sort(function(a,b){
        const diff = skinRatings[b.name] - skinRatings[a.name];
        return diff !== 0 ? diff : a.name.localeCompare(b.name);
      });
    if(!rated.length){
      rankBox.innerHTML = '<p style="color:var(--ink-soft); font-size:.9rem;">Nenhuma skin julgada ainda — comece dando notas lá em cima. ♡</p>';
      return;
    }
    rankBox.innerHTML = rated.map(function(s, i){
      const podium = i===0?"🥇":i===1?"🥈":i===2?"🥉":"";
      return '<div class="rank-row"><span class="rank-pos">' + podium + (podium?"":(i+1)) + '</span>'
        + '<img class="rank-thumb" src="' + loadingUrl(s.num) + '" alt="">'
        + '<span class="rank-name">' + s.name + '</span><span class="rank-stars">' + starsMarkup(skinRatings[s.name], 15) + '</span></div>';
    }).join("");
  }

  /* ---------- JUDGMENT MODAL ---------- */
  const overlay = document.getElementById("judgmentOverlay");
  const judgmentClose = document.getElementById("judgmentClose");
  let currentJudgmentSkin = null;

  function openJudgment(name){
    currentJudgmentSkin = name;
    const skin = SKINS.find(function(s){ return s.name === name; });
    document.getElementById("judgmentSkinName").textContent = name;
    document.getElementById("judgmentResult").textContent = "";
    document.getElementById("judgmentSplash").innerHTML = skin ? '<img src="' + splashUrl(skin.num) + '" alt="">' : "";
    const rating = skinRatings[name] || 0;
    renderJudgmentStars(rating);
    overlay.classList.add("show");
  }
  function renderJudgmentStars(rating){
    const starsEl = document.getElementById("judgmentStars");
    starsEl.innerHTML = [1,2,3,4,5].map(function(n){
      return '<button class="star-btn' + (n<=rating ? ' filled' : '') + '" data-value="' + n + '" aria-label="Dar nota ' + n + '">' + STAR_SVG + '</button>';
    }).join("");
  }
  document.getElementById("judgmentStars").addEventListener("click", function(e){
    const btn = e.target.closest(".star-btn");
    if(!btn || !currentJudgmentSkin) return;
    const value = parseInt(btn.dataset.value, 10);
    setRating(currentJudgmentSkin, value);
    renderJudgmentStars(value);
    document.getElementById("judgmentResult").textContent = "VEREDITO REGISTRADO — " + VERDICTS[value];
  });
  judgmentClose.addEventListener("click", function(){ overlay.classList.remove("show"); });
  overlay.addEventListener("click", function(e){ if(e.target === overlay) overlay.classList.remove("show"); });
  document.addEventListener("keydown", function(e){ if(e.key === "Escape") overlay.classList.remove("show"); });

  renderSkins();
  renderRanking();

  /* ============ EASTER EGG ============ */
  const toast = document.getElementById("egg-toast");
  let toastTimer = null;
  function showEggToast(msg){
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toast.classList.remove("show"); }, 3200);
  }
  let alertShown = false;
  const tribunalSection = document.getElementById("tribunal");
  const alertObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting && !alertShown){
        alertShown = true;
        setTimeout(function(){
          showEggToast("⚠️ ALERTA ⚠️ O jungler inimigo foi visto no mapa. Não faça as Vastilarvas.");
        }, 1800);
      }
    });
  }, {threshold:.4});
  if(tribunalSection) alertObserver.observe(tribunalSection);

  /* ============ SCROLL REVEAL ============ */
  const revealTargets = document.querySelectorAll(".card, .ability-card, .combo-card, .skin-card, .gloss-item, .day-item, .level-card, .camp-card");
  if("IntersectionObserver" in window){
    const io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.style.transition = "opacity .5s ease, transform .5s ease";
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
          io.unobserve(e.target);
        }
      });
    }, {threshold:.12});
    revealTargets.forEach(function(t){
      t.style.opacity = "0";
      t.style.transform = "translateY(10px)";
      io.observe(t);
    });
  }

})();
