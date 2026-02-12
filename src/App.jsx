import { useState, useEffect, useRef } from "react";

// ─── THEME ────────────────────────────────────────────────────────────
const T = {
  bg: "#0A0E1A", surface: "#111827", surfaceAlt: "#151D2E", card: "#1A2235",
  border: "#1F2A40", borderHover: "#2D3A54",
  accent: "#6366F1", accentSoft: "rgba(99,102,241,0.12)", accentGlow: "rgba(99,102,241,0.25)",
  green: "#10B981", greenSoft: "rgba(16,185,129,0.1)",
  amber: "#F59E0B", amberSoft: "rgba(245,158,11,0.1)",
  red: "#EF4444", redSoft: "rgba(239,68,68,0.1)",
  blue: "#3B82F6", blueSoft: "rgba(59,130,246,0.1)",
  cyan: "#06B6D4", cyanSoft: "rgba(6,182,212,0.1)",
  pink: "#EC4899", pinkSoft: "rgba(236,72,153,0.1)",
  text: "#F1F5F9", textSec: "#94A3B8", textMut: "#64748B",
  font: "'DM Sans', 'Segoe UI', -apple-system, sans-serif",
};

const STAGES = [
  { id: "not_contacted", label: "Not Contacted", color: T.textMut, bg: "rgba(100,116,139,0.1)" },
  { id: "reached_out", label: "Reached Out", color: T.blue, bg: T.blueSoft },
  { id: "responded", label: "Responded", color: T.cyan, bg: T.cyanSoft },
  { id: "meeting", label: "Meeting Set", color: T.amber, bg: T.amberSoft },
  { id: "proposal", label: "Proposal Sent", color: T.accent, bg: T.accentSoft },
  { id: "won", label: "Won", color: T.green, bg: T.greenSoft },
  { id: "lost", label: "Lost", color: T.red, bg: T.redSoft },
];

const CHANNELS = ["Email", "LinkedIn", "Phone", "In-person", "Referral", "Other"];

