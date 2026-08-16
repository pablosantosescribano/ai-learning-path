/* ============ ICONS ============ */
const SVG = {
  mobile: '<svg viewBox="0 0 24 24" fill="none"><rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" stroke-width="1.7"/><line x1="10" y1="18" x2="14" y2="18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  tablet: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.7"/><line x1="10" y1="18" x2="14" y2="18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  desktop: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="12" rx="1.5" stroke="currentColor" stroke-width="1.7"/><line x1="8" y1="20" x2="16" y2="20" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><line x1="12" y1="16" x2="12" y2="20" stroke="currentColor" stroke-width="1.7"/></svg>'
};
const DEVICE_TIP = {
  mobile: 'Comfortable on mobile.',
  tablet: 'Works well on tablet.',
  desktop: 'Best on desktop: recommended when notebooks or code are involved.'
};
const LANG_TIP = {
  EN: 'Content in English.',
  ES: 'Content in Spanish.',
  MULTI: 'Available in several languages.'
};
const STATUS_LABEL = {checking:'⋯', verified:'✓', unavailable:'!', unknown:'?', nolink:'–'};
const STATUS_TIP = {
  checking: 'Checking link status…',
  verified: 'Verified — it responded when the page loaded.',
  unavailable: 'Temporarily unavailable — it did not respond when the page loaded. It may still work; try opening it directly.',
  unknown: 'Could not verify automatically — the browser or environment blocked the check.',
  nolink: 'No direct link — reference mentioned in the path.'
};

const BLOCK_NAMES = {A:'Foundations', B:'Building', C:'Trust', D:'Business'};
let currentRoute = 'complete';
let bankOn = true;

function shieldSVG(routeKey, size){
  const r = ROUTES[routeKey];
  const uid = 'clip-'+routeKey+'-'+Math.random().toString(36).slice(2,7);
  const col = (level) => level==='full' ? r.color : (level==='partial' ? r.color : 'var(--border)');
  const op = (level) => level==='full' ? '1' : (level==='partial' ? '0.4' : '1');
  const shieldPath = 'M50 4 L92 18 L92 58 C92 92 70 112 50 118 C30 112 8 92 8 58 L8 18 Z';
  return `
  <svg class="shield" viewBox="0 0 100 120" width="${size||56}" height="${size*1.14||64}">
    <defs><clipPath id="${uid}"><path d="${shieldPath}"/></clipPath></defs>
    <g clip-path="url(#${uid})">
      <rect x="0" y="0" width="50" height="60" fill="${col(r.blocks.A)}" opacity="${op(r.blocks.A)}"/>
      <rect x="50" y="0" width="50" height="60" fill="${col(r.blocks.B)}" opacity="${op(r.blocks.B)}"/>
      <rect x="0" y="60" width="50" height="60" fill="${col(r.blocks.C)}" opacity="${op(r.blocks.C)}"/>
      <rect x="50" y="60" width="50" height="60" fill="${col(r.blocks.D)}" opacity="${op(r.blocks.D)}"/>
    </g>
    <path d="${shieldPath}" fill="none" stroke="var(--border)" stroke-width="2.5"/>
    <text x="50" y="68" font-size="30" text-anchor="middle" dominant-baseline="middle">${r.emoji}</text>
  </svg>`;
}

const seenState = {};
const notesState = {};
const attachState = {};
const skipState = {};
const gateState = {};

/* ============ HELPERS: leaf iteration ============ */
function leafModules(){
  let leaves = [];
  MODULES.forEach(m=>{
    if(m.children) leaves = leaves.concat(m.children);
    else leaves.push(m);
  });
  return leaves;
}
function allModulesFlat(){
  const out = [];
  MODULES.forEach(m=>{ out.push(m); if(m.children) out.push(...m.children); });
  return out;
}
/* A module counts toward progress only if it's relevant to the currently selected route
   (its block isn't marked 'none' for that route) and, if it's banking-only content, only
   when the banking toggle is on. Modules with no block (setup, capstone, reference, etc.)
   are always relevant regardless of route. */
