// Мир 6 — Вулкан мастера
(globalThis.WORLDS ||= []).push({
  name: "Вулкан мастера",
  sub: "Ошибки, модули, ООП, файлы",
  theme: "lava",
  lessons: [
    {
      id: "try",
      title: "try / except",
      theory: `
<p>Ошибки (исключения) можно <b>перехватывать</b>, чтобы программа не падала:</p>
<pre>try:
    n = int("abc")
except ValueError:
    print("Это не число!")</pre>
<p>Частые исключения: <code>ValueError</code>, <code>ZeroDivisionError</code>, <code>KeyError</code>, <code>IndexError</code>, <code>TypeError</code>, <code>NameError</code>.</p>
<pre>try:
    x = 10 / 0
except ZeroDivisionError as e:
    print("Ошибка:", e)
else:
    print("Без ошибок")      # если ошибки не было
finally:
    print("Выполнится всегда")</pre>
<p>Свою ошибку можно вызвать: <code>raise ValueError("Плохое значение")</code>.</p>`,
      ex: [
        { t: "Перехвати <code>ZeroDivisionError</code> и выведи <code>На ноль делить нельзя</code>", s: `a = 10\nb = 0\nprint(a / b)\n`, e: "На ноль делить нельзя", m: ["try:", "except ZeroDivisionError"], sol: `a = 10\nb = 0\ntry:\n    print(a / b)\nexcept ZeroDivisionError:\n    print("На ноль делить нельзя")`, h: "Оберни print(a / b) в try, а в except — сообщение" },
        { t: "Считай ввод и преврати в int. Если не получилось (<code>ValueError</code>) — выведи <code>Нужно число</code>", s: ``, i: ["двадцать"], e: "Нужно число", m: ["try:", "except ValueError"], sol: `try:\n    n = int(input())\n    print(n)\nexcept ValueError:\n    print("Нужно число")`, h: "except ValueError:" },
        { t: "Перехвати <code>KeyError</code> при обращении к <code>d[\"z\"]</code> и выведи <code>Нет ключа</code>", s: `d = {"a": 1}\n`, e: "Нет ключа", m: ["except KeyError"], sol: `d = {"a": 1}\ntry:\n    print(d["z"])\nexcept KeyError:\n    print("Нет ключа")`, h: "try: print(d[\"z\"]) except KeyError: ..." },
        { t: "Добавь блок <code>finally</code>, который выводит <code>Конец</code> (после <code>OK</code>)", s: `try:\n    print("OK")\nexcept Exception:\n    print("Ошибка")\n`, e: "OK\nКонец", m: ["finally:"], sol: `try:\n    print("OK")\nexcept Exception:\n    print("Ошибка")\nfinally:\n    print("Конец")`, h: "finally:\n    print(\"Конец\")" },
        { t: "Функция <code>set_age(age)</code> вызывает <code>raise ValueError(\"Возраст < 0\")</code> для отрицательного. Вызови <code>set_age(-5)</code> в try и выведи текст ошибки через <code>as e</code>", s: ``, e: "Возраст < 0", m: ["raise ValueError", "as e"], sol: `def set_age(age):\n    if age < 0:\n        raise ValueError("Возраст < 0")\n    return age\n\ntry:\n    set_age(-5)\nexcept ValueError as e:\n    print(e)`, h: "except ValueError as e: print(e)" }
      ]
    },
    {
      id: "modules",
      title: "import: math, random",
      theory: `
<p><b>Модули</b> — готовые библиотеки. Их подключают через <code>import</code>:</p>
<pre>import math
print(math.sqrt(16))     # 4.0  корень
print(math.pi)           # 3.141592653589793
print(math.ceil(2.1))    # 3  округление вверх
print(math.floor(2.9))   # 2  вниз

from random import randint, choice
print(randint(1, 6))           # случайное от 1 до 6
print(choice(["к", "н", "б"]))  # случайный элемент

import datetime as dt          # псевдоним</pre>`,
      ex: [
        { t: "Импортируй <code>math</code> и выведи корень из 144 через <code>math.sqrt()</code>", s: ``, e: "12.0", m: ["import math", "math.sqrt("], sol: `import math\nprint(math.sqrt(144))`, h: "import math, затем math.sqrt(144)" },
        { t: "Выведи <code>math.pi</code>, округлённое до 3 знаков", s: `import math\n`, e: "3.142", m: ["math.pi", "round("], sol: `import math\nprint(round(math.pi, 3))`, h: "round(math.pi, 3)" },
        { t: "Округли 7.2 вверх через <code>math.ceil()</code> и 7.8 вниз через <code>math.floor()</code>, выведи через пробел", s: `import math\n`, e: "8 7", m: ["math.ceil(", "math.floor("], sol: `import math\nprint(math.ceil(7.2), math.floor(7.8))`, h: "print(math.ceil(7.2), math.floor(7.8))" },
        { t: "Используй <code>from random import randint</code>. Брось кубик <code>randint(1, 6)</code> и выведи, что результат от 1 до 6: <code>1 <= x <= 6</code>", s: ``, e: "True", m: ["from random import", "randint(1, 6)"], sol: `from random import randint\nx = randint(1, 6)\nprint(1 <= x <= 6)`, h: "x = randint(1, 6); print(1 <= x <= 6)" },
        { t: "Выбери случайный элемент через <code>random.choice()</code> и выведи, есть ли он в списке (<code>in</code>)", s: `import random\nmoves = ["камень", "ножницы", "бумага"]\n`, e: "True", m: ["random.choice("], sol: `import random\nmoves = ["камень", "ножницы", "бумага"]\nm = random.choice(moves)\nprint(m in moves)`, h: "m = random.choice(moves)" }
      ]
    },
    {
      id: "classes",
      title: "Классы и объекты",
      theory: `
<p><b>Класс</b> — чертёж, по которому создаются <b>объекты</b>. <code>__init__</code> вызывается при создании и задаёт <b>атрибуты</b> через <code>self</code>:</p>
<pre>class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

claude = Hero("Claude", 100)
print(claude.name)    # Claude
claude.hp -= 20
print(claude.hp)      # 80</pre>
<p><code>self</code> — это «сам объект». Каждый объект хранит свои значения.</p>`,
      ex: [
        { t: "Создай объект класса <code>Cat</code> с именем <code>\"Мурка\"</code> и выведи его атрибут <code>name</code>", s: `class Cat:\n    def __init__(self, name):\n        self.name = name\n\n`, e: "Мурка", m: ["Cat(", ".name"], sol: `class Cat:\n    def __init__(self, name):\n        self.name = name\n\ncat = Cat("Мурка")\nprint(cat.name)`, h: "cat = Cat(\"Мурка\"); print(cat.name)" },
        { t: "Напиши класс <code>Point</code> с атрибутами <code>x</code> и <code>y</code>. Создай <code>Point(3, 4)</code> и выведи <code>x y</code>", s: ``, e: "3 4", m: ["class Point", "__init__", "self.x"], test: "p = Point(1, 2)\nassert p.x == 1 and p.y == 2", sol: `class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\np = Point(3, 4)\nprint(p.x, p.y)`, h: "def __init__(self, x, y): self.x = x; self.y = y" },
        { t: "Уменьши <code>hp</code> героя на 30 и выведи его", s: `class Hero:\n    def __init__(self, name, hp):\n        self.name = name\n        self.hp = hp\n\nh = Hero("Claude", 100)\n`, e: "70", m: ["re:h\\.hp\\s*-="], sol: `class Hero:\n    def __init__(self, name, hp):\n        self.name = name\n        self.hp = hp\n\nh = Hero("Claude", 100)\nh.hp -= 30\nprint(h.hp)`, h: "h.hp -= 30" },
        { t: "Класс <code>Book</code> с атрибутами <code>title</code> и <code>pages</code>. Создай две книги и выведи сумму их страниц", s: ``, e: "500", m: ["class Book"], test: "b = Book('X', 10)\nassert b.title == 'X' and b.pages == 10", sol: `class Book:\n    def __init__(self, title, pages):\n        self.title = title\n        self.pages = pages\n\na = Book("Python", 300)\nb = Book("Игры", 200)\nprint(a.pages + b.pages)`, h: "Например Book(\"Python\", 300) и Book(\"Игры\", 200)" },
        { t: "Класс <code>Counter</code>: в <code>__init__</code> атрибут <code>value = 0</code> (без параметров). Создай объект, увеличь value на 5, выведи", s: ``, e: "5", m: ["class Counter", "self.value = 0"], test: "assert Counter().value == 0", sol: `class Counter:\n    def __init__(self):\n        self.value = 0\n\nc = Counter()\nc.value += 5\nprint(c.value)`, h: "def __init__(self): self.value = 0" }
      ]
    },
    {
      id: "methods",
      title: "Методы и __str__",
      theory: `
<p><b>Метод</b> — функция внутри класса. Первый параметр всегда <code>self</code>:</p>
<pre>class Hero:
    def __init__(self, name):
        self.name = name
        self.hp = 100

    def hit(self, damage):
        self.hp -= damage

    def is_alive(self):
        return self.hp > 0

    def __str__(self):
        return f"{self.name} ({self.hp} HP)"

h = Hero("Claude")
h.hit(30)
print(h)              # Claude (70 HP) — работает __str__
print(h.is_alive())   # True</pre>`,
      ex: [
        { t: "Добавь классу метод <code>bark(self)</code>, выводящий <code>Гав!</code>, и вызови его у <code>d</code>", s: `class Dog:\n    pass\n\nd = Dog()\n`, e: "Гав!", m: ["def bark(self", "d.bark()"], sol: `class Dog:\n    def bark(self):\n        print("Гав!")\n\nd = Dog()\nd.bark()`, h: "Замени pass на def bark(self): print(\"Гав!\")" },
        { t: "Метод <code>deposit(self, amount)</code> увеличивает <code>balance</code>. Положи 500 и выведи баланс", s: `class Account:\n    def __init__(self):\n        self.balance = 0\n\n`, e: "500", m: ["def deposit(self"], test: "a = Account()\na.deposit(10)\na.deposit(5)\nassert a.balance == 15", sol: `class Account:\n    def __init__(self):\n        self.balance = 0\n\n    def deposit(self, amount):\n        self.balance += amount\n\nacc = Account()\nacc.deposit(500)\nprint(acc.balance)`, h: "self.balance += amount" },
        { t: "Метод <code>area(self)</code> возвращает площадь круга <code>3.14 * r * r</code>. Выведи площадь для r=10", s: `class Circle:\n    def __init__(self, r):\n        self.r = r\n\n`, e: "314.0", m: ["def area(self", "return"], test: "assert Circle(1).area() == 3.14", sol: `class Circle:\n    def __init__(self, r):\n        self.r = r\n\n    def area(self):\n        return 3.14 * self.r * self.r\n\nprint(Circle(10).area())`, h: "return 3.14 * self.r * self.r" },
        { t: "Добавь <code>__str__</code>, чтобы <code>print(item)</code> выводил <code>Меч (+10)</code>", s: `class Item:\n    def __init__(self, name, power):\n        self.name = name\n        self.power = power\n\nitem = Item("Меч", 10)\nprint(item)\n`, e: "Меч (+10)", m: ["def __str__(self"], sol: `class Item:\n    def __init__(self, name, power):\n        self.name = name\n        self.power = power\n\n    def __str__(self):\n        return f"{self.name} (+{self.power})"\n\nitem = Item("Меч", 10)\nprint(item)`, h: "return f\"{self.name} (+{self.power})\"" },
        { t: "Класс <code>Hero</code> с методами <code>hit(dmg)</code> и <code>is_alive()</code>. Ударь на 120 и выведи <code>is_alive()</code>", s: `class Hero:\n    def __init__(self):\n        self.hp = 100\n\n`, e: "False", m: ["def hit(self", "def is_alive(self"], test: "h = Hero()\nh.hit(10)\nassert h.hp == 90 and h.is_alive()", sol: `class Hero:\n    def __init__(self):\n        self.hp = 100\n\n    def hit(self, dmg):\n        self.hp -= dmg\n\n    def is_alive(self):\n        return self.hp > 0\n\nh = Hero()\nh.hit(120)\nprint(h.is_alive())`, h: "is_alive возвращает self.hp > 0" }
      ]
    },
    {
      id: "inherit",
      title: "Наследование",
      theory: `
<p>Класс может <b>наследовать</b> другой класс — получить все его атрибуты и методы, и добавить свои:</p>
<pre>class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "..."

class Cat(Animal):          # Cat наследует Animal
    def speak(self):        # переопределяем метод
        return "Мяу"

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)   # вызвать __init__ родителя
        self.breed = breed

print(Cat("Мурка").speak())      # Мяу
print(isinstance(Cat("М"), Animal))  # True</pre>`,
      ex: [
        { t: "Создай класс <code>Cat(Animal)</code> с методом <code>speak</code>, возвращающим <code>\"Мяу\"</code>. Выведи <code>Cat(\"Мурка\").speak()</code>", s: `class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return "..."\n\n`, e: "Мяу", m: ["class Cat(Animal)"], sol: `class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        return "..."\n\nclass Cat(Animal):\n    def speak(self):\n        return "Мяу"\n\nprint(Cat("Мурка").speak())`, h: "class Cat(Animal): def speak(self): return \"Мяу\"" },
        { t: "Класс <code>Dog(Animal)</code> без своих методов (<code>pass</code>). Выведи <code>name</code> собаки — он унаследован!", s: `class Animal:\n    def __init__(self, name):\n        self.name = name\n\n`, e: "Шарик", m: ["class Dog(Animal)"], sol: `class Animal:\n    def __init__(self, name):\n        self.name = name\n\nclass Dog(Animal):\n    pass\n\nd = Dog("Шарик")\nprint(d.name)`, h: "class Dog(Animal): pass" },
        { t: "В <code>Wizard(Hero)</code> добавь <code>mana</code>, вызвав <code>super().__init__(name)</code>. Выведи <code>name mana</code>", s: `class Hero:\n    def __init__(self, name):\n        self.name = name\n\n`, e: "Мерлин 50", m: ["super().__init__("], test: "w = Wizard('X', 1)\nassert w.name == 'X' and w.mana == 1", sol: `class Hero:\n    def __init__(self, name):\n        self.name = name\n\nclass Wizard(Hero):\n    def __init__(self, name, mana):\n        super().__init__(name)\n        self.mana = mana\n\nw = Wizard("Мерлин", 50)\nprint(w.name, w.mana)`, h: "def __init__(self, name, mana): super().__init__(name); self.mana = mana" },
        { t: "Проверь <code>isinstance(c, Shape)</code> для объекта дочернего класса", s: `class Shape:\n    pass\n\nclass Circle(Shape):\n    pass\n\nc = Circle()\n`, e: "True", m: ["isinstance("], sol: `class Shape:\n    pass\n\nclass Circle(Shape):\n    pass\n\nc = Circle()\nprint(isinstance(c, Shape))`, h: "print(isinstance(c, Shape))" },
        { t: "Полиморфизм: пройди циклом по списку животных и выведи <code>speak()</code> каждого", s: `class Animal:\n    def speak(self):\n        return "..."\n\nclass Cat(Animal):\n    def speak(self):\n        return "Мяу"\n\nclass Cow(Animal):\n    def speak(self):\n        return "Муу"\n\nzoo = [Cat(), Cow(), Animal()]\n`, e: "Мяу\nМуу\n...", m: ["for ", ".speak()"], sol: `class Animal:\n    def speak(self):\n        return "..."\n\nclass Cat(Animal):\n    def speak(self):\n        return "Мяу"\n\nclass Cow(Animal):\n    def speak(self):\n        return "Муу"\n\nzoo = [Cat(), Cow(), Animal()]\nfor a in zoo:\n    print(a.speak())`, h: "for a in zoo: print(a.speak())" }
      ]
    },
    {
      id: "files",
      title: "Работа с файлами",
      theory: `
<p>Файлы открывают функцией <code>open()</code>. Лучше всего — через <code>with</code>: файл закроется сам.</p>
<pre># Запись ("w" — перезаписать, "a" — дописать)
with open("notes.txt", "w") as f:
    f.write("Первая строка\\n")
    f.write("Вторая строка\\n")

# Чтение
with open("notes.txt") as f:
    text = f.read()            # весь текст

with open("notes.txt") as f:
    for line in f:             # построчно
        print(line.strip())</pre>
<p><code>\\n</code> внутри строки — это символ переноса строки. В игре файлы живут в виртуальной памяти браузера.</p>`,
      ex: [
        { t: "Запиши в файл <code>hello.txt</code> текст <code>Привет, файл!</code>, затем прочитай файл и выведи", s: ``, e: "Привет, файл!", m: ["open(", ".write(", ".read()"], sol: `with open("hello.txt", "w") as f:\n    f.write("Привет, файл!")\n\nwith open("hello.txt") as f:\n    print(f.read())`, h: "Два блока with: \"w\" для записи и обычный для чтения" },
        { t: "Запиши три строки (каждую с <code>\\n</code>) в <code>list.txt</code>, затем прочитай построчно и выведи каждую через <code>.strip()</code>", s: `items = ["хлеб", "молоко", "сыр"]\n`, e: "хлеб\nмолоко\nсыр", m: ["open(", ".strip()"], sol: `items = ["хлеб", "молоко", "сыр"]\nwith open("list.txt", "w") as f:\n    for it in items:\n        f.write(it + "\\n")\n\nwith open("list.txt") as f:\n    for line in f:\n        print(line.strip())`, h: "f.write(it + \"\\n\")" },
        { t: "Допиши в файл строку <code>3</code> режимом <code>\"a\"</code> и выведи количество строк файла (<code>len(f.readlines())</code>)", s: `with open("log.txt", "w") as f:\n    f.write("1\\n2\\n")\n`, e: "3", m: ["\"a\"", "readlines()"], sol: `with open("log.txt", "w") as f:\n    f.write("1\\n2\\n")\n\nwith open("log.txt", "a") as f:\n    f.write("3\\n")\n\nwith open("log.txt") as f:\n    print(len(f.readlines()))`, h: "open(\"log.txt\", \"a\")" },
        { t: "Прочитай файл с числами (по одному в строке) и выведи их сумму", s: `with open("nums.txt", "w") as f:\n    f.write("10\\n20\\n30\\n")\n`, e: "60", m: ["open(", "int("], sol: `with open("nums.txt", "w") as f:\n    f.write("10\\n20\\n30\\n")\n\ntotal = 0\nwith open("nums.txt") as f:\n    for line in f:\n        total += int(line)\nprint(total)`, h: "int(line) понимает перенос строки в конце" },
        { t: "Посчитай, сколько слов в файле (<code>len(text.split())</code>)", s: `with open("poem.txt", "w") as f:\n    f.write("Мороз и солнце\\nдень чудесный")\n`, e: "5", m: [".read()", ".split()"], sol: `with open("poem.txt", "w") as f:\n    f.write("Мороз и солнце\\nдень чудесный")\n\nwith open("poem.txt") as f:\n    text = f.read()\nprint(len(text.split()))`, h: "text = f.read(); len(text.split())" }
      ]
    },
    {
      id: "boss",
      title: "БОСС: финальный экзамен",
      boss: true,
      theory: `
<p>🔥 Ты дошёл до жерла вулкана! Здесь нет новой теории — только задачи, где нужно соединить всё изученное: строки, условия, циклы, коллекции, функции и классы.</p>
<p>Советы мастера:</p>
<pre>1. Прочитай задачу дважды.
2. Разбей её на маленькие шаги.
3. Печатай промежуточные значения, если что-то не так.
4. Ошибка — это подсказка, а не провал.</pre>`,
      ex: [
        { t: "Функция <code>is_palindrome(s)</code>: True, если строка читается одинаково в обе стороны (без учёта регистра и пробелов). Выведи для <code>\"А роза упала на лапу Азора\"</code>", s: ``, e: "True", m: ["def is_palindrome("], test: "assert is_palindrome('abba') and not is_palindrome('abc') and is_palindrome('Ab Ba')", sol: `def is_palindrome(s):\n    s = s.lower().replace(" ", "")\n    return s == s[::-1]\n\nprint(is_palindrome("А роза упала на лапу Азора"))`, h: "lower(), replace(\" \", \"\"), сравни с s[::-1]" },
        { t: "FizzBuzz от 1 до 15: кратно 15 → FizzBuzz, 3 → Fizz, 5 → Buzz, иначе число. Каждое на новой строке", s: ``, e: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz", m: ["for "], sol: `for i in range(1, 16):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)`, h: "Цикл + if/elif/else, проверка на 15 первой" },
        { t: "Функция <code>top_word(text)</code> возвращает самое частое слово (в нижнем регистре). Выведи для заданного текста", s: `text = "Кот и пёс. кот спит, пёс ест, КОТ играет"\n`, e: "кот", m: ["def top_word("], test: "assert top_word('a b b c') == 'b'", sol: `text = "Кот и пёс. кот спит, пёс ест, КОТ играет"\n\ndef top_word(text):\n    counts = {}\n    for w in text.lower().replace(".", "").replace(",", "").split():\n        counts[w] = counts.get(w, 0) + 1\n    return max(counts, key=counts.get)\n\nprint(top_word(text))`, h: "Убери знаки препинания, посчитай слова в словаре, max(counts, key=counts.get)" },
        { t: "Класс <code>Inventory</code>: метод <code>add(item, qty)</code> складывает количество в словарь <code>self.items</code>, метод <code>total()</code> возвращает сумму всех предметов. Добавь зелье 3, меч 1, зелье 2 и выведи <code>total()</code>", s: ``, e: "6", m: ["class Inventory", "def add(self", "def total(self"], test: "inv = Inventory()\ninv.add('x', 2)\ninv.add('x', 3)\nassert inv.items['x'] == 5 and inv.total() == 5", sol: `class Inventory:\n    def __init__(self):\n        self.items = {}\n\n    def add(self, item, qty):\n        self.items[item] = self.items.get(item, 0) + qty\n\n    def total(self):\n        return sum(self.items.values())\n\ninv = Inventory()\ninv.add("зелье", 3)\ninv.add("меч", 1)\ninv.add("зелье", 2)\nprint(inv.total())`, h: "self.items = {} в __init__; .get(item, 0) + qty; sum(self.items.values())" },
        { t: "Считай строку чисел через пробел. Выведи сумму только чётных, а если ввод некорректный — <code>Ошибка</code>. Используй генератор списка и try/except", s: ``, i: ["4 7 10 x 3"], e: "Ошибка", m: ["try:", "except", "for "], test: "", sol: `try:\n    nums = [int(x) for x in input().split()]\n    print(sum(n for n in nums if n % 2 == 0))\nexcept ValueError:\n    print("Ошибка")`, h: "nums = [int(x) for x in input().split()] внутри try" }
      ]
    }
  ]
});