// ─── SEED DATA ── TEG COMPETITORS (UK Freight & Logistics Tech) ──────
const seedContacts = [
  // ── LARGE COMPETITORS ──────────────────────────────────────────────
  { id: 1, company: "Transporeon (Trimble)", contact: "", role: "Head of Product / Hiring Manager", email: "", phone: "", linkedin: "https://www.linkedin.com/company/transporeon/jobs", website: "https://www.transporeon.com/en/career", sector: "Freight Platform (Large)", notes: "Largest global freight network. 1,500+ shippers, 150K+ carriers, 220K daily transactions. €48bn freight spend/yr. Subsidiaries: Sixfold (visibility), Mercareon (retail), Ticontract (e-sourcing), ControlPay (freight audit/payment). 1,000+ employees. UK remote roles available. Glassdoor 3.8/5. Direct TEG competitor in freight sourcing, execution, audit & payments.", stage: "not_contacted", channel: "", priority: "high", logs: [] },
  { id: 2, company: "Microlise", contact: "", role: "Head of Product / Talent Acquisition", email: "enquiries@microlise.com", phone: "+44 (0)1773 537000", linkedin: "https://www.linkedin.com/company/microlise", website: "https://www.microlise.com/careers/", sector: "Fleet Telematics (Large)", notes: "AIM-listed (LON: SAAS.L). 2,500+ customers, 800+ employees (UK, France, Australia, India). 640K subscriptions/yr. Revenue ~$91.4M. CEO: Nadeem Raza. Products: Fleet telematics, planning & optimisation, tachograph analysis, ePOD, driver performance. Clients: Eddie Stobart, Carlsberg, Waitrose, Royal Mail, JCB. Great Place to Work certified. FP&A Manager role open. HQ: Farrington Eastwood Way, Nottingham NG16 3AG. Product Manager salary ~£49,696.", stage: "not_contacted", channel: "", priority: "high", logs: [] },
  { id: 3, company: "Aptean (Paragon Routing)", contact: "", role: "Product Manager / Head of Engineering", email: "info@paragonrouting.com", phone: "+44 (0)1306 732600", linkedin: "https://uk.linkedin.com/showcase/paragon-software-systems/", website: "https://www.paragonrouting.com/en-gb/", sector: "Route Optimisation (Large)", notes: "UK's #1 routing & scheduling provider. Founded 1991, acquired by Aptean March 2020. 4,700+ systems in 60+ countries. Products: Route optimisation, home delivery, ePOD, strategic planning. Clients: Whistl, John Lewis, George's Inc. New AI-native product 'Paragon Route 360' launched on AppCentral. HQ: Parsonage House, Dorking, Surrey RH4 1UP. Also offices in Hull, Dallas TX, Manchester NH.", stage: "not_contacted", channel: "", priority: "high", logs: [] },
  { id: 4, company: "Descartes Systems (UK)", contact: "", role: "Product / Engineering Lead", email: "", phone: "", linkedin: "https://www.linkedin.com/company/descartes-systems-group", website: "https://www.descartes.com/careers", sector: "Global TMS (Large)", notes: "Canadian-HQ'd global logistics tech. UK office. Products: TMS, customs compliance, route planning, fleet management, real-time visibility, B2B messaging. Clients include major UK retailers and logistics providers. Publicly traded (TSX: DSG). Direct TEG competitor in compliance and transport execution.", stage: "not_contacted", channel: "", priority: "high", logs: [] },
  { id: 5, company: "WiseTech Global (UK)", contact: "", role: "Product Manager / UK Hiring Manager", email: "", phone: "", linkedin: "https://www.linkedin.com/company/wisetech-global", website: "https://www.wisetechglobal.com/careers/", sector: "Global Logistics Platform (Large)", notes: "Australian-HQ'd. CargoWise platform — leading global logistics execution platform. UK office. Covers freight forwarding, customs, warehousing, transport. Publicly traded (ASX: WTC). Revenue AUD $1B+. 3,000+ employees globally. Direct competitor to TEG in integrated freight management.", stage: "not_contacted", channel: "", priority: "medium", logs: [] },

  // ── MEDIUM COMPETITORS ─────────────────────────────────────────────
  { id: 6, company: "Mandata", contact: "", role: "Head of Product / HR", email: "", phone: "+44 (0)191 250 2220", linkedin: "https://uk.linkedin.com/company/mandata", website: "https://www.mandata.co.uk/about-us/careers-2/", sector: "TMS Provider (Medium)", notes: "UK's leading TMS provider. 50+ years in market. Acquired Returnloads.net (June 2020 — freight exchange, direct TEG competitor). Products: Cloud TMS, route optimisation, ePOD, pallet network integrations. Cyber Essentials Plus, ISO 27001 & 9001. ACTIVELY HIRING: FP&A Manager (up to £45K), Implementation Consultant, Technical Support Analyst, Customer Support Apprentices, Lead Dev Executive. HQ: Newcastle Upon Tyne. Key names: Jack Hall (Lead Dev Exec), Sam Helme. Hybrid & flexible working, 25 days holiday.", stage: "not_contacted", channel: "", priority: "high", logs: [] },
  { id: 7, company: "Sorted Group", contact: "", role: "Head of People / VP Product", email: "", phone: "", linkedin: "https://www.linkedin.com/company/sorted-official", website: "https://sorted.com/about/jobs/", sector: "Delivery Experience (Medium)", notes: "Founded 2010, Manchester. Delivery experience platform for e-commerce. 60+ employees, remote-first with Manchester & London hubs. CEO: Carmen Carey. CTO: Peter Ennis (ex-AWS, The Hut Group). $40M Series C (2021). Clients: ASOS, Asda, Lush, Dyson. Products: Carrier management, shipping, delivery tracking, returns. 219% shipment growth since 2019. Glassdoor 3.9/5. Recruiting via Workable. HQ: 4th Floor, Blackfriars House, St Mary's Parsonage, Manchester M3 2JA.", stage: "not_contacted", channel: "", priority: "high", logs: [] },
  { id: 8, company: "Freight Logistics Solutions (FLS Group)", contact: "", role: "Group Data & Technology Director / HR", email: "info@freightlogisticssolutions.co.uk", phone: "01633 288400", linkedin: "https://uk.linkedin.com/company/freight-logistics-solutions", website: "https://flsgroup.co.uk/", sector: "Digital Freight Forwarder (Medium)", notes: "Founded 2016 (post-Brexit). 55,000+ vehicle network UK/Europe. 500+ active clients/month. FLS Freight Hub: AI load matching, real-time tracking, automated payments. Brands: FLS Forward, FLS Customs, Logiquanta. ACTIVELY HIRING: Account Manager, Customs Agent, Finance roles, IT & Cyber Manager, Senior Business Systems Manager. Expanding to Poland & Lithuania. Leadership: Dafydd Owain Rosser (MD FLS Connect), Gavin Clarke (Operations Director). Quotes email: quotes@freightlogisticssolutions.co.uk. HQ: Pontypool, South Wales NP4 0XZ. Also Monmouth & Silverstone offices.", stage: "not_contacted", channel: "", priority: "high", logs: [] },
  { id: 9, company: "Podfather", contact: "", role: "Managing Director / Hiring Manager", email: "", phone: "", linkedin: "https://uk.linkedin.com/company/podfather", website: "https://thepodfather.com/", sector: "Fleet & ePOD Software (Medium)", notes: "Founded 2000, Edinburgh. Cloud-based fleet logistics: route planning, optimisation, ePOD. MD: Colin McCreadie. 40 employees. Maven Capital invested £3.4M. Clients include HS2/LM-JV (construction logistics). Products: route planning, vehicle checks, real-time tracking, proof of delivery. Attends IntraLogisteX. HQ: Verdant 2, Redheughs Rigg, Edinburgh EH12 9DQ. Competes with TEG on ePOD and fleet management.", stage: "not_contacted", channel: "", priority: "medium", logs: [] },
  { id: 10, company: "project44 (UK)", contact: "", role: "Product Manager / UK Lead", email: "", phone: "", linkedin: "https://www.linkedin.com/company/project44", website: "https://www.project44.com/company/careers", sector: "Visibility Platform (Medium)", notes: "Chicago-HQ'd with UK operations. Leading supply chain visibility platform. Tracks shipments across ocean, air, road, rail, parcel. $420M+ raised. 1,200+ customers globally. Competes with TEG's Sixfold/Transporeon on real-time transport visibility. Strong product team. UK-based roles periodically available.", stage: "not_contacted", channel: "", priority: "medium", logs: [] },

  // ── SMALL / EMERGING COMPETITORS ───────────────────────────────────
  { id: 11, company: "Geo2 (Balloon One)", contact: "", role: "Head of Product / Founder", email: "", phone: "", linkedin: "https://uk.linkedin.com/company/geo2transportmanagementsystem", website: "https://geo2.com/", sector: "TMS & Route Optimisation (Small)", notes: "Founded 2017, relaunched 2023 as Geo2. Part of Balloon One (est. 2003, West London). Cloud TMS: route planning, ePOD, real-time tracking, fleet analytics, CO2 tracking. AI-powered route building. API integrations. Team in UK, Europe, Asia. Parent Balloon One also provides WMS, ERP solutions. Direct TEG competitor in transport management for SMEs.", stage: "not_contacted", channel: "", priority: "medium", logs: [] },
  { id: 12, company: "Returnloads.net (Mandata)", contact: "", role: "Platform Manager", email: "", phone: "+44 (0)191 250 2220", linkedin: "https://uk.linkedin.com/company/mandata", website: "https://www.returnloads.net/", sector: "Freight Exchange (Small)", notes: "UK freight exchange acquired by Mandata Group June 2020. Originally independent — DIRECTLY competes with TEG's Haulage Exchange (HX) and Courier Exchange (CX). Connects hauliers with backloads to reduce empty running. Now integrated into Mandata's TMS ecosystem. Offices: Newcastle & Tilbury. Contact via Mandata Group recruitment.", stage: "not_contacted", channel: "", priority: "medium", logs: [] },
  { id: 13, company: "TGMatrix", contact: "", role: "Founder / Director", email: "", phone: "", linkedin: "", website: "https://www.tgmatrix.com/", sector: "Freight Exchange (Small)", notes: "UK freight exchange platform. Direct competitor to TEG's Courier Exchange and Haulage Exchange. Connects shippers and carriers for load matching. Smaller player but niche competitor in the freight exchange space.", stage: "not_contacted", channel: "", priority: "low", logs: [] },
  { id: 14, company: "Freightex", contact: "", role: "Director / Hiring Manager", email: "", phone: "", linkedin: "", website: "https://www.freightex.com/", sector: "Freight Exchange (Small)", notes: "UK-based freight exchange platform. Competitors directly with TEG's core freight exchange products (CX, HX). Connects transport companies with available loads. Small team but relevant niche competitor.", stage: "not_contacted", channel: "", priority: "low", logs: [] },
  { id: 15, company: "Transport Exchange Group (TEG)", contact: "", role: "Product / Engineering Lead", email: "", phone: "+44 2089937100", linkedin: "https://www.linkedin.com/company/transport-exchange-group", website: "https://www.transportexchangegroup.com/", sector: "Freight Platform (Target)", notes: "THE TARGET COMPANY for competitive intelligence. Founded 2000. 8,500+ logistics providers, 38,625 active users, 51,216 vehicles, 2.5M movements/yr. Brands: Courier Exchange (CX), Haulage Exchange (HX), Integra. Products: Carrier Compliance, Carrier Sourcing, Transport Execution, Freight Audit, Integrated Payments, Analytics. HQ: 166 College Rd, London HA1 1BH. Tech: WordPress, PHP, reCAPTCHA, Cloudflare. Worth understanding their product gaps and team structure.", stage: "not_contacted", channel: "", priority: "low", logs: [] },
];