function isModuleRelevant(m){
  if(m.bank && !bankOn) return false;
  if(m.block && ROUTES[currentRoute].blocks[m.block] === 'none') return false;
  return true;
}
function relevantLeafModules(){
  return leafModules().filter(isModuleRelevant);
}
function totalResources(){
  let t = 0;
  relevantLeafModules().forEach(m => t += (m.resources||[]).filter(r=>r.url).length);
  return t;
}
function seenCount(){
  let c = 0;
  relevantLeafModules().forEach(m => (m.resources||[]).forEach(r=>{ if(r.url && seenState[r.id]) c++; }));
  return c;
}
function moduleProgress(m){
  if(!isModuleRelevant(m)) return null;
  const list = m.children ? m.children.filter(isModuleRelevant).reduce((acc,c)=>acc.concat(c.resources||[]), []) : (m.resources||[]);
  const withUrl = list.filter(r=>r.url);
  if(withUrl.length===0) return null;
  const seen = withUrl.filter(r=>seenState[r.id]).length;
  return {seen, total: withUrl.length};
}

/* ============ LEVEL SYSTEM ============ */
function computeLevel(){
  const total = totalResources();
  const seen = seenCount();
  const pct = total ? seen/total : 0;
  const skipped = Object.values(skipState).filter(Boolean).length;
  const checkpointsFilled = allModulesFlat().filter(m=>m.checkpoint && notesState[m.id] && notesState[m.id].trim().length>10).length;
  if(pct >= 0.95 && checkpointsFilled >= 5) return {emoji:'🏗', name:'Builder', idx:2};
  if(pct >= 0.5) return {emoji:'🛠', name:'Practitioner', idx:1};
  if(pct > 0 || skipped>0) return {emoji:'🧭', name:'Explorer', idx:0};
  return {emoji:'·', name:'Not started', idx:-1};
}

function renderLevelCard(){
  const lvl = computeLevel();
  const total = totalResources();
  const seen = seenCount();
  const pct = total ? Math.round(seen/total*100) : 0;
  const card = document.getElementById('levelCard');
  card.innerHTML = `
    <div class="level-top">
      <span class="level-badge" style="font-size:28px; display:flex; align-items:center; justify-content:center;">${lvl.emoji}</span>
      <div>
        <div class="level-name">${lvl.name}</div>
        <div class="level-sub">${ROUTES[currentRoute].name} path · ${pct}%</div>
      </div>
    </div>
    <div class="level-next">Progress, level, and path are saved in this browser. Use "Copy summary" to bring it to your shared team table.</div>
    <button type="button" class="copy-btn" id="copyLevelBtn">Copy summary</button>
  `;
  document.getElementById('copyLevelBtn').addEventListener('click', (e)=>{
    const txt = `${lvl.emoji} ${lvl.name} — ${ROUTES[currentRoute].name} path · ${pct}% complete · ${new Date().toLocaleDateString('en-GB')}`;
    navigator.clipboard.writeText(txt).then(()=>{
      e.target.textContent = 'Copied ✓';
      e.target.classList.add('copied');
      setTimeout(()=>{ e.target.textContent='Copy summary'; e.target.classList.remove('copied'); }, 1800);
    }).catch(()=>{});
  });
}

/* ============ ROUTE SELECTOR ============ */
function renderRouteGrid(){
  const grid = document.getElementById('routeGrid');
  grid.innerHTML = '';
  Object.keys(ROUTES).forEach(key=>{
    const r = ROUTES[key];
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'route-card' + (currentRoute===key ? ' selected' : '');
    card.style.borderColor = currentRoute===key ? r.color : '';
    card.innerHTML = `
      ${shieldSVG(key, 56)}
      <div class="route-name">${r.name}</div>
      <div class="route-hours">${r.hours}</div>
      <div class="route-best-for">${r.bestFor}</div>
      <div class="route-blocks">
        ${Object.keys(BLOCK_NAMES).map(b=>{
          const lvl = r.blocks[b];
          const swColor = lvl==='none' ? 'var(--dim)' : r.color;
          const swOp = lvl==='full' ? '1' : (lvl==='partial' ? '0.45' : '0.3');
          return `<div class="rb ${lvl!=='none'?'on':''}"><span class="sw" style="background:${swColor}; opacity:${swOp};"></span>${b} · ${BLOCK_NAMES[b]}${lvl==='partial' ? ' (partial)' : (lvl==='none' ? ' (not included)' : '')}</div>`;
        }).join('')}
      </div>
    `;
    card.addEventListener('click', async ()=>{
      currentRoute = key;
      await storeSet('route', currentRoute);
      renderRouteGrid();
      applyRouteVisuals();
      updateOverall();
      renderLevelCard();
    });
    grid.appendChild(card);
  });
}

