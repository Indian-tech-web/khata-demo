// Demo backend: stands in for Supabase so the app works with sample data stored on this device only.
(function () {
  const KEY = 'sk_demo_db', AUTH = 'sk_demo_auth';
  const ls = { g: k => { try { return localStorage.getItem(k) } catch (e) { return null } }, s: (k, v) => { try { localStorage.setItem(k, v) } catch (e) {} } };
  const pad = n => String(n).padStart(2, '0'), ds = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const ago = n => { const d = new Date(); d.setDate(d.getDate() - n); return ds(d) };
  let k = 0, ts = Date.now();
  const id = () => 'd' + Date.now().toString(36) + (++k).toString(36), now = () => new Date(ts++).toISOString();
  function seed() {
    const P = [['Sharma Traders', '9000000001', 'Main Bazar, Sample City'], ['Verma & Sons', '9000000002', 'Market Road, Sample City'], ['Gupta Kirana Store', '9000000003', 'Station Road, Sample City']]
      .map(([name, phone, addr]) => ({ id: id(), name, phone, addr, gstin: '', opening: 0, opening_date: null, created_at: now() }));
    const mk = (no, days, p, katta, rate, mode) => { const w = katta / 2, a = w * rate, cg = Math.round(a * 0.025 * 100) / 100;
      return { id: id(), no, bill_date: ago(days), party_id: p.id, party_name: p.name, party_addr: p.addr, party_gstin: '', broker: '', vehicle: '',
        items: [{ d: 'Sugar', w: String(w), qy: String(katta), r: String(rate), a: String(a) }], sub: a, cgst: cg, sgst: cg, igst: 0, total: a + cg * 2, tax: 'in', mode, created_at: now() } };
    const B = [mk(1, 12, P[0], 40, 3200, 'credit'), mk(2, 9, P[1], 20, 3180, 'credit'), mk(3, 6, P[2], 10, 3210, 'cash'), mk(4, 4, P[0], 30, 3190, 'credit'), mk(5, 2, P[1], 50, 3200, 'credit'), mk(6, 0, P[2], 20, 3205, 'credit')];
    const R = [{ id: id(), party_id: P[0].id, pay_date: ago(3), amount: 50000, note: 'UPI', created_at: now() }, { id: id(), party_id: P[1].id, pay_date: ago(1), amount: 30000, note: 'Cash', created_at: now() }];
    return { parties: P, bills: B, payments: R, settings: [{ id: 1, next_bill: 7 }] };
  }
  let db = null; try { db = JSON.parse(ls.g(KEY)) } catch (e) {}
  if (!db || !db.bills) db = seed();
  const save = () => ls.s(KEY, JSON.stringify(db)); save();
  const cmp = (a, b) => a > b ? 1 : a < b ? -1 : 0;
  function q(t) {
    let ord = [], from = 0, to = 1e9, one = null, mode = 'sel', pl = null, eqs = [];
    const m = r => eqs.every(([c, v]) => r[c] == v);
    function run() {
      if (mode == 'ins') { const r = Object.assign({ id: id(), created_at: now() }, pl); db[t].push(r); save(); return { data: r, error: null } }
      if (mode == 'upd') { db[t].filter(m).forEach(r => Object.assign(r, pl)); save(); return { data: null, error: null } }
      if (mode == 'del') { db[t] = db[t].filter(r => !m(r)); save(); return { data: null, error: null } }
      const d = db[t].filter(m).sort((a, b) => { for (const c of ord) { const x = cmp(a[c], b[c]); if (x) return x } return 0 }).slice(from, to + 1);
      return { data: one ? (d[0] || null) : d, error: null };
    }
    const api = { select() { return api }, order(c) { ord.push(c); return api }, range(a, b) { from = a; to = b; return api }, eq(c, v) { eqs.push([c, v]); return api },
      maybeSingle() { one = 'm'; return api }, single() { one = 's'; return api }, insert(o) { mode = 'ins'; pl = o; return api }, update(o) { mode = 'upd'; pl = o; return api }, delete() { mode = 'del'; return api },
      then(res, rej) { try { res(run()) } catch (e) { rej(e) } } };
    return api;
  }
  let cb = null; const U = { id: 'demo-user', email: 'demo@example.com' }, signed = () => ls.g(AUTH) !== '0';
  const client = {
    from: q,
    rpc: async (f, a) => { const p = a.p, s = db.settings[0], no = s.next_bill++;
      const r = { id: id(), no, bill_date: p.bill_date, party_id: p.party_id, party_name: p.party_name, party_addr: p.party_addr || '', party_gstin: p.party_gstin || '', broker: p.broker || '', vehicle: p.vehicle || '',
        items: p.items, sub: p.sub, cgst: p.cgst, sgst: p.sgst, igst: p.igst, total: p.total, tax: p.tax, mode: p.mode, created_at: now() };
      db.bills.push(r); save(); return { data: r, error: null } },
    auth: {
      getSession: async () => ({ data: { session: signed() ? { user: U } : null } }),
      onAuthStateChange(f) { cb = f; return { data: { subscription: { unsubscribe() {} } } } },
      signInWithPassword: async () => { ls.s(AUTH, '1'); setTimeout(() => cb && cb('SIGNED_IN', { user: U }), 0); return { error: null } },
      signOut: async () => { ls.s(AUTH, '0'); setTimeout(() => cb && cb('SIGNED_OUT', null), 0); return { error: null } }
    },
    channel() { const c = { on() { return c }, subscribe() { return c } }; return c },
    removeAllChannels() {}
  };
  window.supabase = { createClient: () => client };
})();