const LS_KEY = "outreach_contacts_teg_v2";
const loadContacts = () => { try { const d = localStorage.getItem(LS_KEY); return d ? JSON.parse(d) : seedContacts; } catch { return seedContacts; } };
const saveContacts = (c) => { try { localStorage.setItem(LS_KEY, JSON.stringify(c)); } catch {} };

// ─── COMPONENTS ───────────────────────────────────────────────────────
const Badge = ({ color, children, glow }) => (
  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6, color, background: glow || `${color}18`, textTransform: "uppercase", letterSpacing: "0.03em", whiteSpace: "nowrap" }}>{children}</span>
);

const Btn = ({ children, variant = "primary", size = "md", onClick, disabled, style: sx }) => {
  const base = { border: "none", borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer", fontWeight: 600, fontFamily: T.font, transition: "all 0.2s", opacity: disabled ? 0.5 : 1 };
  const sizes = { sm: { fontSize: 11, padding: "5px 10px" }, md: { fontSize: 12, padding: "8px 14px" } };
  const vars = {
    primary: { background: T.accent, color: "#fff" },
    success: { background: T.green, color: "#fff" },
    danger: { background: T.red, color: "#fff" },
    ghost: { background: "transparent", color: T.textSec, border: `1px solid ${T.border}` },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...vars[variant], ...sx }}>{children}</button>;
};