function applyRouteVisuals(){
  const r = ROUTES[currentRoute];
  allModulesFlat().forEach(m=>{
    const sec = document.getElementById(m.id);
    if(!sec || !m.block) return;
    const level = r.blocks[m.block];
    sec.classList.toggle('collapsed-for-route', level==='none');
  });
  document.querySelectorAll('nav.navlist a[data-block]').forEach(a=>{
    const b = a.getAttribute('data-block');
    if(!b) return;
    const level = r.blocks[b];
    a.classList.toggle('dimmed', level==='none');
  });
}

/* ============ BANK TOGGLE ============ */
function applyBankVisuals(){
  allModulesFlat().forEach(m=>{
    if(!m.bank) return;
    const sec = document.getElementById(m.id);
    if(sec) sec.classList.toggle('hidden-bank', !bankOn);
    const navA = document.querySelector('nav.navlist a[href="#'+m.id+'"]');
    if(navA) navA.style.display = bankOn ? '' : 'none';
  });
  document.querySelectorAll('.bank-extra').forEach(el=>{
    el.style.display = bankOn ? '' : 'none';
  });
}
document.getElementById('bankToggle').addEventListener('click', async ()=>{
  bankOn = !bankOn;
  document.getElementById('bankToggle').classList.toggle('on', bankOn);
  await storeSet('bankOn', bankOn);
  applyBankVisuals();
  updateOverall();
  renderLevelCard();
});

/* ============ RENDER NAV ============ */
const navlist = document.getElementById('navlist');
const contentEl = document.getElementById('content');

function renderNav(){
  navlist.innerHTML = '';
  MODULES.forEach(m=>{
    if(m.children){
      const label = document.createElement('div');
      label.className = 'nav-block-label';
      label.textContent = m.tag + ' · ' + m.title;
      navlist.appendChild(label);
      m.children.forEach(c=>{
        const ca = document.createElement('a');
        ca.href = '#'+c.id;
        if(c.block) ca.setAttribute('data-block', c.block);
        if(c.bank) ca.classList.add('bank-item');
        ca.innerHTML = '<span class="n">'+(c.num!==null ? String(c.num).padStart(2,'0') : '·')+'</span>'
          + '<span>'+c.title+'</span>'
          + '<span class="dot" data-mod="'+c.id+'"></span>';
        ca.addEventListener('click', (e)=>{ e.preventDefault(); goToSection(c.id); });
        navlist.appendChild(ca);
      });
    }else{
      const a = document.createElement('a');
      a.href = '#'+m.id;
      if(m.bank) a.classList.add('bank-item');
      a.innerHTML = '<span class="n">'+(m.num!==null ? String(m.num).padStart(2,'0') : '·')+'</span>'
        + '<span>'+m.title+'</span>'
        + '<span class="dot" data-mod="'+m.id+'"></span>';
      a.addEventListener('click', (e)=>{ e.preventDefault(); goToSection(m.id); });
      navlist.appendChild(a);
    }
  });
}

function goToSection(id){
  const target = document.getElementById(id);
  if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
  document.getElementById('sidebar').classList.remove('open');
}

/* ============ ICON HELPERS ============ */
function statusIconHtml(rid, state){
  return `<span class="icwrap status-wrap" data-rid="${rid}"><button type="button" class="ic status-ic status-${state}" data-tip="${STATUS_TIP[state]}">${STATUS_LABEL[state]}</button></span>`;
}
function deviceIconsHtml(devices){
  if(!devices || !devices.length) return '';
  return devices.map(d => `<span class="icwrap"><button type="button" class="ic device-ic" data-tip="${DEVICE_TIP[d]}">${SVG[d]}</button></span>`).join('');
}
function langIconHtml(lang){
  if(!lang) return '';
  return `<span class="icwrap"><button type="button" class="ic lang-ic" data-tip="${LANG_TIP[lang]||''}">${lang}</button></span>`;
}

