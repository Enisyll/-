// Мир 0 — Зелёная долина: самые основы
(globalThis.WORLDS ||= []).push({
  name: "Зелёная долина",
  sub: "Основы Python",
  theme: "grass",
  lessons: [
    {
      id: "print",
      title: "print() — вывод",
      theory: `
<p>Функция <code>print()</code> выводит текст на экран. Текст пишут в кавычках — это <b>строка</b>.</p>
<pre>print("Привет!")
print('Можно и в одинарных')
print(42)          # числа — без кавычек</pre>
<p>Можно передать несколько значений через запятую — они выведутся через пробел:</p>
<pre>print("Мне", 10, "лет")   # Мне 10 лет</pre>
<p>Каждый <code>print()</code> печатает с новой строки. Пустой <code>print()</code> выводит пустую строку.</p>`,
      ex: [
        { t: "Выведи текст <code>Hello, World!</code>", s: ``, e: "Hello, World!", m: ["print("], sol: `print("Hello, World!")`, h: "Напиши print, в скобках — текст в кавычках." },
        { t: "Выведи <code>Привет, Python!</code>", s: ``, e: "Привет, Python!", m: ["print("], sol: `print("Привет, Python!")`, h: "print(\"...\")" },
        { t: "Выведи число <code>2026</code> (число пишется без кавычек)", s: ``, e: "2026", m: ["re:print\\(\\s*2026\\s*\\)"], sol: `print(2026)`, h: "Числа не нужно брать в кавычки: print(2026)" },
        { t: "Выведи две строки: сначала <code>Раз</code>, потом <code>Два</code>", s: ``, e: "Раз\nДва", m: ["print("], sol: `print("Раз")\nprint("Два")`, h: "Используй два print() на разных строках." },
        { t: "Одним <code>print()</code> выведи <code>Я учу Python</code>, передав три значения через запятую: \"Я\", \"учу\", \"Python\"", s: ``, e: "Я учу Python", m: ["re:print\\(\\s*[\"']Я[\"']\\s*,"], sol: `print("Я", "учу", "Python")`, h: "print(\"Я\", \"учу\", \"Python\") — запятые ставят пробелы сами." }
      ]
    },
    {
      id: "comments",
      title: "Комментарии # и sep/end",
      theory: `
<p>Всё после символа <code>#</code> — <b>комментарий</b>. Python его игнорирует. Комментарии пишут для людей.</p>
<pre># Это комментарий
print("Код работает")  # и это тоже
# print("Эта строка не выполнится")</pre>
<p>У <code>print()</code> есть настройки: <code>sep</code> — чем разделять значения, <code>end</code> — чем закончить строку (по умолчанию переносом).</p>
<pre>print("a", "b", "c", sep="-")   # a-b-c
print("Без", end=" ")
print("переноса")              # Без переноса</pre>`,
      ex: [
        { t: "Закомментируй вторую строку, чтобы вывелось только <code>Нужно</code>", s: `print("Нужно")\nprint("Лишнее")`, e: "Нужно", m: ["#"], sol: `print("Нужно")\n# print("Лишнее")`, h: "Поставь # в начале второй строки." },
        { t: "Добавь комментарий <code># моя программа</code> над строкой и выведи <code>Готово</code>", s: ``, e: "Готово", m: ["#"], sol: `# моя программа\nprint("Готово")`, h: "Комментарий начинается с #" },
        { t: "Выведи <code>1-2-3</code>, передав числа 1, 2, 3 и <code>sep=\"-\"</code>", s: `print(1, 2, 3)`, e: "1-2-3", m: ["sep="], sol: `print(1, 2, 3, sep="-")`, h: "Добавь sep=\"-\" последним аргументом." },
        { t: "Сделай так, чтобы два print вывели одну строку <code>Привет мир</code> (используй <code>end=\" \"</code>)", s: `print("Привет")\nprint("мир")`, e: "Привет мир", m: ["end="], sol: `print("Привет", end=" ")\nprint("мир")`, h: "У первого print добавь end=\" \"" },
        { t: "Выведи <code>2026/11/03</code>, передав три значения 2026, 11, \"03\" и разделитель <code>/</code>", s: ``, e: "2026/11/03", m: ["sep="], sol: `print(2026, 11, "03", sep="/")`, h: "print(2026, 11, \"03\", sep=\"/\")" }
      ]
    },
    {
      id: "vars",
      title: "Переменные",
      theory: `
<p><b>Переменная</b> — это коробка с именем, в которой хранится значение. Знак <code>=</code> кладёт значение в коробку.</p>
<pre>name = "Claude"
age = 3
print(name)      # Claude
print(age)       # 3
age = 4          # значение можно поменять
print(age)       # 4</pre>
<p>Правила имён: буквы, цифры и <code>_</code>, нельзя начинать с цифры. Регистр важен: <code>Name</code> и <code>name</code> — разные переменные. Принято писать <code>snake_case</code>: <code>user_name</code>.</p>
<p>Можно присвоить сразу несколько: <code>a, b = 1, 2</code></p>`,
      ex: [
        { t: "Создай переменную <code>city</code> со значением <code>\"Москва\"</code> и выведи её", s: ``, e: "Москва", m: ["city =", "print(city)"], sol: `city = "Москва"\nprint(city)`, h: "city = \"Москва\", затем print(city)" },
        { t: "Создай переменную <code>score</code> = 100 и выведи её", s: ``, e: "100", m: ["re:score\\s*=\\s*100", "print(score)"], sol: `score = 100\nprint(score)`, h: "score = 100" },
        { t: "Измени значение <code>lives</code> на 2 и выведи его", s: `lives = 3\n`, e: "2", m: ["re:lives\\s*=\\s*2", "print(lives)"], sol: `lives = 3\nlives = 2\nprint(lives)`, h: "Просто присвой новое значение: lives = 2" },
        { t: "Создай <code>a = 5</code> и <code>b = a</code>, выведи <code>b</code>", s: ``, e: "5", m: ["re:b\\s*=\\s*a", "print(b)"], sol: `a = 5\nb = a\nprint(b)`, h: "b = a копирует значение из a" },
        { t: "Одной строкой присвой <code>x, y = 10, 20</code> и выведи их через пробел одним print", s: ``, e: "10 20", m: ["re:x\\s*,\\s*y\\s*="], sol: `x, y = 10, 20\nprint(x, y)`, h: "x, y = 10, 20 потом print(x, y)" }
      ]
    },
    {
      id: "types",
      title: "Типы данных и type()",
      theory: `
<p>У каждого значения есть <b>тип</b>:</p>
<pre>5        # int   — целое число
3.14     # float — дробное (через точку!)
"текст"  # str   — строка
True     # bool  — логическое: True или False
None     # NoneType — «ничего»</pre>
<p>Узнать тип можно функцией <code>type()</code>:</p>
<pre>print(type(5))        # &lt;class 'int'&gt;
print(type("5"))      # &lt;class 'str'&gt;</pre>
<p>Обрати внимание: <code>5</code> и <code>"5"</code> — разные вещи: число и строка.</p>`,
      ex: [
        { t: "Выведи тип числа <code>42</code> с помощью <code>type()</code>", s: ``, e: "<class 'int'>", m: ["type("], sol: `print(type(42))`, h: "print(type(42))" },
        { t: "Выведи тип значения <code>3.14</code>", s: ``, e: "<class 'float'>", m: ["type("], sol: `print(type(3.14))`, h: "print(type(3.14))" },
        { t: "Выведи тип строки <code>\"hello\"</code>", s: ``, e: "<class 'str'>", m: ["type("], sol: `print(type("hello"))`, h: "print(type(\"hello\"))" },
        { t: "Создай переменную <code>is_ready = True</code> и выведи её тип", s: ``, e: "<class 'bool'>", m: ["is_ready", "type(is_ready)"], sol: `is_ready = True\nprint(type(is_ready))`, h: "True пишется с большой буквы" },
        { t: "Выведи тип <code>\"10\"</code> (в кавычках!), а затем тип <code>10</code>", s: ``, e: "<class 'str'>\n<class 'int'>", m: ["type("], sol: `print(type("10"))\nprint(type(10))`, h: "Два print(type(...))" }
      ]
    },
    {
      id: "math",
      title: "Арифметика",
      theory: `
<pre>print(7 + 2)    # 9   сложение
print(7 - 2)    # 5   вычитание
print(7 * 2)    # 14  умножение
print(7 / 2)    # 3.5 деление (всегда float)
print(7 // 2)   # 3   целочисленное деление
print(7 % 2)    # 1   остаток от деления
print(2 ** 3)   # 8   степень</pre>
<p>Порядок как в математике, скобки меняют порядок: <code>(2 + 3) * 4</code> = 20.</p>
<p>Сокращения: <code>x += 1</code> то же самое, что <code>x = x + 1</code>. Есть ещё <code>-=</code>, <code>*=</code>, <code>/=</code>.</p>`,
      ex: [
        { t: "Выведи результат <code>15 * 4</code>", s: ``, e: "60", m: ["*"], sol: `print(15 * 4)`, h: "print(15 * 4)" },
        { t: "Выведи остаток от деления 17 на 5 (оператор <code>%</code>)", s: ``, e: "2", m: ["%"], sol: `print(17 % 5)`, h: "print(17 % 5)" },
        { t: "Выведи 2 в степени 10 (оператор <code>**</code>)", s: ``, e: "1024", m: ["**"], sol: `print(2 ** 10)`, h: "print(2 ** 10)" },
        { t: "Выведи целую часть от деления 20 на 3 (оператор <code>//</code>)", s: ``, e: "6", m: ["//"], sol: `print(20 // 3)`, h: "print(20 // 3)" },
        { t: "Увеличь <code>coins</code> на 15 с помощью <code>+=</code> и выведи", s: `coins = 10\n`, e: "25", m: ["+="], sol: `coins = 10\ncoins += 15\nprint(coins)`, h: "coins += 15" }
      ]
    },
    {
      id: "input",
      title: "input() — ввод",
      theory: `
<p><code>input()</code> ждёт, пока пользователь что-то введёт, и возвращает это <b>строкой</b>.</p>
<pre>name = input("Как тебя зовут? ")
print("Привет,", name)</pre>
<p>В игре ввод подставляется автоматически (ты увидишь его в консоли со значком ⌨). Подсказка внутри <code>input("...")</code> в проверке не учитывается.</p>
<p>Важно: <code>input()</code> всегда возвращает строку, даже если ввели число.</p>`,
      ex: [
        { t: "Считай имя через <code>input()</code> в переменную <code>name</code> и выведи его", s: ``, i: ["Анна"], e: "Анна", m: ["input("], sol: `name = input()\nprint(name)`, h: "name = input()" },
        { t: "Считай имя и выведи <code>Привет, ИМЯ</code> (через запятую в print)", s: ``, i: ["Борис"], e: "Привет, Борис", m: ["input("], sol: `name = input("Имя: ")\nprint("Привет,", name)`, h: "print(\"Привет,\", name)" },
        { t: "Считай город и выведи <code>Я живу в: ГОРОД</code>", s: ``, i: ["Казань"], e: "Я живу в: Казань", m: ["input("], sol: `city = input()\nprint("Я живу в:", city)`, h: "print(\"Я живу в:\", city)" },
        { t: "Считай два слова (два input) и выведи их одной строкой через пробел", s: ``, i: ["Синий", "кит"], e: "Синий кит", m: ["input("], sol: `a = input()\nb = input()\nprint(a, b)`, h: "Два вызова input() в две переменные" },
        { t: "Считай что-то и выведи тип полученного значения. Убедись, что это строка!", s: ``, i: ["123"], e: "<class 'str'>", m: ["input(", "type("], sol: `x = input()\nprint(type(x))`, h: "print(type(x))" }
      ]
    },
    {
      id: "convert",
      title: "int(), float(), str()",
      theory: `
<p>Тип можно <b>преобразовать</b>:</p>
<pre>int("42")      # 42     строка → целое
float("2.5")   # 2.5    строка → дробное
str(100)       # "100"  число → строка
int(3.99)      # 3      отбрасывает дробную часть
round(3.567, 2)  # 3.57 округление</pre>
<p>Классика: прочитать число из ввода:</p>
<pre>age = int(input())
print(age + 1)</pre>
<p>Без <code>int()</code> получилось бы сложение строки с числом — ошибка <code>TypeError</code>.</p>`,
      ex: [
        { t: "Считай число, преврати его в <code>int</code> и выведи число, умноженное на 2", s: ``, i: ["21"], e: "42", m: ["int("], sol: `n = int(input())\nprint(n * 2)`, h: "n = int(input())" },
        { t: "Считай два целых числа и выведи их сумму", s: ``, i: ["7", "8"], e: "15", m: ["int("], sol: `a = int(input())\nb = int(input())\nprint(a + b)`, h: "Каждое число оберни в int()" },
        { t: "Считай дробное число через <code>float()</code> и выведи его, увеличенное на 0.5", s: ``, i: ["1.5"], e: "2.0", m: ["float("], sol: `x = float(input())\nprint(x + 0.5)`, h: "x = float(input())" },
        { t: "Склей строку и число: выведи <code>Уровень 5</code> через <code>\"Уровень \" + str(level)</code>", s: `level = 5\n`, e: "Уровень 5", m: ["str(level)", "+"], sol: `level = 5\nprint("Уровень " + str(level))`, h: "Строку можно сложить только со строкой: str(level)" },
        { t: "Округли <code>pi</code> до 2 знаков с помощью <code>round()</code> и выведи", s: `pi = 3.14159\n`, e: "3.14", m: ["round("], sol: `pi = 3.14159\nprint(round(pi, 2))`, h: "round(pi, 2)" }
      ]
    }
  ]
});
