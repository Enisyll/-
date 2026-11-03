/* PyQuest: путь Claude — движок игры */
'use strict';

const PYODIDE_URL = 'https://cdn.jsdelivr.net/npm/pyodide@0.26.4/';
const STORE_KEY = 'pyquest-v1';
const RUN_TIMEOUT = 8000;
const STEP_LIMIT = 3000000;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ================= Данные ================= */
const WORLDS = globalThis.WORLDS;
const ALL = [];
WORLDS.forEach((w, wi) => w.lessons.forEach((l, li) => { l.wi = wi; l.li = li; l.idx = ALL.length; ALL.push(l); }));
const byId = Object.fromEntries(ALL.map(l => [l.id, l]));

/* ================= Сохранение ================= */
function loadState() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
}
const S = Object.assign({ xp: 0, lessons: {}, weak: {}, sound: true, unlockAll: false, streak: 0, lastDay: null, pos: 0, drafts: {}, sandbox: '', proj: {} }, loadState());
const TOTAL_TASKS = ALL.reduce((a, l) => a + l.ex.length, 0);
let saveTimer = null;
function save(now) {
  clearTimeout(saveTimer);
  const doit = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) { /* приватный режим */ } };
  if (now) doit(); else saveTimer = setTimeout(doit, 300);
}
function LS(id) {
  const n = byId[id] ? byId[id].ex.length : 5;
  const st = S.lessons[id] || (S.lessons[id] = { done: [], stars: 0, complete: false });
  while (st.done.length < n) st.done.push(false);
  return st;
}
const isComplete = l => !!(S.lessons[l.id] && S.lessons[l.id].complete);
const isUnlocked = l => S.unlockAll || l.idx === 0 || isComplete(ALL[l.idx - 1]) || isComplete(l);
function currentIdx() {
  for (const l of ALL) if (!isComplete(l)) return l.idx;
  return ALL.length - 1;
}
const level = () => 1 + Math.floor(S.xp / 150);
const today = () => new Date().toISOString().slice(0, 10);
function bumpStreak() {
  const t = today();
  if (S.lastDay === t) return;
  const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  S.streak = S.lastDay === y ? S.streak + 1 : 1;
  S.lastDay = t;
}

/* ================= Звук (8-бит) ================= */
let actx = null;
function beep(notes, type = 'square', dur = 0.09, vol = 0.06) {
  if (!S.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    let t = actx.currentTime;
    for (const f of notes) {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + dur);
      t += dur * 0.9;
    }
  } catch (e) { }
}
const SFX = {
  click: () => beep([660], 'square', 0.04, 0.03),
  ok: () => beep([523, 659, 784, 1047], 'square', 0.09),
  bad: () => beep([220, 165], 'sawtooth', 0.14, 0.04),
  win: () => beep([523, 659, 784, 1047, 784, 1047, 1319], 'square', 0.11),
  step: () => beep([330], 'triangle', 0.03, 0.03),
};

/* ================= Пиксельные спрайты ================= */
const SPR = {
  claude: { pal: { O: '#d97757', o: '#b85c3e', h: '#f5b393', W: '#ffffff', K: '#1a1c2c', D: '#8a4630', p: '#ff9eaa' }, frames: [[
    '....h..h....', '...hO..Oh...', '..OOOOOOOO..', '.OOhhOOOOOO.', 'OOhOOOOOOOOO', 'OOOWKOOWKOOO', 'OOOKKOOKKOOO', 'OpOOOOOOOOpO', 'OOOOOooOOOOO', '.OOOOOOOOOO.', '..OOOOOOOO..', '..DD....DD..', '..DD....DD..'
  ], [
    '....h..h....', '...hO..Oh...', '..OOOOOOOO..', '.OOhhOOOOOO.', 'OOhOOOOOOOOO', 'OOOWKOOWKOOO', 'OOOKKOOKKOOO', 'OpOOOOOOOOpO', 'OOOOOooOOOOO', '.OOOOOOOOOO.', '..OOOOOOOO..', '...DD..DD...', '..DD....DD..'
  ]] },
  tree: { pal: { G: '#3e8948', g: '#63c74d', T: '#733e39', t: '#3e2731' }, frames: [[
    '...gggg...', '..gggGgg..', '.ggGgggGg.', 'gggggGgggg', 'gGgggggGgg', 'ggggGggggG', '.GgggggGG.', '..GGGGGG..', '....TT....', '....Tt....', '...tTTt...'
  ]] },
  bush: { pal: { G: '#265c42', g: '#63c74d', r: '#e43b44' }, frames: [['..gggg..', '.ggrgggg', 'ggggggrg', 'gGgggggG', 'GGGGGGGG']] },
  flower: { pal: { y: '#feae34', w: '#ffffff', g: '#63c74d' }, frames: [['.w.', 'wyw', '.w.', '.g.', 'gg.']] },
  pine: { pal: { G: '#193c3e', g: '#265c42', T: '#733e39' }, frames: [[
    '....g....', '...ggg...', '..gggGg..', '...ggg...', '..gggGg..', '.ggGgggg.', '..gggGg..', '.gggggGg.', 'ggGggggGg', '....T....', '....T....'
  ]] },
  mushroom: { pal: { R: '#e43b44', W: '#ffffff', s: '#ead4aa' }, frames: [['.RRRR.', 'RWRRWR', 'RRRRRR', '..ss..', '..ss..']] },
  cactus: { pal: { G: '#3e8948', g: '#63c74d' }, frames: [[
    '...gg...', '...gG...', 'g..gG...', 'gG.gG..g', 'gGggG.gG', '.GggGggG', '...gGGG.', '...gG...', '...gG...', '...GG...'
  ]] },
  rock: { pal: { R: '#8b9bb4', r: '#5a6988', w: '#c0cbdc' }, frames: [['..wwR...', '.wRRRRr.', 'wRRRRRrr', 'RRRRrrrr', '.rrrrrr.']] },
  dune: { pal: { y: '#f7c58a', Y: '#c9864e' }, frames: [['...yyyy....', '.yyyyyyyy..', 'yyyyyyYYYYY']] },
  snowpine: { pal: { G: '#193c3e', W: '#ffffff', T: '#733e39' }, frames: [[
    '....W....', '...WWW...', '..WGGGW..', '...GWG...', '..GWGGW..', '.WGGGWGG.', '..GGWGG..', '.GWGGGWG.', 'WGGGWGGGW', '....T....', '....T....'
  ]] },
  snowman: { pal: { W: '#ffffff', w: '#c0cbdc', K: '#1a1c2c', O: '#feae34', R: '#e43b44' }, frames: [['..KKK..', '..KKK..', '.KKKKK.', '..WWW..', '.WKWKW.', '..WOW..', '.RRRRR.', '.WWKWW.', 'WWWWWWw', 'WWWKWWw', '.WWWWw.']] },
  crystal: { pal: { b: '#73eff7', B: '#41a6f6' }, frames: [['..b..', '.bbB.', '.bBB.', 'bbBBB', '.bBB.']] },
  peak: { pal: { R: '#566c86', r: '#333c57', W: '#ffffff' }, frames: [[
    '.....W.....', '....WWW....', '...WWRWr...', '..RRRRRrr..', '.RRRRRrrrr.', 'RRRRRrrrrrr'
  ]] },
  tower: { pal: { S: '#8b9bb4', s: '#566c86', K: '#1a1c2c', R: '#e43b44', y: '#ffcd75' }, frames: [[
    '...R.....', '...RR....', '...s.....', 'S.S.S.S.S', 'SSSSSSSSs', '.SSSSSSs.', '.SSKyKSs.', '.SSSSSSs.', '.SSSKSSs.', '.SSKKKSs.', '.SSKKKSs.'
  ]] },
  torch: { pal: { y: '#ffcd75', o: '#ef7d57', T: '#733e39' }, frames: [['.y.', 'yoy', '.o.', '.T.', '.T.', '.T.']] },
  lavarock: { pal: { K: '#262b44', k: '#3e2731', o: '#ef7d57', y: '#ffcd75' }, frames: [['..KKKK..', '.KKoKKk.', 'KKKyoKkk', 'KoKKKKky', '.kkkkkk.']] },
  fire: { pal: { r: '#e43b44', o: '#ef7d57', y: '#ffcd75' }, frames: [['..r...', '.ror.r', '.roorr', 'rooyor', 'royyor', '.ryyr.']] },
  arcade: { pal: { P: '#b13e53', p: '#5d275d', K: '#1a1c2c', S: '#73eff7', y: '#ffcd75', r: '#e43b44' }, frames: [[
    'PPPPPPPP', 'PyyyyyyP', 'PKKKKKKP', 'PKSKKSKP', 'PKKSSKKP', 'PKKKKKKP', 'PPPPPPPP', 'PpKrpKKP', 'PpppppPP', 'PPPPPPPP', 'pp....pp'
  ]] },
  coin: { pal: { y: '#ffcd75', o: '#ef7d57', w: '#ffffff' }, frames: [['.yyy.', 'ywyyo', 'ywyyo', 'yyyyo', '.ooo.']] },
  star: { pal: { y: '#ffffff', b: '#73eff7' }, frames: [['.b.', 'byb', '.b.']] },
  snakeSpr: { pal: { g: '#38b764', G: '#a7f070', K: '#1a1c2c', r: '#e43b44' }, frames: [['......GG.', '.....GKGr', 'gggg.GGG.', 'g..g..g..', 'g..gggg..']] },
};
function spriteRects(name, frame = 0, px = 4) {
  const sp = SPR[name], rows = sp.frames[frame % sp.frames.length];
  let out = '';
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === '.') { x++; continue; }
      let n = 1; while (row[x + n] === c) n++;
      out += `<rect x="${x * px}" y="${y * px}" width="${n * px}" height="${px}" fill="${sp.pal[c]}"/>`;
      x += n;
    }
  });
  return out;
}
const spriteSize = (name, px = 4) => [SPR[name].frames[0][0].length * px, SPR[name].frames[0].length * px];
function spriteSVG(name, px = 4, frame = 0, cls = '') {
  const [w, h] = spriteSize(name, px);
  return `<svg class="${cls}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${spriteRects(name, frame, px)}</svg>`;
}

