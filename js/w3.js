// Мир 3 — Ледяные пещеры циклов
(globalThis.WORLDS ||= []).push({
  name: "Ледяные пещеры",
  sub: "Циклы",
  theme: "snow",
  lessons: [
    {
      id: "for",
      title: "Цикл for",
      theory: `
<p>Цикл <code>for</code> перебирает элементы по одному. Переменная цикла на каждом шаге принимает следующее значение:</p>
<pre>for letter in "кот":
    print(letter)
# к
# о
# т

for fruit in ["яблоко", "груша"]:
    print("Я ем", fruit)</pre>
<p>Тело цикла — строки с отступом.</p>`,
      ex: [
        { t: "Выведи каждую букву слова на отдельной строке с помощью <code>for</code>", s: `word = "Python"\n`, e: "P\ny\nt\nh\no\nn", m: ["for "], sol: `word = "Python"\nfor ch in word:\n    print(ch)`, h: "for ch in word:\n    print(ch)" },
        { t: "Выведи каждый цвет из списка", s: `colors = ["red", "green", "blue"]\n`, e: "red\ngreen\nblue", m: ["for "], sol: `colors = ["red", "green", "blue"]\nfor c in colors:\n    print(c)`, h: "for c in colors:" },
        { t: "Для каждого имени выведи <code>Привет, ИМЯ!</code>", s: `names = ["Аня", "Боря", "Вика"]\n`, e: "Привет, Аня!\nПривет, Боря!\nПривет, Вика!", m: ["for "], sol: `names = ["Аня", "Боря", "Вика"]\nfor n in names:\n    print(f"Привет, {n}!")`, h: "print(f\"Привет, {n}!\")" },
        { t: "Выведи каждое число из списка, умноженное на 10", s: `nums = [1, 2, 3]\n`, e: "10\n20\n30", m: ["for "], sol: `nums = [1, 2, 3]\nfor n in nums:\n    print(n * 10)`, h: "print(n * 10)" },
        { t: "Выведи буквы слова в верхнем регистре через пробел на одной строке (используй <code>end=\" \"</code>)", s: `word = "abc"\n`, e: "A B C", m: ["for ", ".upper()"], sol: `word = "abc"\nfor ch in word:\n    print(ch.upper(), end=" ")`, h: "print(ch.upper(), end=\" \"). Пробел в конце строки не важен." }
      ]
    },
    {
      id: "range",
      title: "range()",
      theory: `
<p><code>range()</code> генерирует последовательность чисел:</p>
<pre>range(5)          # 0, 1, 2, 3, 4  (5 не входит!)
range(1, 6)       # 1, 2, 3, 4, 5
range(0, 10, 2)   # 0, 2, 4, 6, 8  — шаг 2
range(5, 0, -1)   # 5, 4, 3, 2, 1  — обратный отсчёт</pre>
<pre>for i in range(3):
    print("Шаг", i)</pre>`,
      ex: [
        { t: "Выведи числа от 0 до 4 с помощью <code>range(5)</code>", s: ``, e: "0\n1\n2\n3\n4", m: ["range("], sol: `for i in range(5):\n    print(i)`, h: "for i in range(5):" },
        { t: "Выведи числа от 1 до 5 включительно", s: ``, e: "1\n2\n3\n4\n5", m: ["range(1"], sol: `for i in range(1, 6):\n    print(i)`, h: "range(1, 6) — конец не включается" },
        { t: "Выведи чётные числа от 2 до 10 с шагом 2", s: ``, e: "2\n4\n6\n8\n10", m: ["range("], sol: `for i in range(2, 11, 2):\n    print(i)`, h: "range(2, 11, 2)" },
        { t: "Обратный отсчёт от 5 до 1, затем выведи <code>Старт!</code>", s: ``, e: "5\n4\n3\n2\n1\nСтарт!", m: ["range(", "-1"], sol: `for i in range(5, 0, -1):\n    print(i)\nprint("Старт!")`, h: "range(5, 0, -1)" },
        { t: "Выведи таблицу умножения на 7 от 1 до 5 в формате <code>7 x 1 = 7</code>", s: ``, e: "7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35", m: ["range("], sol: `for i in range(1, 6):\n    print(f"7 x {i} = {7 * i}")`, h: "print(f\"7 x {i} = {7 * i}\")" }
      ]
    },
    {
      id: "while",
      title: "Цикл while",
      theory: `
<p><code>while</code> повторяет блок, <b>пока</b> условие истинно:</p>
<pre>n = 3
while n > 0:
    print(n)
    n -= 1      # не забудь менять переменную!
print("Готово")</pre>
<p>Если условие никогда не станет ложным — получится <b>бесконечный цикл</b>. В игре такой код будет остановлен через несколько секунд.</p>`,
      ex: [
        { t: "С помощью <code>while</code> выведи числа от 1 до 3", s: `i = 1\n`, e: "1\n2\n3", m: ["while "], sol: `i = 1\nwhile i <= 3:\n    print(i)\n    i += 1`, h: "while i <= 3: ... i += 1" },
        { t: "Удваивай <code>x</code>, пока он меньше 100, выводя каждое значение (начиная с 1)", s: `x = 1\n`, e: "1\n2\n4\n8\n16\n32\n64", m: ["while "], sol: `x = 1\nwhile x < 100:\n    print(x)\n    x *= 2`, h: "x *= 2 внутри цикла" },
        { t: "Тратить монеты по 3, пока их хватает. Выведи, сколько осталось в конце", s: `coins = 20\n`, e: "2", m: ["while "], sol: `coins = 20\nwhile coins >= 3:\n    coins -= 3\nprint(coins)`, h: "while coins >= 3: coins -= 3" },
        { t: "Считывай пароли (input), пока не введут <code>open</code>. Затем выведи <code>Открыто</code>", s: ``, i: ["123", "qwe", "open"], e: "Открыто", m: ["while "], sol: `p = input()\nwhile p != "open":\n    p = input()\nprint("Открыто")`, h: "p = input() до цикла и внутри цикла" },
        { t: "Посчитай сумму цифр числа <code>n</code> через while (<code>% 10</code> и <code>// 10</code>)", s: `n = 4815\n`, e: "18", m: ["while ", "% 10", "//"], sol: `n = 4815\ntotal = 0\nwhile n > 0:\n    total += n % 10\n    n //= 10\nprint(total)`, h: "Последняя цифра: n % 10, убрать её: n //= 10" }
      ]
    },
    {
      id: "breakcont",
      title: "break и continue",
      theory: `
<p><code>break</code> — немедленно выйти из цикла. <code>continue</code> — пропустить остаток тела и перейти к следующему шагу.</p>
<pre>for i in range(10):
    if i == 5:
        break        # остановимся на 5
    if i % 2 == 0:
        continue     # пропустим чётные
    print(i)
# 1
# 3</pre>
<p>Классика: <code>while True:</code> + <code>break</code> при нужном условии.</p>`,
      ex: [
        { t: "Выводи числа от 1, но остановись (<code>break</code>), когда дойдёшь до 4 (4 не выводить)", s: ``, e: "1\n2\n3", m: ["break"], sol: `for i in range(1, 100):\n    if i == 4:\n        break\n    print(i)`, h: "if i == 4: break" },
        { t: "Выведи числа от 1 до 6, пропуская 3 (<code>continue</code>)", s: ``, e: "1\n2\n4\n5\n6", m: ["continue"], sol: `for i in range(1, 7):\n    if i == 3:\n        continue\n    print(i)`, h: "if i == 3: continue" },
        { t: "Выведи только нечётные числа от 1 до 9 с помощью <code>continue</code>", s: ``, e: "1\n3\n5\n7\n9", m: ["continue"], sol: `for i in range(1, 10):\n    if i % 2 == 0:\n        continue\n    print(i)`, h: "Пропускай чётные" },
        { t: "<code>while True</code>: считывай слова и выводи их, пока не придёт <code>стоп</code>", s: ``, i: ["раз", "два", "стоп", "три"], e: "раз\nдва", m: ["while True", "break"], sol: `while True:\n    w = input()\n    if w == "стоп":\n        break\n    print(w)`, h: "Проверка на стоп перед print" },
        { t: "Найди первое число в списке, которое больше 50, выведи его и прерви цикл", s: `nums = [12, 45, 67, 89, 23]\n`, e: "67", m: ["break"], sol: `nums = [12, 45, 67, 89, 23]\nfor n in nums:\n    if n > 50:\n        print(n)\n        break`, h: "print и break внутри if" }
      ]
    },
    {
      id: "accum",
      title: "Счётчики и суммы",
      theory: `
<p>Частые приёмы с циклами — <b>накопить сумму</b> или <b>посчитать количество</b>:</p>
<pre>total = 0
for n in [3, 5, 7]:
    total += n
print(total)        # 15

count = 0
for ch in "банан":
    if ch == "а":
        count += 1
print(count)        # 2</pre>
<p>Ещё приём — поиск максимума: заводим переменную и обновляем её, если нашли больше.</p>`,
      ex: [
        { t: "Посчитай сумму чисел от 1 до 100 циклом", s: `total = 0\n`, e: "5050", m: ["for ", "+="], sol: `total = 0\nfor i in range(1, 101):\n    total += i\nprint(total)`, h: "total += i в цикле по range(1, 101)" },
        { t: "Посчитай, сколько в списке отрицательных чисел", s: `nums = [3, -1, 4, -5, -9, 2]\ncount = 0\n`, e: "3", m: ["for ", "+= 1"], sol: `nums = [3, -1, 4, -5, -9, 2]\ncount = 0\nfor n in nums:\n    if n < 0:\n        count += 1\nprint(count)`, h: "if n < 0: count += 1" },
        { t: "Найди максимум в списке БЕЗ функции max()", s: `nums = [17, 42, 8, 33]\nbest = nums[0]\n`, e: "42", m: ["for "], sol: `nums = [17, 42, 8, 33]\nbest = nums[0]\nfor n in nums:\n    if n > best:\n        best = n\nprint(best)`, h: "if n > best: best = n" },
        { t: "Посчитай произведение чисел от 1 до 6 (факториал 6)", s: `result = 1\n`, e: "720", m: ["for ", "*="], sol: `result = 1\nfor i in range(1, 7):\n    result *= i\nprint(result)`, h: "result *= i" },
        { t: "Собери новую строку только из гласных слова (<code>res += ch</code>)", s: `word = "программирование"\nres = ""\n`, e: "оаиоаие", m: ["for ", "+="], sol: `word = "программирование"\nres = ""\nfor ch in word:\n    if ch in "аеёиоуыэюя":\n        res += ch\nprint(res)`, h: "if ch in \"аеёиоуыэюя\": res += ch" }
      ]
    },
    {
      id: "nestedloops",
      title: "Вложенные циклы",
      theory: `
<p>Цикл внутри цикла: внутренний цикл проходит полностью на <b>каждом</b> шаге внешнего.</p>
<pre>for i in range(1, 3):
    for j in range(1, 4):
        print(i, j)
# 1 1 / 1 2 / 1 3 / 2 1 / 2 2 / 2 3</pre>
<p>Рисуем фигуры:</p>
<pre>for i in range(1, 4):
    print("#" * i)
# #
# ##
# ###</pre>`,
      ex: [
        { t: "Нарисуй лесенку из 4 строк: <code>*</code>, <code>**</code>, <code>***</code>, <code>****</code>", s: ``, e: "*\n**\n***\n****", m: ["for "], sol: `for i in range(1, 5):\n    print("*" * i)`, h: "print(\"*\" * i)" },
        { t: "Нарисуй квадрат 3x3 из <code>#</code> вложенными циклами (внутри <code>print(\"#\", end=\"\")</code>, после — пустой <code>print()</code>)", s: ``, e: "###\n###\n###", m: ["re:for[\\s\\S]*for"], sol: `for i in range(3):\n    for j in range(3):\n        print("#", end="")\n    print()`, h: "Внешний цикл — строки, внутренний — символы" },
        { t: "Выведи все пары <code>i j</code> для i от 1 до 2 и j от 1 до 2", s: ``, e: "1 1\n1 2\n2 1\n2 2", m: ["re:for[\\s\\S]*for"], sol: `for i in range(1, 3):\n    for j in range(1, 3):\n        print(i, j)`, h: "Два вложенных for по range(1, 3)" },
        { t: "Таблица умножения 3x3: каждая строка — числа через пробел (<code>1 2 3</code> / <code>2 4 6</code> / <code>3 6 9</code>)", s: ``, e: "1 2 3\n2 4 6\n3 6 9", m: ["re:for[\\s\\S]*for"], sol: `for i in range(1, 4):\n    row = []\n    for j in range(1, 4):\n        row.append(str(i * j))\n    print(" ".join(row))`, h: "Собери строку и выведи её после внутреннего цикла. Можно print(i*j, end=\" \")" },
        { t: "Перевёрнутая пирамида: <code>###</code>, <code>##</code>, <code>#</code>", s: ``, e: "###\n##\n#", m: ["for ", "range("], sol: `for i in range(3, 0, -1):\n    print("#" * i)`, h: "range(3, 0, -1)" }
      ]
    }
  ]
});
