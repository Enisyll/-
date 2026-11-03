// Мир 5 — Замок функций
(globalThis.WORLDS ||= []).push({
  name: "Замок функций",
  sub: "Свои функции",
  theme: "castle",
  lessons: [
    {
      id: "def",
      title: "def — своя функция",
      theory: `
<p><b>Функция</b> — именованный кусок кода, который можно вызывать много раз:</p>
<pre>def greet():
    print("Привет!")
    print("Как дела?")

greet()    # вызов
greet()    # и ещё раз</pre>
<p>Функция может принимать <b>параметры</b>:</p>
<pre>def greet(name):
    print(f"Привет, {name}!")

greet("Аня")    # Привет, Аня!</pre>`,
      ex: [
        { t: "Создай функцию <code>hello()</code>, которая выводит <code>Hello!</code>, и вызови её", s: ``, e: "Hello!", m: ["def hello("], sol: `def hello():\n    print("Hello!")\n\nhello()`, h: "def hello():\n    print(\"Hello!\")\nhello()" },
        { t: "Вызови функцию <code>beep()</code> три раза", s: `def beep():\n    print("бип")\n\n`, e: "бип\nбип\nбип", m: ["beep()"], sol: `def beep():\n    print("бип")\n\nbeep()\nbeep()\nbeep()`, h: "Можно и в цикле: for i in range(3): beep()" },
        { t: "Функция <code>greet(name)</code> выводит <code>Привет, ИМЯ!</code>. Вызови её для <code>\"Аня\"</code> и <code>\"Боря\"</code>", s: ``, e: "Привет, Аня!\nПривет, Боря!", m: ["def greet("], sol: `def greet(name):\n    print(f"Привет, {name}!")\n\ngreet("Аня")\ngreet("Боря")`, h: "def greet(name): print(f\"Привет, {name}!\")" },
        { t: "Функция <code>line(n)</code> печатает <code>n</code> символов <code>=</code>. Вызови <code>line(8)</code>", s: ``, e: "========", m: ["def line("], sol: `def line(n):\n    print("=" * n)\n\nline(8)`, h: "print(\"=\" * n)" },
        { t: "Функция <code>info(name, age)</code> с двумя параметрами выводит <code>ИМЯ — ВОЗРАСТ лет</code>. Вызови для Claude, 3", s: ``, e: "Claude — 3 лет", m: ["def info("], sol: `def info(name, age):\n    print(f"{name} — {age} лет")\n\ninfo("Claude", 3)`, h: "Параметры через запятую: def info(name, age):" }
      ]
    },
    {
      id: "return",
      title: "return — результат",
      theory: `
<p><code>return</code> возвращает значение из функции — его можно сохранить в переменную или использовать в выражении:</p>
<pre>def square(x):
    return x * x

result = square(5)
print(result)            # 25
print(square(3) + 1)     # 10</pre>
<p>После <code>return</code> функция сразу заканчивается. Если <code>return</code> нет — функция вернёт <code>None</code>.</p>
<p>Разница: <code>print</code> показывает человеку, <code>return</code> отдаёт значение программе.</p>`,
      ex: [
        { t: "Напиши функцию <code>add(a, b)</code>, которая <b>возвращает</b> сумму. Выведи <code>add(2, 3)</code>", s: ``, e: "5", m: ["def add(", "return"], test: "assert add(10, -4) == 6, 'add(10, -4) должно вернуть 6'", sol: `def add(a, b):\n    return a + b\n\nprint(add(2, 3))`, h: "return a + b" },
        { t: "Функция <code>is_even(n)</code> возвращает <code>True</code>, если число чётное. Выведи <code>is_even(7)</code>", s: ``, e: "False", m: ["def is_even(", "return"], test: "assert is_even(4) is True and is_even(9) is False, 'is_even работает неверно'", sol: `def is_even(n):\n    return n % 2 == 0\n\nprint(is_even(7))`, h: "return n % 2 == 0" },
        { t: "Функция <code>area(w, h)</code> возвращает площадь прямоугольника. Выведи <code>area(4, 5)</code>", s: ``, e: "20", m: ["def area(", "return"], test: "assert area(3, 3) == 9", sol: `def area(w, h):\n    return w * h\n\nprint(area(4, 5))`, h: "return w * h" },
        { t: "Функция <code>maximum(a, b)</code> возвращает большее число (через if, без max). Выведи <code>maximum(8, 13)</code>", s: ``, e: "13", m: ["def maximum(", "return", "if "], test: "assert maximum(5, 2) == 5 and maximum(-1, -3) == -1", sol: `def maximum(a, b):\n    if a > b:\n        return a\n    return b\n\nprint(maximum(8, 13))`, h: "if a > b: return a, иначе return b" },
        { t: "Функция <code>count_vowels(s)</code> возвращает количество гласных (<code>aeiou</code>). Выведи для <code>\"programming\"</code>", s: ``, e: "3", m: ["def count_vowels(", "return"], test: "assert count_vowels('aeiou') == 5 and count_vowels('xyz') == 0", sol: `def count_vowels(s):\n    count = 0\n    for ch in s:\n        if ch in "aeiou":\n            count += 1\n    return count\n\nprint(count_vowels("programming"))`, h: "Счётчик в цикле, return после цикла" }
      ]
    },
    {
      id: "params",
      title: "Параметры по умолчанию",
      theory: `
<p>Параметру можно дать <b>значение по умолчанию</b> — тогда его можно не передавать:</p>
<pre>def greet(name, greeting="Привет"):
    return f"{greeting}, {name}!"

print(greet("Аня"))                    # Привет, Аня!
print(greet("Аня", "Здравствуй"))      # Здравствуй, Аня!
print(greet(greeting="Хай", name="Бо"))  # именованные аргументы</pre>
<p>Параметры со значением по умолчанию пишутся <b>после</b> обычных.</p>`,
      ex: [
        { t: "Функция <code>power(x, n=2)</code> возвращает x в степени n. Выведи <code>power(5)</code>", s: ``, e: "25", m: ["re:n\\s*=\\s*2", "return"], test: "assert power(2, 3) == 8 and power(3) == 9", sol: `def power(x, n=2):\n    return x ** n\n\nprint(power(5))`, h: "def power(x, n=2):" },
        { t: "Вызови <code>power(2, 10)</code>, передав второй аргумент", s: `def power(x, n=2):\n    return x ** n\n\n`, e: "1024", m: ["power(2, 10)"], sol: `def power(x, n=2):\n    return x ** n\n\nprint(power(2, 10))`, h: "print(power(2, 10))" },
        { t: "Функция <code>greet(name, greeting=\"Привет\")</code> возвращает строку. Выведи <code>greet(\"Аня\")</code>", s: ``, e: "Привет, Аня!", m: ["greeting=", "return"], test: "assert greet('Бо', 'Хай') == 'Хай, Бо!'", sol: `def greet(name, greeting="Привет"):\n    return f"{greeting}, {name}!"\n\nprint(greet("Аня"))`, h: "return f\"{greeting}, {name}!\"" },
        { t: "Вызови функцию с <b>именованными</b> аргументами в обратном порядке: <code>order(drink=\"чай\", food=\"пирог\")</code>", s: `def order(food, drink):\n    print(f"Еда: {food}, напиток: {drink}")\n\n`, e: "Еда: пирог, напиток: чай", m: ["drink=", "food="], sol: `def order(food, drink):\n    print(f"Еда: {food}, напиток: {drink}")\n\norder(drink="чай", food="пирог")`, h: "order(drink=\"чай\", food=\"пирог\")" },
        { t: "Функция <code>price(amount, discount=0)</code> возвращает цену со скидкой в процентах. Выведи <code>price(1000, 15)</code>", s: ``, e: "850.0", m: ["discount=0", "return"], test: "assert price(500) == 500", sol: `def price(amount, discount=0):\n    return amount * (1 - discount / 100)\n\nprint(price(1000, 15))`, h: "amount * (1 - discount / 100)" }
      ]
    },
    {
      id: "args",
      title: "*args и **kwargs",
      theory: `
<p><code>*args</code> собирает любое количество аргументов в <b>кортеж</b>:</p>
<pre>def total(*args):
    return sum(args)

print(total(1, 2, 3))     # 6
print(total(5))           # 5</pre>
<p><code>**kwargs</code> собирает именованные аргументы в <b>словарь</b>:</p>
<pre>def profile(**kwargs):
    for key, value in kwargs.items():
        print(key, "=", value)

profile(name="Аня", age=12)</pre>
<p>Звёздочка работает и наоборот — <b>распаковка</b>: <code>print(*[1, 2, 3])</code> → <code>1 2 3</code>.</p>`,
      ex: [
        { t: "Функция <code>total(*args)</code> возвращает сумму всех аргументов. Выведи <code>total(1, 2, 3, 4)</code>", s: ``, e: "10", m: ["*args"], test: "assert total() == 0 and total(7) == 7", sol: `def total(*args):\n    return sum(args)\n\nprint(total(1, 2, 3, 4))`, h: "return sum(args)" },
        { t: "Функция <code>count(*args)</code> возвращает количество переданных аргументов. Выведи <code>count(\"a\", \"b\", \"c\")</code>", s: ``, e: "3", m: ["*args", "len("], test: "assert count() == 0", sol: `def count(*args):\n    return len(args)\n\nprint(count("a", "b", "c"))`, h: "return len(args)" },
        { t: "Функция <code>show(**kwargs)</code> выводит каждую пару как <code>ключ: значение</code>. Вызови <code>show(hp=100, mp=30)</code>", s: ``, e: "hp: 100\nmp: 30", m: ["**kwargs", ".items()"], sol: `def show(**kwargs):\n    for k, v in kwargs.items():\n        print(f"{k}: {v}")\n\nshow(hp=100, mp=30)`, h: "for k, v in kwargs.items():" },
        { t: "Распакуй список в аргументы print через звёздочку: <code>print(*nums)</code>", s: `nums = [3, 1, 4, 1, 5]\n`, e: "3 1 4 1 5", m: ["*nums"], sol: `nums = [3, 1, 4, 1, 5]\nprint(*nums)`, h: "print(*nums)" },
        { t: "Функция <code>biggest(*args)</code> возвращает максимум. Выведи <code>biggest(4, 99, 23)</code>", s: ``, e: "99", m: ["*args", "return"], test: "assert biggest(-5, -2) == -2", sol: `def biggest(*args):\n    return max(args)\n\nprint(biggest(4, 99, 23))`, h: "return max(args)" }
      ]
    },
    {
      id: "lambda",
      title: "lambda, map, filter",
      theory: `
<p><b>lambda</b> — короткая безымянная функция в одну строку:</p>
<pre>double = lambda x: x * 2
print(double(5))     # 10</pre>
<p>Чаще всего lambda передают в другие функции:</p>
<pre>nums = [1, 2, 3, 4]
print(list(map(lambda x: x * 10, nums)))         # [10, 20, 30, 40]
print(list(filter(lambda x: x % 2 == 0, nums)))  # [2, 4]
words = ["банан", "яблоко", "киви"]
print(sorted(words, key=len))                    # по длине
print(sorted(words, key=lambda w: w[-1]))        # по последней букве</pre>`,
      ex: [
        { t: "Создай lambda <code>triple</code>, которая утраивает число. Выведи <code>triple(7)</code>", s: ``, e: "21", m: ["lambda"], test: "assert triple(2) == 6", sol: `triple = lambda x: x * 3\nprint(triple(7))`, h: "triple = lambda x: x * 3" },
        { t: "С помощью <code>map</code> и lambda возведи все числа в квадрат и выведи список", s: `nums = [1, 2, 3, 4]\n`, e: "[1, 4, 9, 16]", m: ["map(", "lambda"], sol: `nums = [1, 2, 3, 4]\nprint(list(map(lambda x: x ** 2, nums)))`, h: "list(map(lambda x: x ** 2, nums))" },
        { t: "С помощью <code>filter</code> оставь только слова длиннее 3 букв", s: `words = ["я", "кот", "слон", "жираф"]\n`, e: "['слон', 'жираф']", m: ["filter(", "lambda"], sol: `words = ["я", "кот", "слон", "жираф"]\nprint(list(filter(lambda w: len(w) > 3, words)))`, h: "filter(lambda w: len(w) > 3, words)" },
        { t: "Отсортируй слова по длине: <code>sorted(words, key=len)</code>", s: `words = ["арбуз", "ёж", "кот"]\n`, e: "['ёж', 'кот', 'арбуз']", m: ["key="], sol: `words = ["арбуз", "ёж", "кот"]\nprint(sorted(words, key=len))`, h: "sorted(words, key=len)" },
        { t: "Отсортируй игроков по очкам по убыванию (<code>key=lambda p: p[1]</code>, <code>reverse=True</code>), выведи список", s: `players = [("Аня", 50), ("Боря", 90), ("Вика", 70)]\n`, e: "[('Боря', 90), ('Вика', 70), ('Аня', 50)]", m: ["lambda", "key="], sol: `players = [("Аня", 50), ("Боря", 90), ("Вика", 70)]\nprint(sorted(players, key=lambda p: p[1], reverse=True))`, h: "sorted(players, key=lambda p: p[1], reverse=True)" }
      ]
    },
    {
      id: "recursion",
      title: "Рекурсия и область видимости",
      theory: `
<p><b>Рекурсия</b> — функция вызывает сама себя. Обязательно нужен <b>базовый случай</b>, где вызовы останавливаются:</p>
<pre>def factorial(n):
    if n <= 1:          # базовый случай
        return 1
    return n * factorial(n - 1)

print(factorial(5))     # 120</pre>
<p><b>Область видимости</b>: переменные, созданные внутри функции, — <b>локальные</b>, снаружи их не видно. Чтобы изменить внешнюю переменную, нужно <code>global</code>:</p>
<pre>count = 0
def inc():
    global count
    count += 1</pre>`,
      ex: [
        { t: "Рекурсивная функция <code>factorial(n)</code>. Выведи <code>factorial(6)</code>", s: ``, e: "720", m: ["def factorial(", "factorial(n - 1)"], test: "assert factorial(1) == 1 and factorial(4) == 24", sol: `def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(6))`, h: "if n <= 1: return 1, иначе return n * factorial(n - 1)" },
        { t: "Рекурсивный обратный отсчёт <code>countdown(n)</code>: выводит n, потом вызывает <code>countdown(n - 1)</code>, пока n > 0. Вызови <code>countdown(3)</code>", s: ``, e: "3\n2\n1", m: ["countdown(n - 1)"], sol: `def countdown(n):\n    if n <= 0:\n        return\n    print(n)\n    countdown(n - 1)\n\ncountdown(3)`, h: "Базовый случай: if n <= 0: return" },
        { t: "Рекурсивная <code>fib(n)</code> — числа Фибоначчи (fib(0)=0, fib(1)=1). Выведи <code>fib(10)</code>", s: ``, e: "55", m: ["def fib(", "fib(n - 1)"], test: "assert fib(0) == 0 and fib(1) == 1 and fib(7) == 13", sol: `def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint(fib(10))`, h: "if n < 2: return n" },
        { t: "Рекурсивная <code>sum_list(lst)</code>: первый элемент + сумма остальных (<code>lst[1:]</code>). Выведи для <code>[1, 2, 3, 4]</code>", s: ``, e: "10", m: ["sum_list(lst[1:])"], test: "assert sum_list([]) == 0", sol: `def sum_list(lst):\n    if not lst:\n        return 0\n    return lst[0] + sum_list(lst[1:])\n\nprint(sum_list([1, 2, 3, 4]))`, h: "Пустой список → 0" },
        { t: "Используй <code>global</code>, чтобы функция <code>add_point()</code> увеличивала <code>score</code>. Вызови её 3 раза и выведи <code>score</code>", s: `score = 0\n\n`, e: "3", m: ["global score"], sol: `score = 0\n\ndef add_point():\n    global score\n    score += 1\n\nadd_point()\nadd_point()\nadd_point()\nprint(score)`, h: "Внутри функции: global score, затем score += 1" }
      ]
    }
  ]
});