/* ================= Подсветка синтаксиса ================= */
const KW = new Set('False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield'.split(' '));
const BI = new Set('print input len range int str float bool list dict set tuple type sum min max sorted abs round open enumerate zip map filter isinstance super reversed any all'.split(' '));
function highlight(code) {
  const re = /(#[^\n]*)|((?:[rRbBfF]{1,2})?(?:"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?))|(\b\d+(?:\.\d+)?\b)|([A-Za-z_Ѐ-ӿ][\wЀ-ӿ]*)|([\s\S])/g;
  let out = '', m;
  while ((m = re.exec(code))) {
    if (m[1] !== undefined) out += `<span class="t-com">${esc(m[1])}</span>`;
    else if (m[2] !== undefined) out += `<span class="t-str">${esc(m[2])}</span>`;
    else if (m[3] !== undefined) out += `<span class="t-num">${m[3]}</span>`;
    else if (m[4] !== undefined) {
      const w = m[4];
      if (KW.has(w)) out += `<span class="t-kw">${w}</span>`;
      else if (w === 'self') out += `<span class="t-self">${w}</span>`;
      else if (BI.has(w)) out += `<span class="t-bi">${w}</span>`;
      else if (code[re.lastIndex] === '(') out += `<span class="t-fn">${esc(w)}</span>`;
      else out += esc(w);
    } else out += esc(m[5]);
  }
  return out;
}
function highlightBlocks(root) {
  $$('pre', root).forEach(p => { p.innerHTML = `<code>${highlight(p.textContent)}</code>`; });
}

/* ================= Python (Pyodide) ================= */
const RUNNER = String.raw`
import sys, io, json, builtins, traceback

class _PQTimeout(Exception):
    pass

def __pq_run(code, inputs_json, test, limit):
    inputs = list(json.loads(inputs_json))
    used = []
    buf = io.StringIO()
    old_out, old_err = sys.stdout, sys.stderr
    sys.stdout = buf
    sys.stderr = buf
    def _input(prompt=""):
        if not inputs:
            raise EOFError("Ввод закончился: программа вызвала input() больше раз, чем есть данных")
        v = str(inputs.pop(0))
        used.append(v)
        return v
    steps = [0]
    def tracer(frame, event, arg):
        if frame.f_code.co_filename != "<code>":
            return None
        if event == "line":
            steps[0] += 1
            if limit and steps[0] > limit:
                raise _PQTimeout()
        return tracer
    g = {"__name__": "__main__", "__builtins__": builtins, "input": _input}
    res = {"out": "", "err": None, "etype": None, "line": None, "test": None}
    sys.settrace(tracer)
    try:
        exec(compile(code, "<code>", "exec"), g)
    except SyntaxError as e:
        res["etype"] = type(e).__name__
        res["err"] = type(e).__name__ + ": " + str(e.msg)
        res["line"] = e.lineno
    except _PQTimeout:
        res["etype"] = "Timeout"
        res["err"] = "Программа выполнялась слишком долго"
    except BaseException as e:
        res["etype"] = type(e).__name__
        msg = str(e)
        res["err"] = type(e).__name__ + (": " + msg if msg else "")
        for fr in traceback.extract_tb(e.__traceback__):
            if fr.filename == "<code>":
                res["line"] = fr.lineno
    finally:
        sys.settrace(None)
    res["out"] = buf.getvalue()
    if res["err"] is None and test:
        sys.stdout = io.StringIO()
        try:
            exec(test, g)
        except AssertionError as e:
            res["test"] = str(e) or "Скрытая проверка не пройдена — функция работает неправильно для других значений"
        except BaseException as e:
            res["test"] = type(e).__name__ + ": " + str(e)
    sys.stdout, sys.stderr = old_out, old_err
    res["inputs"] = used
    return json.dumps(res, ensure_ascii=False)

_PQ_G = {}

def _pq_limited(fn, limit):
    steps = [0]
    def tracer(frame, event, arg):
        if frame.f_code.co_filename != "<code>":
            return None
        if event == "line":
            steps[0] += 1
            if limit and steps[0] > limit:
                raise _PQTimeout()
        return tracer
    sys.settrace(tracer)
    try:
        return fn()
    finally:
        sys.settrace(None)

def _pq_err(e):
    if isinstance(e, _PQTimeout):
        return "Функция выполнялась слишком долго (бесконечный цикл?)"
    line = None
    for fr in traceback.extract_tb(e.__traceback__):
        if fr.filename == "<code>":
            line = fr.lineno
    msg = type(e).__name__ + (": " + str(e) if str(e) else "")
    return msg + (f" (строка {line})" if line else "")

def __pq_load(code, limit):
    # загружает код игрока для режима игры: функции остаются в памяти
    global _PQ_G
    def _noinput(prompt=""):
        raise EOFError("в режиме игры input() не используется")
    g = {"__name__": "__pqgame__", "__builtins__": builtins, "input": _noinput}
    old = sys.stdout
    sys.stdout = io.StringIO()
    err = None
    try:
        _pq_limited(lambda: exec(compile(code, "<code>", "exec"), g), limit)
    except BaseException as e:
        err = _pq_err(e)
    finally:
        sys.stdout = old
    _PQ_G = g
    return json.dumps({"err": err}, ensure_ascii=False)

def _pq_tup(x):
    # из JSON приходят списки; пары чисел [x, y] превращаем обратно в кортежи (x, y)
    if isinstance(x, list):
        if len(x) == 2 and all(type(v) is int for v in x):
            return tuple(x)
        return [_pq_tup(v) for v in x]
    if isinstance(x, dict):
        return {k: _pq_tup(v) for k, v in x.items()}
    return x

def __pq_call(name, args_json, limit):
    if name.startswith("="):
        v = _PQ_G.get(name[1:])
        return json.dumps({"result": v if isinstance(v, (int, float, str)) else None})
    f = _PQ_G.get(name)
    if not callable(f):
        return json.dumps({"err": f"Функция {name}() не найдена — дойди до нужного шага проекта"}, ensure_ascii=False)
    args = _pq_tup(json.loads(args_json))
    old = sys.stdout
    sys.stdout = io.StringIO()
    try:
        r = _pq_limited(lambda: f(*args), limit)
        return json.dumps({"result": r}, ensure_ascii=False)
    except BaseException as e:
        return json.dumps({"err": f"{name}(): " + _pq_err(e)}, ensure_ascii=False)
    finally:
        sys.stdout = old
`;

function workerMain(url, runnerSrc) {
  /* eslint-disable no-undef */
  let runFn = null, loadFn = null, callFn = null;
  try {
    importScripts(url + 'pyodide.js');
  } catch (e) { postMessage({ type: 'fail', msg: 'Не удалось загрузить Pyodide: ' + e }); return; }
  loadPyodide({ indexURL: url }).then(py => {
    py.runPython(runnerSrc);
    runFn = py.globals.get('__pq_run');
    loadFn = py.globals.get('__pq_load');
    callFn = py.globals.get('__pq_call');
    postMessage({ type: 'ready' });
  }).catch(e => postMessage({ type: 'fail', msg: String(e) }));
  onmessage = e => {
    const d = e.data;
    let json;
    try {
      if (d.kind === 'load') json = loadFn(d.code, d.limit);
      else if (d.kind === 'call') json = callFn(d.name, JSON.stringify(d.args || []), d.limit);
      else json = runFn(d.code, JSON.stringify(d.inputs || []), d.test || '', d.limit);
    }
    catch (err) { json = JSON.stringify({ out: '', err: String(err), etype: 'InternalError' }); }
    postMessage({ type: 'result', id: d.id, json });
  };
}

const PY = {
  state: 'loading', mode: null, worker: null, main: null, pending: null, seq: 0, listeners: [],
  init() {
    try { this.startWorker(); } catch (e) { this.startMain(); }
  },
  setState(s, msg) { this.state = s; this.msg = msg; this.listeners.forEach(f => f(s, msg)); },
  startWorker() {
    this.mode = 'worker';
    this.setState('loading');
    const src = `(${workerMain.toString()})(${JSON.stringify(PYODIDE_URL)}, ${JSON.stringify(RUNNER)});`;
    const w = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
    this.worker = w;
    w.onmessage = e => {
      const d = e.data;
      if (d.type === 'ready') this.setState('ready');
      else if (d.type === 'fail') { w.terminate(); this.startMain(); }
      else if (d.type === 'result' && this.pending && this.pending.id === d.id) {
        clearTimeout(this.pending.timer);
        const p = this.pending; this.pending = null;
        p.resolve(JSON.parse(d.json));
      }
    };
    w.onerror = () => { if (this.state !== 'ready') { w.terminate(); this.startMain(); } };
  },
  async startMain() {
    // запасной вариант: Python в основном потоке (защита от бесконечных циклов — лимит шагов)
    if (this.mode === 'main') return;
    this.mode = 'main';
    this.setState('loading');
    try {
      if (!window.loadPyodide) await new Promise((res, rej) => {
        const s = document.createElement('script'); s.src = PYODIDE_URL + 'pyodide.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s);
      });
      const py = await window.loadPyodide({ indexURL: PYODIDE_URL });
      py.runPython(RUNNER);
      this.main = py.globals.get('__pq_run');
      this.mainLoad = py.globals.get('__pq_load');
      this.mainCall = py.globals.get('__pq_call');
      this.setState('ready');
    } catch (e) {
      this.setState('fail', 'Не удалось загрузить Python. Нужен интернет при первом запуске.');
    }
  },
  run(code, inputs = [], test = '') { return this.request({ kind: 'run', code, inputs, test }); },
  load(code) { return this.request({ kind: 'load', code }); },
  call(name, ...args) { return this.request({ kind: 'call', name, args }, 3000); },
  request(msg, timeout = RUN_TIMEOUT) {
    if (this.state !== 'ready') return Promise.resolve({ out: '', err: 'Python ещё загружается, подожди пару секунд…', etype: 'Loading' });
    if (this.pending) return Promise.resolve({ out: '', err: 'Python занят предыдущей программой', etype: 'Busy' });
    if (this.mode === 'main') {
      return new Promise(res => setTimeout(() => {
        try {
          const j = msg.kind === 'load' ? this.mainLoad(msg.code, STEP_LIMIT)
            : msg.kind === 'call' ? this.mainCall(msg.name, JSON.stringify(msg.args || []), STEP_LIMIT)
            : this.main(msg.code, JSON.stringify(msg.inputs || []), msg.test || '', STEP_LIMIT);
          res(JSON.parse(j));
        } catch (e) { res({ out: '', err: String(e), etype: 'InternalError' }); }
      }, 0));
    }
    return new Promise(resolve => {
      const id = ++this.seq;
      const timer = setTimeout(() => {
        // бесконечный цикл где-то внутри — перезапускаем Python
        this.pending = null;
        this.worker.terminate();
        this.startWorker();
        resolve({ out: '', err: 'Программа выполнялась слишком долго', etype: 'Timeout' });
      }, timeout);
      this.pending = { id, resolve, timer };
      this.worker.postMessage(Object.assign({ id, limit: STEP_LIMIT }, msg));
    });
  },
};

function bindPyStatus(ledId, textId) {
  const led = document.getElementById(ledId), txt = document.getElementById(textId);
  const upd = (s, msg) => {
    led.className = 'led' + (s === 'ready' ? ' ok' : s === 'fail' ? ' bad' : '');
    txt.textContent = s === 'ready' ? 'Python готов' : s === 'fail' ? (msg || 'Ошибка загрузки') : 'Python загружается…';
    $$('#btn-run, #btn-check, #btn-sb-run').forEach(b => { b.disabled = s !== 'ready'; });
  };
  PY.listeners.push(upd); upd(PY.state, PY.msg);
}

/* ================= Понятные ошибки ================= */
const ERR_HELP = {
  SyntaxError: 'Синтаксическая ошибка: Python не понимает запись. Проверь скобки, кавычки, двоеточия после if/for/def.',
  IndentationError: 'Ошибка отступа: строки внутри блока (после двоеточия) должны быть сдвинуты на 4 пробела, одинаково.',
  TabError: 'Смешаны табы и пробелы в отступах. Используй только пробелы.',
  NameError: 'Такое имя не найдено. Возможно опечатка, переменная ещё не создана, или ты забыл кавычки у строки.',
  TypeError: 'Операция не подходит для этого типа. Например, нельзя сложить строку и число — используй str() или int().',
  ValueError: 'Неподходящее значение. Например, int("abc") — буквы нельзя превратить в число.',
  IndexError: 'Индекс за пределами. Помни: индексы начинаются с 0, последний — len()-1.',
  KeyError: 'Такого ключа нет в словаре. Можно использовать .get(ключ, по_умолчанию).',
  ZeroDivisionError: 'Деление на ноль!',
  AttributeError: 'У этого объекта нет такого метода/атрибута. Проверь написание (например, .upper(), а не .uppper()).',
  EOFError: 'Программа просит больше input(), чем есть данных в задании.',
  Timeout: 'Похоже на бесконечный цикл: проверь условие while и что переменная в цикле меняется.',
  RecursionError: 'Слишком глубокая рекурсия: у функции нет базового случая или он не срабатывает.',
  UnboundLocalError: 'Переменная используется в функции до присваивания. Для внешней переменной нужен global.',
  FileNotFoundError: 'Файл не найден. Сначала создай его (режим "w").',
};

/* ================= Проверка ответа ================= */
function norm(s) {
  const lines = String(s).replace(/\r/g, '').split('\n').map(l => l.replace(/\s+$/, ''));
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines.join('\n');
}
function mustOk(code, m) { return m.startsWith('re:') ? new RegExp(m.slice(3)).test(code) : code.includes(m); }
function verify(ex, code, r) {
  if (r.err) return { ok: false, kind: 'error' };
  if ('e' in ex && norm(r.out) !== norm(ex.e)) return { ok: false, kind: 'output' };
  if (r.test) return { ok: false, kind: 'test', msg: r.test };
  const miss = (ex.m || []).filter(m => !mustOk(code, m));
  if (miss.length) {
    const plain = miss.filter(m => !m.startsWith('re:'));
    return { ok: false, kind: 'must', msg: plain.length ? 'В коде должно встречаться: ' + plain.map(m => `<code>${esc(m.trim())}</code>`).join(', ') : 'Вывод верный, но решение записано не тем способом, который просит задание. Загляни в подсказку 💡' };
  }
  return { ok: true };
}

/* ================= Редактор кода ================= */
class Editor {
  constructor(host, opts = {}) {
    this.opts = opts;
    host.innerHTML = `<div class="editor"><div class="gutter">1</div><div class="ed-wrap"><pre aria-hidden="true"><code></code></pre><textarea spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="Редактор кода"></textarea></div></div>
      <div class="symbar">${['⇥', ':', '(', ')', '"', "'", '[', ']', '{', '}', '=', '+', '-', '*', '/', '%', '.', ',', '#', '_', '<', '>', '←', '→'].map(s => `<button type="button" data-s="${esc(s)}">${esc(s)}</button>`).join('')}</div>`;
    this.ta = $('textarea', host); this.pre = $('pre code', host); this.gutter = $('.gutter', host);
    this.ta.addEventListener('input', () => this.refresh(true));
    this.ta.addEventListener('scroll', () => { this.pre.parentElement.scrollLeft = this.ta.scrollLeft; });
    this.ta.addEventListener('keydown', e => this.onKey(e));
    $$('.symbar button', host).forEach(b => {
      b.addEventListener('pointerdown', e => { e.preventDefault(); this.sym(b.dataset.s); });
      b.addEventListener('click', e => e.preventDefault());
    });
  }
  get value() { return this.ta.value; }
  set value(v) { this.ta.value = v; this.refresh(false); }
  refresh(changed) {
    const v = this.ta.value;
    this.pre.innerHTML = highlight(v) + '\n';
    const n = v.split('\n').length;
    this.gutter.textContent = Array.from({ length: n }, (_, i) => i + 1).join('\n');
    const rows = Math.max(this.opts.minRows || 7, n + 1);
    this.ta.style.height = (rows * 24 + 20 + 14) + 'px';
    this.pre.parentElement.scrollLeft = this.ta.scrollLeft;
    if (changed && this.opts.onChange) this.opts.onChange(v);
  }
  insert(text) {
    this.ta.focus();
    let ok = false;
    try { ok = document.execCommand('insertText', false, text); } catch (e) { }
    if (!ok) { this.ta.setRangeText(text, this.ta.selectionStart, this.ta.selectionEnd, 'end'); }
    this.refresh(true);
  }
  sym(s) {
    SFX.click();
    const ta = this.ta;
    if (s === '⇥') return this.insert('    ');
    if (s === '←' || s === '→') {
      ta.focus();
      const p = Math.max(0, Math.min(ta.value.length, ta.selectionStart + (s === '→' ? 1 : -1)));
      ta.setSelectionRange(p, p); return;
    }
    this.insert(s);
  }
  onKey(e) {
    const ta = this.ta, v = ta.value, st = ta.selectionStart, en = ta.selectionEnd;
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); if (this.opts.onSubmit) this.opts.onSubmit(e.shiftKey); return; }
    if (e.key === 'Tab') {
      e.preventDefault();
      const ls = v.lastIndexOf('\n', st - 1) + 1;
      if (st !== en || e.shiftKey) {
        const le = v.indexOf('\n', en - (en > st && v[en - 1] === '\n' ? 1 : 0));
        const end = le === -1 ? v.length : le;
        const block = v.slice(ls, end);
        const nb = e.shiftKey ? block.replace(/^ {1,4}/gm, '') : block.replace(/^/gm, '    ');
        ta.setSelectionRange(ls, end);
        this.insert(nb);
        ta.setSelectionRange(ls, ls + nb.length);
      } else this.insert('    ');
      return;
    }
    if (e.key === 'Enter' && !e.isComposing) {
      e.preventDefault();
      const ls = v.lastIndexOf('\n', st - 1) + 1;
      const line = v.slice(ls, st);
      let ind = line.match(/^ */)[0];
      if (/:\s*(#.*)?$/.test(line)) ind += '    ';
      else if (/^\s*(return|break|continue|pass|raise)\b/.test(line)) ind = ind.slice(0, Math.max(0, ind.length - 4));
      this.insert('\n' + ind);
      return;
    }
    if (e.key === 'Backspace' && st === en && st > 0) {
      const ls = v.lastIndexOf('\n', st - 1) + 1;
      const before = v.slice(ls, st);
      if (before.length && /^ +$/.test(before)) {
        e.preventDefault();
        const k = before.length % 4 || 4;
        ta.setSelectionRange(st - k, st);
        this.insert('');
      }
    }
  }
}

/* ================= Экраны ================= */
function show(name) {
  $$('.screen').forEach(s => s.classList.toggle('hidden', s.id !== 'screen-' + name));
  window.scrollTo(0, 0);
  if (name === 'map') renderMap(true);
  if (name === 'review') renderReview();
  if (name === 'sandbox') { sandboxEd.value = S.sandbox || 'name = "Claude"\nprint(f"Привет, {name}!")\n'; }
}
function toast(msg, ms = 1800) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), ms);
}
let modalCleanup = null;
function modal(html, onMount) {
  if (modalCleanup) { modalCleanup(); modalCleanup = null; }
  const root = $('#modal-root');
  root.innerHTML = `<div class="modal-back"><div class="modal px">${html}</div></div>`;
  const back = $('.modal-back', root);
  back.addEventListener('click', e => { if (e.target === back) closeModal(); });
  $$('[data-close]', root).forEach(b => b.addEventListener('click', closeModal));
  if (onMount) onMount($('.modal', root));
}
function closeModal() { if (modalCleanup) { modalCleanup(); modalCleanup = null; } $('#modal-root').innerHTML = ''; }
function updateHud() {
  $('#hud-streak').textContent = S.streak;
  $('#hud-lvl').textContent = level();
  $('#hud-bar').style.width = ((S.xp % 150) / 150 * 100) + '%';
}