/* ============ RESOURCE ROW ============ */
function resourceRow(r){
  const seen = !!seenState[r.id];
  const div = document.createElement('div');
  div.className = 'resource' + (seen ? ' seen' : '');
  const initialStatus = r.url ? 'checking' : 'nolink';
  div.innerHTML = `
    <button class="chk ${seen?'checked':''}" data-rid="${r.id}" aria-label="Mark as viewed"></button>
    <div class="res-body">
      <div class="res-top">
        <span class="res-title">${r.url ? `<a href="${r.url}" target="_blank" rel="noopener">${r.title}</a>` : r.title}</span>
        ${statusIconHtml(r.id, initialStatus)}
        ${r.lang ? '<span class="ic-sep"></span>'+langIconHtml(r.lang) : ''}
        ${r.url && r.devices ? '<span class="ic-sep"></span>' : ''}
        <span class="ic-row">${deviceIconsHtml(r.devices)}</span>
      </div>
      <div class="res-desc">${r.desc}</div>
      ${r.url ? `<div class="res-url">${r.url}</div>` : ''}
    </div>
  `;
  div.querySelector('.chk').addEventListener('click', async (e)=>{
    const btn = e.currentTarget;
    const now = !seenState[r.id];
    seenState[r.id] = now;
    btn.classList.toggle('checked', now);
    div.classList.toggle('seen', now);
    await storeSet('seen:'+r.id, now);
    updateOverall();
    renderLevelCard();
  });
  return div;
}

/* ============ DATASET CARD ============ */
function datasetCardHtml(ds){
  return `
    <div class="dataset-card">
      <h4>📊 ${ds.title}</h4>
      <p>${ds.text}</p>
      <div>${ds.tables.map(t=>`<span class="dataset-table-tag">${t}</span>`).join('')}</div>
      ${ds.url ? `<p style="margin-top:10px;"><a href="${ds.url}" target="_blank" rel="noopener" style="color:var(--violet); text-decoration:none; border-bottom:1px dotted var(--violet);">${ds.url}</a></p>` : ''}
    </div>
  `;
}

