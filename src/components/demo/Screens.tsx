import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Lock, Plus, ArrowRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { currentMonth, isOverdue, monthKey, today, useDemo, type Cuenta } from "./demo-store";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-grid bg-card p-4 sm:p-5 ${className}`}>{children}</div>;
}
function Title({ t, sub }: { t: string; sub?: string }) {
  return (
    <div className="mb-5">
      <h1 className="text-2xl font-bold text-navy">{t}</h1>
      {sub && <p className="text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}
const fecha = (f: string) => f.split("-").reverse().join("/");

function useTotals() {
  const { movs } = useDemo();
  return useMemo(() => {
    const cm = currentMonth();
    let ing = 0, gas = 0, saldo = 0;
    for (const m of movs) {
      const v = m.tipo === "ingreso" ? m.monto : -m.monto;
      saldo += v;
      if (monthKey(m.fecha) === cm) m.tipo === "ingreso" ? (ing += m.monto) : (gas += m.monto);
    }
    return { ing, gas, gan: ing - gas, saldo };
  }, [movs]);
}

export function Dashboard() {
  const { fmt, movs, cobrar, pagar, metas } = useDemo();
  const t = useTotals();
  const chart = useMemo(() => {
    const map = new Map<string, { mes: string; Ingresos: number; Gastos: number }>();
    for (const m of [...movs].sort((a, b) => a.fecha.localeCompare(b.fecha))) {
      const k = monthKey(m.fecha);
      if (!map.has(k)) map.set(k, { mes: MESES[Number(k.slice(5)) - 1] ?? k, Ingresos: 0, Gastos: 0 });
      const r = map.get(k)!;
      m.tipo === "ingreso" ? (r.Ingresos += m.monto) : (r.Gastos += m.monto);
    }
    return [...map.values()].slice(-6);
  }, [movs]);
  const meta = metas[0]!;
  const pct = Math.min(100, Math.round((t.ing / meta.objetivo) * 100));
  const alerts: string[] = [];
  const vc = cobrar.filter(isOverdue), vp = pagar.filter(isOverdue);
  if (vc.length) alerts.push(`${vc.length} cobro(s) vencido(s) por ${fmt(vc.reduce((a, c) => a + c.monto, 0))}`);
  if (vp.length) alerts.push(`${vp.length} pago(s) vencido(s) por ${fmt(vp.reduce((a, c) => a + c.monto, 0))}`);
  if (t.saldo < 0) alerts.push("Tu saldo disponible es negativo");

  return (
    <div>
      <Title t="Dashboard Ejecutivo" sub="Dulces Mari · mes actual" />
      {alerts.length ? (
        <div className="mb-5 space-y-2">
          {alerts.map((a) => (
            <div key={a} className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" /> {a}
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald bg-emerald-soft px-4 py-3 text-sm font-semibold text-emerald-dark">
          <CheckCircle2 className="h-4 w-4" /> Sin alertas críticas. Tus números están bajo control.
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Ingresos del mes", t.ing, "text-emerald-dark"],
          ["Gastos del mes", t.gas, "text-destructive"],
          ["Ganancia del mes", t.gan, t.gan >= 0 ? "text-emerald-dark" : "text-destructive"],
          ["Saldo disponible", t.saldo, t.saldo >= 0 ? "text-navy" : "text-destructive"],
        ].map(([l, v, c]) => (
          <Card key={l as string}>
            <p className="text-xs text-muted-foreground">{l as string}</p>
            <p className={`mt-1 font-display text-lg font-bold sm:text-xl ${c}`}>{fmt(v as number)}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-4">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-semibold text-navy">Meta mensual: {meta.nombre} ({fmt(meta.objetivo)})</span>
          <span className="font-bold text-emerald-dark">{pct}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-grid">
          <div className="h-full rounded-full bg-emerald transition-all" style={{ width: `${pct}%` }} />
        </div>
      </Card>
      <Card className="mt-4">
        <p className="mb-3 font-semibold text-navy">Ingresos vs gastos por mes</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" fontSize={12} />
              <YAxis fontSize={12} width={45} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Legend />
              <Bar dataKey="Ingresos" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Gastos" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function NewMovDialog() {
  const { addMov } = useDemo();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ tipo: "ingreso" as "ingreso" | "egreso", monto: "", categoria: "Ventas", fecha: today(), desc: "" });
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const monto = Number(f.monto);
    if (!monto || monto <= 0) return;
    addMov({ ...f, monto, desc: f.desc || (f.tipo === "ingreso" ? "Ingreso" : "Egreso") });
    setOpen(false);
    setF({ tipo: "ingreso", monto: "", categoria: "Ventas", fecha: today(), desc: "" });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn-cta !px-5 !py-3"><Plus className="h-4 w-4" /> Nuevo movimiento</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nuevo movimiento</DialogTitle></DialogHeader>
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {(["ingreso", "egreso"] as const).map((t) => (
              <button type="button" key={t} onClick={() => setF({ ...f, tipo: t, categoria: t === "ingreso" ? "Ventas" : "Insumos" })}
                className={`rounded-xl border-2 py-2.5 text-sm font-bold capitalize ${f.tipo === t ? "border-emerald bg-emerald-soft text-emerald-dark" : "border-grid text-muted-foreground"}`}>
                {t}
              </button>
            ))}
          </div>
          <div><Label>Monto</Label><Input type="number" min="0" step="0.01" required value={f.monto} onChange={(e) => setF({ ...f, monto: e.target.value })} /></div>
          <div><Label>Categoría</Label><Input value={f.categoria} onChange={(e) => setF({ ...f, categoria: e.target.value })} /></div>
          <div><Label>Fecha</Label><Input type="date" required value={f.fecha} onChange={(e) => setF({ ...f, fecha: e.target.value })} /></div>
          <div><Label>Descripción</Label><Input value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} /></div>
          <button type="submit" className="btn-cta w-full">Guardar</button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function FlujoCaja() {
  const { movs, fmt } = useDemo();
  const t = useTotals();
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <Title t="Flujo de Caja" sub="Entradas, salidas y saldo real" />
        <NewMovDialog />
      </div>
      <div className="mb-4 grid grid-cols-3 gap-3">
        <Card><p className="text-xs text-muted-foreground">Ingresos del mes</p><p className="font-bold text-emerald-dark">{fmt(t.ing)}</p></Card>
        <Card><p className="text-xs text-muted-foreground">Egresos del mes</p><p className="font-bold text-destructive">{fmt(t.gas)}</p></Card>
        <Card><p className="text-xs text-muted-foreground">Saldo</p><p className="font-bold text-navy">{fmt(t.saldo)}</p></Card>
      </div>
      <Card className="!p-0 overflow-hidden">
        <div className="max-h-[60vh] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted text-left text-xs text-muted-foreground">
              <tr><th className="p-3">Fecha</th><th className="p-3">Descripción</th><th className="hidden p-3 sm:table-cell">Categoría</th><th className="p-3 text-right">Monto</th></tr>
            </thead>
            <tbody>
              {movs.map((m) => (
                <tr key={m.id} className="border-t border-grid">
                  <td className="whitespace-nowrap p-3 text-muted-foreground">{fecha(m.fecha)}</td>
                  <td className="p-3 text-navy">{m.desc}</td>
                  <td className="hidden p-3 text-muted-foreground sm:table-cell">{m.categoria}</td>
                  <td className={`whitespace-nowrap p-3 text-right font-bold ${m.tipo === "ingreso" ? "text-emerald-dark" : "text-destructive"}`}>
                    {m.tipo === "ingreso" ? "+" : "-"} {fmt(m.monto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Status({ c, kind }: { c: Cuenta; kind: "cobrar" | "pagar" }) {
  if (c.pagada) return <span className="rounded-full bg-emerald-soft px-2.5 py-1 text-xs font-bold text-emerald-dark">{kind === "cobrar" ? "Cobrada" : "Pagada"}</span>;
  if (isOverdue(c)) return <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-bold text-destructive">Vencida</span>;
  return <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-navy-soft">Pendiente</span>;
}

export function Cuentas({ kind }: { kind: "cobrar" | "pagar" }) {
  const d = useDemo();
  const list = d[kind];
  const pend = list.filter((c) => !c.pagada).reduce((a, c) => a + c.monto, 0);
  return (
    <div>
      <Title t={kind === "cobrar" ? "Cuentas por Cobrar" : "Cuentas por Pagar"} sub={kind === "cobrar" ? "Quién te debe y cuánto falta cobrar" : "Lo que debes y cuándo vence"} />
      <Card className="mb-4"><p className="text-xs text-muted-foreground">Total pendiente</p><p className="font-display text-xl font-bold text-navy">{d.fmt(pend)}</p></Card>
      <div className="space-y-3">
        {list.map((c) => (
          <Card key={c.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold text-navy">{c.nombre}</p>
              <p className="text-sm text-muted-foreground">{c.concepto} · vence {fecha(c.vence)}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-navy">{d.fmt(c.monto)}</span>
              <Status c={c} kind={kind} />
              {!c.pagada && (
                <button onClick={() => d.settle(kind, c.id)} className="rounded-full bg-navy px-3 py-1.5 text-xs font-bold text-primary-foreground">
                  Marcar como {kind === "cobrar" ? "cobrada" : "pagada"}
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function Inventario() {
  const { productos, fmt } = useDemo();
  const total = productos.reduce((a, p) => a + p.stock * p.costo, 0);
  return (
    <div>
      <Title t="Inventario" sub="Valor de tu stock y alertas de mínimos" />
      <Card className="mb-4"><p className="text-xs text-muted-foreground">Valor total del stock</p><p className="font-display text-xl font-bold text-navy">{fmt(total)}</p></Card>
      <div className="space-y-2">
        {productos.map((p) => {
          const low = p.stock < p.minimo;
          return (
            <Card key={p.id} className={`flex items-center justify-between gap-3 ${low ? "!border-destructive/40 !bg-destructive/5" : ""}`}>
              <div>
                <p className="font-bold text-navy">{p.nombre}</p>
                <p className="text-xs text-muted-foreground">Stock {p.stock} · mínimo {p.minimo} · costo {fmt(p.costo)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-navy">{fmt(p.stock * p.costo)}</p>
                {low && <p className="flex items-center gap-1 text-xs font-bold text-destructive"><AlertTriangle className="h-3 w-3" /> Bajo el mínimo</p>}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function Metas() {
  const { metas, setMeta, fmt } = useDemo();
  const t = useTotals();
  return (
    <div>
      <Title t="Metas" sub="Objetivos con avance automático" />
      <div className="grid gap-4 md:grid-cols-3">
        {metas.map((m, i) => {
          const actual = i === 0 ? t.ing : m.actual;
          const pct = Math.min(100, Math.round((actual / m.objetivo) * 100));
          return (
            <Card key={m.id}>
              <p className="font-bold text-navy">{m.nombre}</p>
              <p className="text-sm text-muted-foreground">{fmt(actual)} de {fmt(m.objetivo)}</p>
              <div className="my-3 h-3 overflow-hidden rounded-full bg-grid"><div className="h-full rounded-full bg-emerald transition-all" style={{ width: `${pct}%` }} /></div>
              <p className="text-right text-sm font-bold text-emerald-dark">{pct}%</p>
              {i === 0 ? (
                <p className="mt-2 text-xs text-muted-foreground">Se calcula con los ingresos del mes en Flujo de Caja.</p>
              ) : (
                <div className="mt-2"><Label className="text-xs">Valor actual</Label>
                  <Input type="number" min="0" value={m.actual} onChange={(e) => setMeta(m.id, Math.max(0, Number(e.target.value) || 0))} />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function Locked({ name }: { name: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-muted"><Lock className="h-7 w-7 text-navy-soft" /></span>
      <h1 className="mt-4 text-xl font-bold text-navy">{name}</h1>
      <p className="mt-2 text-muted-foreground">Este módulo está en la versión completa</p>
      <a href="/#planes" className="btn-cta mt-6">Ver planes <ArrowRight className="h-4 w-4" /></a>
    </div>
  );
}