const Input = ({ label, value, onChange, placeholder, type = "text", textarea }) => (
  <div style={{ marginBottom: 10 }}>
    {label && <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: T.textMut, textTransform: "uppercase", marginBottom: 4 }}>{label}</label>}
    {textarea
      ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 10px", color: T.text, fontSize: 12, fontFamily: T.font, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
      : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 10px", color: T.text, fontSize: 12, fontFamily: T.font, outline: "none", boxSizing: "border-box" }} />
    }
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ marginBottom: 10 }}>
    {label && <label style={{ display: "block", fontSize: 10, fontWeight: 600, color: T.textMut, textTransform: "uppercase", marginBottom: 4 }}>{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 10px", color: T.text, fontSize: 12, fontFamily: T.font, outline: "none", boxSizing: "border-box" }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

// ─── PIPELINE VIEW ────────────────────────────────────────────────────
const PipelineView = ({ contacts, onSelect }) => {
  const active = STAGES.filter(s => s.id !== "won" && s.id !== "lost");
  return <div style={{ overflowX: "auto", paddingBottom: 8 }}>
    <div style={{ display: "flex", gap: 10, minWidth: active.length * 210 }}>
      {active.map(stage => {
        const items = contacts.filter(c => c.stage === stage.id);
        return <div key={stage.id} style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, padding: "0 4px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: stage.color }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: "0.05em" }}>{stage.label}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: T.textMut, background: T.surfaceAlt, borderRadius: 10, padding: "1px 7px", marginLeft: "auto" }}>{items.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {items.map(c => (
              <div key={c.id} onClick={() => onSelect(c)} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer", transition: "all 0.2s", borderLeft: `3px solid ${stage.color}` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "none"; }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 3 }}>{c.company}</div>
                {c.contact && <div style={{ fontSize: 11, color: T.textSec }}>{c.contact}{c.role ? ` · ${c.role}` : ""}</div>}
                <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                  <Badge color={{ high: T.red, medium: T.amber, low: T.textMut }[c.priority]}>{c.priority}</Badge>
                  {c.channel && <Badge color={T.accent}>{c.channel}</Badge>}
                </div>
                {c.logs.length > 0 && <div style={{ fontSize: 10, color: T.textMut, marginTop: 6, borderTop: `1px solid ${T.border}`, paddingTop: 5 }}>Last: {c.logs[c.logs.length - 1].date} — {c.logs[c.logs.length - 1].note.slice(0, 50)}{c.logs[c.logs.length - 1].note.length > 50 ? "..." : ""}</div>}
              </div>
            ))}
            {items.length === 0 && <div style={{ padding: "20px 12px", textAlign: "center", color: T.textMut, fontSize: 11, border: `1px dashed ${T.border}`, borderRadius: 10 }}>No contacts</div>}
          </div>
        </div>;
      })}
    </div>
  </div>;
};