/* ================= Карта ================= */
const THEMES = {
  grass: { bg: '#3e8948', bg2: '#4a9b52', road: '#c28569', edge: '#733e39', line: '#ead4aa', deco: ['tree', 'tree', 'bush', 'flower', 'flower'] },
  forest: { bg: '#265c42', bg2: '#2d6a4c', road: '#a0694b', edge: '#3e2731', line: '#e4a672', deco: ['pine', 'pine', 'pine', 'mushroom', 'bush'] },
  desert: { bg: '#e4a672', bg2: '#eab27f', road: '#b86f50', edge: '#733e39', line: '#f7d9a8', deco: ['cactus', 'cactus', 'rock', 'dune', 'dune'] },
  snow: { bg: '#c0cbdc', bg2: '#d3dbe8', road: '#8b9bb4', edge: '#3a4466', line: '#ffffff', deco: ['snowpine', 'snowpine', 'snowman', 'crystal', 'crystal'] },
  mountain: { bg: '#5a6988', bg2: '#64759a', road: '#3a4466', edge: '#1a1c2c', line: '#c0cbdc', deco: ['peak', 'peak', 'rock', 'rock', 'snowpine'] },
  castle: { bg: '#3f2832', bg2: '#4a2f3b', road: '#8b9bb4', edge: '#1a1c2c', line: '#c0cbdc', deco: ['tower', 'torch', 'torch', 'rock'] },
  lava: { bg: '#2a1a24', bg2: '#33202c', road: '#262b44', edge: '#0d0e17', line: '#ef7d57', deco: ['lavarock', 'fire', 'fire', 'lavarock'] },
  arcade: { bg: '#1d1240', bg2: '#2a1a5e', road: '#29366f', edge: '#0d0e17', line: '#73eff7', deco: ['arcade', 'coin', 'coin', 'star', 'star', 'snakeSpr'] },
};
const MAP_W = 400, GAP = 124, BANNER_H = 190, TOP = 30;
const XS = [200, 300, 200, 100];
let MAP = null; // геометрия карты

