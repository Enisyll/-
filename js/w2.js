// Мир 2 — Пустыня условий
(globalThis.WORLDS ||= []).push({
  name: "Пустыня условий",
  sub: "Логика и ветвления",
  theme: "desert",
  lessons: [
    {
      id: "compare",
      title: "Сравнения и bool",
      theory: `
<p>Операторы сравнения возвращают <code>True</code> (истина) или <code>False</code> (ложь):</p>
<pre>print(5 > 3)     # True   больше
print(5 < 3)     # False  меньше
print(5 >= 5)    # True   больше или равно
print(4 <= 3)    # False  меньше или равно
print(5 == 5)    # True   равно (ДВА знака!)
print(5 != 3)    # True   не равно</pre>
<p>Не путай: <code>=</code> — присваивание, <code>==</code> — сравнение. Строки тоже можно сравнивать: <code>"a" == "a"</code>.</p>`,
      ex: [
        { t: "Выведи результат сравнения: больше ли <code>a</code>, чем <code>b</code>", s: `a = 10\nb = 7\n`, e: "True", m: ["a > b"], sol: `a = 10\nb = 7\nprint(a > b)`, h: "print(a > b)" },
        { t: "Проверь, равны ли <code>x</code> и <code>y</code> (оператор <code>==</code>)", s: `x = 5\ny = "5"\n`, e: "False", m: ["=="], sol: `x = 5\ny = "5"\nprint(x == y)`, h: "Число 5 и строка \"5\" не равны" },
        { t: "Проверь, что пароль НЕ равен <code>\"1234\"</code> (оператор <code>!=</code>)", s: `password = "qwerty"\n`, e: "True", m: ["!="], sol: `password = "qwerty"\nprint(password != "1234")`, h: "password != \"1234\"" },
        { t: "Проверь, достиг ли игрок 18 лет (<code>>=</code>)", s: `age = 18\n`, e: "True", m: [">="], sol: `age = 18\nprint(age >= 18)`, h: "age >= 18" },
        { t: "Сохрани результат <code>score > 100</code> в переменную <code>win</code> и выведи <code>win</code>", s: `score = 90\n`, e: "False", m: ["re:win\\s*=\\s*score\\s*>\\s*100", "print(win)"], sol: `score = 90\nwin = score > 100\nprint(win)`, h: "win = score > 100" }
      ]
    },
    {
      id: "logic",
      title: "and, or, not",
      theory: `
<pre>True and True    # True  — оба условия
True and False   # False
True or False    # True  — хотя бы одно
False or False   # False
not True         # False — отрицание</pre>
<p>Пример: <code>age >= 7 and age <= 12</code>. В Python можно и цепочкой: <code>7 <= age <= 12</code>.</p>`,
      ex: [
        { t: "Выведи, есть ли у игрока и ключ, и меч (<code>and</code>)", s: `has_key = True\nhas_sword = False\n`, e: "False", m: [" and "], sol: `has_key = True\nhas_sword = False\nprint(has_key and has_sword)`, h: "has_key and has_sword" },
        { t: "Выведи, выходной ли сегодня: суббота <b>или</b> воскресенье (<code>or</code>)", s: `day = "воскресенье"\n`, e: "True", m: [" or "], sol: `day = "воскресенье"\nprint(day == "суббота" or day == "воскресенье")`, h: "day == \"суббота\" or day == \"воскресенье\"" },
        { t: "Выведи отрицание <code>is_raining</code> через <code>not</code>", s: `is_raining = True\n`, e: "False", m: ["not "], sol: `is_raining = True\nprint(not is_raining)`, h: "not is_raining" },
        { t: "Проверь, что <code>n</code> от 1 до 10 включительно (используй <code>and</code>)", s: `n = 7\n`, e: "True", m: [" and "], sol: `n = 7\nprint(n >= 1 and n <= 10)`, h: "n >= 1 and n <= 10" },
        { t: "Проверь, что число чётное и больше 100", s: `n = 98\n`, e: "False", m: ["%", " and "], sol: `n = 98\nprint(n % 2 == 0 and n > 100)`, h: "n % 2 == 0 and n > 100" }
      ]
    },
    {
      id: "if",
      title: "if — условие",
      theory: `
<p><code>if</code> выполняет блок кода, только если условие истинно. После условия — <b>двоеточие</b>, а блок — с <b>отступом</b> (4 пробела):</p>
<pre>hp = 0
if hp == 0:
    print("Игра окончена")
    print("Попробуй ещё")
print("Эта строка выполнится всегда")</pre>
<p>Отступ — это не украшение: он показывает, какие строки внутри <code>if</code>. Неверный отступ — <code>IndentationError</code>.</p>`,
      ex: [
        { t: "Если <code>temp</code> больше 30, выведи <code>Жарко!</code>", s: `temp = 35\n`, e: "Жарко!", m: ["if ", ":"], sol: `temp = 35\nif temp > 30:\n    print("Жарко!")`, h: "if temp > 30:\n    print(\"Жарко!\")" },
        { t: "Если <code>password</code> равен <code>\"python\"</code>, выведи <code>Доступ разрешён</code>", s: `password = "python"\n`, e: "Доступ разрешён", m: ["if "], sol: `password = "python"\nif password == "python":\n    print("Доступ разрешён")`, h: "if password == \"python\":" },
        { t: "Если число отрицательное, выведи <code>Минус</code>. В конце (вне if) выведи <code>Конец</code>", s: `n = 5\n`, e: "Конец", m: ["if "], sol: `n = 5\nif n < 0:\n    print("Минус")\nprint("Конец")`, h: "Второй print без отступа" },
        { t: "Считай число. Если оно делится на 3 без остатка — выведи <code>Делится</code>", s: ``, i: ["27"], e: "Делится", m: ["if ", "%"], sol: `n = int(input())\nif n % 3 == 0:\n    print("Делится")`, h: "n % 3 == 0" },
        { t: "Если в строке есть буква <code>z</code> (оператор <code>in</code>), выведи <code>Нашёл!</code>", s: `s = "pizza"\n`, e: "Нашёл!", m: ["if ", " in "], sol: `s = "pizza"\nif "z" in s:\n    print("Нашёл!")`, h: "if \"z\" in s:" }
      ]
    },
    {
      id: "else",
      title: "if / else",
      theory: `
<p><code>else</code> — что делать, если условие ложно:</p>
<pre>age = 15
if age >= 18:
    print("Взрослый")
else:
    print("Подросток")</pre>
<p>Короткая форма (тернарный оператор): <code>result = "чёт" if n % 2 == 0 else "нечет"</code></p>`,
      ex: [
        { t: "Выведи <code>Чётное</code> или <code>Нечётное</code> для числа <code>n</code>", s: `n = 7\n`, e: "Нечётное", m: ["if ", "else:"], sol: `n = 7\nif n % 2 == 0:\n    print("Чётное")\nelse:\n    print("Нечётное")`, h: "if n % 2 == 0: ... else: ..." },
        { t: "Считай пароль. Если он <code>\"secret\"</code> — <code>Вход</code>, иначе <code>Отказ</code>", s: ``, i: ["12345"], e: "Отказ", m: ["else:"], sol: `p = input()\nif p == "secret":\n    print("Вход")\nelse:\n    print("Отказ")`, h: "if p == \"secret\": ... else: ..." },
        { t: "Выведи большее из двух чисел с помощью if/else", s: `a = 12\nb = 30\n`, e: "30", m: ["if ", "else:"], sol: `a = 12\nb = 30\nif a > b:\n    print(a)\nelse:\n    print(b)`, h: "if a > b: print(a) else: print(b)" },
        { t: "Считай возраст. 18 и больше — <code>Можно</code>, иначе <code>Нельзя</code>", s: ``, i: ["16"], e: "Нельзя", m: ["int(", "else:"], sol: `age = int(input())\nif age >= 18:\n    print("Можно")\nelse:\n    print("Нельзя")`, h: "Не забудь int(input())" },
        { t: "Тернарный оператор: запиши в <code>status</code> <code>\"онлайн\"</code> если <code>online</code>, иначе <code>\"офлайн\"</code>, выведи", s: `online = False\n`, e: "офлайн", m: ["re:status\\s*=.*if.*else"], sol: `online = False\nstatus = "онлайн" if online else "офлайн"\nprint(status)`, h: "status = \"онлайн\" if online else \"офлайн\"" }
      ]
    },
    {
      id: "elif",
      title: "elif — много веток",
      theory: `
<p><code>elif</code> (else if) позволяет проверить несколько условий по порядку. Выполнится только <b>первая</b> истинная ветка:</p>
<pre>score = 75
if score >= 90:
    print("Отлично")
elif score >= 70:
    print("Хорошо")
elif score >= 50:
    print("Нормально")
else:
    print("Плохо")</pre>`,
      ex: [
        { t: "Выведи <code>Положительное</code>, <code>Отрицательное</code> или <code>Ноль</code>", s: `n = 0\n`, e: "Ноль", m: ["elif "], sol: `n = 0\nif n > 0:\n    print("Положительное")\nelif n < 0:\n    print("Отрицательное")\nelse:\n    print("Ноль")`, h: "if n > 0 ... elif n < 0 ... else ..." },
        { t: "Светофор: <code>red</code> → <code>Стой</code>, <code>yellow</code> → <code>Жди</code>, <code>green</code> → <code>Иди</code>", s: `light = "yellow"\n`, e: "Жди", m: ["elif "], sol: `light = "yellow"\nif light == "red":\n    print("Стой")\nelif light == "yellow":\n    print("Жди")\nelif light == "green":\n    print("Иди")`, h: "Три ветки: if / elif / elif" },
        { t: "Оценка: 90+ → <code>A</code>, 75+ → <code>B</code>, 60+ → <code>C</code>, иначе <code>F</code>", s: `score = 82\n`, e: "B", m: ["elif "], sol: `score = 82\nif score >= 90:\n    print("A")\nelif score >= 75:\n    print("B")\nelif score >= 60:\n    print("C")\nelse:\n    print("F")`, h: "Проверяй от большего к меньшему" },
        { t: "Считай температуру. Меньше 0 — <code>Лёд</code>, меньше 100 — <code>Вода</code>, иначе <code>Пар</code>", s: ``, i: ["120"], e: "Пар", m: ["elif "], sol: `t = int(input())\nif t < 0:\n    print("Лёд")\nelif t < 100:\n    print("Вода")\nelse:\n    print("Пар")`, h: "t = int(input())" },
        { t: "FizzBuzz для одного числа: делится на 15 → <code>FizzBuzz</code>, на 3 → <code>Fizz</code>, на 5 → <code>Buzz</code>, иначе само число", s: `n = 10\n`, e: "Buzz", m: ["elif "], sol: `n = 10\nif n % 15 == 0:\n    print("FizzBuzz")\nelif n % 3 == 0:\n    print("Fizz")\nelif n % 5 == 0:\n    print("Buzz")\nelse:\n    print(n)`, h: "Проверку на 15 ставь первой!" }
      ]
    },
    {
      id: "nested",
      title: "in и вложенные условия",
      theory: `
<p>Оператор <code>in</code> проверяет, содержится ли значение внутри строки или списка:</p>
<pre>print("ко" in "молоко")        # True
print("x" not in "abc")        # True</pre>
<p>Условия можно <b>вкладывать</b> друг в друга — каждый уровень сдвигается ещё на 4 пробела:</p>
<pre>logged_in = True
is_admin = False
if logged_in:
    if is_admin:
        print("Админ-панель")
    else:
        print("Профиль")
else:
    print("Войдите")</pre>`,
      ex: [
        { t: "Выведи, есть ли подстрока <code>\"кот\"</code> в строке (результат <code>in</code>)", s: `s = "скотина"\n`, e: "True", m: [" in "], sol: `s = "скотина"\nprint("кот" in s)`, h: "print(\"кот\" in s)" },
        { t: "Если в email нет символа <code>@</code> (<code>not in</code>), выведи <code>Ошибка</code>, иначе <code>OK</code>", s: `email = "user.mail.ru"\n`, e: "Ошибка", m: ["not in"], sol: `email = "user.mail.ru"\nif "@" not in email:\n    print("Ошибка")\nelse:\n    print("OK")`, h: "if \"@\" not in email:" },
        { t: "Вложенное условие: если <code>logged_in</code>, то проверь <code>is_admin</code>: <code>Админ</code> / <code>Пользователь</code>. Если не вошёл — <code>Гость</code>", s: `logged_in = True\nis_admin = False\n`, e: "Пользователь", m: ["re:\\n\\s{4,}if "], sol: `logged_in = True\nis_admin = False\nif logged_in:\n    if is_admin:\n        print("Админ")\n    else:\n        print("Пользователь")\nelse:\n    print("Гость")`, h: "Внутренний if с отступом 4 пробела, его тело — 8" },
        { t: "Считай букву. Если она есть в <code>\"аеёиоуыэюя\"</code> — <code>Гласная</code>, иначе <code>Согласная</code>", s: ``, i: ["о"], e: "Гласная", m: [" in "], sol: `ch = input()\nif ch in "аеёиоуыэюя":\n    print("Гласная")\nelse:\n    print("Согласная")`, h: "if ch in \"аеёиоуыэюя\":" },
        { t: "Високосный год: делится на 4 и не делится на 100, ИЛИ делится на 400. Выведи <code>Високосный</code> или <code>Обычный</code>", s: `year = 2024\n`, e: "Високосный", m: ["if "], sol: `year = 2024\nif (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:\n    print("Високосный")\nelse:\n    print("Обычный")`, h: "(year % 4 == 0 and year % 100 != 0) or year % 400 == 0" }
      ]
    }
  ]
});
