import React, { useMemo, useState } from "react";

// stopScrappingSaabs.org — single-file React app
// Notes
// - Uses a minimal, Bootstrap-inspired look via utility classes defined below.
// - No external deps required; runs as a single component for easy drop-in.
// - Swap the faux-Bootstrap CSS with real Bootstrap/React-Bootstrap later.
// - Navigation uses internal state for simplicity; replace with react-router as needed.

export default function StopScrappingSaabsApp() {
  const [route, setRoute] = useState("home");
  const [partsQuery, setPartsQuery] = useState("");

  const parts = useMemo(
    () => [
      { id: 1, model: "900 Classic", category: "Engine", name: "APC Solenoid Valve (Refurb)", vendor: "Saab Specialist Yard", url: "#" },
      { id: 2, model: "9000", category: "Brakes", name: "Front Caliper (Left)", vendor: "VSAAB", url: "#" },
      { id: 3, model: "9-5 (OG)", category: "Exhaust", name: "Downpipe 3" , vendor: "RBM Saab", url: "#" },
      { id: 4, model: "9-3 (SS)", category: "Electrical", name: "DI Cassette (OEM)", vendor: "Saabits", url: "#" },
      { id: 5, model: "96", category: "Body", name: "Front Fender (Driver) – Solid Core", vendor: "Heritage Yard", url: "#" },
      { id: 6, model: "900 NG", category: "Suspension", name: "Rear Spring Pair", vendor: "SaabPartsCounter", url: "#" },
    ],
    []
  );

  const filteredParts = useMemo(() => {
    const q = partsQuery.trim().toLowerCase();
    if (!q) return parts;
    return parts.filter(p =>
      [p.model, p.category, p.name, p.vendor].some(v => v.toLowerCase().includes(q))
    );
  }, [partsQuery, parts]);

  return (
    <div className="app">
      <Style />
      <SiteNav route={route} onNav={setRoute} />
      <main className="container">
        {route === "home" && <Home onDonate={() => setRoute("donate")} onStartGuide={() => setRoute("guide")} onFindParts={() => setRoute("parts")} />}
        {route === "about" && <About />}
        {route === "parts" && (
          <PartsDirectory
            query={partsQuery}
            onQuery={setPartsQuery}
            results={filteredParts}
          />
        )}
        {route === "guide" && <RestoreGuide />}
        {route === "donate" && <DonateForm />}
        {route === "community" && <Community />}
      </main>
      <Footer />
    </div>
  );
}

function SiteNav({ route, onNav }: { route: string; onNav: (r: string) => void }) {
  return (
    <header className="navbar navbar-expand shadow-sm">
      <div className="container nav-inner">
        <span className="brand" onClick={() => onNav("home")} role="link" aria-label="Stop Scrapping Saabs home">
          <span className="brand-mark">⚙︎</span> stopScrappingSaabs<span className="dot">.org</span>
        </span>
        <nav className="nav-links">
          <NavLink label="Home" active={route === "home"} onClick={() => onNav("home")} />
          <NavLink label="About" active={route === "about"} onClick={() => onNav("about")} />
          <NavLink label="Parts Directory" active={route === "parts"} onClick={() => onNav("parts")} />
          <NavLink label="Restore Guide" active={route === "guide"} onClick={() => onNav("guide")} />
          <NavLink label="Donate" active={route === "donate"} onClick={() => onNav("donate")} />
          <NavLink label="Community" active={route === "community"} onClick={() => onNav("community")} />
        </nav>
      </div>
    </header>
  );
}

function NavLink({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button className={`nav-link ${active ? "active" : ""}`} onClick={onClick}>
      {label}
    </button>
  );
}

function Hero({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <section className="hero card">
      <div className="card-body">
        <h1 className="display">{title}</h1>
        {subtitle && <p className="lead">{subtitle}</p>}
        {actions && <div className="hero-actions">{actions}</div>}
      </div>
    </section>
  );
}