function mapGeometry() {
  const nodes = [], bands = [];
  let y = TOP;
  WORLDS.forEach((w, wi) => {
    const start = y;
    const bannerY = y + 70;
    y += BANNER_H;
    w.lessons.forEach(l => { nodes[l.idx] = { x: XS[l.idx % 4], y: y + 20, l }; y += GAP; });
    bands.push({ wi, y0: wi === 0 ? 0 : start, y1: y, bannerY });
  });
  const H = y + 40;
  bands[bands.length - 1].y1 = H;
  // дорога: вертикаль → горизонталь → вертикаль
  const pts = [[nodes[0].x, 0]];
  nodes.forEach((n, i) => {
    if (i === 0) { pts.push([n.x, n.y]); return; }
    const p = nodes[i - 1], mid = Math.round((p.y + n.y) / 2 / 4) * 4;
    pts.push([p.x, mid], [n.x, mid], [n.x, n.y]);
  });
  return { nodes, bands, H, pts };
}
function rng(seed) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
function distToRoad(x, y, pts) {
  let d = 1e9;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
    const minx = Math.min(ax, bx), maxx = Math.max(ax, bx), miny = Math.min(ay, by), maxy = Math.max(ay, by);
    const dx = x < minx ? minx - x : x > maxx ? x - maxx : 0;
    const dy = y < miny ? miny - y : y > maxy ? y - maxy : 0;
    d = Math.min(d, Math.hypot(dx, dy));
  }
  return d;
}