/* ============ MODULE SECTION ============ */
function moduleSection(m){
  const sec = document.createElement('section');
  sec.className = 'module';
  sec.id = m.id;
  if(m.isGate) sec.classList.add('gate-module');

  const numClass = (m.num === null) ? ' setup' : '';
  const pillsHtml = (m.bank ? '<span class="bank-pill bank-extra">🏦 Banking</span>' : '') + (m.optionalTag ? `<span class="optional-pill">${m.optionalTag}</span>` : '');
  sec.innerHTML = `
    <div class="mod-head">
      <div class="mod-num${numClass}">${m.num!==null ? String(m.num).padStart(2,'0') : m.tag}</div>
      <div class="mod-title-block">
        <div class="mod-tag-row"><span class="mod-tag">${m.tag}</span>${pillsHtml}</div>
        <h2>${m.title}</h2>
        ${m.duration ? `<div class="mod-duration">Estimated duration · ${m.duration}</div>` : ''}
        ${m.objective ? `<p class="mod-objective">${m.objective}</p>` : ''}
        ${m.result ? `<div class="mod-result"><b>Expected outcome</b>${m.result}</div>` : ''}
        ${!m.isReference && !m.isGate && (m.resources||[]).some(r=>r.url) ? `<div class="signal" data-mod="${m.id}">${Array.from({length:12}).map(()=>'<span></span>').join('')}</div>` : ''}
      </div>
    </div>
  `;

  if(m.skipTest){
    const st = document.createElement('div');
    st.className = 'skip-test';
    st.innerHTML = `<input type="checkbox" id="skip-${m.id}"><label for="skip-${m.id}">${m.skipTest} If so, check it and skip this topic.</label>`;
    const cb = st.querySelector('input');
    cb.addEventListener('change', async ()=>{
      skipState[m.id] = cb.checked;
      st.classList.toggle('checked', cb.checked);
      await storeSet('skip:'+m.id, cb.checked);
      updateOverall();
    });
    sec.appendChild(st);
  }

  if(m.closingText){
    const ct = document.createElement('div');
    ct.className = 'closing-text';
    ct.innerHTML = m.closingText.map(p=>`<p>${p}</p>`).join('');
    sec.appendChild(ct);
  }

  if(m.isCapstone){
    const pw = document.createElement('div');
    pw.innerHTML = `
      <p class="project-intro">${m.projectIntro}</p>
      <table class="project-table">
        <thead><tr><th>Checkpoint</th><th>Piece contributed</th></tr></thead>
        <tbody>${m.projectTable.map(row => `<tr><td>${row.topic}</td><td>${row.checkpoint}</td></tr>`).join('')}</tbody>
      </table>
      ${m.dataset ? datasetCardHtml(m.dataset) : ''}
      <div class="capstone-agg" id="capstoneAgg"></div>
      <button type="button" class="refresh-btn" id="refreshAgg">↻ Refresh with my saved notes</button>
    `;
    sec.appendChild(pw);
  }

  if(m.isAdoption){
    const aw = document.createElement('div');
    aw.innerHTML = `
      <div class="adopt-grid">
        ${m.adoptItems.map(it => `<div class="adopt-item"><div class="a-title">${it.title}</div><div class="a-desc">${it.desc}</div></div>`).join('')}
      </div>
    `;
    sec.appendChild(aw);
  }

  if(m.isGlossary){
    const gw = document.createElement('div');
    gw.className = 'glossary-grid';
    gw.innerHTML = m.glossary.map(g => `<div class="gloss-item"><div class="gloss-term">${g.term}</div><div class="gloss-def">${g.def}</div></div>`).join('');
    sec.appendChild(gw);
  }

  if(m.isGate){
    const gateWrap = document.createElement('div');
    gateWrap.className = 'checklist bank-extra';
    m.checklist.forEach(item=>{
      const row = document.createElement('div');
      row.className = 'check-item';
      row.innerHTML = `<input type="checkbox" id="gate-${item.id}"><label for="gate-${item.id}">${item.text}</label>`;
      const cb = row.querySelector('input');
      cb.addEventListener('change', async ()=>{
        gateState[item.id] = cb.checked;
        await storeSet('gate:'+item.id, cb.checked);
        updateGateBanner(m);
      });
      gateWrap.appendChild(row);
    });
    sec.appendChild(gateWrap);
    const banner = document.createElement('div');
    banner.className = 'gate-banner bank-extra';
    banner.id = 'gateBanner';
    sec.appendChild(banner);
  }

  if((m.resources||[]).length > 0){
    const resWrap = document.createElement('div');
    resWrap.className = 'resources';
    m.resources.forEach(r => resWrap.appendChild(resourceRow(r)));
    sec.appendChild(resWrap);
  }

  if(m.dataset && !m.isCapstone){
    const dw = document.createElement('div');
    dw.innerHTML = datasetCardHtml(m.dataset);
    sec.appendChild(dw);
  }

  if(m.checkpoint){
    const cp = document.createElement('div');
    cp.className = 'checkpoint';
    cp.innerHTML = `
      <div class="checkpoint-label">🔧 Project checkpoint</div>
      <div class="checkpoint-title">${m.checkpoint.title}</div>
      <div class="checkpoint-text">${m.checkpoint.text}</div>
      ${m.checkpoint.piece ? `<div class="checkpoint-piece">${m.checkpoint.piece}</div>` : ''}
    `;
    sec.appendChild(cp);
  }

  if(m.bankExtra){
    const be = document.createElement('div');
    be.className = 'checkpoint bank-extra';
    be.innerHTML = `
      <div class="checkpoint-label">🏦 ${m.bankExtra.title}</div>
      <div class="checkpoint-text">${m.bankExtra.text}</div>
    `;
    sec.appendChild(be);
  }

  if(m.noCheckpointNote){
    const nc = document.createElement('div');
    nc.className = 'no-checkpoint';
    nc.textContent = m.noCheckpointNote;
    sec.appendChild(nc);
  }

  if(m.notesOn){
    const notes = document.createElement('div');
    notes.className = 'notes-block';
    notes.innerHTML = `
      <h3>Notes for this topic</h3>
      <textarea placeholder="Comments, ideas, open questions…" data-mod="${m.id}"></textarea>
      <div class="save-hint" data-hint="${m.id}"></div>
      <div class="attach-row">
        <input type="text" name="alabel" placeholder="Resource or document name" />
        <input type="text" name="alink" placeholder="Link (Drive, Notion, public PDF…)" />
        <button type="button" data-attach="${m.id}">Add</button>
      </div>
      <div class="attach-hint">Files can\'t be uploaded: add a link (Drive, SharePoint, Notion…) and it will show up here.</div>
      <div class="attachments" data-list="${m.id}"></div>
    `;
    sec.appendChild(notes);
  }

  return sec;
}