function Home({ onDonate, onStartGuide, onFindParts }: { onDonate: () => void; onStartGuide: () => void; onFindParts: () => void }) {
  return (
    <div className="stack-lg">
      <Hero
        title="Save Saabs. Restore Legacy."
        subtitle="Help owners restore viable chassis instead of sending Saabs to the crusher."
        actions={
          <div className="btn-row">
            <button className="btn btn-primary" onClick={onDonate}>Donate your Saab</button>
            <button className="btn btn-secondary" onClick={onFindParts}>Find parts</button>
            <button className="btn btn-ghost" onClick={onStartGuide}>See the guide</button>
          </div>
        }
      />

      <section className="grid-3">
        <Card title="Assess viability" text="Quickly evaluate chassis, structure, and rust to decide restore vs. part-out." icon="🧰" />
        <Card title="Source parts" text="Browse curated Saab vendors, yards, and refurb sources across models." icon="🧩" />
        <Card title="Donate or match" text="If you can’t fix it, match your Saab with a restorer or club that can." icon="🤝" />
      </section>

      <section className="card">
        <div className="card-body">
          <h2 className="h2">How it works</h2>
          <ol className="numbered">
            <li>Check safety: frame rails, floors, jack points, windshield base, rear arches.</li>
            <li>Estimate scope: engine/trans health, brakes, electrics, interior, body panels.</li>
            <li>Search parts: start with essentials before cosmetics.</li>
            <li>Decide: restore, donor, or club donation. Favor restore if the shell is solid.</li>
          </ol>
        </div>
      </section>
    </div>
  );
}

function About() {
  return (
    <div className="stack-lg">
      <section className="card">
        <div className="card-body">
          <h2 className="h2">Why stop scrapping Saabs?</h2>
          <p>
            Saab engineering, safety, and design earned a global enthusiast community. Many cars head to the yard
            due to parts scarcity or unclear repair paths. This project connects owners, parts sources, and restorers
            so viable cars get a second life instead of a one-way trip.
          </p>
          <ul className="checklist">
            <li>Preserve unique models and specs</li>
            <li>Reduce waste and environmental impact</li>
            <li>Keep knowledge and skills within the community</li>
          </ul>
        </div>
      </section>

      <section className="card">
        <div className="card-body">
          <h3 className="h3">Our goals</h3>
          <div className="grid-3">
            <MiniStat label="Vehicles saved" value="1,248" />
            <MiniStat label="Parts sources" value="87" />
            <MiniStat label="Volunteer shops" value="43" />
          </div>
        </div>
      </section>
    </div>
  );
}

function PartsDirectory({ query, onQuery, results }: { query: string; onQuery: (q: string) => void; results: any[] }) {
  return (
    <div className="stack-lg">
      <section className="card">
        <div className="card-body">
          <div className="flex-between">
            <h2 className="h2">Saab parts directory</h2>
            <span className="muted">Community-curated · Vendors + refurb + heritage</span>
          </div>
          <div className="input-row">
            <input
              value={query}
              onChange={e => onQuery(e.target.value)}
              placeholder="Search model, category, vendor, or part name"
              className="form-control"
              aria-label="Search parts"
            />
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Category</th>
                  <th>Part</th>
                  <th>Vendor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.id}>
                    <td>{r.model}</td>
                    <td>{r.category}</td>
                    <td>{r.name}</td>
                    <td>{r.vendor}</td>
                    <td><a className="btn btn-sm btn-outline" href={r.url}>View</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="card info">
        <div className="card-body">
          <p className="muted small">Tip: add refurb sources for DI cassettes, APC valves, ABS modules, and other NLA items.</p>
        </div>
      </section>
    </div>
  );
}

function RestoreGuide() {
  return (
    <div className="stack-lg">
      <Hero title="Restore instead of scrap" subtitle="Follow this path to keep viable Saabs on the road." />

      <section className="card">
        <div className="card-body">
          <h3 className="h3">1. Assess viability</h3>
          <ul>
            <li>Structure: jack points, frame rails, floors, front subframe, rear arches, windshield base.</li>
            <li>Powertrain: compression/leakdown, turbo shaft play, gearbox synchros, clutch, rear main.</li>
            <li>Safety: brake lines, calipers, hoses, ABS operation, tires, suspension bushings.</li>
            <li>Electrics: DI cassette, crank/cam sensors, grounds, charging system, SID/ACC pixels.</li>
          </ul>
        </div>
      </section>

      <section className="card">
        <div className="card-body">
          <h3 className="h3">2. Parts plan</h3>
          <p>Prioritize safety-critical items first, then reliability, then cosmetic. Batch orders by vendor to save shipping.</p>
          <div className="grid-3">
            <Bullet title="Safety" items={["Brakes & lines", "Tires", "Bushings", "Lighting"]} />
            <Bullet title="Reliability" items={["DI cassette & plugs", "Sensors & hoses", "Cooling system", "Vacuum lines"]} />
            <Bullet title="Cosmetic" items={["Panels", "Trim & seals", "Interior plastics", "Glass"]} />
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-body">
          <h3 className="h3">3. Decide path</h3>
          <ul className="checklist">
            <li>Solid shell → Restore or match with a restorer</li>
            <li>Marginal shell, great drivetrain → Donor to save another car</li>
            <li>Unsafe shell → Professional evaluation before any road use</li>
          </ul>
        </div>
      </section>

      <section className="card">
        <div className="card-body">
          <h3 className="h3">4. Donate or match</h3>
          <p>Use the donate form to reach clubs and shops that specialize in Saabs. Transport can be coordinated at cost.</p>
        </div>
      </section>
    </div>
  );
}

function DonateForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    city: "",
    state: "",
    model: "",
    year: "",
    condition: "",
    notes: "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="stack-lg">
      <section className="card">
        <div className="card-body">
          <h2 className="h2">Donate or match your Saab</h2>
          {!submitted ? (
            <form className="grid-2" onSubmit={submit}>
              <Input label="Your name" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
              <Input label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} required />
              <Input label="City" value={form.city} onChange={v => setForm({ ...form, city: v })} />
              <Input label="State/Region" value={form.state} onChange={v => setForm({ ...form, state: v })} />
              <Input label="Model (e.g., 9000, 9-5)" value={form.model} onChange={v => setForm({ ...form, model: v })} />
              <Input label="Year" type="number" value={form.year} onChange={v => setForm({ ...form, year: v })} />
              <Select label="Overall condition" value={form.condition} onChange={v => setForm({ ...form, condition: v })} options={["Solid shell", "Repairable", "Donor only", "Unknown"]} />
              <Textarea label="Notes" value={form.notes} onChange={v => setForm({ ...form, notes: v })} placeholder="Rust areas, engine/trans status, title availability, extra parts…" />
              <div className="span-2">
                <button className="btn btn-primary" type="submit">Submit</button>
              </div>
            </form>
          ) : (
            <div className="alert success">
              <strong>Thanks!</strong> We'll review and connect you with nearby restorers or clubs.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Community() {
  return (
    <div className="stack-lg">
      <section className="card">
        <div className="card-body">
          <h2 className="h2">Community hub</h2>
          <p>Find local Saab clubs, events, and restoration partners. Share progress logs and tips.</p>
          <div className="grid-3">
            <CommunityCard title="Local clubs" desc="Connect with regional Saab Owners clubs and meets." action="Browse" />
            <CommunityCard title="Shops & specialists" desc="Find Saab-savvy garages and machinists." action="Find" />
            <CommunityCard title="Forums & groups" desc="Join model-specific groups to get help fast." action="Join" />
          </div>
        </div>
      </section>
    </div>
  );
}

