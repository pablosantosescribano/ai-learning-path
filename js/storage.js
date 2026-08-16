/* ============ STORAGE HELPERS ============ */
/* Priority: Supabase (cross-device, per person) > window.storage (Claude.ai artifact host)
   > localStorage (same device/browser only) > in-memory (last resort). No console noise on
   the expected fallback paths. */

const memoryStore = {};
const hasWindowStorage = typeof window !== 'undefined' && !!window.storage;
let localStorageOK = false;
try{
  const testKey = '__storage_test__';
  window.localStorage.setItem(testKey, '1');
  window.localStorage.removeItem(testKey);
  localStorageOK = true;
}catch(e){ localStorageOK = false; }

const supabaseConfigured = SUPABASE_URL.indexOf('TU-PROYECTO') === -1 && SUPABASE_ANON_KEY.indexOf('TU-ANON-KEY') === -1;
let supabaseClient = null;
let supabaseUserId = null;
let supabaseCache = null;       // full jsonb blob for this user, loaded once
let lastSavedAt = null;         // Date of the last successful write to Supabase

if(supabaseConfigured && typeof window !== 'undefined' && window.supabase){
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/* ---- Identity modal: asks who is using the tracker, explains why, warns against
   personal data, and offers to continue with a name already saved on this device. ---- */
function getSavedLocalName(){
  try{ return window.localStorage.getItem('itin:whoami'); }catch(e){ return null; }
}
function setSavedLocalName(name){
  try{ window.localStorage.setItem('itin:whoami', name); }catch(e){}
}
async function fetchProgressForUser(name){
  try{
    const { data, error } = await supabaseClient
      .from('path_progress')
      .select('data')
      .eq('user_id', name)
      .maybeSingle();
    if(error) throw error;
    return (data && data.data) ? data.data : {};
  }catch(e){
    return {};
  }
}
function showIdentityModal(){
  return new Promise((resolve)=>{
    const existing = getSavedLocalName();
    const overlay = document.createElement('div');
    overlay.className = 'idmodal-overlay';
    overlay.innerHTML = `
      <div class="idmodal-box">
        <div class="idmodal-title">Who's tracking progress?</div>
        <div class="idmodal-desc">Pick a name so your progress on this learning path can be saved and found again later, from any device.</div>
        <div class="idmodal-warning">⚠ Please don't use personal data (e.g. your full legal name or email) — use a nickname or initials instead. This name is stored, as entered, in a shared database.</div>
        ${existing ? `
          <div class="idmodal-existing">
            <p>This browser last used: <strong>${existing.replace(/</g,'&lt;')}</strong></p>
            <div class="idmodal-actions">
              <button type="button" class="idmodal-btn idmodal-btn-primary" id="idContinueBtn">Continue as "${existing.replace(/</g,'&lt;')}"</button>
              <button type="button" class="idmodal-btn" id="idSwitchBtn">Use a different name</button>
            </div>
          </div>
          <div id="idSwitchBox" style="display:none;">
        ` : ''}
        <input type="text" class="idmodal-input" id="idNameInput" placeholder="e.g. jm23 or explorer-ana" maxlength="40" ${existing ? '' : 'autofocus'}>
        <div class="idmodal-actions">
          <button type="button" class="idmodal-btn idmodal-btn-primary" id="idConfirmBtn">Start / continue</button>
        </div>
        <div class="idmodal-error" id="idError"></div>
        ${existing ? `</div>` : ''}
      </div>
    `;
    document.body.appendChild(overlay);

    const finish = (name)=>{
      document.body.removeChild(overlay);
      resolve(name);
    };

    if(existing){
      const switchBox = overlay.querySelector('#idSwitchBox');
      overlay.querySelector('#idContinueBtn').addEventListener('click', ()=> finish(existing));
      overlay.querySelector('#idSwitchBtn').addEventListener('click', ()=>{
        switchBox.style.display = 'block';
        overlay.querySelector('#idNameInput').focus();
      });
    }
    const input = overlay.querySelector('#idNameInput');
    const errEl = overlay.querySelector('#idError');
    const confirm = ()=>{
      const v = (input.value || '').trim().toLowerCase();
      if(!v){ errEl.textContent = 'Please enter a name.'; return; }
      if(v.length < 2){ errEl.textContent = 'Name is too short.'; return; }
      finish(v);
    };
    overlay.querySelector('#idConfirmBtn').addEventListener('click', confirm);
    input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') confirm(); });
  });
}
async function identifySupabaseUser(){
  if(!supabaseClient) return;
  const name = await showIdentityModal();
  supabaseUserId = name;
  setSavedLocalName(name);
  supabaseCache = await fetchProgressForUser(name);
}

function renderLastSaved(){
  const el = document.getElementById('lastSavedNote');
  if(!el) return;
  if(!supabaseClient){ el.textContent = ''; return; }
  if(!lastSavedAt){ el.textContent = supabaseUserId ? `Signed in as ${supabaseUserId} · not saved yet` : ''; return; }
  const time = lastSavedAt.toLocaleString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
  el.textContent = `Signed in as ${supabaseUserId} · last saved ${time}`;
}

async function supabasePersist(){
  if(!supabaseClient || !supabaseUserId || !supabaseCache) return;
  try{
    const { error } = await supabaseClient.from('path_progress').upsert({
      user_id: supabaseUserId,
      data: supabaseCache,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    if(error) throw error;
    lastSavedAt = new Date();
    renderLastSaved();
  }catch(e){ /* offline or RLS issue: value still lives in supabaseCache for this session */ }
}

async function storeGet(key){
  if(supabaseClient){
    if(supabaseCache && Object.prototype.hasOwnProperty.call(supabaseCache, key)){
      return supabaseCache[key];
    }
  }
  if(hasWindowStorage){
    try{
      const r = await window.storage.get(key, false);
      return r ? JSON.parse(r.value) : null;
    }catch(e){ /* fall through to other backends */ }
  }
  if(localStorageOK){
    try{
      const v = window.localStorage.getItem('itin:'+key);
      return v !== null ? JSON.parse(v) : null;
    }catch(e){ return null; }
  }
  return Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null;
}
async function storeSet(key, value){
  if(supabaseClient){
    supabaseCache = supabaseCache || {};
    supabaseCache[key] = value;
    await supabasePersist();
    return;
  }
  if(hasWindowStorage){
    try{ await window.storage.set(key, JSON.stringify(value), false); return; }
    catch(e){ /* fall through to other backends */ }
  }
  if(localStorageOK){
    try{ window.localStorage.setItem('itin:'+key, JSON.stringify(value)); return; }
    catch(e){ /* fall through to memory */ }
  }
  memoryStore[key] = value;
}