function groupSection(m){
  const sec = document.createElement('section');
  sec.className = 'module module-group';
  sec.id = m.id;
  if(m.block) sec.setAttribute('data-block', m.block);

  sec.innerHTML = `
    <div class="mod-head">
      <div class="mod-num setup">${m.tag}</div>
      <div class="mod-title-block">
        <div class="mod-tag">${m.tag}</div>
        <h2>${m.title}</h2>
        ${m.objective ? `<p class="mod-objective">${m.objective}</p>` : ''}
        <div class="signal" data-mod="${m.id}">${Array.from({length:12}).map(()=>'<span></span>').join('')}</div>
      </div>
    </div>
  `;

  const childrenWrap = document.createElement('div');
  childrenWrap.className = 'group-children';
  m.children.forEach(c => childrenWrap.appendChild(moduleSection(c)));
  sec.appendChild(childrenWrap);

  return sec;
}

function renderContent(){
  contentEl.innerHTML = '';
  let navCount = 0;
  MODULES.forEach(m => {
    navCount += 1;
    if(m.children){
      contentEl.appendChild(groupSection(m));
      navCount += m.children.length;
    }else{
      contentEl.appendChild(moduleSection(m));
    }
  });
  document.getElementById('modCount').textContent = navCount;
}

function renderLegend(){
  const legend = document.getElementById('legend');
  legend.innerHTML = `
    <div class="legend-title">Legend</div>
    <div class="legend-item">${statusIconHtml('legend-v','verified')}<span>Link verified</span></div>
    <div class="legend-item">${statusIconHtml('legend-u','unavailable')}<span>Temporarily unavailable</span></div>
    <div class="legend-item">${statusIconHtml('legend-x','unknown')}<span>Could not verify</span></div>
    <div class="legend-item"><span class="icwrap"><button type="button" class="ic device-ic" data-tip="">${SVG.mobile}</button></span><span>Mobile</span></div>
    <div class="legend-item"><span class="icwrap"><button type="button" class="ic device-ic" data-tip="">${SVG.tablet}</button></span><span>Tablet</span></div>
    <div class="legend-item"><span class="icwrap"><button type="button" class="ic device-ic" data-tip="">${SVG.desktop}</button></span><span>Desktop</span></div>
    <div class="legend-item"><span class="icwrap"><button type="button" class="ic lang-ic" data-tip="">EN</button></span><span>Resource language</span></div>
    <div class="legend-item"><span class="bank-pill">🏦 Banking</span><span>Banking-specific module</span></div>
  `;
}

function renderAttachments(modId){
  const list = document.querySelector('.attachments[data-list="'+modId+'"]');
  if(!list) return;
  const items = attachState[modId] || [];
  list.innerHTML = '';
  items.forEach((it, idx)=>{
    const row = document.createElement('div');
    row.className = 'attachment';
    row.innerHTML = `<span>📎</span><a href="${it.url}" target="_blank" rel="noopener">${it.label || it.url}</a><button class="rm" data-idx="${idx}" data-mod="${modId}">remove</button>`;
    list.appendChild(row);
  });
}

/* ============ GATE BANNER ============ */
function updateGateBanner(gateModule){
  const banner = document.getElementById('gateBanner');
  if(!banner) return;
  const total = gateModule.checklist.length;
  const done = gateModule.checklist.filter(i=>gateState[i.id]).length;
  const pass = done === total;
  banner.classList.toggle('pass', pass);
  banner.textContent = pass
    ? '✓ Checklist complete — you can consider the case ready to discuss with Risk/DPO/Security.'
    : `${done}/${total} completed — the agent shouldn\'t touch real bank data yet.`;
}

/* ============ CAPSTONE AGGREGATION ============ */
async function renderCapstoneAgg(){
  const wrap = document.getElementById('capstoneAgg');
  if(!wrap) return;
  const capstoneModule = MODULES.find(m=>m.isCapstone);
  const pieces = capstoneModule.projectTable;
  const moduleIdByTopic = {
    '3 — Prompting':'m3', '4 — RAG':'m4', '5 — Agents':'m5', '5.3 — Anti-hype':'m5-3',
    '9 — Integration/MCP':'m9', '7 — Evaluation':'m7', '8-bis / Gate — Banking':'m8b', '11 — Business':'m11'
  };
  wrap.innerHTML = '';
  for(const row of pieces){
    const modId = moduleIdByTopic[row.topic];
    const note = notesState[modId];
    const item = document.createElement('div');
    item.className = 'agg-item';
    item.innerHTML = `
      <h4>${row.checkpoint}</h4>
      <div class="agg-body">${note && note.trim() ? note.replace(/</g,'&lt;') : '<span class="agg-empty">No notes saved yet in topic "'+row.topic+'" — go to the checkpoint and write there.</span>'}</div>
    `;
    wrap.appendChild(item);
  }
}

