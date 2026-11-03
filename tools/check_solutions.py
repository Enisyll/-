"""Проверяет, что эталонное решение каждого задания проходит проверку игры.
Запуск: node tools/dump.js > /tmp/w.json && python3 tools/check_solutions.py /tmp/w.json"""
import json, re, sys, io, builtins, traceback, os, tempfile

def run(code, inputs, test):
    inputs = list(inputs)
    buf = io.StringIO(); old = sys.stdout; sys.stdout = buf
    def _input(prompt=""):
        if not inputs: raise EOFError("ввод закончился")
        return str(inputs.pop(0))
    g = {"__name__": "__main__", "input": _input}
    err = terr = None
    try:
        exec(compile(code, "<code>", "exec"), g)
    except BaseException as e:
        err = f"{type(e).__name__}: {e}"
    out = buf.getvalue()
    if err is None and test:
        sys.stdout = io.StringIO()
        try: exec(test, g)
        except BaseException as e: terr = f"{type(e).__name__}: {e}"
    sys.stdout = old
    return out, err, terr

def norm(s):
    lines = [l.rstrip() for l in s.replace("\r", "").split("\n")]
    while lines and lines[-1] == "": lines.pop()
    return "\n".join(lines)

def must_ok(code, m):
    if m.startswith("re:"): return re.search(m[3:], code) is not None
    return m in code

worlds = json.load(open(sys.argv[1]))
os.chdir(tempfile.mkdtemp())
bad = 0; total = 0; ids = set()
for w in worlds:
    for L in w["lessons"]:
        assert L["id"] not in ids, L["id"]; ids.add(L["id"])
        if not L.get("project"):
            assert len(L["ex"]) == 5, (L["id"], len(L["ex"]))
        for k, ex in enumerate(L["ex"]):
            if L.get("project") and k > 0:
                prev = L["ex"][k - 1]["sol"]
                ex["s"] = prev + "\n\n" + ex["add"]   # так стартовый код собирает игра
                if not ex["sol"].startswith(prev):
                    print(f'{L["id"]}#{k+1} | решение не продолжает решение прошлого шага')
            total += 1
            tag = f'{L["id"]}#{k+1}'
            out, err, terr = run(ex["sol"], ex.get("i", []), ex.get("test"))
            probs = []
            if err: probs.append("err " + err)
            if terr: probs.append("test " + terr)
            if "e" in ex and norm(out) != norm(ex["e"]): probs.append(f"out {out!r} != {ex['e']!r}")
            for m in ex.get("m", []):
                if not must_ok(ex["sol"], m): probs.append("must " + m)
            # стартовый код не должен сразу проходить
            o2, e2, t2 = run(ex.get("s", ""), ex.get("i", []), ex.get("test"))
            if not e2 and not t2 and norm(o2) == norm(ex.get("e", "")) and all(must_ok(ex.get("s",""), m) for m in ex.get("m", [])):
                probs.append("starter already passes")
            if probs:
                bad += 1; print(tag, "|", "; ".join(probs))
print(f"{total} заданий, ошибок: {bad}")
sys.exit(1 if bad else 0)
