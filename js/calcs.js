/* 82567.com — calculator engine (vanilla JS, no dependencies) */
(function () {
  'use strict';
  var CUR = (function () { try { return localStorage.getItem('cur') || 'USD'; } catch (e) { return 'USD'; } })();
  var SYM = { USD: '$', CAD: 'C$', EUR: '€', GBP: '£', INR: '₹', AUD: 'A$' };
  function money(n) {
    if (!isFinite(n)) return '—';
    var d = Math.abs(n) < 1 && n !== 0 ? 4 : 2;
    return (SYM[CUR] || '$') + Number(n).toLocaleString(undefined, { maximumFractionDigits: d, minimumFractionDigits: 2 });
  }
  function num(n, d) { return isFinite(n) ? Number(n).toLocaleString(undefined, { maximumFractionDigits: d == null ? 2 : d }) : '—'; }
  function pct(n) { return isFinite(n) ? num(n, 2) + '%' : '—'; }
  function pmt(P, rMonthly, n) { return rMonthly === 0 ? P / n : P * rMonthly / (1 - Math.pow(1 + rMonthly, -n)); }

  var C = [
    /* ---------- MONEY ---------- */
    { id: 'loan', cat: 'Money', name: 'Loan / EMI Calculator', icon: '🏦', desc: 'Monthly payment, total interest and payoff for any personal, car or business loan.',
      f: [['amount', 'Loan amount', 25000], ['rate', 'Annual interest rate (%)', 8.5], ['years', 'Term (years)', 5]],
      run: function (v) { var n = v.years * 12, r = v.rate / 1200, m = pmt(v.amount, r, n), t = m * n;
        return { out: [['Monthly payment', money(m)], ['Total interest', money(t - v.amount)], ['Total paid', money(t)], ['Payments', num(n, 0)]],
          chart: amort(v.amount, r, n, m) }; } },
    { id: 'mortgage', cat: 'Money', name: 'Mortgage Calculator', icon: '🏠', desc: 'Payment with taxes and insurance, plus how much interest the bank collects.',
      f: [['price', 'Home price', 450000], ['down', 'Down payment', 90000], ['rate', 'Interest rate (%)', 5.5], ['years', 'Amortization (years)', 25], ['tax', 'Property tax / year', 4000], ['ins', 'Insurance / year', 1200]],
      run: function (v) { var P = v.price - v.down, n = v.years * 12, r = v.rate / 1200, m = pmt(P, r, n), all = m + (v.tax + v.ins) / 12;
        return { out: [['Principal & interest', money(m)], ['All-in monthly', money(all)], ['Loan amount', money(P)], ['Down payment %', pct(v.down / v.price * 100)], ['Total interest', money(m * n - P)]], chart: amort(P, r, n, m) }; } },
    { id: 'compound', cat: 'Money', name: 'Compound Interest Calculator', icon: '📈', desc: 'See how deposits plus compounding grow — with a year-by-year chart.',
      f: [['p', 'Starting amount', 10000], ['c', 'Monthly contribution', 500], ['rate', 'Annual return (%)', 7], ['years', 'Years', 20]],
      run: function (v) { var b = v.p, r = v.rate / 1200, pts = [b], dep = v.p;
        for (var y = 1; y <= v.years; y++) { for (var m = 0; m < 12; m++) { b = b * (1 + r) + v.c; dep += v.c; } pts.push(b); }
        return { out: [['Future value', money(b)], ['Total deposited', money(dep)], ['Interest earned', money(b - dep)], ['Rule of 72 doubling', v.rate > 0 ? num(72 / v.rate, 1) + ' yrs' : '—']], chart: { label: 'Balance by year', data: pts } }; } },
    { id: 'savings-goal', cat: 'Money', name: 'Savings Goal Calculator', icon: '🎯', desc: 'How much to save each month to hit a target by a deadline.',
      f: [['goal', 'Target amount', 50000], ['have', 'Already saved', 5000], ['rate', 'Annual return (%)', 4], ['years', 'Years to goal', 5]],
      run: function (v) { var n = v.years * 12, r = v.rate / 1200, fvHave = v.have * Math.pow(1 + r, n), need = v.goal - fvHave;
        var m = r === 0 ? need / n : need * r / (Math.pow(1 + r, n) - 1);
        return { out: [['Save per month', money(Math.max(0, m))], ['Save per week', money(Math.max(0, m) * 12 / 52)], ['Current savings grow to', money(fvHave)]] }; } },
    { id: 'retirement', cat: 'Money', name: 'Retirement / FIRE Calculator', icon: '🏖️', desc: 'Your FIRE number and the year your portfolio can fund your lifestyle.',
      f: [['spend', 'Annual spending in retirement', 60000], ['have', 'Invested today', 80000], ['save', 'Saved per year', 25000], ['rate', 'Real return (%)', 5], ['wr', 'Safe withdrawal rate (%)', 4]],
      run: function (v) { var target = v.spend / (v.wr / 100), b = v.have, y = 0, pts = [b];
        while (b < target && y < 80) { b = b * (1 + v.rate / 100) + v.save; y++; pts.push(b); }
        return { out: [['FIRE number', money(target)], ['Years to FIRE', y >= 80 ? '80+' : num(y, 0)], ['Portfolio then', money(b)]], chart: { label: 'Portfolio path', data: pts } }; } },
    { id: 'credit-card', cat: 'Money', name: 'Credit Card Payoff Calculator', icon: '💳', desc: 'Months to debt-free and the true cost of minimum payments.',
      f: [['bal', 'Balance', 6000], ['apr', 'APR (%)', 21.99], ['pay', 'Monthly payment', 250]],
      run: function (v) { var b = v.bal, r = v.apr / 1200, m = 0, int = 0;
        if (v.pay <= b * r) return { out: [['Result', 'Payment too low — balance never falls']] };
        while (b > 0 && m < 1200) { var i = b * r; int += i; b = b + i - v.pay; m++; }
        return { out: [['Months to payoff', num(m, 0)], ['Years', num(m / 12, 1)], ['Total interest', money(int)]] }; } },
    { id: 'inflation', cat: 'Money', name: 'Inflation Calculator', icon: '🎈', desc: 'What money today is worth in the future at a given inflation rate.',
      f: [['amt', 'Amount today', 1000], ['inf', 'Inflation rate (%)', 3], ['years', 'Years', 10]],
      run: function (v) { var f = Math.pow(1 + v.inf / 100, v.years);
        return { out: [['Future cost of same goods', money(v.amt * f)], ['Purchasing power left', money(v.amt / f)], ['Value lost', pct((1 - 1 / f) * 100)]] }; } },
    { id: 'salary', cat: 'Money', name: 'Salary ↔ Hourly Converter', icon: '⏱️', desc: 'Convert annual salary to hourly, daily, weekly and monthly pay.',
      f: [['sal', 'Annual salary', 75000], ['hrs', 'Hours per week', 40], ['wks', 'Paid weeks per year', 52]],
      run: function (v) { var h = v.sal / (v.hrs * v.wks);
        return { out: [['Hourly', money(h)], ['Daily (8h)', money(h * 8)], ['Weekly', money(v.sal / v.wks)], ['Monthly', money(v.sal / 12)]] }; } },
    { id: 'roi', cat: 'Money', name: 'ROI & Annualized Return', icon: '💹', desc: 'Total ROI and CAGR for any investment or campaign.',
      f: [['cost', 'Amount invested', 10000], ['value', 'Final value', 16500], ['years', 'Holding period (years)', 3]],
      run: function (v) { var roi = (v.value - v.cost) / v.cost * 100, cagr = (Math.pow(v.value / v.cost, 1 / v.years) - 1) * 100;
        return { out: [['Total ROI', pct(roi)], ['Annualized (CAGR)', pct(cagr)], ['Gain', money(v.value - v.cost)]] }; } },
    { id: 'tip', cat: 'Money', name: 'Tip & Bill Splitter', icon: '🧾', desc: 'Split any bill fairly with tip in one tap.',
      f: [['bill', 'Bill total', 120], ['tip', 'Tip (%)', 18], ['people', 'People', 4]],
      run: function (v) { var t = v.bill * v.tip / 100;
        return { out: [['Tip', money(t)], ['Total', money(v.bill + t)], ['Per person', money((v.bill + t) / Math.max(1, v.people))]] }; } },

    /* ---------- BUSINESS ---------- */
    { id: 'break-even', cat: 'Business', name: 'Break-Even Calculator', icon: '⚖️', desc: 'Units and revenue needed before you make a single dollar of profit.',
      f: [['fixed', 'Fixed costs / month', 12000], ['price', 'Price per unit', 49], ['var', 'Variable cost per unit', 19]],
      run: function (v) { var cm = v.price - v.var, u = v.fixed / cm;
        return { out: [['Break-even units', num(Math.ceil(u), 0)], ['Break-even revenue', money(Math.ceil(u) * v.price)], ['Contribution margin', money(cm) + ' (' + pct(cm / v.price * 100) + ')']] }; } },
    { id: 'margin', cat: 'Business', name: 'Profit Margin & Markup', icon: '🏷️', desc: 'Gross margin vs markup — the difference that kills pricing.',
      f: [['cost', 'Cost', 60], ['price', 'Selling price', 100]],
      run: function (v) { var p = v.price - v.cost;
        return { out: [['Profit', money(p)], ['Gross margin', pct(p / v.price * 100)], ['Markup', pct(p / v.cost * 100)]] }; } },
    { id: 'price-from-margin', cat: 'Business', name: 'Price from Target Margin', icon: '🎚️', desc: 'Set a price that guarantees your target margin.',
      f: [['cost', 'Unit cost', 35], ['m', 'Target margin (%)', 40]],
      run: function (v) { var p = v.cost / (1 - v.m / 100);
        return { out: [['Price to charge', money(p)], ['Profit per unit', money(p - v.cost)], ['Equivalent markup', pct((p - v.cost) / v.cost * 100)]] }; } },
    { id: 'ltv-cac', cat: 'Business', name: 'LTV : CAC Calculator', icon: '🧲', desc: 'Is your customer acquisition profitable? Benchmark: 3:1.',
      f: [['arpu', 'Revenue per customer / month', 40], ['gm', 'Gross margin (%)', 75], ['churn', 'Monthly churn (%)', 3], ['cac', 'Cost to acquire a customer', 250]],
      run: function (v) { var ltv = v.arpu * v.gm / 100 / (v.churn / 100), ratio = ltv / v.cac, payback = v.cac / (v.arpu * v.gm / 100);
        return { out: [['Customer LTV', money(ltv)], ['LTV : CAC', num(ratio, 2) + ' : 1 ' + (ratio >= 3 ? '✅' : '⚠️')], ['CAC payback', num(payback, 1) + ' months']] }; } },
    { id: 'runway', cat: 'Business', name: 'Startup Runway Calculator', icon: '🛫', desc: 'Months of cash left and your zero-cash date.',
      f: [['cash', 'Cash in bank', 250000], ['burn', 'Monthly expenses', 32000], ['rev', 'Monthly revenue', 9000], ['g', 'Revenue growth / month (%)', 5]],
      run: function (v) { var c = v.cash, r = v.rev, m = 0, pts = [c];
        while (c > 0 && m < 120) { c = c - v.burn + r; r = r * (1 + v.g / 100); m++; pts.push(Math.max(c, 0)); if (r >= v.burn) break; }
        var d = new Date(); d.setMonth(d.getMonth() + m);
        return { out: [['Runway', m >= 120 || c > 0 ? (c > 0 ? 'Default-alive (breakeven in ' + m + ' mo)' : '120+ months') : num(m, 0) + ' months'], ['Zero-cash date', c > 0 ? '—' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })], ['Net burn now', money(v.burn - v.rev)]], chart: { label: 'Cash balance', data: pts } }; } },
    { id: 'mrr', cat: 'Business', name: 'SaaS MRR Growth Projector', icon: '🚀', desc: 'Project MRR and ARR with new sales and churn.',
      f: [['mrr', 'Current MRR', 10000], ['newm', 'New MRR added / month', 2500], ['churn', 'Monthly churn (%)', 2.5], ['months', 'Months to project', 24]],
      run: function (v) { var m = v.mrr, pts = [m];
        for (var i = 0; i < v.months; i++) { m = m * (1 - v.churn / 100) + v.newm; pts.push(m); }
        return { out: [['MRR at end', money(m)], ['ARR at end', money(m * 12)], ['Ceiling MRR (steady state)', v.churn > 0 ? money(v.newm / (v.churn / 100)) : '∞']], chart: { label: 'MRR', data: pts } }; } },
    { id: 'sales-tax', cat: 'Business', name: 'Sales Tax / VAT / GST', icon: '🧮', desc: 'Add or remove tax from any price.',
      f: [['amt', 'Amount', 100], ['rate', 'Tax rate (%)', 13]],
      run: function (v) { return { out: [['Tax added', money(v.amt * v.rate / 100)], ['Price incl. tax', money(v.amt * (1 + v.rate / 100))], ['If amount already incl. tax → net', money(v.amt / (1 + v.rate / 100))], ['…tax portion', money(v.amt - v.amt / (1 + v.rate / 100))]] }; } },
    { id: 'discount', cat: 'Business', name: 'Discount Calculator', icon: '🛍️', desc: 'Sale price, stacked discounts and savings.',
      f: [['price', 'Original price', 199], ['d1', 'Discount (%)', 25], ['d2', 'Extra discount (%)', 10]],
      run: function (v) { var p = v.price * (1 - v.d1 / 100) * (1 - v.d2 / 100);
        return { out: [['Final price', money(p)], ['You save', money(v.price - p)], ['Effective discount', pct((1 - p / v.price) * 100)]] }; } },
    { id: 'adsense', cat: 'Business', name: 'Website Ad Revenue Estimator', icon: '📰', desc: 'Estimate display-ad income from pageviews and RPM.',
      f: [['pv', 'Monthly pageviews', 100000], ['rpm', 'Page RPM (revenue per 1,000 views)', 8], ['g', 'Monthly traffic growth (%)', 5]],
      run: function (v) { var m = v.pv * v.rpm / 1000, y = 0, pv = v.pv;
        for (var i = 0; i < 12; i++) { y += pv * v.rpm / 1000; pv *= 1 + v.g / 100; }
        return { out: [['This month', money(m)], ['Next 12 months', money(y)], ['Daily', money(m / 30)]] }; } },

    /* ---------- AI ---------- */
    { id: 'llm-cost', cat: 'AI', name: 'LLM API Cost Estimator', icon: '🤖', desc: 'Monthly cost of any AI model — enter the provider’s current per-million-token prices.',
      f: [['req', 'Requests per day', 2000], ['inT', 'Input tokens / request', 1500], ['outT', 'Output tokens / request', 400], ['inP', 'Input price per 1M tokens', 3], ['outP', 'Output price per 1M tokens', 15]],
      run: function (v) { var day = v.req * (v.inT * v.inP + v.outT * v.outP) / 1e6;
        return { out: [['Cost per request', money(day / Math.max(v.req, 1))], ['Daily', money(day)], ['Monthly (30d)', money(day * 30)], ['Yearly', money(day * 365)]] }; } },
    { id: 'ai-roi', cat: 'AI', name: 'AI Automation ROI', icon: '⚡', desc: 'Hours saved × hourly cost vs. what the AI tool costs you.',
      f: [['people', 'People using it', 5], ['hrs', 'Hours saved per person / week', 4], ['rate', 'Loaded hourly cost', 45], ['tool', 'Tool cost / month (total)', 300]],
      run: function (v) { var save = v.people * v.hrs * v.rate * 52 / 12, net = save - v.tool;
        return { out: [['Value of time saved / month', money(save)], ['Net gain / month', money(net)], ['ROI', pct(net / v.tool * 100)], ['Hours freed / year', num(v.people * v.hrs * 52, 0)]] }; } },
    { id: 'tokens', cat: 'AI', name: 'Token & Word Estimator', icon: '🔤', desc: 'Paste text to estimate tokens, words and reading time (≈4 chars/token).',
      f: [['text', 'Paste text', 'Prime numbers have exactly two divisors: one and themselves.', 'textarea']],
      run: function (v) { var t = String(v.text || ''), w = (t.trim().match(/\S+/g) || []).length;
        return { out: [['Characters', num(t.length, 0)], ['Words', num(w, 0)], ['≈ Tokens', num(Math.ceil(t.length / 4), 0)], ['Reading time', num(w / 230, 1) + ' min']] }; } },
    { id: 'gpu', cat: 'AI', name: 'GPU / Cloud Compute Cost', icon: '🖥️', desc: 'Budget a training or inference run on rented GPUs.',
      f: [['gpus', 'Number of GPUs', 8], ['hrs', 'Hours', 72], ['price', 'Price per GPU-hour', 2.5], ['util', 'Expected utilization (%)', 85]],
      run: function (v) { var c = v.gpus * v.hrs * v.price;
        return { out: [['Total cost', money(c)], ['Effective cost per useful GPU-hour', money(v.price / (v.util / 100))], ['GPU-hours', num(v.gpus * v.hrs, 0)]] }; } },

    /* ---------- EVERYDAY ---------- */
    { id: 'percent', cat: 'Everyday', name: 'Percentage Calculator', icon: '％', desc: 'X% of Y, percent change and “what percent is”.',
      f: [['a', 'Value A', 25], ['b', 'Value B', 200]],
      run: function (v) { return { out: [['A% of B', num(v.a * v.b / 100, 4)], ['A is what % of B', pct(v.a / v.b * 100)], ['% change A → B', pct((v.b - v.a) / v.a * 100)]] }; } },
    { id: 'age', cat: 'Everyday', name: 'Age & Date Difference', icon: '📅', desc: 'Exact age or days between two dates.',
      f: [['d1', 'Start date / birthday', '1990-01-01', 'date'], ['d2', 'End date', '', 'date']],
      run: function (v) { var a = new Date(v.d1), b = v.d2 ? new Date(v.d2) : new Date(); if (isNaN(a) || isNaN(b)) return { out: [['Result', 'Enter valid dates']] };
        var y = b.getFullYear() - a.getFullYear(), m = b.getMonth() - a.getMonth(), d = b.getDate() - a.getDate();
        if (d < 0) { m--; d += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); } if (m < 0) { y--; m += 12; }
        var days = Math.round((b - a) / 864e5);
        return { out: [['Difference', y + ' y, ' + m + ' m, ' + d + ' d'], ['Total days', num(days, 0)], ['Total weeks', num(days / 7, 1)]] }; } },
    { id: 'bmi', cat: 'Everyday', name: 'BMI Calculator', icon: '⚕️', desc: 'Body-mass index in metric units (general information only).',
      f: [['kg', 'Weight (kg)', 75], ['cm', 'Height (cm)', 178]],
      run: function (v) { var b = v.kg / Math.pow(v.cm / 100, 2);
        return { out: [['BMI', num(b, 1)], ['WHO category', b < 18.5 ? 'Underweight' : b < 25 ? 'Normal range' : b < 30 ? 'Overweight' : 'Obesity range']] }; } },
    { id: 'fuel', cat: 'Everyday', name: 'Trip Fuel / EV Cost', icon: '🚗', desc: 'Cost of a road trip for gas or electric vehicles.',
      f: [['km', 'Distance (km)', 500], ['eff', 'Consumption per 100 km (L or kWh)', 7.5], ['price', 'Price per L or kWh', 1.6]],
      run: function (v) { var u = v.km * v.eff / 100; return { out: [['Energy needed', num(u, 1)], ['Trip cost', money(u * v.price)], ['Cost per km', money(u * v.price / v.km)]] }; } },
    { id: 'units', cat: 'Everyday', name: 'Length Unit Converter', icon: '📏', desc: 'Meters, feet, inches, miles, kilometers.',
      f: [['m', 'Meters', 82.567]],
      run: function (v) { return { out: [['Feet', num(v.m * 3.28084, 3)], ['Inches', num(v.m * 39.3701, 2)], ['Kilometers', num(v.m / 1000, 5)], ['Miles', num(v.m / 1609.344, 5)], ['Yards', num(v.m * 1.09361, 3)]] }; } }
  ];

  function amort(P, r, n, m) {
    var b = P, pts = [P];
    for (var i = 1; i <= n; i++) { b = b * (1 + r) - m; if (i % 12 === 0 || i === n) pts.push(Math.max(b, 0)); }
    return { label: 'Remaining balance by year', data: pts };
  }

  /* ---------- Number explorer ---------- */
  function isPrime(n) { if (n < 2 || n % 1) return false; if (n < 4) return true; if (n % 2 === 0 || n % 3 === 0) return false; for (var i = 5; i * i <= n; i += 6) if (n % i === 0 || n % (i + 2) === 0) return false; return true; }
  function factorize(n) { var f = [], d = 2; while (n > 1 && d * d <= n) { while (n % d === 0) { f.push(d); n /= d; } d++; } if (n > 1) f.push(n); return f; }
  function divisors(n) { var a = [], b = []; for (var i = 1; i * i <= n; i++) if (n % i === 0) { a.push(i); if (i * i !== n) b.unshift(n / i); } return a.concat(b); }
  function explore(n) {
    var out = [];
    if (!Number.isSafeInteger(n) || n < 1 || n > 1e12) return [['Error', 'Enter a whole number between 1 and 1,000,000,000,000']];
    var p = isPrime(n), divs = n <= 1e10 ? divisors(n) : null, s = divs ? divs.reduce(function (a, b) { return a + b; }, 0) - n : null;
    var np = n + 1; while (!isPrime(np)) np++; var pp = n - 1; while (pp > 1 && !isPrime(pp)) pp--;
    var ds = String(n).split('').reduce(function (a, c) { return a + +c; }, 0);
    var sq = Math.sqrt(n);
    out.push(['Prime?', p ? 'Yes — ' + num(n, 0) + ' is prime ✨' : 'No (composite)' ]);
    out.push(['Prime factorization', n === 1 ? '1' : factorize(n).join(' × ')]);
    if (divs) out.push(['Divisors (' + divs.length + ')', divs.length > 40 ? divs.slice(0, 40).join(', ') + ' …' : divs.join(', ')]);
    if (s != null) out.push(['Classification', n === 1 ? 'Unit' : s === n ? 'Perfect' : s > n ? 'Abundant' : 'Deficient']);
    out.push(['Previous / next prime', (pp > 1 ? num(pp, 0) : '—') + ' / ' + num(np, 0)]);
    out.push(['Digit sum / digital root', ds + ' / ' + (1 + (n - 1) % 9)]);
    out.push(['Palindrome?', String(n) === String(n).split('').reverse().join('') ? 'Yes' : 'No']);
    out.push(['Perfect square?', sq % 1 === 0 ? 'Yes (' + sq + '²)' : 'No']);
    out.push(['Square root', num(sq, 6)]);
    out.push(['Binary', n.toString(2)]);
    out.push(['Octal / Hex', n.toString(8) + ' / ' + n.toString(16).toUpperCase()]);
    out.push(['Roman numerals', n < 4000 ? roman(n) : 'n/a (> 3999)']);
    out.push(['In words', words(n)]);
    out.push(['As seconds', dur(n)]);
    return out;
  }
  function roman(n) { var m = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']], r = ''; m.forEach(function (x) { while (n >= x[0]) { r += x[1]; n -= x[0]; } }); return r; }
  function words(n) {
    var a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
      t = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'], s = ['', ' thousand', ' million', ' billion', ' trillion'];
    function h(x) { var r = ''; if (x >= 100) { r += a[Math.floor(x / 100)] + ' hundred'; x %= 100; if (x) r += ' '; } if (x >= 20) { r += t[Math.floor(x / 10)]; if (x % 10) r += '-' + a[x % 10]; } else if (x) r += a[x]; return r; }
    if (n === 0) return 'zero'; var parts = [], i = 0; while (n > 0) { var c = n % 1000; if (c) parts.unshift(h(c) + s[i]); n = Math.floor(n / 1000); i++; } return parts.join(' ');
  }
  function dur(n) { var d = Math.floor(n / 86400), h = Math.floor(n % 86400 / 3600), m = Math.floor(n % 3600 / 60); return d + 'd ' + h + 'h ' + m + 'm ' + (n % 60) + 's'; }

  /* ---------- Rendering ---------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function card(c) {
    var fields = c.f.map(function (x) {
      var type = x[3] || 'number', id = c.id + '-' + x[0];
      var input = type === 'textarea' ? '<textarea id="' + id + '" name="' + x[0] + '" rows="4">' + esc(x[2]) + '</textarea>'
        : '<input id="' + id + '" name="' + x[0] + '" type="' + type + '" ' + (type === 'number' ? 'step="any" inputmode="decimal"' : '') + ' value="' + esc(x[2]) + '">';
      return '<label for="' + id + '">' + esc(x[1]) + input + '</label>';
    }).join('');
    return '<article class="calc card" id="' + c.id + '" data-cat="' + c.cat + '"><header><span class="ci">' + c.icon + '</span><div><h3>' + esc(c.name) + '</h3><p>' + esc(c.desc) + '</p></div></header>' +
      '<form class="cform" data-id="' + c.id + '" novalidate>' + fields + '</form><div class="res" aria-live="polite"></div><canvas class="chart" height="160" hidden></canvas>' +
      '<div class="cfoot"><button type="button" class="btn ghost sm share" data-id="' + c.id + '">🔗 Copy link</button><a class="btn ghost sm" href="get-quote.html?topic=' + encodeURIComponent(c.name) + '">Need expert help? →</a></div></article>';
  }
  function compute(form) {
    var c = C.filter(function (x) { return x.id === form.dataset.id; })[0], v = {};
    c.f.forEach(function (x) { var el = form.elements[x[0]]; v[x[0]] = (x[3] === 'date' || x[3] === 'textarea') ? el.value : parseFloat(el.value) || 0; });
    var r; try { r = c.run(v); } catch (e) { r = { out: [['Error', 'Check your inputs']] }; }
    var box = form.parentNode.querySelector('.res');
    box.innerHTML = r.out.map(function (o, i) { return '<div class="kv' + (i === 0 ? ' big' : '') + '"><span>' + esc(o[0]) + '</span><b>' + esc(o[1]) + '</b></div>'; }).join('');
    var cv = form.parentNode.querySelector('canvas');
    if (r.chart) { cv.hidden = false; draw(cv, r.chart); } else cv.hidden = true;
  }
  function draw(cv, ch) {
    var w = cv.clientWidth || 320, h = 160, dpr = window.devicePixelRatio || 1; cv.width = w * dpr; cv.height = h * dpr;
    var x = cv.getContext('2d'); x.scale(dpr, dpr); x.clearRect(0, 0, w, h);
    var d = ch.data, max = Math.max.apply(null, d) || 1, bw = (w - 20) / d.length;
    var g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#7c5cff'); g.addColorStop(1, '#19c3a6');
    x.fillStyle = g; d.forEach(function (v, i) { var bh = Math.max(1, (h - 30) * v / max); x.fillRect(10 + i * bw + 1, h - 12 - bh, Math.max(1, bw - 2), bh); });
    x.fillStyle = getComputedStyle(document.body).getPropertyValue('--muted') || '#888'; x.font = '11px system-ui'; x.fillText(ch.label, 10, 12);
  }

  window.P82567 = { calcs: C, explore: explore, isPrime: isPrime, money: money, esc: esc };

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('calc-grid');
    if (grid) {
      var only = grid.dataset.only ? grid.dataset.only.split(',') : null;
      grid.innerHTML = C.filter(function (c) { return !only || only.indexOf(c.id) > -1; }).map(card).join('');
      grid.querySelectorAll('.cform').forEach(function (f) { f.addEventListener('input', function () { compute(f); }); compute(f); });
      grid.addEventListener('click', function (e) {
        var b = e.target.closest('.share'); if (!b) return;
        var url = location.origin + location.pathname.replace(/[^/]*$/, '') + 'calculators.html#' + b.dataset.id;
        (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () { b.textContent = '✅ Copied'; }, function () { prompt('Copy link:', url); });
      });
      var filt = document.getElementById('calc-filter'), chips = document.querySelectorAll('[data-chip]');
      function apply() {
        var q = (filt && filt.value || '').toLowerCase(), cat = (document.querySelector('[data-chip].on') || {}).dataset;
        cat = cat ? cat.chip : 'All';
        grid.querySelectorAll('.calc').forEach(function (el) { var ok = (cat === 'All' || el.dataset.cat === cat) && el.textContent.toLowerCase().indexOf(q) > -1; el.style.display = ok ? '' : 'none'; });
      }
      if (filt) { filt.addEventListener('input', apply); var qs = new URLSearchParams(location.search).get('q'); if (qs) { filt.value = qs; } }
      chips.forEach(function (c) { c.addEventListener('click', function () { chips.forEach(function (x) { x.classList.remove('on'); }); c.classList.add('on'); apply(); }); });
      apply();
      if (location.hash) { var t = document.querySelector(location.hash); if (t) { t.classList.add('flash'); setTimeout(function () { t.scrollIntoView({ behavior: 'smooth' }); }, 150); } }
    }
    var nf = document.getElementById('num-form');
    if (nf) {
      var inp = nf.elements.n, box = document.getElementById('num-out');
      function go() { var n = parseInt(String(inp.value).replace(/[, ]/g, ''), 10); box.innerHTML = explore(n).map(function (o) { return '<div class="kv"><span>' + esc(o[0]) + '</span><b>' + esc(o[1]) + '</b></div>'; }).join(''); }
      var qn = new URLSearchParams(location.search).get('n'); if (qn) inp.value = qn;
      nf.addEventListener('submit', function (e) { e.preventDefault(); history.replaceState(null, '', '?n=' + encodeURIComponent(inp.value)); go(); });
      document.querySelectorAll('[data-try]').forEach(function (b) { b.addEventListener('click', function () { inp.value = b.dataset.try; go(); }); });
      go();
    }
  });
})();
