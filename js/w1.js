// Мир 1 — Строковый лес
(globalThis.WORLDS ||= []).push({
  name: "Строковый лес",
  sub: "Работа со строками",
  theme: "forest",
  lessons: [
    {
      id: "strops",
      title: "Сложение и умножение строк",
      theory: `
<p>Строки можно <b>склеивать</b> оператором <code>+</code> и <b>повторять</b> оператором <code>*</code>:</p>
<pre>first = "Py"
second = "thon"
print(first + second)   # Python
print("ha" * 3)         # hahaha
print("-" * 10)         # ----------</pre>
<p>Пробелы сами не добавляются: <code>"a" + "b"</code> → <code>ab</code>. Нужен пробел — добавь <code>" "</code>.</p>`,
      ex: [
        { t: "Склей <code>a</code> и <code>b</code> через <code>+</code> и выведи <code>Pixel</code>", s: `a = "Pix"\nb = "el"\n`, e: "Pixel", m: ["+"], sol: `a = "Pix"\nb = "el"\nprint(a + b)`, h: "print(a + b)" },
        { t: "Выведи <code>Привет, Claude</code>, склеив <code>\"Привет, \"</code> и переменную <code>name</code>", s: `name = "Claude"\n`, e: "Привет, Claude", m: ["+ name"], sol: `name = "Claude"\nprint("Привет, " + name)`, h: "\"Привет, \" + name" },
        { t: "Выведи строку из 20 звёздочек <code>*</code>, используя умножение строки", s: ``, e: "********************", m: ["re:\\*\\s*20|20\\s*\\*"], sol: `print("*" * 20)`, h: "\"*\" * 20" },
        { t: "Выведи <code>ура!ура!ура!</code> с помощью <code>*</code>", s: ``, e: "ура!ура!ура!", m: ["re:\\*\\s*3"], sol: `print("ура!" * 3)`, h: "\"ура!\" * 3" },
        { t: "Склей имя и фамилию через пробел: <code>Ада Лавлейс</code>", s: `first = "Ада"\nlast = "Лавлейс"\n`, e: "Ада Лавлейс", m: ["+"], sol: `first = "Ада"\nlast = "Лавлейс"\nprint(first + " " + last)`, h: "first + \" \" + last" }
      ]
    },
    {
      id: "fstr",
      title: "f-строки",
      theory: `
<p><b>f-строка</b> — самый удобный способ вставить значения в текст. Перед кавычкой пишется <code>f</code>, а переменные — в фигурных скобках:</p>
<pre>name = "Claude"
age = 3
print(f"Меня зовут {name}, мне {age} года")
print(f"2 + 2 = {2 + 2}")        # внутри можно выражения
price = 9.5
print(f"Цена: {price:.2f}")      # Цена: 9.50 — 2 знака после точки</pre>`,
      ex: [
        { t: "С помощью f-строки выведи <code>Привет, Мир!</code>", s: `who = "Мир"\n`, e: "Привет, Мир!", m: ["f\"", "{who}"], sol: `who = "Мир"\nprint(f"Привет, {who}!")`, h: "print(f\"Привет, {who}!\")" },
        { t: "Выведи <code>Мне 25 лет</code> через f-строку", s: `age = 25\n`, e: "Мне 25 лет", m: ["{age}"], sol: `age = 25\nprint(f"Мне {age} лет")`, h: "f\"Мне {age} лет\"" },
        { t: "Выведи <code>3 * 7 = 21</code>, вычислив произведение прямо в f-строке", s: `a = 3\nb = 7\n`, e: "3 * 7 = 21", m: ["{a * b}"], sol: `a = 3\nb = 7\nprint(f"{a} * {b} = {a * b}")`, h: "{a * b} внутри f-строки" },
        { t: "Выведи цену с двумя знаками: <code>Итого: 4.50</code> (формат <code>:.2f</code>)", s: `total = 4.5\n`, e: "Итого: 4.50", m: [":.2f"], sol: `total = 4.5\nprint(f"Итого: {total:.2f}")`, h: "{total:.2f}" },
        { t: "Считай имя и выведи <code>ИМЯ, добро пожаловать в игру!</code> через f-строку", s: ``, i: ["Ника"], e: "Ника, добро пожаловать в игру!", m: ["re:f[\"']"], sol: `name = input()\nprint(f"{name}, добро пожаловать в игру!")`, h: "name = input(), затем f\"{name}, ...\"" }
      ]
    },
    {
      id: "upperlower",
      title: ".upper() и .lower()",
      theory: `
<p><b>Метод</b> — функция, которая «принадлежит» значению. Вызывается через точку.</p>
<pre>s = "Hello"
print(s.upper())   # HELLO — все буквы заглавные
print(s.lower())   # hello — все строчные</pre>
<p>Методы строк <b>не меняют</b> исходную строку, а возвращают новую. Чтобы сохранить — присвой: <code>s = s.upper()</code>.</p>
<p>Частый приём — сравнение без учёта регистра: <code>answer.lower() == "да"</code>.</p>`,
      ex: [
        { t: "Выведи <code>word</code> заглавными буквами с помощью <code>.upper()</code>", s: `word = "python"\n`, e: "PYTHON", m: [".upper()"], sol: `word = "python"\nprint(word.upper())`, h: "print(word.upper())" },
        { t: "Выведи <code>shout</code> строчными буквами с помощью <code>.lower()</code>", s: `shout = "НЕ КРИЧИ"\n`, e: "не кричи", m: [".lower()"], sol: `shout = "НЕ КРИЧИ"\nprint(shout.lower())`, h: "print(shout.lower())" },
        { t: "Сохрани в <code>name</code> версию в верхнем регистре (<code>name = name.upper()</code>) и выведи", s: `name = "claude"\n`, e: "CLAUDE", m: ["re:name\\s*=\\s*name\\.upper\\(\\)"], sol: `name = "claude"\nname = name.upper()\nprint(name)`, h: "name = name.upper()" },
        { t: "Считай ответ и выведи его в нижнем регистре", s: ``, i: ["ДаА"], e: "даа", m: [".lower()", "input("], sol: `ans = input()\nprint(ans.lower())`, h: "input().lower() тоже работает" },
        { t: "Выведи f-строкой <code>GAME OVER, ИГРОК</code>, где имя переведено в верхний регистр прямо в скобках", s: `player = "Ник"\n`, e: "GAME OVER, НИК", m: ["{player.upper()}"], sol: `player = "Ник"\nprint(f"GAME OVER, {player.upper()}")`, h: "f\"GAME OVER, {player.upper()}\"" }
      ]
    },
    {
      id: "strip",
      title: ".strip(), .lstrip(), .rstrip()",
      theory: `
<p><code>.strip()</code> убирает пробелы (и переносы строк) <b>по краям</b> строки:</p>
<pre>s = "   привет   "
print(s.strip())    # "привет"
print(s.lstrip())   # "привет   " — только слева
print(s.rstrip())   # "   привет" — только справа</pre>
<p>Можно указать, какие символы убирать:</p>
<pre>print("***ура***".strip("*"))   # ура
print("xxhixx".strip("x"))     # hi</pre>
<p>Пробелы в середине строки не трогаются. Очень полезно при обработке ввода: <code>input().strip()</code>.</p>`,
      ex: [
        { t: "Убери пробелы по краям с помощью <code>.strip()</code> и выведи в квадратных скобках: <code>[кот]</code>", s: `s = "   кот   "\n`, e: "[кот]", m: [".strip()"], sol: `s = "   кот   "\nprint("[" + s.strip() + "]")`, h: "\"[\" + s.strip() + \"]\"" },
        { t: "Убери пробелы только слева (<code>.lstrip()</code>) и выведи <code>[код  ]</code>", s: `s = "   код  "\n`, e: "[код  ]", m: [".lstrip()"], sol: `s = "   код  "\nprint(f"[{s.lstrip()}]")`, h: "f\"[{s.lstrip()}]\"" },
        { t: "Убери пробелы только справа (<code>.rstrip()</code>) и выведи <code>[  end]</code>", s: `s = "  end    "\n`, e: "[  end]", m: [".rstrip()"], sol: `s = "  end    "\nprint(f"[{s.rstrip()}]")`, h: "f\"[{s.rstrip()}]\"" },
        { t: "Убери все решётки по краям: <code>.strip(\"#\")</code>, выведи <code>Заголовок</code>", s: `title = "###Заголовок###"\n`, e: "Заголовок", m: [".strip("], sol: `title = "###Заголовок###"\nprint(title.strip("#"))`, h: "title.strip(\"#\")" },
        { t: "Считай ввод с лишними пробелами, очисти <code>.strip()</code> и переведи в нижний регистр (цепочка методов!)", s: ``, i: ["   ПРИВЕТ  "], e: "привет", m: [".strip()", ".lower()"], sol: `s = input()\nprint(s.strip().lower())`, h: "Методы можно вызывать цепочкой: s.strip().lower()" }
      ]
    },
    {
      id: "replace",
      title: ".replace()",
      theory: `
<p><code>.replace(старое, новое)</code> заменяет все вхождения подстроки:</p>
<pre>s = "Я люблю Java"
print(s.replace("Java", "Python"))   # Я люблю Python
print("a-b-c".replace("-", ""))      # abc — удалить символ
print("ааа".replace("а", "б", 2))     # бба — только 2 замены</pre>`,
      ex: [
        { t: "Замени <code>кошка</code> на <code>собака</code> и выведи", s: `s = "У меня есть кошка"\n`, e: "У меня есть собака", m: [".replace("], sol: `s = "У меня есть кошка"\nprint(s.replace("кошка", "собака"))`, h: "s.replace(\"кошка\", \"собака\")" },
        { t: "Удали все пробелы из номера телефона (замени <code>\" \"</code> на <code>\"\"</code>)", s: `phone = "8 900 123 45 67"\n`, e: "89001234567", m: [".replace("], sol: `phone = "8 900 123 45 67"\nprint(phone.replace(" ", ""))`, h: "phone.replace(\" \", \"\")" },
        { t: "Замени все точки на запятые: <code>3,14</code>", s: `num = "3.14"\n`, e: "3,14", m: [".replace("], sol: `num = "3.14"\nprint(num.replace(".", ","))`, h: "num.replace(\".\", \",\")" },
        { t: "Замени только первое <code>ха</code> на <code>ХА</code> (третий аргумент — количество)", s: `s = "хахаха"\n`, e: "ХАхаха", m: [".replace("], sol: `s = "хахаха"\nprint(s.replace("ха", "ХА", 1))`, h: "s.replace(\"ха\", \"ХА\", 1)" },
        { t: "Цепочка: замени <code>плохо</code> на <code>хорошо</code>, потом сделай всё заглавными", s: `s = "всё плохо"\n`, e: "ВСЁ ХОРОШО", m: [".replace(", ".upper()"], sol: `s = "всё плохо"\nprint(s.replace("плохо", "хорошо").upper())`, h: "s.replace(...).upper()" }
      ]
    },
    {
      id: "splitjoin",
      title: ".split() и .join()",
      theory: `
<p><code>.split()</code> режет строку на <b>список</b> частей. Без аргумента — по пробелам:</p>
<pre>s = "яблоко банан киви"
print(s.split())          # ['яблоко', 'банан', 'киви']
print("a,b,c".split(","))  # ['a', 'b', 'c']</pre>
<p><code>.join()</code> — обратная операция: склеивает список в строку через разделитель:</p>
<pre>words = ["a", "b", "c"]
print("-".join(words))    # a-b-c
print("".join(words))     # abc</pre>`,
      ex: [
        { t: "Разбей строку по пробелам с <code>.split()</code> и выведи список", s: `s = "раз два три"\n`, e: "['раз', 'два', 'три']", m: [".split("], sol: `s = "раз два три"\nprint(s.split())`, h: "print(s.split())" },
        { t: "Разбей CSV-строку по запятой и выведи список", s: `csv = "red,green,blue"\n`, e: "['red', 'green', 'blue']", m: [".split(\",\")"], sol: `csv = "red,green,blue"\nprint(csv.split(","))`, h: "csv.split(\",\")" },
        { t: "Склей список через пробел с помощью <code>\" \".join()</code>", s: `words = ["Python", "это", "сила"]\n`, e: "Python это сила", m: [".join("], sol: `words = ["Python", "это", "сила"]\nprint(" ".join(words))`, h: "\" \".join(words)" },
        { t: "Склей буквы через <code>-</code>: <code>P-Y-T-H-O-N</code>", s: `letters = ["P", "Y", "T", "H", "O", "N"]\n`, e: "P-Y-T-H-O-N", m: [".join("], sol: `letters = ["P", "Y", "T", "H", "O", "N"]\nprint("-".join(letters))`, h: "\"-\".join(letters)" },
        { t: "Замени пробелы на подчёркивания через split + join: <code>my_cool_var</code>", s: `s = "my cool var"\n`, e: "my_cool_var", m: [".split(", ".join("], sol: `s = "my cool var"\nprint("_".join(s.split()))`, h: "\"_\".join(s.split())" }
      ]
    },
    {
      id: "findcount",
      title: ".find(), .count(), .startswith()",
      theory: `
<pre>s = "банан"
print(s.find("н"))         # 2  — индекс первого вхождения (с нуля!)
print(s.find("я"))         # -1 — не найдено
print(s.count("а"))        # 2  — сколько раз встречается
print(s.startswith("ба"))  # True — начинается с?
print(s.endswith("ан"))    # True — заканчивается на?</pre>
<p><code>startswith</code> и <code>endswith</code> возвращают <code>True</code> или <code>False</code>.</p>`,
      ex: [
        { t: "Посчитай, сколько раз буква <code>о</code> встречается в строке, через <code>.count()</code>", s: `s = "молоко"\n`, e: "3", m: [".count("], sol: `s = "молоко"\nprint(s.count("о"))`, h: "s.count(\"о\")" },
        { t: "Найди индекс слова <code>мир</code> с помощью <code>.find()</code>", s: `s = "привет мир"\n`, e: "7", m: [".find("], sol: `s = "привет мир"\nprint(s.find("мир"))`, h: "s.find(\"мир\")" },
        { t: "Проверь, начинается ли <code>url</code> с <code>https</code> (<code>.startswith()</code>)", s: `url = "https://python.org"\n`, e: "True", m: [".startswith("], sol: `url = "https://python.org"\nprint(url.startswith("https"))`, h: "url.startswith(\"https\")" },
        { t: "Проверь, заканчивается ли имя файла на <code>.py</code> (<code>.endswith()</code>)", s: `file = "game.js"\n`, e: "False", m: [".endswith("], sol: `file = "game.js"\nprint(file.endswith(".py"))`, h: "file.endswith(\".py\")" },
        { t: "Посчитай количество слов <code>python</code> без учёта регистра (lower + count)", s: `s = "Python python PYTHON"\n`, e: "3", m: [".lower()", ".count("], sol: `s = "Python python PYTHON"\nprint(s.lower().count("python"))`, h: "s.lower().count(\"python\")" }
      ]
    },
    {
      id: "strcheck",
      title: ".title(), .capitalize(), .isdigit()",
      theory: `
<pre>s = "привет мир"
print(s.title())        # Привет Мир — каждое слово с заглавной
print(s.capitalize())   # Привет мир — только первая буква
print("12a".isdigit())  # False — только ли цифры?
print("123".isdigit())  # True
print("abc".isalpha())  # True — только ли буквы?
print("Hi".swapcase())  # hI — поменять регистр</pre>`,
      ex: [
        { t: "Сделай каждое слово с заглавной буквы через <code>.title()</code>", s: `name = "иван иванов"\n`, e: "Иван Иванов", m: [".title()"], sol: `name = "иван иванов"\nprint(name.title())`, h: "name.title()" },
        { t: "Сделай заглавной только первую букву предложения: <code>.capitalize()</code>", s: `s = "сегодня хороший день"\n`, e: "Сегодня хороший день", m: [".capitalize()"], sol: `s = "сегодня хороший день"\nprint(s.capitalize())`, h: "s.capitalize()" },
        { t: "Проверь, состоит ли код только из цифр (<code>.isdigit()</code>)", s: `code = "4815"\n`, e: "True", m: [".isdigit()"], sol: `code = "4815"\nprint(code.isdigit())`, h: "code.isdigit()" },
        { t: "Проверь <code>.isalpha()</code> для строки <code>\"abc123\"</code>", s: `s = "abc123"\n`, e: "False", m: [".isalpha()"], sol: `s = "abc123"\nprint(s.isalpha())`, h: "s.isalpha()" },
        { t: "Считай имя (с пробелами и в разном регистре), очисти и выведи с заглавной: <code>Мария</code>", s: ``, i: ["  мАРИЯ "], e: "Мария", m: [".strip()", ".capitalize()"], sol: `name = input()\nprint(name.strip().capitalize())`, h: "name.strip().capitalize()" }
      ]
    },
    {
      id: "index",
      title: "Индексы и len()",
      theory: `
<p>Каждый символ строки имеет <b>индекс</b> — номер. Счёт начинается с <b>нуля</b>!</p>
<pre>s = "Python"
#    012345
print(s[0])     # P
print(s[3])     # h
print(s[-1])    # n — с конца
print(s[-2])    # o
print(len(s))   # 6 — длина строки</pre>
<p>Последний индекс равен <code>len(s) - 1</code>. Обращение за пределы — ошибка <code>IndexError</code>.</p>`,
      ex: [
        { t: "Выведи первый символ строки (индекс 0)", s: `s = "Claude"\n`, e: "C", m: ["s[0]"], sol: `s = "Claude"\nprint(s[0])`, h: "s[0]" },
        { t: "Выведи последний символ через отрицательный индекс <code>[-1]</code>", s: `s = "Пиксель"\n`, e: "ь", m: ["[-1]"], sol: `s = "Пиксель"\nprint(s[-1])`, h: "s[-1]" },
        { t: "Выведи длину строки через <code>len()</code>", s: `s = "программирование"\n`, e: "16", m: ["len("], sol: `s = "программирование"\nprint(len(s))`, h: "len(s)" },
        { t: "Выведи третий символ строки (подумай, какой это индекс)", s: `s = "ABCDEF"\n`, e: "C", m: ["s[2]"], sol: `s = "ABCDEF"\nprint(s[2])`, h: "Третий символ — индекс 2" },
        { t: "Считай слово и выведи его первую и последнюю буквы через пробел", s: ``, i: ["радуга"], e: "р а", m: ["[0]", "[-1]"], sol: `w = input()\nprint(w[0], w[-1])`, h: "print(w[0], w[-1])" }
      ]
    },
    {
      id: "slices",
      title: "Срезы [start:stop:step]",
      theory: `
<p><b>Срез</b> вырезает кусок строки: <code>s[start:stop]</code> — от <code>start</code> включительно до <code>stop</code> НЕ включительно.</p>
<pre>s = "Python"
print(s[0:3])    # Pyt
print(s[2:])     # thon — до конца
print(s[:2])     # Py  — с начала
print(s[-3:])    # hon — последние 3
print(s[::2])    # Pto — каждый второй
print(s[::-1])   # nohtyP — задом наперёд!</pre>`,
      ex: [
        { t: "Выведи первые 3 символа строки срезом <code>[:3]</code>", s: `s = "Пиксельный"\n`, e: "Пик", m: ["[:3]"], sol: `s = "Пиксельный"\nprint(s[:3])`, h: "s[:3]" },
        { t: "Выведи строку без первых двух символов <code>[2:]</code>", s: `s = "--текст"\n`, e: "текст", m: ["[2:]"], sol: `s = "--текст"\nprint(s[2:])`, h: "s[2:]" },
        { t: "Выведи последние 4 символа строки", s: `year = "Год 2026"\n`, e: "2026", m: ["[-4:]"], sol: `year = "Год 2026"\nprint(year[-4:])`, h: "year[-4:]" },
        { t: "Разверни строку срезом <code>[::-1]</code>", s: `s = "топот"\nt = "Python"\n`, e: "nohtyP", m: ["t[::-1]"], sol: `s = "топот"\nt = "Python"\nprint(t[::-1])`, h: "t[::-1]" },
        { t: "Выведи символы с индекса 1 по 4 включительно (то есть срез <code>[1:5]</code>)", s: `s = "0123456789"\n`, e: "1234", m: ["[1:5]"], sol: `s = "0123456789"\nprint(s[1:5])`, h: "stop не включается, поэтому 5" }
      ]
    }
  ]
});