// ─── LIST VIEW ────────────────────────────────────────────────────────
const ListView = ({ contacts, onSelect }) => (
  <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${T.border}` }}>
            {["Company", "Contact", "Sector", "Stage", "Priority", "Channel", "Last Activity"].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 10, color: T.textMut, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contacts.map(c => {
            const stage = STAGES.find(s => s.id === c.stage);
            const lastLog = c.logs.length > 0 ? c.logs[c.logs.length - 1] : null;
            return (
              <tr key={c.id} onClick={() => onSelect(c)} style={{ borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = T.surfaceAlt}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{c.company}</div>
                  {c.website && <div style={{ fontSize: 10, color: T.accent, marginTop: 1 }}>{c.website.replace(/https?:\/\/(www\.)?/, "").split("/")[0]}</div>}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ fontSize: 12, color: T.text }}>{c.contact || "—"}</div>
                  <div style={{ fontSize: 10, color: T.textMut }}>{c.role || ""}</div>
                </td>
                <td style={{ padding: "10px 12px", fontSize: 12, color: T.textSec }}>{c.sector}</td>
                <td style={{ padding: "10px 12px" }}><Badge color={stage.color} glow={stage.bg}>{stage.label}</Badge></td>
                <td style={{ padding: "10px 12px" }}><Badge color={{ high: T.red, medium: T.amber, low: T.textMut }[c.priority]}>{c.priority}</Badge></td>
                <td style={{ padding: "10px 12px", fontSize: 12, color: T.textSec }}>{c.channel || "—"}</td>
                <td style={{ padding: "10px 12px", fontSize: 11, color: T.textMut }}>{lastLog ? `${lastLog.date}` : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── CONTACT DETAIL / EDITOR ──────────────────────────────────────────
const ContactDetail = ({ contact, onSave, onDelete, onBack }) => {
  const [c, setC] = useState({ ...contact });
  const [newLog, setNewLog] = useState("");
  const [logDate, setLogDate] = useState(new Date().toISOString().split("T")[0]);

  const upd = (k, v) => setC(p => ({ ...p, [k]: v }));
  const addLog = () => {
    if (!newLog.trim()) return;
    const log = { id: Date.now(), date: logDate, note: newLog.trim() };
    const updated = { ...c, logs: [...c.logs, log] };
    setC(updated);
    onSave(updated);
    setNewLog("");
  };
  const removeLog = (lid) => {
    const updated = { ...c, logs: c.logs.filter(l => l.id !== lid) };
    setC(updated);
    onSave(updated);
  };

  return <div>
    <button onClick={onBack} style={{ background: "none", border: "none", color: T.accent, cursor: "pointer", fontSize: 12, fontWeight: 600, padding: 0, marginBottom: 14, display: "flex", alignItems: "center", gap: 4, fontFamily: T.font }}>
      <span style={{ fontSize: 16 }}>←</span> Back to contacts
    </button>

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0, letterSpacing: "-0.02em" }}>{c.company || "New Contact"}</h2>
        {c.website && <a href={c.website} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: T.accent, textDecoration: "none" }}>{c.website.replace(/https?:\/\/(www\.)?/, "").split("/")[0]} ↗</a>}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <Btn variant="success" onClick={() => onSave(c)}>Save</Btn>
        {contact.id && <Btn variant="danger" onClick={() => { if (confirm("Delete this contact?")) onDelete(c.id); }}>Delete</Btn>}
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* Left: Details */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Contact Details</h3>
        <Input label="Company" value={c.company} onChange={v => upd("company", v)} placeholder="Company name" />
        <Input label="Contact Person" value={c.contact} onChange={v => upd("contact", v)} placeholder="Full name" />
        <Input label="Role / Title" value={c.role} onChange={v => upd("role", v)} placeholder="e.g. Head of Product" />
        <Input label="Email" value={c.email} onChange={v => upd("email", v)} placeholder="email@company.com" type="email" />
        <Input label="Phone" value={c.phone} onChange={v => upd("phone", v)} placeholder="+44..." />
        <Input label="LinkedIn" value={c.linkedin} onChange={v => upd("linkedin", v)} placeholder="LinkedIn profile URL" />
        <Input label="Website" value={c.website} onChange={v => upd("website", v)} placeholder="https://..." />
        <Input label="Sector" value={c.sector} onChange={v => upd("sector", v)} placeholder="e.g. Freight, 3PL" />
        <Input label="Notes" value={c.notes} onChange={v => upd("notes", v)} textarea placeholder="Key info about this company..." />
      </div>

      {/* Right: Stage + Logs */}
      <div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, marginBottom: 12 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pipeline Status</h3>
          <Select label="Stage" value={c.stage} onChange={v => upd("stage", v)} options={STAGES.map(s => ({ value: s.id, label: s.label }))} />
          <Select label="Priority" value={c.priority} onChange={v => upd("priority", v)} options={[{ value: "high", label: "High" }, { value: "medium", label: "Medium" }, { value: "low", label: "Low" }]} />
          <Select label="Channel" value={c.channel} onChange={v => upd("channel", v)} options={[{ value: "", label: "Select..." }, ...CHANNELS.map(ch => ({ value: ch, label: ch }))]} />

          {/* Stage progress */}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: T.textMut, textTransform: "uppercase", marginBottom: 6 }}>Progress</div>
            <div style={{ display: "flex", gap: 3 }}>
              {STAGES.map((s, i) => {
                const currentIdx = STAGES.findIndex(st => st.id === c.stage);
                const isActive = i <= currentIdx;
                return <div key={s.id} style={{ flex: 1, height: 6, borderRadius: 3, background: isActive ? s.color : `${T.textMut}22`, transition: "all 0.3s" }} title={s.label} />;
              })}
            </div>
          </div>
        </div>

        {/* Communication Log */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Communication Log ({c.logs.length})</h3>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <input type="date" value={logDate} onChange={e => setLogDate(e.target.value)} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "6px 8px", color: T.text, fontSize: 11, fontFamily: T.font, outline: "none" }} />
            <input value={newLog} onChange={e => setNewLog(e.target.value)} placeholder="Add note..." onKeyDown={e => e.key === "Enter" && addLog()} style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "6px 10px", color: T.text, fontSize: 12, fontFamily: T.font, outline: "none" }} />
            <Btn size="sm" onClick={addLog} disabled={!newLog.trim()}>Add</Btn>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 280, overflowY: "auto" }}>
            {c.logs.length === 0 && <div style={{ textAlign: "center", padding: "16px 0", color: T.textMut, fontSize: 12 }}>No communications logged yet</div>}
            {[...c.logs].reverse().map(log => (
              <div key={log.id} style={{ background: T.surface, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${T.accent}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: T.accent }}>{log.date}</span>
                  <button onClick={() => removeLog(log.id)} style={{ background: "none", border: "none", color: T.textMut, cursor: "pointer", fontSize: 12, padding: 0, fontFamily: T.font }}>×</button>
                </div>
                <div style={{ fontSize: 12, color: T.textSec, marginTop: 3, lineHeight: 1.5 }}>{log.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>;
};

// ─── STATS DASHBOARD ──────────────────────────────────────────────────
const Stats = ({ contacts }) => {
  const bySt = STAGES.map(s => ({ ...s, count: contacts.filter(c => c.stage === s.id).length }));
  const total = contacts.length;
  const contacted = contacts.filter(c => c.stage !== "not_contacted").length;
  const active = contacts.filter(c => !["won", "lost", "not_contacted"].includes(c.stage)).length;
  const won = contacts.filter(c => c.stage === "won").length;
  const convRate = contacted > 0 ? ((won / contacted) * 100).toFixed(0) : 0;
  const totalLogs = contacts.reduce((s, c) => s + c.logs.length, 0);
  const byPriority = { high: contacts.filter(c => c.priority === "high").length, medium: contacts.filter(c => c.priority === "medium").length, low: contacts.filter(c => c.priority === "low").length };

  return <div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 16 }}>
      {[
        { label: "Total Contacts", value: total, color: T.text },
        { label: "Contacted", value: contacted, color: T.blue },
        { label: "Active Pipeline", value: active, color: T.amber },
        { label: "Won", value: won, color: T.green },
        { label: "Conversion", value: `${convRate}%`, color: T.accent },
        { label: "Interactions", value: totalLogs, color: T.cyan },
      ].map(s => (
        <div key={s.label} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: T.textMut, textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</div>
        </div>
      ))}
    </div>

    {/* Funnel */}
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, marginBottom: 12 }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: "0 0 14px" }}>Pipeline Funnel</h3>
      {bySt.map(s => (
        <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: T.textSec, width: 110, flexShrink: 0, textAlign: "right" }}>{s.label}</span>
          <div style={{ flex: 1, height: 20, background: `${T.textMut}15`, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${total > 0 ? (s.count / total) * 100 : 0}%`, background: s.color, borderRadius: 6, transition: "width 0.5s ease", minWidth: s.count > 0 ? 20 : 0, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6 }}>
              {s.count > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{s.count}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Priority breakdown */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: "0 0 10px" }}>By Priority</h3>
        {Object.entries(byPriority).map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>
            <Badge color={{ high: T.red, medium: T.amber, low: T.textMut }[k]}>{k}</Badge>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: "0 0 10px" }}>Recent Activity</h3>
        {contacts.filter(c => c.logs.length > 0).sort((a, b) => {
          const aL = a.logs[a.logs.length - 1]?.date || "";
          const bL = b.logs[b.logs.length - 1]?.date || "";
          return bL.localeCompare(aL);
        }).slice(0, 5).map(c => (
          <div key={c.id} style={{ padding: "5px 0", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{c.company}</div>
            <div style={{ fontSize: 10, color: T.textMut }}>{c.logs[c.logs.length - 1]?.date} — {c.logs[c.logs.length - 1]?.note.slice(0, 40)}...</div>
          </div>
        ))}
        {contacts.filter(c => c.logs.length > 0).length === 0 && <div style={{ textAlign: "center", padding: "12px 0", color: T.textMut, fontSize: 12 }}>No activity yet</div>}
      </div>
    </div>
  </div>;
};

// ─── MAIN APP ─────────────────────────────────────────────────────────
export default function App() {
  const [contacts, setContacts] = useState(loadContacts);
  const [view, setView] = useState("pipeline"); // pipeline | list | stats | detail | new
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sb, setSb] = useState(false);

  useEffect(() => { saveContacts(contacts); }, [contacts]);

  const filtered = contacts.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.company.toLowerCase().includes(q) || c.contact.toLowerCase().includes(q) || c.sector.toLowerCase().includes(q) || c.notes.toLowerCase().includes(q);
    const matchStage = filterStage === "all" || c.stage === filterStage;
    const matchPri = filterPriority === "all" || c.priority === filterPriority;
    return matchSearch && matchStage && matchPri;
  });

  const saveContact = (c) => {
    if (c.id) {
      setContacts(p => p.map(x => x.id === c.id ? c : x));
    } else {
      const newC = { ...c, id: Date.now(), logs: [] };
      setContacts(p => [...p, newC]);
      setSelected(newC);
    }
  };
  const deleteContact = (id) => { setContacts(p => p.filter(c => c.id !== id)); setView("list"); setSelected(null); };
  const openDetail = (c) => { setSelected(c); setView("detail"); setSb(false); };
  const newContact = () => { setSelected({ id: 0, company: "", contact: "", role: "", email: "", phone: "", linkedin: "", website: "", sector: "", notes: "", stage: "not_contacted", channel: "", priority: "medium", logs: [] }); setView("detail"); };
  const resetData = () => { if (confirm("Reset all contacts to defaults? This cannot be undone.")) { setContacts(seedContacts); setView("pipeline"); setSelected(null); } };

  const tabs = [
    { id: "pipeline", label: "Pipeline", icon: "⚡" },
    { id: "list", label: "All Contacts", icon: "📋" },
    { id: "stats", label: "Dashboard", icon: "📊" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.font }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Top Bar */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 52, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setSb(!sb)} className="hamburger" style={{ background: "none", border: "none", color: T.textSec, cursor: "pointer", display: "none", padding: 2 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
          </button>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${T.accent}, ${T.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff" }}>O</div>
          <div>
            <span style={{ fontSize: 15, fontWeight: 800, color: T.text, letterSpacing: "-0.01em" }}>OutreachTracker</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: T.accent, background: T.accentSoft, padding: "1px 6px", borderRadius: 4, marginLeft: 6 }}>CRM</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Btn variant="ghost" size="sm" onClick={resetData}>Reset</Btn>
          <Btn size="sm" onClick={newContact}>+ Add Contact</Btn>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 52px)" }}>
        {/* Sidebar overlay */}
        {sb && <div onClick={() => setSb(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200 }} className="sbo" />}

        {/* Sidebar */}
        <div className="sb" style={{ width: 180, background: T.surface, borderRight: `1px solid ${T.border}`, padding: "14px 8px", flexShrink: 0, zIndex: 201, overflowY: "auto" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.textMut, textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 8px", marginBottom: 8 }}>Views</div>
          {tabs.map(t => (
            <button key={t.id} onClick={() => { setView(t.id); setSelected(null); setSb(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, border: "none", background: view === t.id || (view === "detail" && t.id === "list") ? T.accentSoft : "transparent", color: view === t.id || (view === "detail" && t.id === "list") ? T.accent : T.textSec, cursor: "pointer", fontSize: 12, fontWeight: 600, marginBottom: 2, textAlign: "left", fontFamily: T.font }}>
              <span style={{ fontSize: 14 }}>{t.icon}</span>{t.label}
            </button>
          ))}

          <div style={{ fontSize: 9, fontWeight: 700, color: T.textMut, textTransform: "uppercase", letterSpacing: "0.1em", padding: "14px 8px 6px" }}>Quick Filters</div>
          {STAGES.slice(0, 5).map(s => {
            const count = contacts.filter(c => c.stage === s.id).length;
            return <button key={s.id} onClick={() => { setFilterStage(filterStage === s.id ? "all" : s.id); setView("list"); setSb(false); }} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 12px", borderRadius: 6, border: "none", background: filterStage === s.id ? s.bg : "transparent", color: filterStage === s.id ? s.color : T.textMut, cursor: "pointer", fontSize: 11, fontWeight: 600, marginBottom: 1, fontFamily: T.font }}>
              <span>{s.label}</span>
              <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.7 }}>{count}</span>
            </button>;
          })}

          <div style={{ borderTop: `1px solid ${T.border}`, margin: "14px 8px 8px", paddingTop: 10 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: T.textMut, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Summary</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.accent }}>{contacts.length}</div>
            <div style={{ fontSize: 10, color: T.textMut }}>Total contacts</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.green, marginTop: 6 }}>{contacts.filter(c => c.stage !== "not_contacted").length}</div>
            <div style={{ fontSize: 10, color: T.textMut }}>Contacted</div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "18px 24px", overflowY: "auto", maxWidth: 1100 }}>
          {view !== "detail" && <>
            {/* Search + Filters */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies, contacts, sectors..." style={{ width: "100%", background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", color: T.text, fontSize: 13, fontFamily: T.font, outline: "none", boxSizing: "border-box" }} />
              </div>
              <select value={filterStage} onChange={e => setFilterStage(e.target.value)} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 12px", color: T.text, fontSize: 12, fontFamily: T.font, outline: "none" }}>
                <option value="all">All Stages</option>
                {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 12px", color: T.text, fontSize: 12, fontFamily: T.font, outline: "none" }}>
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </>}

          {view === "pipeline" && <>
            <div style={{ marginBottom: 14 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0, letterSpacing: "-0.02em" }}>Outreach Pipeline</h1>
              <p style={{ fontSize: 12, color: T.textMut, margin: "4px 0 0" }}>Track your TEG competitor outreach campaign</p>
            </div>
            <PipelineView contacts={filtered} onSelect={openDetail} />
          </>}

          {view === "list" && <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0, letterSpacing: "-0.02em" }}>All Contacts</h1>
                <p style={{ fontSize: 12, color: T.textMut, margin: "4px 0 0" }}>{filtered.length} of {contacts.length} contacts</p>
              </div>
              <Btn onClick={newContact}>+ Add Contact</Btn>
            </div>
            <ListView contacts={filtered} onSelect={openDetail} />
          </>}

          {view === "stats" && <>
            <div style={{ marginBottom: 14 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0, letterSpacing: "-0.02em" }}>Campaign Dashboard</h1>
              <p style={{ fontSize: 12, color: T.textMut, margin: "4px 0 0" }}>Overview of your outreach performance</p>
            </div>
            <Stats contacts={contacts} />
          </>}

          {view === "detail" && selected && <ContactDetail contact={selected} onSave={saveContact} onDelete={deleteContact} onBack={() => { setView("list"); setSelected(null); }} />}
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .hamburger{display:block!important}
          .sb{position:fixed!important;top:52px;left:0;bottom:0;transform:${sb ? "translateX(0)" : "translateX(-100%)"}!important;transition:transform .3s!important}
          .sbo{display:${sb ? "block" : "none"}}
        }
        @media(min-width:769px){
          .sbo{display:none!important}
          .hamburger{display:none!important}
        }
        ::selection{background:${T.accentGlow};color:${T.text}}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:${T.borderHover}}
      `}</style>
    </div>
  );
}