function Card({ title, text, icon }: { title: string; text: string; icon?: string }) {
  return (
    <article className="card card-hover">
      <div className="card-body">
        <div className="card-icon">{icon}</div>
        <h3 className="h4">{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="ministat">
      <div className="value">{value}</div>
      <div className="label">{label}</div>
    </div>
  );
}

function Bullet({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="h5">{title}</h4>
      <ul>
        {items.map(it => <li key={it}>{it}</li>)}
      </ul>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="form-field">
      <span className="form-label">{label}{required && <em aria-hidden>*</em>}</span>
      <input className="form-control" type={type} value={value} onChange={e => onChange(e.target.value)} required={required} />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="form-field">
      <span className="form-label">{label}</span>
      <select className="form-control" value={value} onChange={e => onChange(e.target.value)}>
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Textarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="form-field">
      <span className="form-label">{label}</span>
      <textarea className="form-control" rows={4} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="muted small">© {new Date().getFullYear()} stopScrappingSaabs.org • Built with a Bootstrap-inspired theme</div>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}

function CommunityCard({ title, desc, action }: { title: string; desc: string; action: string }) {
  return (
    <article className="card">
      <div className="card-body">
        <h4 className="h4">{title}</h4>
        <p>{desc}</p>
        <button className="btn btn-outline btn-sm">{action}</button>
      </div>
    </article>
  );
}

function Style() {
  return (
    <style>{`
      :root {
        --bg: #0b0c10;
        --panel: #12141a;
        --panel-2: #161922;
        --muted: #9aa3af;
        --text: #e5e7eb;
        --brand: #60a5fa;
        --brand-600: #3b82f6;
        --accent: #22d3ee;
        --ok: #22c55e;
        --warn: #f59e0b;
        --err: #ef4444;
        --border: #1f2430;
        --shadow: 0 6px 20px rgba(0,0,0,.35);
        --radius: 16px;
      }
      * { box-sizing: border-box; }
      html, body, #root { height: 100%; }
      body { margin: 0; background: var(--bg); color: var(--text); font: 16px/1.5 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial; }
      .container { width: min(1100px, 92%); margin: 0 auto; }

      /* Navbar */
      .navbar { position: sticky; top: 0; z-index: 50; background: rgba(9, 11, 16, .85); backdrop-filter: blur(6px); border-bottom: 1px solid var(--border); }
      .nav-inner { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; }
      .brand { font-weight: 800; letter-spacing: .3px; cursor: pointer; user-select: none; }
      .brand-mark { color: var(--accent); margin-right: 8px; }
      .dot { color: var(--brand); }
      .nav-links { display: flex; gap: 8px; }
      .nav-link { background: transparent; border: 1px solid transparent; color: var(--text); padding: 8px 12px; border-radius: 12px; cursor: pointer; }
      .nav-link:hover { background: var(--panel-2); border-color: var(--border); }
      .nav-link.active { background: var(--brand-600); border-color: var(--brand-600); color: white; }

      /* Layout helpers */
      .stack-lg { display: grid; gap: 20px; margin: 24px 0 60px; }
      .grid-3 { display: grid; gap: 16px; grid-template-columns: repeat(3, 1fr); }
      .grid-2 { display: grid; gap: 16px; grid-template-columns: repeat(2, 1fr); }
      .span-2 { grid-column: span 2; }
      .flex-between { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
      @media (max-width: 860px) { .grid-3 { grid-template-columns: 1fr; } .grid-2 { grid-template-columns: 1fr; } .span-2{ grid-column: auto; } }

      /* Cards */
      .card { background: linear-gradient(180deg, var(--panel), var(--panel-2)); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
      .card-hover { transition: transform .12s ease, box-shadow .12s ease; }
      .card-hover:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,.45); }
      .card-body { padding: 18px 20px; }

      .display { font-size: clamp(28px, 5vw, 44px); margin: 0 0 8px; letter-spacing: .2px; }
      .lead { color: var(--muted); margin: 0 0 12px; }
      .h2 { font-size: 26px; margin: 0 0 8px; }
      .h3 { font-size: 22px; margin: 0 0 10px; }
      .h4 { font-size: 18px; margin: 0 0 6px; }
      .h5 { font-size: 16px; margin: 0 0 6px; color: var(--muted); }

      .hero-actions, .btn-row { display: flex; flex-wrap: wrap; gap: 10px; }

      .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 14px; border-radius: 12px; border: 1px solid var(--border); background: var(--panel-2); color: var(--text); cursor: pointer; }
      .btn:hover { filter: brightness(1.08); }
      .btn-primary { background: var(--brand-600); border-color: var(--brand-600); color: #fff; }
      .btn-secondary { background: #334155; border-color: #334155; color: #e5e7eb; }
      .btn-ghost { background: transparent; border-color: var(--border); }
      .btn-outline { background: transparent; border-color: var(--border); }
      .btn-sm { padding: 6px 10px; border-radius: 10px; font-size: 14px; }

      .numbered { counter-reset: step; padding-left: 18px; }
      .numbered li { margin: 8px 0; }

      .checklist { list-style: none; padding: 0; margin: 0; }
      .checklist li::before { content: "✔"; color: var(--ok); margin-right: 10px; }

      .ministat { background: var(--panel-2); border: 1px solid var(--border); border-radius: 14px; padding: 12px; text-align: center; }
      .ministat .value { font-weight: 800; font-size: 20px; }
      .ministat .label { color: var(--muted); font-size: 12px; }

      .input-row { margin: 10px 0 16px; }
      .form-field { display: grid; gap: 6px; }
      .form-label { font-size: 14px; color: var(--muted); }
      .form-control { width: 100%; background: #0f1218; border: 1px solid var(--border); color: var(--text); padding: 10px 12px; border-radius: 12px; }

      .table-responsive { overflow-x: auto; }
      .table { width: 100%; border-collapse: collapse; }
      .table th, .table td { padding: 10px 12px; border-bottom: 1px solid var(--border); text-align: left; }
      .table th { color: var(--muted); font-weight: 600; font-size: 14px; }

      .alert { padding: 12px 14px; border-radius: 12px; border: 1px solid var(--border); background: #102413; }
      .alert.success { border-color: #134e1e; }

      .muted { color: var(--muted); }
      .small { font-size: 13px; }

      .footer { border-top: 1px solid var(--border); padding: 18px 0 40px; background: rgba(9, 11, 16, .5); margin-top: 40px; }
      .footer-inner { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
      .footer a { color: var(--muted); text-decoration: none; }
      .footer a:hover { color: var(--text); }
    `}</style>
  );
}
