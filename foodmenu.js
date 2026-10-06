const FOODS = [
    {id:1, name:'Squid Sweet & Sour Salad', price:19.99, tags:['Top of Week','Featured'], desc:'Grilled squid, cucumber and tomato in a sharp sweet-and-sour dressing.'},
    {id:2, name:'Japan Hainanese Sashimi',  price:39.99, tags:['Top of Week','Featured'], desc:'Salmon and tuna over warm rice with avocado, soy and a little wasabi.'},
    {id:3, name:'Black Pepper Beef Lumpia', price:27.12, tags:['Top of Week','Snack'],    desc:'Crisp rolls of peppered beef, served with sweet chili.'},
    {id:4, name:'Chicken Teriyaki',         price:25.00, tags:['Featured'],               desc:'Grilled thigh glazed in house teriyaki, with rice and pickles.'},
    {id:5, name:'Hongkong Hainanese Rice',  price:14.00, tags:['Top of Week'],            desc:'Poached chicken on fragrant rice, with ginger and scallion oil.'},
    {id:6, name:'Hot & Sour Dumpling Soup', price:30.00, tags:['Top of Week','Soup'],     desc:'Pork dumplings in a peppery, tangy broth.'},
    {id:7, name:'Singapore Noodles',        price:24.00, tags:['Snack'],                  desc:'Thin rice noodles with curry powder, shrimp, egg and vegetables.'},
    {id:8, name:'Creamy Corn Soup',         price:12.50, tags:['Soup'],                   desc:'Sweet corn simmered with egg ribbons and white pepper.'},
  ];
  const CATS = ['All','Featured','Top of Week','Soup','Snack'];
  const SAUCES = ['Teriyaki','Yakiniku'];
  const TOPPINGS = [{n:'Extra egg',p:2},{n:'Avocado',p:3},{n:'Nori',p:1}];
  const SHIPPING = 2;
  const S = { tab:'home', q:'', cat:'All', detail:null, cart:[], fav:new Set([2]), order:null };
  
  const $ = s => document.querySelector(s);
  const money = n => '$' + n.toFixed(2);
  const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const food = id => FOODS.find(f => f.id === id);
  const count = () => S.cart.reduce((a,l) => a + l.qty, 0);
  const lineTotal = l => (food(l.id).price + l.tops.reduce((a,t) => a + t.p, 0)) * l.qty;
  const optsOf = l => [...l.sauces, ...l.tops.map(t => t.n)].join(', ');
  const isDark = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches;
  const qty = (key,q) => `<div class="qty"><button data-dec="${key}" aria-label="Decrease">−</button><span>${q}</span><button data-inc="${key}" aria-label="Increase">+</button></div>`;
  
  /* ---------- dish pictures ---------- */
  // Flat illustrations. To use real photos, add img/1.jpg ... img/8.jpg next to index.html; they cover the drawings automatically.
  const TILES = {1:'#E6EDD4',2:'#F6DCC8',3:'#EEDAB6',4:'#F1DEC4',5:'#ECE5CE',6:'#F2D2C0',7:'#F5E6B6',8:'#F3EAC6'};
  const base = (rim, inner) => `<circle cx="60" cy="60" r="47" fill="${rim}"/><circle cx="60" cy="60" r="39" fill="${inner}"/>`;
  const ART = {
    1: base('#fff','#F8F4EA') +
       `<g fill="#5E9B4B"><ellipse cx="46" cy="50" rx="14" ry="8" transform="rotate(-30 46 50)"/><ellipse cx="73" cy="48" rx="14" ry="8" transform="rotate(25 73 48)"/><ellipse cx="58" cy="72" rx="15" ry="8" transform="rotate(8 58 72)"/></g>
        <ellipse cx="42" cy="68" rx="11" ry="6" fill="#86BB62" transform="rotate(40 42 68)"/>
        <g fill="#D9442E"><circle cx="52" cy="58" r="6"/><circle cx="71" cy="64" r="6"/><circle cx="62" cy="42" r="5"/></g>
        <g fill="#DCEBB8" stroke="#6FA84F" stroke-width="2"><circle cx="78" cy="53" r="6"/><circle cx="40" cy="58" r="5.5"/></g>
        <g fill="none" stroke="#F1DDC0" stroke-width="4"><circle cx="64" cy="57" r="5"/><circle cx="50" cy="77" r="5"/><circle cx="74" cy="76" r="5"/></g>`,
    2: base('#C99A4B','#F6EBD7') +
       `<g fill="#F58B5B"><rect x="36" y="38" width="24" height="9" rx="4.5" transform="rotate(-20 48 42)"/><rect x="38" y="51" width="24" height="9" rx="4.5" transform="rotate(-20 50 55)"/></g>
        <g fill="#C8363F"><rect x="66" y="40" width="22" height="9" rx="4.5" transform="rotate(25 77 44)"/><rect x="68" y="53" width="22" height="9" rx="4.5" transform="rotate(25 79 57)"/></g>
        <g fill="#7BA83A"><ellipse cx="46" cy="78" rx="13" ry="6" transform="rotate(-15 46 78)"/><ellipse cx="62" cy="84" rx="11" ry="5" transform="rotate(-5 62 84)"/></g>
        <rect x="72" y="72" width="14" height="11" rx="2" fill="#2D3B2E"/>
        <g fill="#3A2A1E"><circle cx="58" cy="62" r="1.3"/><circle cx="64" cy="66" r="1.3"/><circle cx="55" cy="68" r="1.3"/></g>`,
    3: base('#fff','#F8F4EA') +
       `<g transform="rotate(-28 60 60)"><rect x="22" y="36" width="76" height="14" rx="7" fill="#D79A43"/><rect x="22" y="53" width="76" height="14" rx="7" fill="#C98A36"/><rect x="22" y="70" width="76" height="14" rx="7" fill="#D79A43"/>
        <g stroke="#EDC27A" stroke-width="2.5" stroke-linecap="round"><path d="M32 42h48"/><path d="M32 59h48"/><path d="M32 76h48"/></g>
        <g fill="#6B3A22"><circle cx="92" cy="43" r="4.5"/><circle cx="92" cy="60" r="4.5"/><circle cx="92" cy="77" r="4.5"/></g></g>
        <circle cx="88" cy="88" r="9" fill="#fff" stroke="#E6DFD0" stroke-width="2"/><circle cx="88" cy="88" r="5.5" fill="#C93A2B"/>`,
    4: base('#fff','#F8F4EA') +
       `<circle cx="43" cy="55" r="17" fill="#fff" stroke="#E2DACA" stroke-width="2"/>
        <g fill="#E8E0CF"><circle cx="38" cy="50" r="1.4"/><circle cx="46" cy="48" r="1.4"/><circle cx="42" cy="58" r="1.4"/><circle cx="50" cy="56" r="1.4"/><circle cx="36" cy="60" r="1.4"/></g>
        <g transform="rotate(18 76 58)"><rect x="60" y="36" width="30" height="12" rx="6" fill="#8A4B22"/><rect x="60" y="50" width="30" height="12" rx="6" fill="#9A5A2B"/><rect x="60" y="64" width="30" height="12" rx="6" fill="#8A4B22"/>
        <g stroke="#C98245" stroke-width="2" stroke-linecap="round"><path d="M66 42h16"/><path d="M66 56h16"/><path d="M66 70h16"/></g></g>
        <g fill="#6CAA4E"><circle cx="70" cy="48" r="2"/><circle cx="82" cy="62" r="2"/><circle cx="74" cy="76" r="2"/></g>
        <g fill="#DCEBB8" stroke="#6FA84F" stroke-width="2"><circle cx="40" cy="82" r="6"/><circle cx="54" cy="86" r="6"/></g>`,
    5: base('#fff','#F8F4EA') +
       `<circle cx="42" cy="58" r="18" fill="#fff" stroke="#E2DACA" stroke-width="2"/>
        <g fill="#F4E2C0" stroke="#D9B27A" stroke-width="2"><ellipse cx="74" cy="42" rx="13" ry="7" transform="rotate(-25 74 42)"/><ellipse cx="80" cy="58" rx="13" ry="7"/><ellipse cx="74" cy="74" rx="13" ry="7" transform="rotate(25 74 74)"/></g>
        <g fill="#DCEBB8" stroke="#6FA84F" stroke-width="2"><circle cx="34" cy="84" r="6"/><circle cx="48" cy="88" r="6"/></g>
        <circle cx="60" cy="30" r="5" fill="#D9442E"/>`,
    6: base('#8E3B2B','#D2652F') +
       `<g fill="#F6E7CA" stroke="#E2C99B" stroke-width="1.5"><ellipse cx="46" cy="52" rx="12" ry="7.5" transform="rotate(-25 46 52)"/><ellipse cx="72" cy="50" rx="12" ry="7.5" transform="rotate(20 72 50)"/><ellipse cx="60" cy="72" rx="12" ry="7.5" transform="rotate(-5 60 72)"/></g>
        <g stroke="#E2C99B" stroke-width="1.5" stroke-linecap="round"><path d="M40 51l12-4"/><path d="M66 46l12 5"/><path d="M54 70h12"/></g>
        <g fill="#6CAA4E"><circle cx="58" cy="44" r="2.2"/><circle cx="82" cy="66" r="2.2"/><circle cx="38" cy="70" r="2.2"/><circle cx="76" cy="80" r="2.2"/></g>
        <g fill="#8E2A1E"><circle cx="52" cy="62" r="1.4"/><circle cx="66" cy="60" r="1.4"/><circle cx="48" cy="80" r="1.4"/></g>`,
    7: base('#fff','#F8F4EA') +
       `<g fill="none" stroke="#F0C34E" stroke-width="4.5" stroke-linecap="round"><path d="M32 46q9-11 17 0t17 0t18 0"/><path d="M30 57q9-11 17 0t17 0t20 0"/><path d="M32 68q9-11 17 0t17 0t18 0"/><path d="M36 79q9-11 17 0t17 0t14 0"/></g>
        <g fill="#EE7A4A" stroke="#C85A2E" stroke-width="1.5"><ellipse cx="46" cy="50" rx="8" ry="4.5" transform="rotate(-30 46 50)"/><ellipse cx="74" cy="72" rx="8" ry="4.5" transform="rotate(30 74 72)"/></g>
        <g fill="#6CAA4E"><rect x="56" y="58" width="7" height="3" rx="1.5"/><rect x="40" y="72" width="7" height="3" rx="1.5"/></g>
        <g fill="#D9442E"><rect x="68" y="48" width="6" height="3" rx="1.5"/><rect x="52" y="82" width="6" height="3" rx="1.5"/></g>`,
    8: base('#E9E2D0','#F3D36B') +
       `<g fill="none" stroke="#FFF6D8" stroke-width="3.5" stroke-linecap="round"><path d="M34 50q10-9 18 0t18 0t14 -2"/><path d="M36 66q10-9 18 0t18 0t12 -2"/><path d="M42 80q8-7 14 0t14 0"/></g>
        <g fill="#F2A91E"><circle cx="46" cy="58" r="2.6"/><circle cx="62" cy="60" r="2.6"/><circle cx="76" cy="58" r="2.6"/><circle cx="54" cy="74" r="2.6"/><circle cx="70" cy="76" r="2.6"/><circle cx="44" cy="44" r="2.6"/><circle cx="78" cy="44" r="2.6"/></g>
        <g fill="#6CAA4E"><circle cx="58" cy="52" r="2"/><circle cx="68" cy="68" r="2"/><circle cx="40" cy="70" r="2"/></g>`
  };
  const pic = (f, cls='') => `<span class="pic ${cls}" style="--tile:${TILES[f.id]}"><svg viewBox="0 0 120 120" role="img" aria-label="${f.name}">${ART[f.id]}</svg><img src="img/${f.id}.jpg" alt="${f.name}" loading="lazy" onerror="this.remove()"></span>`;
  
  /* ---------- pages ---------- */
  const searchIcon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
  const tile = f => `<button class="food" data-open="${f.id}">${pic(f)}<b>${f.name}</b><span class="price">${money(f.price)}</span></button>`;
  const banner = () => `<div class="banner"><small>Delivery to Home</small><b>Phonphanao Village, Vientiane</b><span class="pill">2.4 km</span></div>`;
  
  function home(){
    return `<h1>Asian comfort food, cooked when you order.</h1>
    <button class="search" data-go>${searchIcon}<span>Search dishes</span></button>
    <div class="duo">${banner()}
      <div class="promo"><div><h3>Chicken Teriyaki</h3><p>25% off this week</p><button class="btn sm" data-open="4">Order now</button></div>${pic(food(4))}</div>
    </div>
    <h2>Popular this week</h2>
    <div class="tiles">${FOODS.filter(f => f.tags.includes('Top of Week')).map(tile).join('')}</div>`;
  }
  function listHTML(){
    const q = S.q.trim().toLowerCase();
    const list = FOODS.filter(f => (S.cat==='All' || f.tags.includes(S.cat)) && (f.name+' '+f.desc).toLowerCase().includes(q));
    return list.length ? list.map(tile).join('') : `<p class="empty">Nothing matches “${esc(S.q)}”. Try another word.</p>`;
  }
  function menu(){
    return `<h1 class="page">Menu</h1>
    <label class="search" style="margin-top:0">${searchIcon}<input id="search" type="search" placeholder="Search dishes" value="${esc(S.q)}" autocomplete="off" aria-label="Search dishes"></label>
    <div class="chips">${CATS.map(c => `<button data-cat="${c}" class="${c===S.cat?'on':''}">${c}</button>`).join('')}</div>
    <div class="tiles" id="list">${listHTML()}</div>`;
  }
  function cart(){
    if(!S.cart.length) return `<h1 class="page">Your order</h1><p class="muted" style="margin-bottom:28px">Nothing here yet.</p><button class="btn" data-tab="menu">Browse the menu</button>`;
    const sub = S.cart.reduce((a,l) => a + lineTotal(l), 0);
    return `<h1 class="page">Your order (${count()})</h1><div class="cart">${banner()}
      <ul class="lines">${S.cart.map((l,i) => `<li>${pic(food(l.id))}<div><b>${food(l.id).name}</b><small>${optsOf(l)}</small><button class="rm" data-remove="${i}">Remove</button></div>${qty(i,l.qty)}<span class="p">${money(lineTotal(l))}</span></li>`).join('')}</ul>
      <div class="sum">
        <div class="kv"><span>Subtotal</span><b>${money(sub)}</b></div>
        <div class="kv"><span>Delivery</span><b>${money(SHIPPING)}</b></div>
        <div class="kv total"><span>Total</span><b>${money(sub+SHIPPING)}</b></div>
        <button class="btn wide" data-place>Place order</button>
      </div></div>`;
  }
  function confirm(){
    const o = S.order;
    return `<p class="eyebrow">Order #${o.id}</p><h1 class="page" style="margin-top:8px">Thanks, we’ve got it.</h1>
    <p class="muted">Arriving between ${o.time}. Changed your mind? <button class="link" data-cancel>Cancel the order</button></p>
    <div class="receipt">
      ${o.lines.map(l => `<div class="kv"><span>${l.qty} × ${food(l.id).name}${optsOf(l)?`<small>${optsOf(l)}</small>`:''}</span><b>${money(lineTotal(l))}</b></div>`).join('')}
      <div class="kv"><span>Delivery</span><b>${money(SHIPPING)}</b></div>
      <div class="kv total"><span>Total</span><b>${money(o.sub+SHIPPING)}</b></div>
    </div><button class="btn" data-tab="home">Back to home</button>`;
  }
  function profile(){
    const saved = FOODS.filter(f => S.fav.has(f.id));
    return `<h1 class="page">Profile</h1>
    <div class="panel">
      <div class="kv"><span>Name</span><b>Kupa guest</b></div>
      <div class="kv"><span>Address</span><b>Phonphanao Village, Vientiane</b></div>
      <div class="kv"><span>Appearance</span><button class="link" data-dark>${isDark()?'Dark':'Light'} · switch</button></div>
    </div>
    <h2>Saved dishes</h2>
    ${saved.length ? `<div class="tiles">${saved.map(tile).join('')}</div>` : '<p class="muted">Nothing saved yet.</p>'}`;
  }
  
  /* ---------- dish dialog ---------- */
  function sheet(){
    const d = S.detail, sc = $('#scrim');
    if(!d){ sc.classList.remove('open'); document.body.classList.remove('lock'); return; }
    const f = food(d.id), extra = TOPPINGS.filter(t => d.tops.has(t.n)).reduce((a,t) => a + t.p, 0);
    $('#sheet').innerHTML = `
      ${pic(f,'wide')}<div class="top-row"><span class="eyebrow">${f.tags[0]}</span><button class="link" data-fav="${f.id}">${S.fav.has(f.id)?'Saved':'Save'}</button></div>
      <h3>${f.name}</h3><p class="muted">${f.desc}</p>
      <div class="price-row">${qty('d',d.qty)}<b>${money(f.price)}</b></div>
      <h4>Sauce</h4>${SAUCES.map(s => `<label class="opt"><input type="checkbox" data-sauce="${s}" ${d.sauces.has(s)?'checked':''}>${s}<em>Free</em></label>`).join('')}
      <h4>Add on</h4>${TOPPINGS.map(t => `<label class="opt"><input type="checkbox" data-top="${t.n}" ${d.tops.has(t.n)?'checked':''}>${t.n}<em>+${money(t.p)}</em></label>`).join('')}
      <button class="btn wide" data-add>Add to order · ${money((f.price+extra)*d.qty)}</button>
      <button class="link" data-close style="display:block;margin:18px auto 0">Close</button>`;
    sc.classList.add('open'); document.body.classList.add('lock');
  }
  
  /* ---------- render ---------- */
  function render(anim){
    const m = $('#screen');
    m.innerHTML = (S.tab==='confirm' && S.order ? confirm : ({home,menu,cart,profile})[S.tab] || home)();
    m.classList.remove('in');
    if(anim){ void m.offsetWidth; m.classList.add('in'); window.scrollTo(0,0); }
    const n = count();
    $('#nav').innerHTML = [['home','Home'],['menu','Menu'],['cart', n ? `Cart (${n})` : 'Cart'],['profile','Profile']]
      .map(([k,l]) => `<button data-tab="${k}" class="${S.tab===k?'on':''}" ${S.tab===k?'aria-current="page"':''}>${l}</button>`).join('');
  }
  function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove('show'), 1600); }
  
  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    if(e.target.id === 'scrim'){ S.detail = null; sheet(); return; }
    const el = e.target.closest('[data-tab],[data-go],[data-cat],[data-open],[data-inc],[data-dec],[data-fav],[data-add],[data-place],[data-cancel],[data-dark],[data-close],[data-remove]');
    if(!el) return;
    const D = el.dataset;
    if('tab' in D){ S.detail = null; sheet(); S.tab = D.tab; render(true); }
    else if('go' in D){ S.tab = 'menu'; render(true); $('#search').focus(); }
    else if('cat' in D){ S.cat = D.cat; render(); }
    else if('open' in D){ S.detail = {id:+D.open, qty:1, sauces:new Set(['Teriyaki']), tops:new Set()}; sheet(); }
    else if('close' in D){ S.detail = null; sheet(); }
    else if('fav' in D){ const id = +D.fav; S.fav.has(id) ? S.fav.delete(id) : S.fav.add(id); sheet(); }
    else if('inc' in D || 'dec' in D){
      const delta = 'inc' in D ? 1 : -1, key = D.inc ?? D.dec;
      if(key === 'd'){ S.detail.qty = Math.max(1, S.detail.qty + delta); sheet(); }
      else { const l = S.cart[+key]; l.qty += delta; if(l.qty < 1) S.cart.splice(+key,1); render(); }
    }
    else if('remove' in D){ S.cart.splice(+D.remove,1); render(); }
    else if('add' in D){
      const d = S.detail, sauces = [...d.sauces], tops = TOPPINGS.filter(t => d.tops.has(t.n));
      const key = d.id + '|' + sauces.join() + '|' + tops.map(t => t.n).join();
      const same = S.cart.find(l => l.key === key);
      same ? same.qty += d.qty : S.cart.push({key, id:d.id, qty:d.qty, sauces, tops});
      S.detail = null; sheet(); render(); toast('Added to your order');
    }
    else if('place' in D){
      const sub = S.cart.reduce((a,l) => a + lineTotal(l), 0), now = Date.now();
      const at = m => new Date(now + m*60000).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      S.order = {id:Math.floor(10000 + Math.random()*90000), lines:S.cart, sub, time:`${at(10)} and ${at(15)}`};
      S.cart = []; S.tab = 'confirm'; render(true);
    }
    else if('cancel' in D){ S.cart = S.order.lines; S.order = null; S.tab = 'cart'; render(true); toast('Order cancelled'); }
    else if('dark' in D){ document.documentElement.dataset.theme = isDark() ? 'light' : 'dark'; render(); }
  });
  document.addEventListener('change', e => {
    const i = e.target; if(!S.detail || !(i.dataset.sauce || i.dataset.top)) return;
    const set = i.dataset.sauce ? S.detail.sauces : S.detail.tops, v = i.dataset.sauce || i.dataset.top;
    i.checked ? set.add(v) : set.delete(v); sheet();
  });
  document.addEventListener('input', e => { if(e.target.id === 'search'){ S.q = e.target.value; $('#list').innerHTML = listHTML(); } });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && S.detail){ S.detail = null; sheet(); } });
  render(true);