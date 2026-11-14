import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight, BarChart3, Boxes, CalendarDays, CalendarRange, ClipboardList, Gauge, HandCoins,
  LayoutDashboard, Lock, Menu, Receipt, RotateCcw, Target, Users, Wallet, X,
} from "lucide-react";
import { CURRENCIES, DemoProvider, useDemo } from "@/components/demo/demo-store";
import { Cuentas, Dashboard, FlujoCaja, Inventario, Locked, Metas } from "@/components/demo/Screens";
import { useSalesTracking } from "@/hooks/use-sales-tracking";

const TITLE = "Demo de Dinero Inteligente — Pruébalo sin registrarte";
const DESC = "Explora una cuenta de ejemplo con datos ficticios: dashboard, flujo de caja, cobros, pagos, inventario y metas.";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DemoPage,
});

const MENU = [
  { id: "dash", n: "Dashboard Ejecutivo", icon: LayoutDashboard },
  { id: "flujo", n: "Flujo de Caja", icon: Wallet },
  { id: "cobrar", n: "Cuentas por Cobrar", icon: HandCoins },
  { id: "pagar", n: "Cuentas por Pagar", icon: Receipt },
  { id: "diario", n: "Control Diario", icon: ClipboardList, locked: true },
  { id: "semanal", n: "Planificador Semanal", icon: CalendarDays, locked: true },
  { id: "mensual", n: "Planificador Mensual", icon: CalendarRange, locked: true },
  { id: "inv", n: "Inventario", icon: Boxes },
  { id: "clientes", n: "Clientes", icon: Users, locked: true },
  { id: "metas", n: "Metas", icon: Target },
  { id: "ind", n: "Indicadores", icon: Gauge, locked: true },
];

function DemoPage() {
  useSalesTracking(true);
  return (
    <DemoProvider>
      <Shell />
    </DemoProvider>
  );
}

function Sidebar({ active, go }: { active: string; go: (id: string) => void }) {
  const { currency, setCurrency } = useDemo();
  return (
    <div className="flex h-full flex-col bg-navy text-primary-foreground">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald"><BarChart3 className="h-5 w-5" /></span>
        <div>
          <p className="font-display text-sm font-bold">Centro de Control</p>
          <p className="text-xs opacity-70">Dinero con Foco™</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {MENU.map((m) => (
          <button key={m.id} onClick={() => go(m.id)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${active === m.id ? "bg-emerald font-bold" : "opacity-85 hover:bg-navy-soft"}`}>
            <m.icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{m.n}</span>
            {m.locked && <Lock className="h-3.5 w-3.5 opacity-60" />}
          </button>
        ))}
      </nav>
      <div className="border-t border-primary-foreground/15 p-4">
        <label className="text-xs opacity-70">Moneda: {currency}</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}
          className="mt-1 w-full rounded-lg bg-navy-soft px-3 py-2 text-sm text-primary-foreground">
          {Object.keys(CURRENCIES).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <p className="mt-3 text-center text-xs opacity-60">Datos ficticios · Demo</p>
      </div>
    </div>
  );
}

function Shell() {
  const { reset } = useDemo();
  const [active, setActive] = useState("dash");
  const [open, setOpen] = useState(false);
  const go = (id: string) => { setActive(id); setOpen(false); window.scrollTo(0, 0); };
  const item = MENU.find((m) => m.id === active)!;

  let screen: React.ReactNode;
  if (item.locked) screen = <Locked name={item.n} />;
  else if (active === "dash") screen = <Dashboard />;
  else if (active === "flujo") screen = <FlujoCaja />;
  else if (active === "cobrar") screen = <Cuentas kind="cobrar" />;
  else if (active === "pagar") screen = <Cuentas kind="pagar" />;
  else if (active === "inv") screen = <Inventario />;
  else screen = <Metas />;

  return (
    <div className="min-h-screen bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] lg:block"><Sidebar active={active} go={go} /></aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw]">
            <button aria-label="Cerrar menú" onClick={() => setOpen(false)} className="absolute right-3 top-5 z-10 text-primary-foreground"><X className="h-5 w-5" /></button>
            <Sidebar active={active} go={go} />
          </div>
        </div>
      )}
      <div className="lg:pl-[280px]">
        <div className="sticky top-0 z-20">
          <div className="flex flex-wrap items-center justify-center gap-2 bg-emerald-soft px-4 py-2 text-center text-xs font-semibold text-navy sm:text-sm">
            <span>Estás en una demo con datos ficticios. Nada de lo que hagas se guarda.</span>
            <a href="/#planes" className="rounded-full bg-emerald px-3 py-1 font-bold text-primary-foreground">Ver planes</a>
            <button onClick={reset} className="inline-flex items-center gap-1 rounded-full border border-navy px-3 py-1 font-bold"><RotateCcw className="h-3 w-3" /> Reiniciar demo</button>
          </div>
          <header className="flex items-center gap-3 border-b border-grid bg-navy px-4 py-3 text-primary-foreground lg:hidden">
            <button aria-label="Abrir menú" onClick={() => setOpen(true)}><Menu className="h-6 w-6" /></button>
            <span className="font-display text-sm font-bold">Centro de Control</span>
          </header>
        </div>
        <main className="mx-auto max-w-6xl px-4 py-6 pb-28 sm:px-6">{screen}</main>
      </div>
      <a href="/#planes" className="btn-cta fixed bottom-4 right-4 z-40 !py-3 text-xs sm:text-sm">
        Quiero mi acceso — ver planes <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}