function renderMap(animate) {
  const scrollEl = $('#map-scroll'), map = $('#map');
  const k = Math.min(1.35, Math.max(0.8, (scrollEl.clientWidth || window.innerWidth) / MAP_W));
  const G = MAP = mapGeometry();
  const W = MAP_W * k, H = G.H * k;
  map.style.width = W + 'px'; map.style.height = H + 'px';
  // фон миров на всю ширину экрана
  scrollEl.style.background = 'linear-gradient(to bottom,' + G.bands.map(b => { const c = THEMES[WORLDS[b.wi].theme].bg; return `${c} ${b.y0 * k}px,${c} ${b.y1 * k}px`; }).join(',') + ')';

  let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${MAP_W} ${G.H}" shape-rendering="crispEdges" style="position:absolute;left:0;top:0">`;
  // фон — полосы мира с «плиткой»
  G.bands.forEach(b => {
    const th = THEMES[WORLDS[b.wi].theme];
    svg += `<rect x="-200" y="${b.y0}" width="${MAP_W + 400}" height="${b.y1 - b.y0}" fill="${th.bg}"/>`;
    const r = rng(b.wi * 97 + 13);
    for (let i = 0; i < 70; i++) {
      const x = Math.floor(r() * 100) * 4, y = b.y0 + Math.floor(r() * (b.y1 - b.y0) / 4) * 4;
      svg += `<rect x="${x}" y="${y}" width="${r() < .5 ? 4 : 8}" height="4" fill="${th.bg2}"/>`;
    }
  });
  // переходы между мирами — зубчатая граница
  G.bands.slice(1).forEach(b => {
    const prev = THEMES[WORLDS[b.wi - 1].theme];
    for (let x = 0; x < MAP_W; x += 8) svg += `<rect x="${x}" y="${b.y0}" width="8" height="${(x / 8) % 2 ? 4 : 8}" fill="${prev.bg}"/>`;
  });
  // дорога
  const path = 'M' + G.pts.map(p => p.join(',')).join(' L');
  G.bands.forEach(b => {
    const th = THEMES[WORLDS[b.wi].theme];
    const id = 'clip' + b.wi;
    svg += `<clipPath id="${id}"><rect x="-10" y="${b.y0}" width="${MAP_W + 20}" height="${b.y1 - b.y0}"/></clipPath><g clip-path="url(#${id})">
      <path d="${path}" fill="none" stroke="${th.edge}" stroke-width="44" stroke-linejoin="miter" stroke-linecap="square"/>
      <path d="${path}" fill="none" stroke="${th.road}" stroke-width="32" stroke-linejoin="miter" stroke-linecap="square"/>
      <path d="${path}" fill="none" stroke="${th.line}" stroke-width="4" stroke-dasharray="8 12" opacity=".7"/></g>`;
  });
  // декорации
  G.bands.forEach(b => {
    const th = THEMES[WORLDS[b.wi].theme];
    const r = rng(b.wi * 31 + 7);
    let placed = 0, tries = 0;
    const spots = [];
    while (placed < Math.round((b.y1 - b.y0) / 55) && tries < 600) {
      tries++;
      const x = 8 + r() * (MAP_W - 40), y = b.y0 + 20 + r() * (b.y1 - b.y0 - 60);
      if (Math.abs(y - b.bannerY) < 50) continue;
      if (distToRoad(x + 16, y + 20, G.pts) < 46) continue;
      if (G.nodes.some(n => y < n.y + 30 && y + 48 > n.y - 30 && (n.x <= 200 ? x + 44 > n.x - 36 && x < n.x + 200 : x + 44 > n.x - 200 && x < n.x + 36))) continue; // не под узлом и подписью
      if (spots.some(([sx, sy]) => Math.abs(sx - x) < 36 && Math.abs(sy - y) < 40)) continue;
      spots.push([x, y]);
      const name = th.deco[Math.floor(r() * th.deco.length)];
      svg += `<g transform="translate(${Math.round(x / 4) * 4},${Math.round(y / 4) * 4})">${spriteRects(name, 0, 4)}</g>`;
      placed++;
    }
  });
  svg += '</svg>';

  let html = svg;
  G.bands.forEach(b => {
    const w = WORLDS[b.wi];
    const done = w.lessons.filter(isComplete).length;
    html += `<div class="banner" style="top:${b.bannerY * k}px"><div class="w">МИР ${b.wi + 1} · ${done}/${w.lessons.length}</div><div class="n">${esc(w.name)}</div><div class="s">${esc(w.sub)}</div></div>`;
  });
  const cur = currentIdx();
  G.nodes.forEach(n => {
    const l = n.l, st = S.lessons[l.id];
    const complete = isComplete(l), open = isUnlocked(l);
    const cls = complete ? 'done' : (open ? (l.idx === cur || S.unlockAll ? 'open' : 'open') : 'locked');
    const size = (l.boss ? 64 : 52) * k;
    const label = l.project ? (open ? '🎮' : '🔒') : l.boss ? '☠' : complete ? '★' : open ? (l.idx + 1) : '🔒';
    html += `<div class="node ${cls}${l.boss ? ' boss' : ''}" data-idx="${l.idx}" style="left:${n.x * k}px;top:${n.y * k}px;width:${size}px;height:${size}px;font-size:${(open ? 13 : 12) * k}px">${label}</div>`;
    const right = n.x <= 200;
    const pos = right ? `left:${(n.x + 36) * k}px` : `right:${(MAP_W - n.x + 36) * k}px`;
    const stars = complete ? `<span class="stars">${'★'.repeat(st.stars)}${'☆'.repeat(3 - st.stars)}</span>` : '';
    html += `<div class="nlabel${open ? '' : ' locked'}" style="${pos};top:${n.y * k}px;font-size:${8 * Math.min(k, 1.15)}px;max-width:${150 * k}px">${esc(l.title)}${stars}</div>`;
  });
  html += `<div id="claude"><div class="bob">${spriteSVG('claude', Math.round(4 * k))}</div></div>`;
  map.innerHTML = html;

  $$('.node', map).forEach(el => el.addEventListener('click', () => {
    const l = ALL[+el.dataset.idx];
    if (!isUnlocked(l)) { SFX.bad(); toast('🔒 Сначала пройди предыдущий урок'); return; }
    SFX.click(); openLesson(l, isComplete(l) ? 'replay' : 'lesson');
  }));

  const target = cur;
  const from = Math.min(S.pos || 0, ALL.length - 1);
  if (animate && from !== target && from < target) walkClaude(from, target, k);
  else { placeClaude(target, k); scrollToNode(target, k, false); }
  updateHud();
  $('#btn-continue').textContent = ALL.every(isComplete) ? '🏆 Сертификат' : '▶ Продолжить';
}
function placeClaudeXY(x, y, k) {
  const c = $('#claude'); if (!c) return;
  c.style.left = x * k + 'px'; c.style.top = (y - 22) * k + 'px';
}
function placeClaude(idx, k) { const n = MAP.nodes[idx]; placeClaudeXY(n.x, n.y - (n.l.boss ? 6 : 0), k); }
function scrollToNode(idx, k, smooth) {
  const n = MAP.nodes[idx];
  const top = $('#map-scroll').offsetTop + n.y * k - window.innerHeight / 2;
  window.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'auto' });
}
function walkClaude(from, to, k) {
  // собираем точки пути от узла from до узла to
  const pts = [];
  for (let i = from; i <= to; i++) {
    const n = MAP.nodes[i];
    if (i > from) { const p = MAP.nodes[i - 1], mid = Math.round((p.y + n.y) / 2 / 4) * 4; pts.push([p.x, mid], [n.x, mid]); }
    pts.push([n.x, n.y]);
  }
  placeClaude(from, k); scrollToNode(from, k, false);
  const c = $('#claude'); const bob = $('.bob', c);
  bob.style.animation = 'none';
  let seg = 0, t0 = null, frame = 0, lastF = 0;
  const speed = 0.16; // ед./мс
  const segLen = i => Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
  setTimeout(() => {
    const step = ts => {
      if (!$('#claude') || $('#screen-map').classList.contains('hidden')) return;
      if (t0 === null) t0 = ts;
      let d = (ts - t0) * speed;
      seg = 0;
      while (seg < pts.length - 1 && d > segLen(seg)) { d -= segLen(seg); seg++; }
      if (seg >= pts.length - 1) {
        placeClaude(to, k); S.pos = to; save(); bob.style.animation = '';
        bob.innerHTML = spriteSVG('claude', Math.round(4 * k), 0);
        SFX.ok();
        return;
      }
      const [ax, ay] = pts[seg], [bx, by] = pts[seg + 1], L = segLen(seg) || 1;
      const x = ax + (bx - ax) * d / L, y = ay + (by - ay) * d / L;
      placeClaudeXY(x, y, k);
      if (ts - lastF > 140) { frame ^= 1; lastF = ts; bob.innerHTML = spriteSVG('claude', Math.round(4 * k), frame); if (frame) SFX.step(); }
      const top = $('#map-scroll').offsetTop + y * k - window.innerHeight / 2;
      window.scrollTo(0, Math.max(0, top));
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, 350);
}

/* ================= Урок ================= */
let LES = null; // текущая сессия: {title, items:[{lesson, k}], cur, mode, reveals}
let lessonEd = null;

function openLesson(lesson, mode = 'lesson') {
  const st = LS(lesson.id);
  const items = lesson.ex.map((ex, k) => ({ lesson, k }));
  let cur = mode === 'lesson' ? Math.max(0, st.done.findIndex(d => !d)) : 0;
  LES = { title: `${lesson.idx + 1}. ${lesson.title}`, items, cur, mode, reveals: 0, solved: items.map((it, i) => mode === 'lesson' && st.done[i]), lesson };
  startSession();
}
function openPractice(items, title) {
  if (!items.length) { toast('Пока нечего повторять'); return; }
  LES = { title, items, cur: 0, mode: 'review', reveals: 0, solved: items.map(() => false) };
  startSession();
}
function startSession() {
  show('lesson');
  $('#lesson-title').textContent = LES.title;
  renderExercise();
}
function exOf(it) { return it.lesson.ex[it.k]; }
// стартовый код: в проектах — твой код прошлого шага + заготовка нового
function starterCode(it) {
  const ex = exOf(it);
  if (!it.lesson.project || it.k === 0) return ex.s || '';
  const prevKey = it.lesson.id + '#' + (it.k - 1);
  const prev = S.proj[prevKey] || it.lesson.ex[it.k - 1].sol;
  return prev.replace(/\s+$/, '') + '\n\n' + ex.add;
}
// код для запуска игры: последний решённый шаг проекта (или текущий редактор)
function projectCode(lesson) {
  const last = lesson.ex.length - 1;
  return S.proj[lesson.id + '#' + last] || S.drafts[lesson.id + '#' + last] || lesson.ex[last].sol;
}
function draftKey(it) { return it.lesson.id + '#' + it.k; }

function renderExercise() {
  const it = LES.items[LES.cur], ex = exOf(it), lesson = it.lesson;
  // точки прогресса
  $('#dots').innerHTML = LES.items.map((_, i) => `<button class="dot${LES.solved[i] ? ' done' : ''}${i === LES.cur ? ' cur' : ''}" data-i="${i}">${LES.solved[i] ? '✓' : i + 1}</button>`).join('');
  $$('#dots .dot').forEach(d => d.addEventListener('click', () => { LES.cur = +d.dataset.i; renderExercise(); }));
  // теория
  const th = $('#theory');
  const thKey = lesson.project ? lesson.id + '#' + it.k : lesson.id;
  if (th.dataset.lesson !== thKey) {
    th.innerHTML = lesson.project ? `<div class="tag" style="background:var(--blue);color:#111">ГАЙД · ШАГ ${it.k + 1} ИЗ ${lesson.ex.length}</div><h3 style="margin:4px 0 6px">${esc(ex.title)}</h3>${ex.guide}` : lesson.theory;
    th.dataset.lesson = thKey; highlightBlocks(th);
    if (lesson.project) $('#theory-card').classList.remove('collapsed');
  }
  $('#theory-card h3').firstChild.textContent = lesson.project ? '🧭 Гайд ' : '📖 Теория ';
  $('#task-tag').innerHTML = LES.mode === 'review' ? `<span class="tag">${esc(lesson.title)}</span>` : '';
  $('#task-num').innerHTML = `${spriteSVG('claude', 2)} ${lesson.project ? `Шаг ${it.k + 1} из ${lesson.ex.length}: ${esc(ex.title)}` : `Задание ${LES.cur + 1} из ${LES.items.length}`}`;
  $('#task-text').innerHTML = ex.t;
  const inp = $('#task-inputs');
  if (ex.i && ex.i.length) { inp.classList.remove('hidden'); inp.innerHTML = '⌨ Ввод для input(): ' + ex.i.map(v => `<code>${esc(v)}</code>`).join(' '); }
  else inp.classList.add('hidden');
  lessonEd.value = S.drafts[draftKey(it)] ?? starterCode(it);
  $('#verdict').innerHTML = ''; $('#extra').innerHTML = ''; $('#next-row').innerHTML = '';
  $('#console-body').innerHTML = '<span class="note">Нажми «Проверить» (или Ctrl+Enter), чтобы запустить код и проверить ответ.</span>';
  LES.fails = 0;
  if (LES.solved[LES.cur]) showNextRow(true);
}

function renderConsole(el, r, inputs) {
  let h = '';
  if (r.inputs && r.inputs.length) h += `<span class="in">⌨ ввод: ${r.inputs.map(esc).join(', ')}</span>\n`;
  h += r.out ? `<span class="out">${esc(r.out)}</span>` : (r.err ? '' : '<span class="note">(программа ничего не вывела)</span>');
  if (r.err) {
    const help = ERR_HELP[r.etype] || '';
    h += `${r.out && !r.out.endsWith('\n') ? '\n' : ''}<span class="err">✖ ${esc(r.err)}${r.line ? ` (строка ${r.line})` : ''}</span>`;
    if (help) h += `\n<span class="note">💬 ${esc(help)}</span>`;
  }
  el.innerHTML = h;
}

async function runLesson(check) {
  const it = LES.items[LES.cur], ex = exOf(it), code = lessonEd.value;
  $('#console-body').innerHTML = '<span class="note">Выполняю…</span>';
  $('#verdict').innerHTML = '';
  const r = await PY.run(code, ex.i || [], check ? (ex.test || '') : '');
  renderConsole($('#console-body'), r);
  if (!check) return;
  const v = verify(ex, code, r);
  if (v.ok) return onSolved();
  LES.fails++;
  SFX.bad();
  let h = '<div class="verdict bad"><b class="pixel">✖ Пока не то</b>';
  if (v.kind === 'error') h += 'В программе ошибка — смотри консоль ниже.';
  else if (v.kind === 'output') h += `Вывод не совпадает с ожидаемым.<div class="cmp"><div><small>ОЖИДАЛОСЬ</small>${esc(norm(ex.e)) || '(пусто)'}</div><div><small>ПОЛУЧИЛОСЬ</small>${esc(norm(r.out)) || '(пусто)'}</div></div>`;
  else h += v.msg;
  if (LES.fails >= 2) h += '<div style="margin-top:8px;color:var(--yellow)">Застрял? Нажми 💡 для подсказки или 👁 для решения.</div>';
  h += '</div>';
  $('#verdict').innerHTML = h;
  markWeak(it, true);
}

function markWeak(it, add) {
  const key = draftKey(it);
  if (add) S.weak[key] = (S.weak[key] || 0) + 1; else delete S.weak[key];
  save();
}

function onSolved() {
  const it = LES.items[LES.cur];
  const st = LS(it.lesson.id);
  const first = !st.done[it.k];
  const gain = first ? 10 : 3;
  const lvl0 = level();
  S.xp += gain; bumpStreak();
  st.done[it.k] = true;
  if (it.lesson.project) S.proj[draftKey(it)] = lessonEd.value;
  if (!LES.revealedThis) markWeak(it, false);
  LES.revealedThis = false;
  LES.solved[LES.cur] = true;
  save();
  SFX.ok();
  const praise = ['Отлично!', 'Супер!', 'Так держать!', 'Чистый код!', 'Великолепно!', 'Claude гордится тобой!'];
  $('#verdict').innerHTML = `<div class="verdict ok"><b class="pixel">✔ ${praise[Math.floor(Math.random() * praise.length)]} +${gain} XP</b>Задание выполнено.</div>`;
  const icon = $('#task-num svg'); if (icon) { icon.classList.remove('jump'); void icon.offsetWidth; icon.classList.add('jump'); }
  $$('#dots .dot')[LES.cur].className = 'dot done cur';
  $$('#dots .dot')[LES.cur].textContent = '✓';
  updateHud();
  if (level() > lvl0) setTimeout(() => toast(`⬆ Новый уровень: ${level()}!`), 400);
  showNextRow(false);
}

function showNextRow(already) {
  const allDone = LES.solved.every(Boolean);
  const nextIdx = LES.solved.findIndex((d, i) => !d && i > LES.cur);
  const anyIdx = nextIdx !== -1 ? nextIdx : LES.solved.findIndex(d => !d);
  const row = $('#next-row');
  if (allDone) row.innerHTML = `<button class="btn orange grow" id="btn-next">🏁 Завершить</button>`;
  else row.innerHTML = `<button class="btn orange grow" id="btn-next">Дальше →</button>`;
  const it = LES.items[LES.cur];
  if (it.lesson.project && it.k === it.lesson.ex.length - 1 && LES.solved[LES.cur]) {
    row.insertAdjacentHTML('afterbegin', `<button class="btn blue grow" id="btn-play">🎮 Играть</button>`);
    $('#btn-play').onclick = () => playProject(it.lesson, lessonEd.value);
  }
  $('#btn-next').onclick = () => {
    SFX.click();
    if (allDone) return finishSession();
    LES.cur = anyIdx; renderExercise(); window.scrollTo({ top: $('#task-card').offsetTop - 70, behavior: 'smooth' });
  };
  if (!already) $('#btn-next').focus({ preventScroll: true });
}

function finishSession() {
  SFX.win();
  if (LES.mode === 'review') {
    modal(`<div class="center"><div>${spriteSVG('claude', 6, 0, 'jump')}</div><h2>Тренировка завершена!</h2><p>Ты решил ${LES.items.length} задач. Повторение — мать учения 💪</p>
      <div class="row" style="justify-content:center"><button class="btn ghost" id="m-again">↻ Ещё</button><button class="btn orange" id="m-map">На карту</button></div></div>`, m => {
      $('#m-map', m).onclick = () => { closeModal(); show('map'); };
      $('#m-again', m).onclick = () => { closeModal(); show('review'); };
    });
    return;
  }
  const lesson = LES.lesson, st = LS(lesson.id);
  const stars = Math.max(1, 3 - LES.reveals);
  const wasComplete = st.complete;
  st.complete = true;
  st.stars = Math.max(st.stars || 0, stars);
  if (!wasComplete) S.xp += 20;
  save(true);
  const next = ALL[lesson.idx + 1];
  const worldDone = !next || next.wi !== lesson.wi;
  const allDone = ALL.every(isComplete);
  modal(`<div class="center"><div>${spriteSVG('claude', 6, 0, 'jump')}</div>
    <h2>${lesson.project ? '🎮 Игра написана!' : lesson.boss ? '☠ БОСС ПОВЕРЖЕН!' : worldDone && !wasComplete ? '🏆 Мир пройден!' : 'Урок пройден!'}</h2>
    <div class="big-stars">${'★'.repeat(stars)}<span class="off">${'★'.repeat(3 - stars)}</span></div>
    <p>${esc(lesson.title)}${wasComplete ? '' : ' · +20 XP бонус'}</p>
    ${lesson.project ? '<p>Ты написал игру сам, шаг за шагом. Жми «Играть» — она работает на твоём коде!</p>' : ''}
    <p style="color:var(--muted);font-size:13px">${stars < 3 ? 'Звёзды снимаются за просмотр решений. Пройди урок снова, чтобы получить ★★★.' : 'Идеально — без подсказок решения!'}</p>
    <div class="row" style="justify-content:center">${lesson.project ? '<button class="btn blue" id="m-play">🎮 Играть</button>' : ''}<button class="btn ghost" id="m-retry">↻ Ещё раз</button><button class="btn orange" id="m-map">${allDone ? '🏆 Финал' : 'На карту →'}</button></div></div>`, m => {
    if (lesson.project) $('#m-play', m).onclick = () => { closeModal(); playProject(lesson, projectCode(lesson)); };
    $('#m-map', m).onclick = () => { closeModal(); show('map'); if (allDone && !wasComplete) setTimeout(showCertificate, 900); };
    $('#m-retry', m).onclick = () => { closeModal(); openLesson(lesson, 'replay'); };
  });
}

function showHint() {
  SFX.click();
  const ex = exOf(LES.items[LES.cur]);
  $('#extra').innerHTML = `<div class="hintbox">💡 ${esc(ex.h || 'Перечитай теорию слева — там есть пример.')}</div>`;
}
function showSolution() {
  const it = LES.items[LES.cur], ex = exOf(it);
  modal(`<h2>👁 Показать решение?</h2><p>Лучше сначала попробовать самому или посмотреть подсказку. За просмотр решения урок получит на одну звезду меньше, а задание попадёт в «Слабые места» для повторения.</p>
    <div class="row"><button class="btn ghost" data-close>Попробую сам</button><button class="btn yellow" id="m-show">Показать</button></div>`, m => {
    $('#m-show', m).onclick = () => {
      closeModal();
      if (!LES.solved[LES.cur]) LES.reveals++;
      LES.revealedThis = true;
      markWeak(it, true);
      $('#extra').innerHTML = `<div class="hintbox sol">Решение (перепиши его сам — так лучше запомнится):<pre class="code"><code>${highlight(ex.sol)}</code></pre><button class="btn small ghost" id="btn-paste">Вставить в редактор</button></div>`;
      $('#btn-paste').onclick = () => { lessonEd.value = ex.sol; S.drafts[draftKey(it)] = ex.sol; save(); };
    };
  });
}

/* ================= Повторение ================= */
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function renderReview() {
  const done = ALL.filter(l => isComplete(l) && !l.project);
  const projects = ALL.filter(l => l.project && isComplete(l));
  const weakItems = Object.keys(S.weak).map(k => { const [id, n] = k.split('#'); return byId[id] ? { lesson: byId[id], k: +n } : null; }).filter(Boolean);
  let h = `<div class="grid2">
    <div class="px mode-card" id="rv-random"><div class="pixel">🎯 Случайная тренировка</div><p>10 случайных задач из пройденных тем. Отличный способ освежить память.</p></div>
    <div class="px mode-card" id="rv-weak"><div class="pixel">🩹 Слабые места (${weakItems.length})</div><p>Задачи, где были ошибки или подсмотрено решение.</p></div>
    <div class="px mode-card" id="rv-last"><div class="pixel">🧠 Последние темы</div><p>Все задания трёх последних пройденных уроков вперемешку.</p></div>
  </div><h2>Пройденные темы</h2>`;
  if (projects.length) {
    h += `<h2>🎮 Мои игры</h2>`;
    projects.forEach(l => { h += `<div class="px lrow"><div class="t"><b>${esc(l.title.replace('Проект: ', ''))}</b><small style="color:var(--muted);letter-spacing:0">работает на твоём коде</small></div><button class="btn small ghost" data-rp="${l.id}">✎ Код</button><button class="btn small blue" data-play="${l.id}">🎮 Играть</button></div>`; });
  }
  if (!done.length) h += `<div class="px empty">Пройди первый урок — и здесь появятся темы для повторения.</div>`;
  WORLDS.forEach((w, wi) => {
    const ls = w.lessons.filter(l => isComplete(l) && !l.project);
    if (!ls.length) return;
    h += `<div class="pixel" style="font-size:9px;color:var(--muted);margin:16px 0 8px">МИР ${wi + 1} · ${esc(w.name)}</div>`;
    ls.forEach(l => {
      const st = S.lessons[l.id];
      h += `<div class="px lrow"><div class="t"><b>${l.idx + 1}. ${esc(l.title)}</b><small>${'★'.repeat(st.stars)}${'☆'.repeat(3 - st.stars)}</small></div>
        <button class="btn small ghost" data-th="${l.id}" title="Шпаргалка">📖</button><button class="btn small orange" data-rp="${l.id}">↻ ${l.ex.length} задач</button></div>`;
    });
  });
  $('#review-page').innerHTML = h;
  const allItems = () => done.flatMap(l => l.ex.map((_, k) => ({ lesson: l, k })));
  $('#rv-random').onclick = () => openPractice(shuffle(allItems()).slice(0, 10), '🎯 Случайная тренировка');
  $('#rv-weak').onclick = () => openPractice(shuffle(weakItems).slice(0, 10), '🩹 Слабые места');
  $('#rv-last').onclick = () => openPractice(shuffle(done.slice(-3).flatMap(l => l.ex.map((_, k) => ({ lesson: l, k })))), '🧠 Последние темы');
  $$('[data-rp]').forEach(b => b.onclick = () => openLesson(byId[b.dataset.rp], 'replay'));
  $$('[data-th]').forEach(b => b.onclick = () => showTheory(byId[b.dataset.th]));
  $$('[data-play]').forEach(b => b.onclick = () => { const l = byId[b.dataset.play]; playProject(l, projectCode(l)); });
}
function showTheory(l) {
  modal(`<h2>📖 ${esc(l.title)}</h2><div class="theory">${l.theory}</div><div class="row"><button class="btn ghost" data-close>Закрыть</button><button class="btn orange" id="m-rp">↻ Практика</button></div>`, m => {
    highlightBlocks(m);
    $('#m-rp', m).onclick = () => { closeModal(); openLesson(l, 'replay'); };
  });
}

/* ================= Настройки ================= */
function showSettings() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  modal(`<h2>⚙ Настройки</h2>
    <div class="toggle"><span>🔊 Звуки</span><button class="btn small ${S.sound ? 'green' : 'ghost'}" id="s-sound">${S.sound ? 'ВКЛ' : 'ВЫКЛ'}</button></div>
    <div class="toggle"><span>🔓 Открыть все уроки<br><small style="color:var(--muted)">если уже знаешь основы</small></span><button class="btn small ${S.unlockAll ? 'green' : 'ghost'}" id="s-unlock">${S.unlockAll ? 'ВКЛ' : 'ВЫКЛ'}</button></div>
    <div class="toggle"><span>📊 Прогресс: ${ALL.filter(isComplete).length}/${ALL.length} уроков, ${S.xp} XP</span></div>
    <h2 style="margin-top:18px">📲 Перенос прогресса</h2>
    <p style="font-size:14px;color:var(--muted)">Скопируй код на одном устройстве (ПК) и вставь на другом (iPhone), чтобы продолжить с того же места.</p>
    <div class="row"><button class="btn small blue" id="s-export">Скопировать код</button><button class="btn small ghost" id="s-import">Вставить код</button></div>
    <div id="s-io"></div>
    <h2 style="margin-top:18px">📱 Установка как приложение</h2>
    <p style="font-size:14px">${isIOS ? '<b>iPhone/iPad:</b> в Safari нажми «Поделиться» ⬆ → «На экран „Домой“». Игра откроется во весь экран, как приложение.' : '<b>ПК (Chrome/Edge):</b> значок «Установить» ⊕ в адресной строке. <b>iPhone:</b> открой эту же ссылку в Safari → «Поделиться» → «На экран „Домой“».'}<br><span style="color:var(--muted)">После первой загрузки игра работает и без интернета.</span></p>
    <div class="row" style="justify-content:space-between"><button class="btn small red" id="s-reset">Сбросить прогресс</button><button class="btn orange" data-close>Готово</button></div>`, m => {
    $('#s-sound', m).onclick = () => { S.sound = !S.sound; save(); showSettings(); };
    $('#s-unlock', m).onclick = () => { S.unlockAll = !S.unlockAll; save(); showSettings(); renderMap(false); };
    $('#s-export', m).onclick = async () => {
      const data = { xp: S.xp, lessons: S.lessons, weak: S.weak, streak: S.streak, lastDay: S.lastDay, pos: S.pos };
      const code = 'PQ1:' + btoa(unescape(encodeURIComponent(JSON.stringify(data))));
      $('#s-io', m).innerHTML = `<textarea class="plain" readonly>${code}</textarea>`;
      const ta = $('#s-io textarea', m); ta.select();
      try { await navigator.clipboard.writeText(code); toast('Код скопирован'); } catch (e) { toast('Выдели и скопируй код'); }
    };
    $('#s-import', m).onclick = () => {
      $('#s-io', m).innerHTML = `<textarea class="plain" placeholder="Вставь код PQ1:..."></textarea><div class="row"><button class="btn small green" id="s-apply">Загрузить</button></div>`;
      $('#s-apply', m).onclick = () => {
        try {
          const raw = $('#s-io textarea', m).value.trim().replace(/^PQ1:/, '');
          const data = JSON.parse(decodeURIComponent(escape(atob(raw))));
          if (typeof data.xp !== 'number' || typeof data.lessons !== 'object') throw new Error();
          Object.assign(S, data); save(true); closeModal(); renderMap(false); toast('Прогресс загружен!');
        } catch (e) { toast('Неверный код'); }
      };
    };
    $('#s-reset', m).onclick = () => {
      modal(`<h2>Сбросить весь прогресс?</h2><p>Все пройденные уроки, звёзды и опыт будут удалены. Это нельзя отменить.</p><div class="row"><button class="btn ghost" data-close>Отмена</button><button class="btn red" id="m-yes">Сбросить</button></div>`, mm => {
        $('#m-yes', mm).onclick = () => { Object.assign(S, { xp: 0, lessons: {}, weak: {}, streak: 0, lastDay: null, pos: 0, drafts: {} }); save(true); closeModal(); renderMap(false); };
      });
    };
  });
}
function showCertificate() {
  SFX.win();
  const stars = ALL.reduce((a, l) => a + ((S.lessons[l.id] || {}).stars || 0), 0);
  modal(`<div class="center"><div>${spriteSVG('claude', 7, 0, 'jump')}</div><h2>🏆 СЕРТИФИКАТ PYTHON-КОДЕРА</h2>
    <p>Ты прошёл весь путь вместе с Claude: ${ALL.length} уроков, ${TOTAL_TASKS} задач и написал две свои игры!</p>
    <div class="big-stars" style="font-size:20px">★ ${stars} / ${ALL.length * 3}</div>
    <p style="color:var(--muted);font-size:14px">Что дальше: пиши свои мини-проекты в Песочнице (игра «Угадай число», калькулятор, список дел), повторяй слабые места и бери задачки посложнее.</p>
    <div class="row" style="justify-content:center"><button class="btn orange" data-close>Ура!</button></div></div>`);
}

/* ================= Игры из проектов ================= */
async function playProject(lesson, code) {
  if (PY.state !== 'ready') { toast('Python ещё загружается…'); return; }
  SFX.click();
  const r = await PY.load(code);
  // ошибка в конце файла (например, input() в play_console) не мешает — функции уже созданы
  const warn = r.err && !/^EOFError/.test(r.err) ? r.err : '';
  if (lesson.play === 'snake') playSnake(warn); else playGuess(warn);
}
function gameErr(el, msg) {
  el.innerHTML = `<div class="verdict bad" style="margin-top:10px"><b class="pixel">✖ Ошибка в твоём коде</b>${esc(msg)}<div style="margin-top:6px;color:var(--muted)">Исправь функцию в проекте и запусти игру снова.</div></div>`;
  SFX.bad();
}

function playGuess(warn) {
  modal(`<h2>🔢 Угадай число</h2>
    <p id="g-msg">Я загадал число от 1 до 100. Попробуй угадать!</p>
    <div class="row" style="flex-wrap:nowrap"><input id="g-in" class="g-in" inputmode="numeric" autocomplete="off" placeholder="Число"><button class="btn green" id="g-go">Проверить</button></div>
    <div class="console" style="margin-top:12px"><div class="console-head">ПОПЫТКИ</div><div class="console-body" id="g-hist"><span class="note">Пока ни одной.</span></div></div>
    <div id="g-err">${warn ? `<p class="note" style="color:var(--yellow);font-size:13px">⚠ ${esc(warn)}</p>` : ''}</div>
    <p style="color:var(--muted);font-size:13px">Игра использует твои функции: <code>new_secret</code>, <code>is_valid</code>, <code>check_guess</code>, <code>rating</code>.</p>
    <div class="row"><button class="btn ghost" id="g-new">↻ Новая игра</button><button class="btn orange" data-close>Выход</button></div>`, async m => {
    let secret = null, attempts = 0, over = false;
    const msg = $('#g-msg', m), hist = $('#g-hist', m), inp = $('#g-in', m), errEl = $('#g-err', m);
    async function start() {
      const r = await PY.call('new_secret');
      if (r.err) return gameErr(errEl, r.err);
      secret = r.result; attempts = 0; over = false;
      msg.textContent = 'Я загадал число от 1 до 100. Попробуй угадать!';
      hist.innerHTML = '<span class="note">Пока ни одной.</span>';
      inp.value = ''; inp.focus();
    }
    let busy = false;
    async function go() {
      if (busy) return;
      busy = true;
      try { await guess(); } finally { busy = false; }
    }
    async function guess() {
      if (over || secret === null) return;
      const text = inp.value;
      const v = await PY.call('is_valid', text);
      if (v.err) return gameErr(errEl, v.err);
      if (!v.result) { msg.textContent = 'Введи число от 1 до 100'; SFX.bad(); return; }
      attempts++;
      const r = await PY.call('check_guess', secret, parseInt(text, 10));
      if (r.err) return gameErr(errEl, r.err);
      if (attempts === 1) hist.innerHTML = '';
      hist.insertAdjacentHTML('beforeend', `<div><span class="note">#${attempts}</span> ${esc(text.trim())} → <b>${esc(r.result)}</b></div>`);
      hist.scrollTop = hist.scrollHeight;
      inp.value = '';
      if (r.result === 'Угадал!') {
        over = true;
        const rt = await PY.call('rating', attempts);
        msg.innerHTML = `🎉 Угадал число <b>${secret}</b> за ${attempts} попыт${attempts % 10 === 1 && attempts !== 11 ? 'ку' : 'ок'}! <b>${esc(rt.err ? '' : rt.result)}</b>`;
        SFX.win();
      } else { msg.textContent = r.result; SFX.click(); inp.focus(); }
    }
    $('#g-go', m).onclick = go;
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    $('#g-new', m).onclick = start;
    start();
  });
}

function playSnake(warn) {
  modal(`<h2>🐍 Змейка</h2>
    <div class="sn-top"><span class="pixel" id="sn-status">Нажми «Старт»</span><span class="pixel" id="sn-best">Рекорд: ${S.best || 0}</span></div>
    <div class="sn-wrap"><canvas id="sn-canvas"></canvas><div class="sn-over hidden" id="sn-over"></div></div>
    <div class="dpad">
      <button class="btn ghost" data-d="up" style="grid-area:u">▲</button>
      <button class="btn ghost" data-d="left" style="grid-area:l">◀</button>
      <button class="btn orange" id="sn-start" style="grid-area:c">▶</button>
      <button class="btn ghost" data-d="right" style="grid-area:r">▶</button>
      <button class="btn ghost" data-d="down" style="grid-area:d">▼</button>
    </div>
    <p style="color:var(--muted);font-size:13px;text-align:center;margin:8px 0 0">Стрелки / WASD · свайпы · кнопки. Каждый ход — вызов твоей <code>step()</code>.</p>
    <div id="sn-err">${warn ? `<p style="color:var(--yellow);font-size:13px">⚠ ${esc(warn)}</p>` : ''}</div>
    <div class="row" style="justify-content:flex-end"><button class="btn orange" data-close>Выход</button></div>`, async m => {
    const cv = $('#sn-canvas', m), ctx = cv.getContext('2d');
    const statusEl = $('#sn-status', m), errEl = $('#sn-err', m), over = $('#sn-over', m);
    let W = 15, H = 15, state = null, running = false, timer = null, delay = 160, alive = true;
    const C = 24;
    const wv = await PY.call('=WIDTH'), hv = await PY.call('=HEIGHT');
    if (Number.isInteger(wv.result) && wv.result >= 5 && wv.result <= 40) W = wv.result;
    if (Number.isInteger(hv.result) && hv.result >= 5 && hv.result <= 40) H = hv.result;
    cv.width = W * C; cv.height = H * C;
    function draw() {
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { ctx.fillStyle = (x + y) % 2 ? '#1f2a3d' : '#243049'; ctx.fillRect(x * C, y * C, C, C); }
      if (!state) return;
      const f = state.food;
      if (Array.isArray(f)) { // пиксельное яблоко
        const fx = f[0] * C, fy = f[1] * C, p = C / 8;
        ctx.fillStyle = '#e43b44'; ctx.fillRect(fx + p, fy + 2 * p, 6 * p, 5 * p); ctx.fillRect(fx + 2 * p, fy + 7 * p, 4 * p, p);
        ctx.fillStyle = '#ff8a8a'; ctx.fillRect(fx + 2 * p, fy + 3 * p, p, 2 * p);
        ctx.fillStyle = '#38b764'; ctx.fillRect(fx + 4 * p, fy, 2 * p, 2 * p);
      }
      (state.snake || []).forEach((c, i) => {
        if (!Array.isArray(c)) return;
        ctx.fillStyle = i === 0 ? '#a7f070' : (i % 2 ? '#38b764' : '#2e9c55');
        ctx.fillRect(c[0] * C + 1, c[1] * C + 1, C - 2, C - 2);
        if (i === 0) {
          ctx.fillStyle = '#1a1c2c'; const p = C / 8;
          const d = state.dir;
          const eyes = d === 'up' ? [[2, 2], [5, 2]] : d === 'down' ? [[2, 5], [5, 5]] : d === 'left' ? [[2, 2], [2, 5]] : [[5, 2], [5, 5]];
          eyes.forEach(([ex, ey]) => ctx.fillRect(c[0] * C + ex * p, c[1] * C + ey * p, p + 1, p + 1));
        }
      });
    }
    async function refreshStatus() {
      const s = await PY.call('status', state);
      statusEl.textContent = s.err ? `Счёт: ${state.score}` : String(s.result);
      const sp = await PY.call('speed', state.score || 0);
      delay = !sp.err && typeof sp.result === 'number' ? Math.max(40, Math.min(1000, sp.result)) : 160;
    }
    async function start() {
      clearTimeout(timer); errEl.innerHTML = ''; over.classList.add('hidden');
      const r = await PY.call('new_game');
      if (r.err) return gameErr(errEl, r.err);
      state = r.result; running = true; alive = true;
      draw(); await refreshStatus();
      timer = setTimeout(tick, delay);
    }
    async function tick() {
      if (!running) return;
      const prevScore = state.score;
      const r = await PY.call('step', state);
      if (!running) return;
      if (r.err || !r.result || typeof r.result !== 'object') { running = false; return gameErr(errEl, r.err || 'step() должна вернуть словарь состояния'); }
      state = r.result; draw();
      if (state.score !== prevScore || !state.alive) await refreshStatus();
      if (state.score > prevScore) beep([880, 1320], 'square', 0.05, 0.04);
      if (!state.alive) {
        running = false; SFX.bad();
        if ((state.score || 0) > (S.best || 0)) { S.best = state.score; save(); $('#sn-best', m).textContent = `Рекорд: ${S.best}`; }
        over.innerHTML = `<div class="pixel">GAME OVER</div><div>Счёт: ${state.score}</div><button class="btn orange" id="sn-again">↻ Ещё раз</button>`;
        over.classList.remove('hidden');
        $('#sn-again', m).onclick = start;
        return;
      }
      timer = setTimeout(tick, delay);
    }
    function turn(d) { if (state && running) state.next_dir = d; else if (!running) start(); }
    const KEYS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right', 'ц': 'up', 'ы': 'down', 'ф': 'left', 'в': 'right' };
    const onKey = e => { const d = KEYS[e.key]; if (d) { e.preventDefault(); turn(d); } else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!running) start(); } };
    document.addEventListener('keydown', onKey);
    let t0 = null;
    cv.addEventListener('touchstart', e => { t0 = e.touches[0]; e.preventDefault(); }, { passive: false });
    cv.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
    cv.addEventListener('touchend', e => {
      if (!t0) return; const t = e.changedTouches[0], dx = t.clientX - t0.clientX, dy = t.clientY - t0.clientY; t0 = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) { if (!running) start(); return; }
      turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
    });
    $$('[data-d]', m).forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); turn(b.dataset.d); }));
    $('#sn-start', m).onclick = start;
    modalCleanup = () => { running = false; clearTimeout(timer); document.removeEventListener('keydown', onKey); };
    draw();
  });
}

