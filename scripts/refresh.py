import datetime, json, random, re
today = datetime.date.today()
rnd = random.Random(today.toordinal())
def is_prime(n):
    if n < 2: return False
    if n % 2 == 0: return n == 2
    i = 3
    while i * i <= n:
        if n % i == 0: return False
        i += 2
    return True
n = rnd.randint(1000, 999999)
if today.day % 2:
    while not is_prime(n): n += 1
def factors(n):
    f, d = [], 2
    while d * d <= n:
        while n % d == 0: f.append(d); n //= d
        d += 1
    if n > 1: f.append(n)
    return f
if is_prime(n):
    p = n - 1
    while not is_prime(p): p -= 1
    q = n + 1
    while not is_prime(q): q += 1
    fact = f"is prime — divisible only by 1 and itself. Neighbouring primes: {p:,} and {q:,}."
else:
    fact = f"is composite: {' × '.join(map(str, factors(n)))}. Its digits sum to {sum(map(int, str(n)))}."
json.dump({"date": today.isoformat(), "number": n, "fact": fact}, open('data/daily.json', 'w'), ensure_ascii=False, indent=2)
s = open('sitemap.xml').read()
s = re.sub(r'<lastmod>[0-9-]+</lastmod>', f'<lastmod>{today.isoformat()}</lastmod>', s)
open('sitemap.xml', 'w').write(s)