/* ============ LINK CHECKING ============ */
function withTimeout(promise, ms){
  return new Promise((resolve, reject)=>{
    const t = setTimeout(()=>reject(new Error('timeout')), ms);
    promise.then(v=>{ clearTimeout(t); resolve(v); }, e=>{ clearTimeout(t); reject(e); });
  });
}
async function checkUrl(url){
  try{
    await withTimeout(fetch(url, {mode:'no-cors', cache:'no-store'}), 6000);
    return true;
  }catch(e){
    return false;
  }
}
function setStatus(rid, state){
  const wrap = document.querySelector('.status-wrap[data-rid="'+rid+'"]');
  if(!wrap) return;
  const btn = wrap.querySelector('.status-ic');
  btn.className = 'ic status-ic status-'+state;
  btn.setAttribute('data-tip', STATUS_TIP[state]);
  btn.innerHTML = STATUS_LABEL[state];
}
async function runLinkChecks(){
  const targets = [];
  leafModules().forEach(m => (m.resources||[]).forEach(r => { if(r.url) targets.push(r); }));
  const results = await Promise.all(targets.map(async r => ({id:r.id, ok: await checkUrl(r.url)})));
  const successCount = results.filter(r=>r.ok).length;
  const blocked = successCount === 0 && results.length >= 5;
  results.forEach(r=>{
    if(blocked){ setStatus(r.id, 'unknown'); }
    else{ setStatus(r.id, r.ok ? 'verified' : 'unavailable'); }
  });
}

/* ============ OVERALL PROGRESS ============ */
function updateOverall(){
  const total = totalResources();
  const seen = seenCount();
  const pct = total ? Math.round(seen/total*100) : 0;
  document.getElementById('overallPct').textContent = pct + '%';
  document.getElementById('overallBar').style.width = pct + '%';

  allModulesFlat().forEach(m=>{
    const dot = document.querySelector('.dot[data-mod="'+m.id+'"]');
    if(!dot) return;
    dot.classList.remove('full','partial','skipped');
    if(skipState[m.id]){ dot.classList.add('skipped'); return; }
    const p = moduleProgress(m);
    if(p){
      if(p.seen === p.total && p.total>0) dot.classList.add('full');
      else if(p.seen>0) dot.classList.add('partial');
    }
    const strip = document.querySelectorAll('.signal[data-mod="'+m.id+'"] span');
    if(strip.length && p){
      const litCount = Math.round((p.seen/p.total)*strip.length);
      strip.forEach((s,i)=> s.classList.toggle('on', i < litCount));
    }
  });
}

/* ============ EVENTS: tooltips ============ */
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('.ic');
  if(btn && btn.closest('.legend') === null){
    const wrap = btn.closest('.icwrap');
    const wasOpen = wrap.classList.contains('open');
    document.querySelectorAll('.icwrap.open').forEach(w=>w.classList.remove('open'));
    if(!wasOpen){
      wrap.classList.add('open');
      if(!wrap.querySelector('.tip')){
        const tipText = btn.getAttribute('data-tip');
        if(tipText){
          const tipEl = document.createElement('span');
          tipEl.className = 'tip';
          tipEl.textContent = tipText;
          wrap.appendChild(tipEl);
        }
      }
    }
    e.stopPropagation();
    return;
  }
  document.querySelectorAll('.icwrap.open').forEach(w=>w.classList.remove('open'));
});

/* ============ EVENTS: notes + attachments ============ */
let noteTimers = {};
document.addEventListener('input', (e)=>{
  if(e.target.matches('textarea[data-mod]')){
    const modId = e.target.getAttribute('data-mod');
    notesState[modId] = e.target.value;
    clearTimeout(noteTimers[modId]);
    const hint = document.querySelector('.save-hint[data-hint="'+modId+'"]');
    if(hint) hint.textContent = 'Saving…';
    noteTimers[modId] = setTimeout(async ()=>{
      await storeSet('notes:'+modId, notesState[modId]);
      if(hint) hint.textContent = 'Saved ✓';
      setTimeout(()=>{ if(hint) hint.textContent=''; }, 1500);
      renderLevelCard();
    }, 600);
  }
});

