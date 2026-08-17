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
let supabasePasswordHash = null; // hashed access password for this user, resent on every persist
let lastSavedAt = null;         // Date of the last successful write to Supabase

if(supabaseConfigured && typeof window !== 'undefined' && window.supabase){
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/* ---- Password hashing: best-effort only. It stops the app's own UI from letting
   someone reuse another person's display name without their password, but anyone
   with the anon key could still bypass it directly against the API — real
   enforcement would need a Postgres RLS policy, which is out of scope here. ---- */
async function hashPassword(pw){
  if(window.crypto && window.crypto.subtle){
    const enc = new TextEncoder().encode(pw);
    const buf = await window.crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  // Fallback for contexts without Web Crypto (e.g. opening index.html via file://
  // in some browsers): a simple non-cryptographic hash, still better than plaintext.
  let h = 0;
  for(let i=0;i<pw.length;i++){ h = (Math.imul(31,h) + pw.charCodeAt(i)) | 0; }
  return 'fnv:' + (h>>>0).toString(16);
}

/* ---- Identity modal: asks who is using the tracker and their access password,
   explains why, warns against personal data, and pre-fills the name last used on
   this device. A name with no password_hash yet (new, or created before this
   feature existed) is claimed with whatever password is entered. ---- */
function getSavedLocalName(){
  try{ return window.localStorage.getItem('itin:whoami'); }catch(e){ return null; }
}
function setSavedLocalName(name){
  try{ window.localStorage.setItem('itin:whoami', name); }catch(e){}
}
async function fetchUserRow(name){
  try{
    const { data, error } = await supabaseClient
      .from('path_progress')
      .select('data, password_hash')
      .eq('user_id', name)
      .maybeSingle();
    if(error) throw error;
    return data; // null => no row for this name yet
  }catch(e){
    return undefined; // undefined => lookup itself failed (network/RLS)
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
        <div class="idmodal-desc">Pick a name and a password so your progress on this learning path can be saved and found again later, from any device. The password stops someone else from continuing under your name.</div>
        <div class="idmodal-warning">⚠ Please don't use personal data (e.g. your full legal name or email) — use a nickname or initials instead. Don't reuse a password from elsewhere: it's stored (hashed) in a shared database, not meant for high security.</div>
        <input type="text" class="idmodal-input" id="idNameInput" placeholder="e.g. jm23 or explorer-ana" maxlength="40" value="${existing ? existing.replace(/"/g,'&quot;') : ''}">
        <input type="password" class="idmodal-input" id="idPasswordInput" placeholder="Password (min. 4 characters)" maxlength="72" autocomplete="current-password">
        <div class="idmodal-actions">
          <button type="button" class="idmodal-btn idmodal-btn-primary" id="idConfirmBtn">Start / continue</button>
        </div>
        <div class="idmodal-error" id="idError"></div>
        <div class="idmodal-hint">If this name doesn't exist yet, this password will be set for it — there's no recovery if you forget it.</div>
      </div>
    `;
    document.body.appendChild(overlay);

    const nameInput = overlay.querySelector('#idNameInput');
    const pwInput = overlay.querySelector('#idPasswordInput');
    const errEl = overlay.querySelector('#idError');
    const confirmBtn = overlay.querySelector('#idConfirmBtn');
    (existing ? pwInput : nameInput).focus();

    const finish = (result)=>{
      document.body.removeChild(overlay);
      resolve(result);
    };

    let busy = false;
    const confirm = async ()=>{
      if(busy) return;
      const name = (nameInput.value || '').trim().toLowerCase();
      const pw = pwInput.value || '';
      errEl.textContent = '';
      if(!name){ errEl.textContent = 'Please enter a name.'; return; }
      if(name.length < 2){ errEl.textContent = 'Name is too short.'; return; }
      if(pw.length < 4){ errEl.textContent = 'Password must be at least 4 characters.'; return; }

      busy = true;
      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Checking…';
      const row = await fetchUserRow(name);
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Start / continue';
      busy = false;

      if(row === undefined){
        errEl.textContent = "Couldn't verify that name right now — check your connection and try again.";
        return;
      }
      const passwordHash = await hashPassword(pw);
      if(row === null){
        finish({name, passwordHash, existingData: {}, needsPersist: true});
        return;
      }
      if(row.password_hash && row.password_hash !== passwordHash){
        errEl.textContent = 'Incorrect password for that name.';
        pwInput.value = '';
        pwInput.focus();
        return;
      }
      finish({name, passwordHash, existingData: row.data || {}, needsPersist: !row.password_hash});
    };
    confirmBtn.addEventListener('click', confirm);
    pwInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') confirm(); });
    nameInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') pwInput.focus(); });
  });
}
async function identifySupabaseUser(){
  if(!supabaseClient) return;
  const { name, passwordHash, existingData, needsPersist } = await showIdentityModal();
  supabaseUserId = name;
  supabasePasswordHash = passwordHash;
  setSavedLocalName(name);
  supabaseCache = existingData || {};
  if(needsPersist) await supabasePersist();
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
      password_hash: supabasePasswordHash,
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