/* ================= Песочница ================= */
let sandboxEd = null;
async function runSandbox() {
  const code = sandboxEd.value;
  S.sandbox = code; save();
  const inputs = $('#sandbox-input').value.split('\n').filter((l, i, a) => i < a.length - 1 || l !== '');
  $('#sb-console').innerHTML = '<span class="note">Выполняю…</span>';
  const r = await PY.run(code, inputs, '');
  renderConsole($('#sb-console'), r);
}

/* ================= Запуск ================= */
function init() {
  $('#logo-claude').innerHTML = spriteSVG('claude', 2);
  lessonEd = new Editor($('#lesson-editor'), {
    onChange: v => { if (LES) { S.drafts[draftKey(LES.items[LES.cur])] = v; save(); } },
    onSubmit: shift => runLesson(!shift),
  });
  sandboxEd = new Editor($('#sandbox-editor'), { minRows: 12, onChange: v => { S.sandbox = v; save(); }, onSubmit: () => runSandbox() });
  bindPyStatus('led1', 'pystat1');
  bindPyStatus('led2', 'pystat2');
  PY.init();

  $('#btn-run').onclick = () => runLesson(false);
  $('#btn-check').onclick = () => runLesson(true);
  $('#btn-hint').onclick = showHint;
  $('#btn-sol').onclick = showSolution;
  $('#btn-reset').onclick = () => { const it = LES.items[LES.cur]; delete S.drafts[draftKey(it)]; lessonEd.value = starterCode(it); save(); };
  $('#btn-back').onclick = () => { SFX.click(); show(LES && LES.mode === 'review' ? 'review' : 'map'); };
  $('#btn-theory-toggle').onclick = e => { const c = $('#theory-card').classList.toggle('collapsed'); e.target.textContent = c ? 'Развернуть' : 'Свернуть'; };
  $('#btn-review').onclick = () => { SFX.click(); show('review'); };
  $('#btn-sandbox').onclick = () => { SFX.click(); show('sandbox'); };
  $('#btn-settings').onclick = () => { SFX.click(); showSettings(); };
  $('#btn-sb-run').onclick = runSandbox;
  $('#btn-sb-clear').onclick = () => { $('#sb-console').innerHTML = ''; };
  $$('[data-go]').forEach(b => b.onclick = () => { SFX.click(); show(b.dataset.go); });
  $('#btn-continue').onclick = () => {
    SFX.click();
    if (ALL.every(isComplete)) return showCertificate();
    openLesson(ALL[currentIdx()], 'lesson');
  };
  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (!$('#screen-map').classList.contains('hidden')) renderMap(false); }, 200); });

  show('map');
  if (!S.seenIntro) {
    S.seenIntro = true; save();
    modal(`<div class="center"><div>${spriteSVG('claude', 7, 0, 'jump')}</div><h2>Привет! Я Claude 👋</h2>
      <p>Вместе мы пройдём путь от «что такое print?» до классов и файлов. ${ALL.length} уроков в ${WORLDS.length} мирах, в каждом — теория и <b>5 заданий</b>, чтобы синтаксис отложился в пальцах. А в конце — пошаговые проекты: напишем свою <b>Змейку</b>!</p>
      <p style="color:var(--muted);font-size:14px">Код выполняется настоящим Python прямо в браузере. Пройденные темы можно повторять в разделе ↻.</p>
      <div class="row" style="justify-content:center"><button class="btn orange" id="m-go">▶ Поехали!</button></div></div>`, m => {
      $('#m-go', m).onclick = () => { closeModal(); SFX.ok(); openLesson(ALL[0], 'lesson'); };
    });
  }
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => { });
  }
}
document.addEventListener('DOMContentLoaded', init);