document.addEventListener('click', async (e)=>{
  if(e.target.matches('button[data-attach]')){
    const modId = e.target.getAttribute('data-attach');
    const row = e.target.closest('.attach-row');
    const label = row.querySelector('input[name="alabel"]').value.trim();
    const link = row.querySelector('input[name="alink"]').value.trim();
    if(!link) return;
    if(!attachState[modId]) attachState[modId] = [];
    attachState[modId].push({label, url: link});
    await storeSet('attach:'+modId, attachState[modId]);
    row.querySelector('input[name="alabel"]').value = '';
    row.querySelector('input[name="alink"]').value = '';
    renderAttachments(modId);
  }
  if(e.target.matches('button.rm')){
    const modId = e.target.getAttribute('data-mod');
    const idx = parseInt(e.target.getAttribute('data-idx'), 10);
    attachState[modId].splice(idx, 1);
    await storeSet('attach:'+modId, attachState[modId]);
    renderAttachments(modId);
  }
  if(e.target.id === 'refreshAgg'){
    renderCapstoneAgg();
  }
});

/* ============ scroll spy ============ */
const sections = () => Array.from(document.querySelectorAll('.module'));
const groupIdForChild = {};
MODULES.filter(m=>m.children).forEach(m=> m.children.forEach(c=> groupIdForChild[c.id] = m.id));

window.addEventListener('scroll', ()=>{
  let current = null;
  sections().forEach(s=>{
    if(s.getBoundingClientRect().top < 140) current = s.id;
  });
  document.querySelectorAll('nav.navlist a').forEach(a=>{
    const href = a.getAttribute('href').slice(1);
    a.classList.toggle('active', href === current);
  });
}, {passive:true});

/* ============ mobile menu ============ */
document.getElementById('menuToggle').addEventListener('click', ()=>{
  document.getElementById('sidebar').classList.toggle('open');
});
document.addEventListener('click', (e)=>{
  const sb = document.getElementById('sidebar');
  const mt = document.getElementById('menuToggle');
  if(sb.classList.contains('open') && !sb.contains(e.target) && !mt.contains(e.target)){
    sb.classList.remove('open');
  }
});

/* ============ INIT ============ */
async function init(){
  renderLegend();
  renderNav();
  renderContent();
  renderRouteGrid();

  if(supabaseClient){
    await identifySupabaseUser();
  }

  const savedRoute = await storeGet('route');
  if(savedRoute && ROUTES[savedRoute]) currentRoute = savedRoute;
  const savedBank = await storeGet('bankOn');
  if(savedBank !== null) bankOn = !!savedBank;
  document.getElementById('bankToggle').classList.toggle('on', bankOn);
  renderRouteGrid();

  const allModules = allModulesFlat();
  for(const m of allModules){
    const resources = m.resources || [];
    for(const r of resources){
      if(!r.url) continue;
      const v = await storeGet('seen:'+r.id);
      if(v) seenState[r.id] = true;
    }
    const note = await storeGet('notes:'+m.id);
    if(note){
      notesState[m.id] = note;
      const ta = document.querySelector('textarea[data-mod="'+m.id+'"]');
      if(ta) ta.value = note;
    }
    const att = await storeGet('attach:'+m.id);
    if(att){ attachState[m.id] = att; renderAttachments(m.id); }
    if(m.skipTest){
      const sv = await storeGet('skip:'+m.id);
      if(sv){
        skipState[m.id] = true;
        const cb = document.getElementById('skip-'+m.id);
        if(cb){ cb.checked = true; cb.closest('.skip-test').classList.add('checked'); }
      }
    }
  }

  const gateModule = MODULES.find(mm => mm.children ? mm.children.some(c=>c.isGate) : mm.isGate) ;
  let gateMod = null;
  allModules.forEach(m=>{ if(m.isGate) gateMod = m; });
  if(gateMod){
    for(const item of gateMod.checklist){
      const v = await storeGet('gate:'+item.id);
      if(v){
        gateState[item.id] = true;
        const cb = document.getElementById('gate-'+item.id);
        if(cb) cb.checked = true;
      }
    }
    updateGateBanner(gateMod);
  }

  document.querySelectorAll('.chk').forEach(btn=>{
    const rid = btn.getAttribute('data-rid');
    if(seenState[rid]){
      btn.classList.add('checked');
      btn.closest('.resource').classList.add('seen');
    }
  });

  applyRouteVisuals();
  applyBankVisuals();
  updateOverall();
  renderLevelCard();
  renderLastSaved();
  renderCapstoneAgg();
  runLinkChecks();
}
init();
