import { ArrowDownRight, ArrowUpRight, PiggyBank, Wallet } from "lucide-react";

const kpis = [
  { label: "Ingresos del mes", value: "$ 3.840", icon: ArrowUpRight, tone: "text-emerald-dark" },
  { label: "Gastos del mes", value: "$ 2.115", icon: ArrowDownRight, tone: "text-destructive" },
  { label: "Ganancia del mes", value: "$ 1.725", icon: PiggyBank, tone: "text-emerald-dark" },
  { label: "Saldo disponible", value: "$ 5.230", icon: Wallet, tone: "text-navy" },
];
const bars = [
  { m: "Jun", i: 62, g: 48 },
  { m: "Jul", i: 70, g: 52 },
  { m: "Ago", i: 58, g: 50 },
  { m: "Sep", i: 78, g: 55 },
  { m: "Oct", i: 84, g: 57 },
  { m: "Nov", i: 92, g: 54 },
];

export function DashboardMockup() {
  return (
    <div className="rounded-3xl border border-grid bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Dashboard Ejecutivo</p>
          <p className="font-display text-sm font-bold text-navy">Noviembre</p>
        </div>
        <span className="rounded-full bg-emerald-soft px-2.5 py-1 text-[10px] font-bold text-emerald-dark">
          Ejemplo visual — datos ficticios
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-grid p-3">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <k.icon className={`h-3.5 w-3.5 ${k.tone}`} />
              {k.label}
            </div>
            <p className={`mt-1 font-display text-lg font-bold ${k.tone}`}>{k.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs">
          <span className="font-semibold text-navy">Meta del mes</span>
          <span className="font-bold text-emerald-dark">72%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-grid">
          <div className="h-full w-[72%] rounded-full bg-emerald" />
        </div>
      </div>
      <div className="mt-5">
        <div className="mb-2 flex gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-emerald" />Ingresos</span>
          <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-navy" />Gastos</span>
        </div>
        <div className="flex h-28 items-end justify-between gap-2 border-b border-grid">
          {bars.map((b) => (
            <div key={b.m} className="flex flex-1 flex-col items-center">
              <div className="flex h-24 w-full items-end justify-center gap-0.5">
                <div className="w-1/3 rounded-t bg-emerald" style={{ height: `${b.i}%` }} />
                <div className="w-1/3 rounded-t bg-navy" style={{ height: `${b.g}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          {bars.map((b) => (
            <span key={b.m} className="flex-1 text-center">{b.m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const rows = [
  { d: "08/11", desc: "Torta de cumpleaños", t: "in", v: "+ $ 85" },
  { d: "07/11", desc: "Harina y azúcar", t: "out", v: "- $ 42" },
  { d: "06/11", desc: "Pedido 24 cupcakes", t: "in", v: "+ $ 60" },
  { d: "05/11", desc: "Gas de cocina", t: "out", v: "- $ 18" },
];

export function CashFlowMockup() {
  return (
    <div className="rounded-3xl border border-grid bg-card p-4 text-left shadow-[var(--shadow-card)]">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-sm font-bold text-navy">Flujo de Caja</p>
        <p className="text-xs text-muted-foreground">Saldo: <b className="text-emerald-dark">$ 5.230</b></p>
      </div>
      <div className="divide-y divide-grid text-sm">
        {rows.map((r) => (
          <div key={r.desc} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{r.d}</span>
              <span className="text-navy">{r.desc}</span>
            </div>
            <span className={`font-bold ${r.t === "in" ? "text-emerald-dark" : "text-destructive"}`}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
