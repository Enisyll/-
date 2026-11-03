// Мир 7 — Аркада Claude: пошаговые проекты-игры
// У проектов (project: true) задания — это шаги. Код переносится из шага в шаг:
// стартовый код шага = твой код прошлого шага + заготовка add.
(globalThis.WORLDS ||= []).push({
  name: "Аркада Claude",
  sub: "Пишем настоящие игры по шагам",
  theme: "arcade",
  lessons: [
    {
      id: "proj_guess",
      title: "Проект: Угадай число",
      project: true,
      play: "guess",
      theory: "",
      ex: [
        {
          title: "Сравниваем догадку",
          guide: `
<p>🎮 <b>Добро пожаловать в Аркаду!</b> Здесь мы напишем игру <b>«Угадай число»</b>: компьютер загадывает число от 1 до 100, а игрок угадывает. После каждой попытки игра подсказывает: «Больше» или «Меньше».</p>
<p><b>Как устроен проект.</b> Игру мы разбиваем на маленькие функции. Каждый шаг — одна функция. Твой код <b>переносится</b> в следующий шаг, и к нему добавляется заготовка новой функции. В конце нажмёшь <b>🎮 Играть</b> — и игра запустится на <b>твоих</b> функциях!</p>
<p><b>Шаг 1.</b> Сердце игры — сравнение. Напишем функцию <code>check_guess(secret, guess)</code>:</p>
<pre>secret — загаданное число
guess  — догадка игрока

если guess меньше secret  → вернуть "Больше"   (нужно число побольше)
если guess больше secret  → вернуть "Меньше"
иначе (равны)             → вернуть "Угадал!"</pre>
<p>Вспомни <code>if / elif / else</code> и <code>return</code>. Важно именно <b>вернуть</b> строку, а не напечатать: игра сама решит, что с ней делать.</p>
<p>✅ <b>Что проверим:</b> функцию на разных числах и вывод трёх строк внизу.</p>`,
          t: "Допиши функцию <code>check_guess(secret, guess)</code>, чтобы три print внизу вывели <code>Больше</code>, <code>Меньше</code>, <code>Угадал!</code>",
          s: `import random

# Шаг 1: сравнение догадки с загаданным числом
def check_guess(secret, guess):
    # твой код здесь
    pass

print(check_guess(50, 30))
print(check_guess(50, 80))
print(check_guess(50, 50))`,
          e: "Больше\nМеньше\nУгадал!",
          m: ["def check_guess(", "return"],
          test: `assert check_guess(10, 1) == "Больше", 'check_guess(10, 1) должна вернуть "Больше"'
assert check_guess(10, 99) == "Меньше", 'check_guess(10, 99) должна вернуть "Меньше"'
assert check_guess(7, 7) == "Угадал!", 'check_guess(7, 7) должна вернуть "Угадал!"'`,
          sol: `import random

# Шаг 1: сравнение догадки с загаданным числом
def check_guess(secret, guess):
    if guess < secret:
        return "Больше"
    elif guess > secret:
        return "Меньше"
    return "Угадал!"

print(check_guess(50, 30))
print(check_guess(50, 80))
print(check_guess(50, 50))`,
          h: "if guess < secret: return \"Больше\"\nelif guess > secret: return \"Меньше\"\nreturn \"Угадал!\""
        },
        {
          title: "Загадываем число",
          guide: `
<p><b>Шаг 2.</b> Компьютер должен <b>загадать</b> случайное число. Для этого в начале файла уже есть <code>import random</code>.</p>
<p>Функция <code>random.randint(a, b)</code> возвращает случайное целое от <code>a</code> до <code>b</code> <b>включительно</b>:</p>
<pre>random.randint(1, 6)    # как бросок кубика: 1, 2, 3, 4, 5 или 6</pre>
<p>Напиши <code>new_secret(low=1, high=100)</code>. Параметры по умолчанию (помнишь урок «Параметры по умолчанию»?) позволят вызывать её просто <code>new_secret()</code>, а при желании — <code>new_secret(1, 10)</code> для лёгкого режима.</p>
<p>✅ <b>Что проверим:</b> 200 вызовов подряд — все числа должны попадать в диапазон, и они должны быть разными.</p>`,
          t: "Допиши <code>new_secret(low=1, high=100)</code>: она возвращает случайное число от <code>low</code> до <code>high</code>",
          add: `# Шаг 2: компьютер загадывает число
def new_secret(low=1, high=100):
    # твой код здесь
    pass`,
          m: ["def new_secret(", "random.randint("],
          test: `vals = [new_secret() for _ in range(200)]
assert all(isinstance(v, int) and 1 <= v <= 100 for v in vals), "new_secret() должна возвращать целые числа от 1 до 100"
assert len(set(vals)) > 10, "числа должны быть случайными"
assert all(1 <= new_secret(1, 3) <= 3 for _ in range(50)), "new_secret(1, 3) должна возвращать числа от 1 до 3"`,
          sol: `import random

# Шаг 1: сравнение догадки с загаданным числом
def check_guess(secret, guess):
    if guess < secret:
        return "Больше"
    elif guess > secret:
        return "Меньше"
    return "Угадал!"

print(check_guess(50, 30))
print(check_guess(50, 80))
print(check_guess(50, 50))

# Шаг 2: компьютер загадывает число
def new_secret(low=1, high=100):
    return random.randint(low, high)`,
          h: "return random.randint(low, high)"
        },
        {
          title: "Проверяем ввод",
          guide: `
<p><b>Шаг 3.</b> Игроки бывают хитрыми: введут <code>abc</code>, <code>-5</code> или <code>1000</code>. Если отдать такое в <code>int()</code>, программа упадёт с <code>ValueError</code>. Защитимся!</p>
<p>Функция <code>is_valid(text)</code> получает <b>строку</b> и возвращает <code>True</code>, только если это число от 1 до 100. План:</p>
<pre>1. убрать пробелы по краям: text.strip()
2. проверить, что остались только цифры: .isdigit()
3. только если цифры — превратить в int и проверить 1 <= n <= 100</pre>
<p>Хитрость: <code>and</code> проверяет условия слева направо и останавливается на первом <code>False</code>. Поэтому в <code>text.isdigit() and 1 <= int(text) <= 100</code> функция <code>int()</code> никогда не получит буквы.</p>
<p>✅ <b>Что проверим:</b> <code>"42"</code>, <code>" 7 "</code> — да; <code>"abc"</code>, <code>"0"</code>, <code>"101"</code>, <code>""</code>, <code>"-3"</code> — нет.</p>`,
          t: "Допиши <code>is_valid(text)</code>: <code>True</code>, если строка — число от 1 до 100 (пробелы по краям допустимы)",
          add: `# Шаг 3: проверка ввода игрока
def is_valid(text):
    # твой код здесь
    pass`,
          m: ["def is_valid(", ".isdigit()"],
          test: `for good in ["42", " 7 ", "1", "100"]:
    assert is_valid(good) is True, f"is_valid({good!r}) должна вернуть True"
for bad in ["abc", "0", "101", "", "-3", "4.5", "1 2"]:
    assert is_valid(bad) is False, f"is_valid({bad!r}) должна вернуть False"`,
          sol: `import random

# Шаг 1: сравнение догадки с загаданным числом
def check_guess(secret, guess):
    if guess < secret:
        return "Больше"
    elif guess > secret:
        return "Меньше"
    return "Угадал!"

print(check_guess(50, 30))
print(check_guess(50, 80))
print(check_guess(50, 50))

# Шаг 2: компьютер загадывает число
def new_secret(low=1, high=100):
    return random.randint(low, high)

# Шаг 3: проверка ввода игрока
def is_valid(text):
    text = text.strip()
    return text.isdigit() and 1 <= int(text) <= 100`,
          h: "text = text.strip()\nreturn text.isdigit() and 1 <= int(text) <= 100"
        },
        {
          title: "Оценка игрока",
          guide: `
<p><b>Шаг 4.</b> Любой игре нужна награда! После победы покажем оценку по числу попыток.</p>
<p>Интересный факт: число от 1 до 100 всегда можно угадать <b>за 7 попыток</b>, если каждый раз называть середину оставшегося диапазона (50 → 25 → 37 → …). Это называется <b>бинарный поиск</b> — один из важнейших алгоритмов в программировании.</p>
<p>Функция <code>rating(attempts)</code>:</p>
<pre>attempts <= 5  → "Гений!"
attempts <= 8  → "Отлично"
иначе          → "Можно лучше"</pre>
<p>Порядок проверок важен: сначала самое строгое условие (как в уроке про <code>elif</code>).</p>
<p>✅ <b>Что проверим:</b> 1, 5 → «Гений!»; 6, 8 → «Отлично»; 9, 30 → «Можно лучше».</p>`,
          t: "Допиши <code>rating(attempts)</code>, которая возвращает оценку по числу попыток",
          add: `# Шаг 4: оценка по числу попыток
def rating(attempts):
    # твой код здесь
    pass`,
          m: ["def rating(", "return"],
          test: `cases = {1: "Гений!", 5: "Гений!", 6: "Отлично", 8: "Отлично", 9: "Можно лучше", 30: "Можно лучше"}
for a, r in cases.items():
    assert rating(a) == r, f"rating({a}) должна вернуть {r!r}"`,
          sol: `import random

# Шаг 1: сравнение догадки с загаданным числом
def check_guess(secret, guess):
    if guess < secret:
        return "Больше"
    elif guess > secret:
        return "Меньше"
    return "Угадал!"

print(check_guess(50, 30))
print(check_guess(50, 80))
print(check_guess(50, 50))

# Шаг 2: компьютер загадывает число
def new_secret(low=1, high=100):
    return random.randint(low, high)

# Шаг 3: проверка ввода игрока
def is_valid(text):
    text = text.strip()
    return text.isdigit() and 1 <= int(text) <= 100

# Шаг 4: оценка по числу попыток
def rating(attempts):
    if attempts <= 5:
        return "Гений!"
    elif attempts <= 8:
        return "Отлично"
    return "Можно лучше"`,
          h: "if attempts <= 5: ... elif attempts <= 8: ... return \"Можно лучше\""
        },
        {
          title: "Игровой цикл",
          guide: `
<p><b>Шаг 5 — финальный!</b> Соберём всё в <b>игровой цикл</b> — главную часть любой игры. Цикл крутится, пока игрок не победит:</p>
<pre>attempts = 0
while True:
    text = input()             # 1. читаем ход игрока
    если не is_valid(text):    # 2. проверяем ввод
        print("Введи число от 1 до 100")
        continue               #    неверный ввод — попытка не считается
    attempts += 1              # 3. считаем попытку
    result = check_guess(secret, int(text))
    print(result)              # 4. показываем подсказку
    если result == "Угадал!":
        break                  # 5. победа — выходим из цикла
после цикла: print(f"Попыток: {attempts}") и print(rating(attempts))</pre>
<p>Функция <code>play_console(secret)</code> должна ещё и <b>вернуть</b> <code>attempts</code>.</p>
<p>В самом конце файла вызови <code>play_console(42)</code> — ввод игрока в задании подставится автоматически: <code>50</code>, <code>abc</code>, <code>25</code>, <code>42</code>. (Первые три строки вывода — от print из шага 1, это нормально.)</p>
<p>🎮 После этого шага нажми <b>«Играть»</b> — в игре будут работать твои функции <code>new_secret</code>, <code>is_valid</code>, <code>check_guess</code> и <code>rating</code>!</p>`,
          t: "Допиши <code>play_console(secret)</code> по плану из гайда и вызови <code>play_console(42)</code> в конце",
          i: ["50", "abc", "25", "42"],
          add: `# Шаг 5: игровой цикл
def play_console(secret):
    attempts = 0
    # твой код здесь: while True + input() + is_valid + check_guess
    return attempts

play_console(42)`,
          e: "Больше\nМеньше\nУгадал!\nМеньше\nВведи число от 1 до 100\nБольше\nУгадал!\nПопыток: 3\nГений!",
          m: ["def play_console(", "while", "input(", "is_valid(", "check_guess("],
          test: `import io, sys
_vals = iter(["70", "x", "10", "35", "20", "30", "33", "34", "31", "32"])
input = lambda prompt="": next(_vals)
_old = sys.stdout
sys.stdout = io.StringIO()
try:
    _n = play_console(32)
finally:
    sys.stdout = _old
assert _n == 9, f"play_console должна вернуть число попыток (ожидалось 9, неверный ввод не считается), а вернула {_n}"`,
          sol: `import random

# Шаг 1: сравнение догадки с загаданным числом
def check_guess(secret, guess):
    if guess < secret:
        return "Больше"
    elif guess > secret:
        return "Меньше"
    return "Угадал!"

print(check_guess(50, 30))
print(check_guess(50, 80))
print(check_guess(50, 50))

# Шаг 2: компьютер загадывает число
def new_secret(low=1, high=100):
    return random.randint(low, high)

# Шаг 3: проверка ввода игрока
def is_valid(text):
    text = text.strip()
    return text.isdigit() and 1 <= int(text) <= 100

# Шаг 4: оценка по числу попыток
def rating(attempts):
    if attempts <= 5:
        return "Гений!"
    elif attempts <= 8:
        return "Отлично"
    return "Можно лучше"

# Шаг 5: игровой цикл
def play_console(secret):
    attempts = 0
    while True:
        text = input()
        if not is_valid(text):
            print("Введи число от 1 до 100")
            continue
        attempts += 1
        result = check_guess(secret, int(text))
        print(result)
        if result == "Угадал!":
            break
    print(f"Попыток: {attempts}")
    print(rating(attempts))
    return attempts

play_console(42)`,
          h: "Первые три строки вывода — это print из шага 1, их оставь. Дальше: while True: text = input(); if not is_valid(text): print(...); continue; attempts += 1; ..."
        }
      ]
    },
    {
      id: "proj_snake",
      title: "Проект: Змейка",
      project: true,
      play: "snake",
      theory: "",
      ex: [
        {
          title: "Игровое поле",
          guide: `
<p>🐍 <b>Пишем «Змейку»!</b> Змейка ползёт по клетчатому полю, ест яблоки и растёт. Врезалась в стену или в себя — игра окончена.</p>
<p><b>Как это устроено.</b> Любая игра — это <b>состояние</b> (где змейка, где яблоко, какой счёт) и <b>функция шага</b>, которая много раз в секунду превращает старое состояние в новое. Рисованием и клавишами займётся игра, а <b>вся логика будет на твоём Python</b>. Мы напишем её за 11 шагов — по одной маленькой функции.</p>
<p><b>Шаг 1. Поле.</b> Поле — сетка 15×15 клеток. Каждая клетка — пара координат <code>(x, y)</code>:</p>
<pre>(0, 0) — левый верхний угол
x растёт вправо → (14, 0) — правый верхний
y растёт ВНИЗ   → (0, 14) — левый нижний</pre>
<p>Да, <code>y</code> растёт вниз — так принято почти во всех играх и графических программах.</p>
<p>Размеры поля сохраним в <b>константы</b> — переменные, которые не меняются. Их принято называть БОЛЬШИМИ буквами: <code>WIDTH</code>, <code>HEIGHT</code>.</p>
<p>✅ <b>Что проверим:</b> <code>WIDTH = 15</code>, <code>HEIGHT = 15</code> и вывод <code>Поле 15x15</code>.</p>`,
          t: "Создай константы <code>WIDTH</code> и <code>HEIGHT</code> равными 15 и выведи f-строкой <code>Поле 15x15</code>",
          s: `import random

# Шаг 1: размеры игрового поля
`,
          e: "Поле 15x15",
          m: ["WIDTH", "HEIGHT", "{WIDTH}"],
          test: `assert WIDTH == 15 and HEIGHT == 15, "WIDTH и HEIGHT должны быть равны 15"`,
          sol: `import random

# Шаг 1: размеры игрового поля
WIDTH = 15
HEIGHT = 15
print(f"Поле {WIDTH}x{HEIGHT}")`,
          h: "WIDTH = 15\nHEIGHT = 15\nprint(f\"Поле {WIDTH}x{HEIGHT}\")"
        },
        {
          title: "Направления",
          guide: `
<p><b>Шаг 2. Куда ползём?</b> У змейки 4 направления. Каждое — это <b>сдвиг</b> <code>(dx, dy)</code>: на сколько изменить x и y за один ход.</p>
<pre>"up"    → (0, -1)   вверх: y уменьшается (помнишь, y растёт вниз?)
"down"  → (0, 1)
"left"  → (-1, 0)
"right" → (1, 0)</pre>
<p>Удобнее всего хранить это в <b>словаре</b>: название направления → кортеж-сдвиг. Тогда сдвиг получаем одной строкой: <code>DIRECTIONS["up"]</code> → <code>(0, -1)</code>. Никаких длинных цепочек <code>if</code>!</p>
<p>✅ <b>Что проверим:</b> словарь <code>DIRECTIONS</code> с четырьмя правильными сдвигами.</p>`,
          t: "Создай словарь <code>DIRECTIONS</code>: <code>\"up\"</code>, <code>\"down\"</code>, <code>\"left\"</code>, <code>\"right\"</code> → кортежи-сдвиги",
          add: `# Шаг 2: направления движения (dx, dy)
DIRECTIONS = {
    # твой код здесь
}`,
          m: ["DIRECTIONS"],
          test: `assert DIRECTIONS == {"up": (0, -1), "down": (0, 1), "left": (-1, 0), "right": (1, 0)}, "проверь сдвиги: up=(0, -1), down=(0, 1), left=(-1, 0), right=(1, 0)"`,
          sol: `import random

# Шаг 1: размеры игрового поля
WIDTH = 15
HEIGHT = 15
print(f"Поле {WIDTH}x{HEIGHT}")

# Шаг 2: направления движения (dx, dy)
DIRECTIONS = {
    "up": (0, -1),
    "down": (0, 1),
    "left": (-1, 0),
    "right": (1, 0),
}`,
          h: "\"up\": (0, -1),\n\"down\": (0, 1),\n\"left\": (-1, 0),\n\"right\": (1, 0),"
        },
        {
          title: "Новая голова",
          guide: `
<p><b>Шаг 3. Как змейка ползёт.</b> Змейка — это <b>список клеток</b>, первая клетка — <b>голова</b>:</p>
<pre>snake = [(7, 7), (6, 7), (5, 7)]
#         голова  тело    хвост</pre>
<p>Эта змейка лежит горизонтально, голова справа. Чтобы сделать ход, сначала узнаем, где окажется голова. Функция <code>next_head(snake, direction)</code>:</p>
<pre>1. достать голову и распаковать:  x, y = snake[0]
2. достать сдвиг:                 dx, dy = DIRECTIONS[direction]
3. вернуть новую клетку:          (x + dx, y + dy)</pre>
<p>Пример: голова <code>(7, 7)</code>, направление <code>"up"</code> → <code>(7, 6)</code>.</p>
<p>✅ <b>Что проверим:</b> все 4 направления. Сам список <code>snake</code> функция менять не должна.</p>`,
          t: "Допиши <code>next_head(snake, direction)</code>: верни кортеж — клетку, куда переместится голова",
          add: `# Шаг 3: куда переместится голова
def next_head(snake, direction):
    # твой код здесь
    pass`,
          m: ["def next_head(", "DIRECTIONS[", "return"],
          test: `s = [(7, 7), (6, 7), (5, 7)]
assert next_head(s, "right") == (8, 7), "голова (7, 7) + right должна дать (8, 7)"
assert next_head(s, "up") == (7, 6), "голова (7, 7) + up должна дать (7, 6)"
assert next_head(s, "down") == (7, 8), "голова (7, 7) + down должна дать (7, 8)"
assert next_head([(0, 3)], "left") == (-1, 3), "голова (0, 3) + left должна дать (-1, 3)"
assert s == [(7, 7), (6, 7), (5, 7)], "next_head не должна менять список snake"`,
          sol: `import random

# Шаг 1: размеры игрового поля
WIDTH = 15
HEIGHT = 15
print(f"Поле {WIDTH}x{HEIGHT}")

# Шаг 2: направления движения (dx, dy)
DIRECTIONS = {
    "up": (0, -1),
    "down": (0, 1),
    "left": (-1, 0),
    "right": (1, 0),
}

# Шаг 3: куда переместится голова
def next_head(snake, direction):
    x, y = snake[0]
    dx, dy = DIRECTIONS[direction]
    return (x + dx, y + dy)`,
          h: "x, y = snake[0]\ndx, dy = DIRECTIONS[direction]\nreturn (x + dx, y + dy)"
        },
        {
          title: "Удар о стену",
          guide: `
<p><b>Шаг 4. Стены.</b> Если голова выйдет за поле — игра окончена. Клетка <code>(x, y)</code> находится <b>за полем</b>, если:</p>
<pre>x < 0          — левее левого края
x >= WIDTH     — правее правого (последняя клетка: WIDTH - 1 = 14!)
y < 0          — выше верхнего
y >= HEIGHT    — ниже нижнего</pre>
<p>Хватит любого одного условия — значит, соединяем их через <code>or</code>. Используй константы <code>WIDTH</code> и <code>HEIGHT</code>, а не число 15: тогда поле можно будет увеличить, поменяв одну строчку.</p>
<p>✅ <b>Что проверим:</b> углы <code>(0, 0)</code> и <code>(14, 14)</code> — внутри; <code>(-1, 5)</code>, <code>(15, 5)</code>, <code>(5, -1)</code>, <code>(5, 15)</code> — стена.</p>`,
          t: "Допиши <code>hits_wall(pos)</code>: <code>True</code>, если клетка за пределами поля",
          add: `# Шаг 4: врезались в стену?
def hits_wall(pos):
    # твой код здесь
    pass`,
          m: ["def hits_wall(", "WIDTH", "HEIGHT"],
          test: `for p in [(0, 0), (14, 14), (7, 3), (0, 14), (14, 0)]:
    assert hits_wall(p) is False, f"клетка {p} внутри поля — должно быть False"
for p in [(-1, 5), (15, 5), (5, -1), (5, 15), (20, 20)]:
    assert hits_wall(p) is True, f"клетка {p} за полем — должно быть True"`,
          sol: `import random

# Шаг 1: размеры игрового поля
WIDTH = 15
HEIGHT = 15
print(f"Поле {WIDTH}x{HEIGHT}")

# Шаг 2: направления движения (dx, dy)
DIRECTIONS = {
    "up": (0, -1),
    "down": (0, 1),
    "left": (-1, 0),
    "right": (1, 0),
}

# Шаг 3: куда переместится голова
def next_head(snake, direction):
    x, y = snake[0]
    dx, dy = DIRECTIONS[direction]
    return (x + dx, y + dy)

# Шаг 4: врезались в стену?
def hits_wall(pos):
    x, y = pos
    return x < 0 or x >= WIDTH or y < 0 or y >= HEIGHT`,
          h: "x, y = pos\nreturn x < 0 or x >= WIDTH or y < 0 or y >= HEIGHT"
        },
        {
          title: "Укус себя",
          guide: `
<p><b>Шаг 5. Не кусай себя!</b> Если новая голова попадает на клетку тела — проигрыш. Проверить, есть ли элемент в списке, поможет оператор <code>in</code>:</p>
<pre>(6, 7) in [(7, 7), (6, 7), (5, 7)]   # True</pre>
<p><b>Тонкость.</b> Когда змейка делает ход, её <b>хвост уходит</b> со своей клетки. Значит, ползти в клетку, где <i>сейчас</i> хвост, можно! Поэтому проверяем всё тело <b>без последней клетки</b> — срезом <code>snake[:-1]</code> (урок про срезы пригодился!).</p>
<pre>snake[:-1]   # все элементы, кроме последнего</pre>
<p>✅ <b>Что проверим:</b> удар в тело → <code>True</code>, свободная клетка → <code>False</code>, клетка хвоста → <code>False</code>.</p>`,
          t: "Допиши <code>hits_self(head, snake)</code>: <code>True</code>, если голова попала в тело (кроме хвоста)",
          add: `# Шаг 5: укусили себя?
def hits_self(head, snake):
    # твой код здесь
    pass`,
          m: ["def hits_self(", " in ", "[:-1]"],
          test: `s = [(5, 5), (5, 6), (6, 6), (6, 5), (7, 5)]
assert hits_self((5, 6), s) is True, "клетка (5, 6) занята телом — должно быть True"
assert hits_self((4, 5), s) is False, "клетка (4, 5) свободна — должно быть False"
assert hits_self((7, 5), s) is False, "клетка (7, 5) — хвост, он уползёт. Должно быть False (используй snake[:-1])"`,
          sol: `import random

# Шаг 1: размеры игрового поля
WIDTH = 15
HEIGHT = 15
print(f"Поле {WIDTH}x{HEIGHT}")

# Шаг 2: направления движения (dx, dy)
DIRECTIONS = {
    "up": (0, -1),
    "down": (0, 1),
    "left": (-1, 0),
    "right": (1, 0),
}

# Шаг 3: куда переместится голова
def next_head(snake, direction):
    x, y = snake[0]
    dx, dy = DIRECTIONS[direction]
    return (x + dx, y + dy)

# Шаг 4: врезались в стену?
def hits_wall(pos):
    x, y = pos
    return x < 0 or x >= WIDTH or y < 0 or y >= HEIGHT

# Шаг 5: укусили себя?
def hits_self(head, snake):
    return head in snake[:-1]`,
          h: "return head in snake[:-1]"
        },
        {
          title: "Движение и рост",
          guide: `
<p><b>Шаг 6. Двигаем змейку.</b> Хитрость всех «змеек» мира: не нужно двигать каждую клетку! Достаточно:</p>
<pre>1. добавить НОВУЮ голову в начало списка
2. убрать ПОСЛЕДНЮЮ клетку (хвост)</pre>
<p>Тело как будто «перетекает» вперёд. А если змейка <b>съела яблоко</b> (<code>grow=True</code>), хвост просто <b>не убираем</b> — и она становится на клетку длиннее!</p>
<pre>было:  [(7,7), (6,7), (5,7)]     ход вправо
стало: [(8,7), (7,7), (6,7)]     (5,7) убрали
с ростом: [(8,7), (7,7), (6,7), (5,7)]</pre>
<p>Создай новый список: <code>[next_head(snake, direction)] + snake</code>, а хвост убери методом <code>.pop()</code>.</p>
<p>✅ <b>Что проверим:</b> обычный ход (длина та же) и ход с ростом (длина +1).</p>`,
          t: "Допиши <code>move(snake, direction, grow=False)</code>: верни новый список-змейку после хода",
          add: `# Шаг 6: ход змейки (с ростом или без)
def move(snake, direction, grow=False):
    # твой код здесь
    pass`,
          m: ["def move(", "next_head(", "grow"],
          test: `s = [(7, 7), (6, 7), (5, 7)]
assert move(s, "right") == [(8, 7), (7, 7), (6, 7)], "обычный ход вправо: [(8, 7), (7, 7), (6, 7)]"
assert move(s, "up", True) == [(7, 6), (7, 7), (6, 7), (5, 7)], "ход вверх с ростом: голова (7, 6), хвост остаётся"
assert move([(1, 1), (1, 2)], "left") == [(0, 1), (1, 1)], "проверь ход влево"`,
          sol: `import random

# Шаг 1: размеры игрового поля
WIDTH = 15
HEIGHT = 15
print(f"Поле {WIDTH}x{HEIGHT}")

# Шаг 2: направления движения (dx, dy)
DIRECTIONS = {
    "up": (0, -1),
    "down": (0, 1),
    "left": (-1, 0),
    "right": (1, 0),
}

# Шаг 3: куда переместится голова
def next_head(snake, direction):
    x, y = snake[0]
    dx, dy = DIRECTIONS[direction]
    return (x + dx, y + dy)

# Шаг 4: врезались в стену?
def hits_wall(pos):
    x, y = pos
    return x < 0 or x >= WIDTH or y < 0 or y >= HEIGHT

# Шаг 5: укусили себя?
def hits_self(head, snake):
    return head in snake[:-1]

# Шаг 6: ход змейки (с ростом или без)
def move(snake, direction, grow=False):
    new_snake = [next_head(snake, direction)] + snake
    if not grow:
        new_snake.pop()
    return new_snake`,
          h: "new_snake = [next_head(snake, direction)] + snake\nif not grow:\n    new_snake.pop()\nreturn new_snake"
        },
        {
          title: "Яблоко",
          guide: `
<p><b>Шаг 7. Где появится яблоко?</b> В случайной <b>свободной</b> клетке — не на змейке.</p>
<p>Надёжный способ: собрать список всех свободных клеток и выбрать одну случайно.</p>
<pre>free = []
для каждого x от 0 до WIDTH - 1:          for x in range(WIDTH):
    для каждого y от 0 до HEIGHT - 1:         for y in range(HEIGHT):
        если (x, y) нет в змейке:                 if (x, y) not in snake:
            добавить в free                           free.append((x, y))
вернуть random.choice(free)</pre>
<p>Это <b>вложенные циклы</b> — они перебирают все 15 × 15 = 225 клеток. А <code>random.choice()</code> из урока про модули выбирает случайный элемент списка.</p>
<p>✅ <b>Что проверим:</b> 100 раз — яблоко всегда на поле и никогда не на змейке.</p>`,
          t: "Допиши <code>random_food(snake)</code>: верни случайную свободную клетку-кортеж",
          add: `# Шаг 7: случайное место для яблока
def random_food(snake):
    # твой код здесь
    pass`,
          m: ["def random_food(", "random.choice(", "for "],
          test: `s = [(x, 0) for x in range(15)] + [(x, 1) for x in range(15)]
seen = set()
for _ in range(100):
    f = random_food(s)
    assert isinstance(f, tuple) and len(f) == 2, "random_food должна вернуть кортеж (x, y)"
    assert f not in s, f"яблоко {f} оказалось на змейке"
    assert not hits_wall(f), f"яблоко {f} за пределами поля"
    seen.add(f)
assert len(seen) > 20, "яблоко должно появляться в разных местах"
full = [(x, y) for x in range(15) for y in range(15) if (x, y) != (3, 9)]
assert random_food(full) == (3, 9), "если свободна одна клетка, яблоко должно быть в ней"`,
          sol: `import random

# Шаг 1: размеры игрового поля
WIDTH = 15
HEIGHT = 15
print(f"Поле {WIDTH}x{HEIGHT}")

# Шаг 2: направления движения (dx, dy)
DIRECTIONS = {
    "up": (0, -1),
    "down": (0, 1),
    "left": (-1, 0),
    "right": (1, 0),
}

# Шаг 3: куда переместится голова
def next_head(snake, direction):
    x, y = snake[0]
    dx, dy = DIRECTIONS[direction]
    return (x + dx, y + dy)

# Шаг 4: врезались в стену?
def hits_wall(pos):
    x, y = pos
    return x < 0 or x >= WIDTH or y < 0 or y >= HEIGHT

# Шаг 5: укусили себя?
def hits_self(head, snake):
    return head in snake[:-1]

# Шаг 6: ход змейки (с ростом или без)
def move(snake, direction, grow=False):
    new_snake = [next_head(snake, direction)] + snake
    if not grow:
        new_snake.pop()
    return new_snake

# Шаг 7: случайное место для яблока
def random_food(snake):
    free = []
    for x in range(WIDTH):
        for y in range(HEIGHT):
            if (x, y) not in snake:
                free.append((x, y))
    return random.choice(free)`,
          h: "free = []\nfor x in range(WIDTH):\n    for y in range(HEIGHT):\n        if (x, y) not in snake:\n            free.append((x, y))\nreturn random.choice(free)"
        },
        {
          title: "Поворот",
          guide: `
<p><b>Шаг 8. Повороты.</b> Игрок жмёт стрелки, и змейка поворачивает. Но есть правило: <b>нельзя развернуться назад</b>! Если змейка ползёт вправо и игрок нажал «влево», голова въедет в собственную шею.</p>
<p>Заведём словарь противоположных направлений:</p>
<pre>OPPOSITE = {"up": "down", "down": "up", "left": "right", "right": "left"}</pre>
<p>И функцию <code>change_direction(current, new)</code>:</p>
<pre>если new — противоположное current  → оставить current (игнорируем нажатие)
иначе                                → вернуть new</pre>
<p>Проверка на противоположность: <code>new == OPPOSITE[current]</code>.</p>
<p>✅ <b>Что проверим:</b> right → up = up; right → left = right (разворот запрещён); up → up = up.</p>`,
          t: "Создай словарь <code>OPPOSITE</code> и допиши <code>change_direction(current, new)</code>",
          add: `# Шаг 8: поворот без разворота назад
OPPOSITE = {}  # заполни словарь

def change_direction(current, new):
    # твой код здесь
    pass`,
          m: ["OPPOSITE", "def change_direction("],
          test: `assert OPPOSITE == {"up": "down", "down": "up", "left": "right", "right": "left"}, "проверь словарь OPPOSITE"
assert change_direction("right", "up") == "up", "right → up: поворот разрешён"
assert change_direction("right", "left") == "right", "right → left: разворот запрещён, остаётся right"
assert change_direction("up", "down") == "up", "up → down: разворот запрещён"
assert change_direction("down", "down") == "down"
assert change_direction("left", "down") == "down"`,
          sol: `import random

# Шаг 1: размеры игрового поля
WIDTH = 15
HEIGHT = 15
print(f"Поле {WIDTH}x{HEIGHT}")

# Шаг 2: направления движения (dx, dy)
DIRECTIONS = {
    "up": (0, -1),
    "down": (0, 1),
    "left": (-1, 0),
    "right": (1, 0),
}

# Шаг 3: куда переместится голова
def next_head(snake, direction):
    x, y = snake[0]
    dx, dy = DIRECTIONS[direction]
    return (x + dx, y + dy)

# Шаг 4: врезались в стену?
def hits_wall(pos):
    x, y = pos
    return x < 0 or x >= WIDTH or y < 0 or y >= HEIGHT

# Шаг 5: укусили себя?
def hits_self(head, snake):
    return head in snake[:-1]

# Шаг 6: ход змейки (с ростом или без)
def move(snake, direction, grow=False):
    new_snake = [next_head(snake, direction)] + snake
    if not grow:
        new_snake.pop()
    return new_snake

# Шаг 7: случайное место для яблока
def random_food(snake):
    free = []
    for x in range(WIDTH):
        for y in range(HEIGHT):
            if (x, y) not in snake:
                free.append((x, y))
    return random.choice(free)

# Шаг 8: поворот без разворота назад
OPPOSITE = {"up": "down", "down": "up", "left": "right", "right": "left"}

def change_direction(current, new):
    if new == OPPOSITE[current]:
        return current
    return new`,
          h: "if new == OPPOSITE[current]:\n    return current\nreturn new"
        },
        {
          title: "Новая игра",
          guide: `
<p><b>Шаг 9. Состояние игры.</b> Всё, что описывает игру в данный момент, сложим в один <b>словарь</b> — это и есть <b>состояние</b>:</p>
<pre>{
    "snake": [(7, 7), (6, 7), (5, 7)],   # змейка
    "dir": "right",                      # куда ползёт сейчас
    "next_dir": "right",                 # что нажал игрок
    "food": (x, y),                      # яблоко
    "score": 0,                          # счёт
    "alive": True,                       # жива ли
}</pre>
<p>Зачем два направления? Игрок может нажать клавишу в любой момент, а змейка поворачивает только на следующем ходу. Нажатие запоминаем в <code>"next_dir"</code>.</p>
<p>Функция <code>new_game()</code> создаёт и возвращает такое состояние. Яблоко поставь с помощью твоей <code>random_food(snake)</code> — переиспользуем код!</p>
<p>✅ <b>Что проверим:</b> все 6 ключей и их начальные значения.</p>`,
          t: "Допиши <code>new_game()</code>: верни словарь начального состояния (змейка <code>[(7, 7), (6, 7), (5, 7)]</code>)",
          add: `# Шаг 9: начальное состояние игры
def new_game():
    snake = [(7, 7), (6, 7), (5, 7)]
    # твой код здесь: верни словарь состояния
    pass`,
          m: ["def new_game(", "random_food(", "\"alive\""],
          test: `g = new_game()
assert isinstance(g, dict), "new_game должна вернуть словарь"
for k in ["snake", "dir", "next_dir", "food", "score", "alive"]:
    assert k in g, f"в состоянии нет ключа {k!r}"
assert g["snake"] == [(7, 7), (6, 7), (5, 7)], "начальная змейка: [(7, 7), (6, 7), (5, 7)]"
assert g["dir"] == "right" and g["next_dir"] == "right", "начальное направление — right"
assert g["score"] == 0 and g["alive"] is True, "score = 0, alive = True"
assert g["food"] not in g["snake"] and not hits_wall(g["food"]), "яблоко должно быть на свободной клетке"`,
          sol: `import random

# Шаг 1: размеры игрового поля
WIDTH = 15
HEIGHT = 15
print(f"Поле {WIDTH}x{HEIGHT}")

# Шаг 2: направления движения (dx, dy)
DIRECTIONS = {
    "up": (0, -1),
    "down": (0, 1),
    "left": (-1, 0),
    "right": (1, 0),
}

# Шаг 3: куда переместится голова
def next_head(snake, direction):
    x, y = snake[0]
    dx, dy = DIRECTIONS[direction]
    return (x + dx, y + dy)

# Шаг 4: врезались в стену?
def hits_wall(pos):
    x, y = pos
    return x < 0 or x >= WIDTH or y < 0 or y >= HEIGHT

# Шаг 5: укусили себя?
def hits_self(head, snake):
    return head in snake[:-1]

# Шаг 6: ход змейки (с ростом или без)
def move(snake, direction, grow=False):
    new_snake = [next_head(snake, direction)] + snake
    if not grow:
        new_snake.pop()
    return new_snake

# Шаг 7: случайное место для яблока
def random_food(snake):
    free = []
    for x in range(WIDTH):
        for y in range(HEIGHT):
            if (x, y) not in snake:
                free.append((x, y))
    return random.choice(free)

# Шаг 8: поворот без разворота назад
OPPOSITE = {"up": "down", "down": "up", "left": "right", "right": "left"}

def change_direction(current, new):
    if new == OPPOSITE[current]:
        return current
    return new

# Шаг 9: начальное состояние игры
def new_game():
    snake = [(7, 7), (6, 7), (5, 7)]
    return {
        "snake": snake,
        "dir": "right",
        "next_dir": "right",
        "food": random_food(snake),
        "score": 0,
        "alive": True,
    }`,
          h: "return {\n    \"snake\": snake,\n    \"dir\": \"right\",\n    \"next_dir\": \"right\",\n    \"food\": random_food(snake),\n    \"score\": 0,\n    \"alive\": True,\n}"
        },
        {
          title: "Шаг игры",
          guide: `
<p><b>Шаг 10. Главная функция!</b> <code>step(state)</code> вызывается несколько раз в секунду и делает один ход. Здесь мы соберём <b>все</b> функции, которые ты написал:</p>
<pre>1. d = change_direction(state["dir"], state["next_dir"])   # учли нажатие
2. head = next_head(state["snake"], d)                      # куда ползём
3. если hits_wall(head) или hits_self(head, state["snake"]):
       state["alive"] = False                               # проигрыш
       return state
4. grow = head == state["food"]                             # съели яблоко?
5. state["snake"] = move(state["snake"], d, grow)           # ползём
6. state["dir"] = d
7. если grow:
       state["score"] += 1                                  # +1 очко
       state["food"] = random_food(state["snake"])          # новое яблоко
8. return state</pre>
<p>Вот так большая задача складывается из маленьких функций — это главный навык программиста. Каждая функция простая, а вместе они — игра!</p>
<p>✅ <b>Что проверим:</b> поедание яблока, удар о стену, удар в себя и попытку развернуться.</p>`,
          t: "Допиши <code>step(state)</code> по плану из гайда",
          add: `# Шаг 10: один ход игры
def step(state):
    # твой код здесь
    return state`,
          m: ["def step(", "change_direction(", "next_head(", "hits_wall(", "hits_self(", "move(", "random_food("],
          test: `s = {"snake": [(2, 2), (1, 2), (0, 2)], "dir": "right", "next_dir": "right", "food": (3, 2), "score": 0, "alive": True}
s = step(s)
assert s["snake"][0] == (3, 2) and len(s["snake"]) == 4, "змейка должна съесть яблоко в (3, 2) и вырасти до 4 клеток"
assert s["score"] == 1, "за яблоко счёт +1"
assert s["food"] not in s["snake"], "после поедания должно появиться новое яблоко на свободной клетке"
s = step(s)
assert s["snake"][0] == (4, 2) and len(s["snake"]) == 4 and s["alive"], "обычный ход: длина не меняется"
w = {"snake": [(14, 5), (13, 5), (12, 5)], "dir": "right", "next_dir": "right", "food": (0, 0), "score": 0, "alive": True}
assert step(w)["alive"] is False, "удар о правую стену — alive должно стать False"
b = {"snake": [(5, 5), (6, 5), (6, 6), (5, 6), (4, 6)], "dir": "left", "next_dir": "down", "food": (0, 0), "score": 0, "alive": True}
assert step(b)["alive"] is False, "голова въезжает в своё тело — alive должно стать False"
r = {"snake": [(5, 5), (4, 5), (3, 5)], "dir": "right", "next_dir": "left", "food": (0, 0), "score": 0, "alive": True}
r = step(r)
assert r["snake"][0] == (6, 5) and r["dir"] == "right", "разворот назад должен игнорироваться"`,
          sol: `import random

# Шаг 1: размеры игрового поля
WIDTH = 15
HEIGHT = 15
print(f"Поле {WIDTH}x{HEIGHT}")

# Шаг 2: направления движения (dx, dy)
DIRECTIONS = {
    "up": (0, -1),
    "down": (0, 1),
    "left": (-1, 0),
    "right": (1, 0),
}

# Шаг 3: куда переместится голова
def next_head(snake, direction):
    x, y = snake[0]
    dx, dy = DIRECTIONS[direction]
    return (x + dx, y + dy)

# Шаг 4: врезались в стену?
def hits_wall(pos):
    x, y = pos
    return x < 0 or x >= WIDTH or y < 0 or y >= HEIGHT

# Шаг 5: укусили себя?
def hits_self(head, snake):
    return head in snake[:-1]

# Шаг 6: ход змейки (с ростом или без)
def move(snake, direction, grow=False):
    new_snake = [next_head(snake, direction)] + snake
    if not grow:
        new_snake.pop()
    return new_snake

# Шаг 7: случайное место для яблока
def random_food(snake):
    free = []
    for x in range(WIDTH):
        for y in range(HEIGHT):
            if (x, y) not in snake:
                free.append((x, y))
    return random.choice(free)

# Шаг 8: поворот без разворота назад
OPPOSITE = {"up": "down", "down": "up", "left": "right", "right": "left"}

def change_direction(current, new):
    if new == OPPOSITE[current]:
        return current
    return new

# Шаг 9: начальное состояние игры
def new_game():
    snake = [(7, 7), (6, 7), (5, 7)]
    return {
        "snake": snake,
        "dir": "right",
        "next_dir": "right",
        "food": random_food(snake),
        "score": 0,
        "alive": True,
    }

# Шаг 10: один ход игры
def step(state):
    d = change_direction(state["dir"], state["next_dir"])
    head = next_head(state["snake"], d)
    if hits_wall(head) or hits_self(head, state["snake"]):
        state["alive"] = False
        return state
    grow = head == state["food"]
    state["snake"] = move(state["snake"], d, grow)
    state["dir"] = d
    if grow:
        state["score"] += 1
        state["food"] = random_food(state["snake"])
    return state`,
          h: "Следуй плану из гайда построчно. Не забудь return state в конце и после проигрыша."
        },
        {
          title: "Счёт и скорость",
          guide: `
<p><b>Шаг 11 — последний!</b> Добавим две функции «для красоты»:</p>
<p><code>status(state)</code> — строка, которую игра покажет над полем:</p>
<pre>если змейка жива  → "Счёт: 3"
иначе             → "Игра окончена! Счёт: 3"</pre>
<p><code>speed(score)</code> — пауза между ходами в миллисекундах. Чем больше счёт, тем быстрее игра (меньше пауза), но не быстрее 70 мс:</p>
<pre>пауза = 200 - score * 10, но не меньше 70
→ max(70, 200 - score * 10)</pre>
<p>Функция <code>max()</code> выбирает большее из чисел — так мы ограничиваем скорость снизу.</p>
<p>🎮 После этого шага нажми <b>«Играть»</b>! Управление: стрелки или WASD на ПК, свайпы или кнопки на телефоне. Каждый ход змейки — это вызов <b>твоей</b> функции <code>step()</code>.</p>
<p>💡 <b>Идеи для доработки</b> (меняй код в последнем шаге и снова жми «Играть»): поле побольше (<code>WIDTH = 20</code>), старт с длинной змейкой, яблоко за 2 очка, своя формула скорости.</p>`,
          t: "Допиши <code>status(state)</code> и <code>speed(score)</code>",
          add: `# Шаг 11: текст над полем и скорость
def status(state):
    # твой код здесь
    pass

def speed(score):
    # твой код здесь
    pass`,
          m: ["def status(", "def speed(", "max("],
          test: `assert status({"alive": True, "score": 3}) == "Счёт: 3", 'для живой змейки: "Счёт: 3"'
assert status({"alive": False, "score": 7}) == "Игра окончена! Счёт: 7", 'после проигрыша: "Игра окончена! Счёт: 7"'
assert speed(0) == 200 and speed(5) == 150, "speed(0) = 200, speed(5) = 150"
assert speed(13) == 70 and speed(50) == 70, "пауза не меньше 70"`,
          sol: `import random

# Шаг 1: размеры игрового поля
WIDTH = 15
HEIGHT = 15
print(f"Поле {WIDTH}x{HEIGHT}")

# Шаг 2: направления движения (dx, dy)
DIRECTIONS = {
    "up": (0, -1),
    "down": (0, 1),
    "left": (-1, 0),
    "right": (1, 0),
}

# Шаг 3: куда переместится голова
def next_head(snake, direction):
    x, y = snake[0]
    dx, dy = DIRECTIONS[direction]
    return (x + dx, y + dy)

# Шаг 4: врезались в стену?
def hits_wall(pos):
    x, y = pos
    return x < 0 or x >= WIDTH or y < 0 or y >= HEIGHT

# Шаг 5: укусили себя?
def hits_self(head, snake):
    return head in snake[:-1]

# Шаг 6: ход змейки (с ростом или без)
def move(snake, direction, grow=False):
    new_snake = [next_head(snake, direction)] + snake
    if not grow:
        new_snake.pop()
    return new_snake

# Шаг 7: случайное место для яблока
def random_food(snake):
    free = []
    for x in range(WIDTH):
        for y in range(HEIGHT):
            if (x, y) not in snake:
                free.append((x, y))
    return random.choice(free)

# Шаг 8: поворот без разворота назад
OPPOSITE = {"up": "down", "down": "up", "left": "right", "right": "left"}

def change_direction(current, new):
    if new == OPPOSITE[current]:
        return current
    return new

# Шаг 9: начальное состояние игры
def new_game():
    snake = [(7, 7), (6, 7), (5, 7)]
    return {
        "snake": snake,
        "dir": "right",
        "next_dir": "right",
        "food": random_food(snake),
        "score": 0,
        "alive": True,
    }

# Шаг 10: один ход игры
def step(state):
    d = change_direction(state["dir"], state["next_dir"])
    head = next_head(state["snake"], d)
    if hits_wall(head) or hits_self(head, state["snake"]):
        state["alive"] = False
        return state
    grow = head == state["food"]
    state["snake"] = move(state["snake"], d, grow)
    state["dir"] = d
    if grow:
        state["score"] += 1
        state["food"] = random_food(state["snake"])
    return state

# Шаг 11: текст над полем и скорость
def status(state):
    if state["alive"]:
        return f"Счёт: {state['score']}"
    return f"Игра окончена! Счёт: {state['score']}"

def speed(score):
    return max(70, 200 - score * 10)`,
          h: "status: if state[\"alive\"]: return f\"Счёт: {state['score']}\"\nspeed: return max(70, 200 - score * 10)"
        }
      ]
    }
  ]
});
