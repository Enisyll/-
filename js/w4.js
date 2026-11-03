// Мир 4 — Горы коллекций
(globalThis.WORLDS ||= []).push({
  name: "Горы коллекций",
  sub: "Списки, словари, множества",
  theme: "mountain",
  lessons: [
    {
      id: "lists",
      title: "Списки",
      theory: `
<p><b>Список</b> хранит много значений по порядку. Пишется в квадратных скобках:</p>
<pre>items = ["меч", "щит", "зелье"]
print(items[0])      # меч — индексы как у строк
print(items[-1])     # зелье
print(len(items))    # 3
items[1] = "лук"     # список можно менять!
print(items)         # ['меч', 'лук', 'зелье']
print(items[0:2])    # срезы тоже работают</pre>
<p>В списке могут быть любые значения, даже разных типов: <code>[1, "a", True]</code>.</p>`,
      ex: [
        { t: "Создай список <code>fruits</code> из <code>\"яблоко\"</code>, <code>\"банан\"</code>, <code>\"киви\"</code> и выведи его", s: ``, e: "['яблоко', 'банан', 'киви']", m: ["fruits", "["], sol: `fruits = ["яблоко", "банан", "киви"]\nprint(fruits)`, h: "fruits = [\"яблоко\", \"банан\", \"киви\"]" },
        { t: "Выведи второй элемент списка", s: `planets = ["Меркурий", "Венера", "Земля"]\n`, e: "Венера", m: ["planets[1]"], sol: `planets = ["Меркурий", "Венера", "Земля"]\nprint(planets[1])`, h: "Второй элемент — индекс 1" },
        { t: "Замени последний элемент на <code>99</code> и выведи список", s: `nums = [1, 2, 3]\n`, e: "[1, 2, 99]", m: ["re:nums\\[(-1|2)\\]\\s*="], sol: `nums = [1, 2, 3]\nnums[-1] = 99\nprint(nums)`, h: "nums[-1] = 99" },
        { t: "Выведи количество элементов списка через <code>len()</code>", s: `days = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]\n`, e: "7", m: ["len("], sol: `days = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]\nprint(len(days))`, h: "len(days)" },
        { t: "Выведи срезом только рабочие дни (первые 5)", s: `days = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]\n`, e: "['пн', 'вт', 'ср', 'чт', 'пт']", m: ["[:5]"], sol: `days = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]\nprint(days[:5])`, h: "days[:5]" }
      ]
    },
    {
      id: "listmethods",
      title: ".append(), .insert(), .remove(), .pop()",
      theory: `
<pre>bag = ["меч"]
bag.append("щит")       # добавить в конец → ['меч', 'щит']
bag.insert(0, "карта")  # вставить по индексу → ['карта', 'меч', 'щит']
bag.remove("меч")       # удалить по значению → ['карта', 'щит']
last = bag.pop()        # удалить и вернуть последний → 'щит'
first = bag.pop(0)      # удалить по индексу → 'карта'
bag.clear()             # очистить всё</pre>
<p>Эти методы <b>меняют сам список</b> (в отличие от методов строк).</p>`,
      ex: [
        { t: "Добавь <code>\"зелье\"</code> в конец списка через <code>.append()</code> и выведи список", s: `bag = ["меч", "щит"]\n`, e: "['меч', 'щит', 'зелье']", m: [".append("], sol: `bag = ["меч", "щит"]\nbag.append("зелье")\nprint(bag)`, h: "bag.append(\"зелье\")" },
        { t: "Вставь <code>0</code> в начало списка через <code>.insert()</code>", s: `nums = [1, 2, 3]\n`, e: "[0, 1, 2, 3]", m: [".insert("], sol: `nums = [1, 2, 3]\nnums.insert(0, 0)\nprint(nums)`, h: "nums.insert(0, 0) — индекс, потом значение" },
        { t: "Удали <code>\"брокколи\"</code> из списка через <code>.remove()</code>", s: `food = ["пицца", "брокколи", "торт"]\n`, e: "['пицца', 'торт']", m: [".remove("], sol: `food = ["пицца", "брокколи", "торт"]\nfood.remove("брокколи")\nprint(food)`, h: "food.remove(\"брокколи\")" },
        { t: "Достань последний элемент через <code>.pop()</code>, выведи его, затем выведи список", s: `stack = ["a", "b", "c"]\n`, e: "c\n['a', 'b']", m: [".pop()"], sol: `stack = ["a", "b", "c"]\ntop = stack.pop()\nprint(top)\nprint(stack)`, h: "top = stack.pop()" },
        { t: "Создай пустой список, циклом добавь в него квадраты чисел 1..5 и выведи", s: `squares = []\n`, e: "[1, 4, 9, 16, 25]", m: [".append(", "for "], sol: `squares = []\nfor i in range(1, 6):\n    squares.append(i ** 2)\nprint(squares)`, h: "squares.append(i ** 2)" }
      ]
    },
    {
      id: "listfuncs",
      title: "sort, sorted, min, max, sum",
      theory: `
<pre>nums = [5, 2, 8, 1]
print(min(nums), max(nums))   # 1 8
print(sum(nums))              # 16
print(sorted(nums))           # [1, 2, 5, 8] — новый список
nums.sort()                   # сортирует сам список
nums.sort(reverse=True)       # по убыванию → [8, 5, 2, 1]
nums.reverse()                # развернуть
print(nums.index(5))          # индекс элемента
print(nums.count(2))          # сколько раз встречается
print(3 in nums)              # есть ли элемент</pre>`,
      ex: [
        { t: "Выведи сумму всех чисел списка через <code>sum()</code>", s: `scores = [10, 25, 40, 5]\n`, e: "80", m: ["sum("], sol: `scores = [10, 25, 40, 5]\nprint(sum(scores))`, h: "sum(scores)" },
        { t: "Выведи минимум и максимум через пробел (<code>min()</code>, <code>max()</code>)", s: `temps = [-3, 7, 15, -10, 4]\n`, e: "-10 15", m: ["min(", "max("], sol: `temps = [-3, 7, 15, -10, 4]\nprint(min(temps), max(temps))`, h: "print(min(temps), max(temps))" },
        { t: "Отсортируй список методом <code>.sort()</code> и выведи", s: `names = ["Вика", "Аня", "Гоша", "Боря"]\n`, e: "['Аня', 'Боря', 'Вика', 'Гоша']", m: [".sort()"], sol: `names = ["Вика", "Аня", "Гоша", "Боря"]\nnames.sort()\nprint(names)`, h: "names.sort() ничего не возвращает — выводи names" },
        { t: "Выведи отсортированный по убыванию список через <code>sorted(..., reverse=True)</code>", s: `nums = [3, 9, 1, 7]\n`, e: "[9, 7, 3, 1]", m: ["sorted(", "reverse=True"], sol: `nums = [3, 9, 1, 7]\nprint(sorted(nums, reverse=True))`, h: "sorted(nums, reverse=True)" },
        { t: "Выведи среднее арифметическое оценок (сумма / количество)", s: `grades = [5, 4, 5, 3, 4, 3]\n`, e: "4.0", m: ["sum(", "len("], sol: `grades = [5, 4, 5, 3, 4, 3]\nprint(sum(grades) / len(grades))`, h: "sum(grades) / len(grades)" }
      ]
    },
    {
      id: "tuples",
      title: "Кортежи и распаковка",
      theory: `
<p><b>Кортеж</b> (tuple) — как список, но <b>неизменяемый</b>. Пишется в круглых скобках:</p>
<pre>point = (3, 5)
print(point[0])   # 3
# point[0] = 1   → ошибка! кортеж менять нельзя</pre>
<p><b>Распаковка</b> — разложить значения по переменным:</p>
<pre>x, y = point
print(x, y)        # 3 5
a, b = 1, 2
a, b = b, a        # обмен значений! теперь a=2, b=1</pre>`,
      ex: [
        { t: "Создай кортеж <code>rgb = (255, 128, 0)</code> и выведи его", s: ``, e: "(255, 128, 0)", m: ["rgb", "("], sol: `rgb = (255, 128, 0)\nprint(rgb)`, h: "rgb = (255, 128, 0)" },
        { t: "Выведи второй элемент кортежа", s: `size = (1920, 1080)\n`, e: "1080", m: ["size[1]"], sol: `size = (1920, 1080)\nprint(size[1])`, h: "size[1]" },
        { t: "Распакуй кортеж в <code>name, age</code> и выведи <code>Аня 12</code>", s: `person = ("Аня", 12)\n`, e: "Аня 12", m: ["re:name\\s*,\\s*age\\s*=\\s*person"], sol: `person = ("Аня", 12)\nname, age = person\nprint(name, age)`, h: "name, age = person" },
        { t: "Поменяй значения <code>a</code> и <code>b</code> местами одной строкой и выведи <code>a b</code>", s: `a = "лево"\nb = "право"\n`, e: "право лево", m: ["re:a\\s*,\\s*b\\s*=\\s*b\\s*,\\s*a"], sol: `a = "лево"\nb = "право"\na, b = b, a\nprint(a, b)`, h: "a, b = b, a" },
        { t: "Пройди циклом по списку кортежей с распаковкой <code>for name, score in ...</code> и выведи <code>ИМЯ: ОЧКИ</code>", s: `results = [("Аня", 90), ("Боря", 75)]\n`, e: "Аня: 90\nБоря: 75", m: ["re:for\\s+\\w+\\s*,\\s*\\w+\\s+in"], sol: `results = [("Аня", 90), ("Боря", 75)]\nfor name, score in results:\n    print(f"{name}: {score}")`, h: "for name, score in results:" }
      ]
    },
    {
      id: "dicts",
      title: "Словари",
      theory: `
<p><b>Словарь</b> (dict) хранит пары <b>ключ: значение</b>. Ищем значение по ключу, а не по номеру:</p>
<pre>hero = {"name": "Claude", "hp": 100, "level": 3}
print(hero["name"])     # Claude
hero["hp"] = 80         # изменить
hero["mana"] = 50       # добавить новый ключ
del hero["level"]       # удалить
print("hp" in hero)     # True — есть ли ключ
print(len(hero))        # 3</pre>`,
      ex: [
        { t: "Выведи значение по ключу <code>\"capital\"</code>", s: `country = {"name": "Франция", "capital": "Париж"}\n`, e: "Париж", m: ["[\"capital\"]"], sol: `country = {"name": "Франция", "capital": "Париж"}\nprint(country["capital"])`, h: "country[\"capital\"]" },
        { t: "Создай словарь <code>pet</code> с ключами <code>\"name\"</code>: <code>\"Барсик\"</code> и <code>\"age\"</code>: <code>4</code>, выведи его", s: ``, e: "{'name': 'Барсик', 'age': 4}", m: ["{"], sol: `pet = {"name": "Барсик", "age": 4}\nprint(pet)`, h: "pet = {\"name\": \"Барсик\", \"age\": 4}" },
        { t: "Измени <code>hp</code> на 50 и выведи словарь", s: `hero = {"name": "Claude", "hp": 100}\n`, e: "{'name': 'Claude', 'hp': 50}", m: ["re:hero\\[\"hp\"\\]\\s*="], sol: `hero = {"name": "Claude", "hp": 100}\nhero["hp"] = 50\nprint(hero)`, h: "hero[\"hp\"] = 50" },
        { t: "Добавь ключ <code>\"email\"</code> со значением <code>\"a@b.ru\"</code> и выведи количество ключей", s: `user = {"login": "anna", "id": 7}\n`, e: "3", m: ["[\"email\"]", "len("], sol: `user = {"login": "anna", "id": 7}\nuser["email"] = "a@b.ru"\nprint(len(user))`, h: "user[\"email\"] = \"a@b.ru\", потом len(user)" },
        { t: "Посчитай, сколько раз встречается каждая буква слова, в словаре <code>counts</code>, и выведи его", s: `word = "мама"\ncounts = {}\n`, e: "{'м': 2, 'а': 2}", m: ["for "], sol: `word = "мама"\ncounts = {}\nfor ch in word:\n    if ch in counts:\n        counts[ch] += 1\n    else:\n        counts[ch] = 1\nprint(counts)`, h: "Если ключ есть — +1, иначе = 1" }
      ]
    },
    {
      id: "dictmethods",
      title: ".keys(), .values(), .items(), .get()",
      theory: `
<pre>prices = {"хлеб": 50, "сыр": 300}
print(list(prices.keys()))     # ['хлеб', 'сыр']
print(list(prices.values()))   # [50, 300]
for item, price in prices.items():
    print(item, price)
print(prices.get("молоко"))      # None — без ошибки
print(prices.get("молоко", 0))   # 0 — значение по умолчанию
prices.update({"чай": 120})      # добавить несколько
x = prices.pop("сыр")            # удалить и вернуть</pre>
<p>Обращение <code>prices["молоко"]</code> к несуществующему ключу вызывает <code>KeyError</code>, а <code>.get()</code> — нет.</p>`,
      ex: [
        { t: "Выведи список всех ключей: <code>list(d.keys())</code>", s: `d = {"a": 1, "b": 2, "c": 3}\n`, e: "['a', 'b', 'c']", m: [".keys()"], sol: `d = {"a": 1, "b": 2, "c": 3}\nprint(list(d.keys()))`, h: "list(d.keys())" },
        { t: "Выведи сумму всех значений через <code>.values()</code>", s: `wallet = {"руб": 500, "монеты": 37, "карта": 1200}\n`, e: "1737", m: [".values()"], sol: `wallet = {"руб": 500, "монеты": 37, "карта": 1200}\nprint(sum(wallet.values()))`, h: "sum(wallet.values())" },
        { t: "Пройди по <code>.items()</code> и выведи строки <code>КЛЮЧ = ЗНАЧЕНИЕ</code>", s: `cfg = {"volume": 7, "lang": "ru"}\n`, e: "volume = 7\nlang = ru", m: [".items()"], sol: `cfg = {"volume": 7, "lang": "ru"}\nfor k, v in cfg.items():\n    print(f"{k} = {v}")`, h: "for k, v in cfg.items():" },
        { t: "Получи цену <code>\"кофе\"</code> через <code>.get()</code> со значением по умолчанию 0", s: `menu = {"чай": 100, "сок": 150}\n`, e: "0", m: [".get("], sol: `menu = {"чай": 100, "сок": 150}\nprint(menu.get("кофе", 0))`, h: "menu.get(\"кофе\", 0)" },
        { t: "Посчитай слова через <code>.get()</code>: <code>counts[w] = counts.get(w, 0) + 1</code>, выведи словарь", s: `text = "да нет да да"\ncounts = {}\n`, e: "{'да': 3, 'нет': 1}", m: [".get(", ".split("], sol: `text = "да нет да да"\ncounts = {}\nfor w in text.split():\n    counts[w] = counts.get(w, 0) + 1\nprint(counts)`, h: "for w in text.split(): counts[w] = counts.get(w, 0) + 1" }
      ]
    },
    {
      id: "sets",
      title: "Множества set",
      theory: `
<p><b>Множество</b> хранит только <b>уникальные</b> значения, без порядка:</p>
<pre>s = {1, 2, 2, 3}
print(s)                  # {1, 2, 3}
print(set("hello"))       # уникальные буквы
s.add(4)                  # добавить
s.discard(1)              # удалить (без ошибки, если нет)
a = {1, 2, 3}
b = {2, 3, 4}
print(a & b)   # {2, 3}       пересечение
print(a | b)   # {1, 2, 3, 4} объединение
print(a - b)   # {1}          разность</pre>
<p>Пустое множество: <code>set()</code> (а <code>{}</code> — это пустой словарь).</p>`,
      ex: [
        { t: "Убери дубликаты: выведи количество уникальных чисел через <code>len(set(...))</code>", s: `nums = [1, 2, 2, 3, 3, 3, 4]\n`, e: "4", m: ["set("], sol: `nums = [1, 2, 2, 3, 3, 3, 4]\nprint(len(set(nums)))`, h: "len(set(nums))" },
        { t: "Выведи отсортированный список уникальных значений: <code>sorted(set(...))</code>", s: `tags = ["py", "js", "py", "go", "js"]\n`, e: "['go', 'js', 'py']", m: ["set(", "sorted("], sol: `tags = ["py", "js", "py", "go", "js"]\nprint(sorted(set(tags)))`, h: "sorted(set(tags))" },
        { t: "Найди общих друзей (пересечение <code>&</code>), выведи отсортированным списком", s: `anna = {"Боря", "Вика", "Гоша"}\nboris = {"Вика", "Гоша", "Дима"}\n`, e: "['Вика', 'Гоша']", m: ["&"], sol: `anna = {"Боря", "Вика", "Гоша"}\nboris = {"Вика", "Гоша", "Дима"}\nprint(sorted(anna & boris))`, h: "sorted(anna & boris)" },
        { t: "Добавь в множество <code>5</code> через <code>.add()</code> и выведи <code>5 in s</code>", s: `s = {1, 2, 3}\n`, e: "True", m: [".add("], sol: `s = {1, 2, 3}\ns.add(5)\nprint(5 in s)`, h: "s.add(5)" },
        { t: "Найди буквы, которые есть в первом слове, но нет во втором (<code>-</code>), выведи отсортированно", s: `a = set("python")\nb = set("typo")\n`, e: "['h', 'n']", m: ["a - b"], sol: `a = set("python")\nb = set("typo")\nprint(sorted(a - b))`, h: "sorted(a - b)" }
      ]
    },
    {
      id: "comprehension",
      title: "Генераторы списков",
      theory: `
<p><b>List comprehension</b> — создание списка в одну строку:</p>
<pre>squares = [x ** 2 for x in range(5)]        # [0, 1, 4, 9, 16]
evens = [x for x in range(10) if x % 2 == 0]  # [0, 2, 4, 6, 8]
upper = [w.upper() for w in ["a", "b"]]     # ['A', 'B']</pre>
<p>Это то же самое, что цикл с <code>.append()</code>, только короче. Бывают и словарные:</p>
<pre>{w: len(w) for w in ["кот", "слон"]}   # {'кот': 3, 'слон': 4}</pre>`,
      ex: [
        { t: "Создай список квадратов чисел от 1 до 5 генератором и выведи", s: ``, e: "[1, 4, 9, 16, 25]", m: ["re:\\[.+for .+ in .+\\]"], sol: `print([x ** 2 for x in range(1, 6)])`, h: "[x ** 2 for x in range(1, 6)]" },
        { t: "Отбери только положительные числа генератором с <code>if</code>", s: `nums = [3, -2, 7, -8, 0, 5]\n`, e: "[3, 7, 5]", m: ["re:\\[.+for .+ in .+if .+\\]"], sol: `nums = [3, -2, 7, -8, 0, 5]\nprint([n for n in nums if n > 0])`, h: "[n for n in nums if n > 0]" },
        { t: "Переведи все слова в верхний регистр генератором списка", s: `words = ["кот", "пёс", "ёж"]\n`, e: "['КОТ', 'ПЁС', 'ЁЖ']", m: ["re:\\[.+for .+ in .+\\]", ".upper()"], sol: `words = ["кот", "пёс", "ёж"]\nprint([w.upper() for w in words])`, h: "[w.upper() for w in words]" },
        { t: "Преврати список строк в список чисел: <code>[int(s) for s in ...]</code>", s: `data = "4 8 15 16 23 42".split()\n`, e: "[4, 8, 15, 16, 23, 42]", m: ["re:\\[.+for .+ in .+\\]", "int("], sol: `data = "4 8 15 16 23 42".split()\nprint([int(s) for s in data])`, h: "[int(s) for s in data]" },
        { t: "Словарный генератор: слово → его длина", s: `words = ["я", "ты", "они"]\n`, e: "{'я': 1, 'ты': 2, 'они': 3}", m: ["re:\\{.+:.+for .+ in .+\\}"], sol: `words = ["я", "ты", "они"]\nprint({w: len(w) for w in words})`, h: "{w: len(w) for w in words}" }
      ]
    }
  ]
});
