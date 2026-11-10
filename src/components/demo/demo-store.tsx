import { createContext, useContext, useState, type ReactNode } from "react";

export type Mov = { id: string; tipo: "ingreso" | "egreso"; monto: number; categoria: string; fecha: string; desc: string };
export type Cuenta = { id: string; nombre: string; concepto: string; monto: number; vence: string; pagada: boolean };
export type Producto = { id: string; nombre: string; stock: number; minimo: number; costo: number };
export type Meta = { id: string; nombre: string; objetivo: number; actual: number };

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const offset = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return iso(d);
};
export const today = () => iso(new Date());

function buildMovs(): Mov[] {
  const out: Mov[] = [];
  const now = new Date();
  const ventas = ["Torta de cumpleaños", "Pedido de cupcakes", "Alfajores por docena", "Mesa dulce evento", "Venta en feria"];
  const gastos: [string, string, number][] = [
    ["Insumos", "Harina, azúcar y huevos", 1],
    ["Insumos", "Chocolate y crema", 1],
    ["Servicios", "Gas y luz", 0],
    ["Empaques", "Cajas y bolsas", 0],
    ["Transporte", "Envíos del mes", 0],
  ];
  let k = 0;
  for (let m = 5; m >= 0; m--) {
    const base = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const maxDay = m === 0 ? Math.max(now.getDate(), 2) : 26;
    const grow = 1 + (5 - m) * 0.06;
    for (let i = 0; i < 6; i++) {
      const day = Math.min(1 + i * 4, maxDay);
      out.push({ id: `m${k++}`, tipo: "ingreso", monto: Math.round((260 + ((i * 97 + m * 31) % 220)) * grow), categoria: "Ventas", fecha: iso(new Date(base.getFullYear(), base.getMonth(), day)), desc: ventas[i % ventas.length]! });
    }
    gastos.forEach(([cat, desc, dbl], i) => {
      const day = Math.min(3 + i * 5, maxDay);
      out.push({ id: `m${k++}`, tipo: "egreso", monto: Math.round((150 + ((i * 53 + m * 17) % 120)) * (dbl ? 1.6 : 1)), categoria: cat, fecha: iso(new Date(base.getFullYear(), base.getMonth(), day)), desc });
    });
  }
  return out.sort((a, b) => b.fecha.localeCompare(a.fecha));
}

function initial() {
  return {
    movs: buildMovs(),
    cobrar: [
      { id: "c1", nombre: "Laura Gómez", concepto: "Torta de boda", monto: 320, vence: offset(-6), pagada: false },
      { id: "c2", nombre: "Café Central", concepto: "Pedido semanal de medialunas", monto: 145, vence: offset(-2), pagada: false },
      { id: "c3", nombre: "Pedro Ruiz", concepto: "Mesa dulce cumpleaños", monto: 210, vence: offset(4), pagada: false },
      { id: "c4", nombre: "Colegio San José", concepto: "Kermés escolar", monto: 180, vence: offset(9), pagada: false },
      { id: "c5", nombre: "Ana Torres", concepto: "Cupcakes personalizados", monto: 60, vence: offset(-12), pagada: true },
    ] as Cuenta[],
    pagar: [
      { id: "p1", nombre: "Distribuidora El Trigo", concepto: "Harina y azúcar", monto: 190, vence: offset(-3), pagada: false },
      { id: "p2", nombre: "Empaques del Sur", concepto: "Cajas para tortas", monto: 85, vence: offset(5), pagada: false },
      { id: "p3", nombre: "Compañía de gas", concepto: "Factura del mes", monto: 48, vence: offset(8), pagada: false },
      { id: "p4", nombre: "Lácteos La Vaquita", concepto: "Crema y manteca", monto: 120, vence: offset(12), pagada: false },
      { id: "p5", nombre: "Alquiler local", concepto: "Mes anterior", monto: 400, vence: offset(-20), pagada: true },
    ] as Cuenta[],
    productos: [
      { id: "i1", nombre: "Harina 0000 (kg)", stock: 25, minimo: 10, costo: 1.2 },
      { id: "i2", nombre: "Azúcar (kg)", stock: 6, minimo: 8, costo: 1.1 },
      { id: "i3", nombre: "Chocolate cobertura (kg)", stock: 4, minimo: 2, costo: 9.5 },
      { id: "i4", nombre: "Huevos (docena)", stock: 3, minimo: 5, costo: 3.2 },
      { id: "i5", nombre: "Manteca (kg)", stock: 7, minimo: 3, costo: 6.4 },
      { id: "i6", nombre: "Cajas para torta", stock: 40, minimo: 15, costo: 0.8 },
      { id: "i7", nombre: "Pirotines (paquete)", stock: 12, minimo: 4, costo: 2.0 },
      { id: "i8", nombre: "Crema de leche (litro)", stock: 9, minimo: 4, costo: 4.3 },
    ] as Producto[],
    metas: [
      { id: "g1", nombre: "Ventas del mes", objetivo: 2500, actual: 0 },
      { id: "g2", nombre: "Fondo para horno nuevo", objetivo: 1800, actual: 950 },
      { id: "g3", nombre: "Reserva de emergencia", objetivo: 1000, actual: 420 },
    ] as Meta[],
  };
}

type State = ReturnType<typeof initial>;

export const CURRENCIES: Record<string, { locale: string; symbol: string; dec: number }> = {
  USD: { locale: "en-US", symbol: "US$", dec: 2 },
  MXN: { locale: "es-MX", symbol: "MX$", dec: 2 },
  COP: { locale: "es-CO", symbol: "COL$", dec: 0 },
  ARS: { locale: "es-AR", symbol: "AR$", dec: 2 },
  CLP: { locale: "es-CL", symbol: "CLP$", dec: 0 },
  PEN: { locale: "es-PE", symbol: "S/", dec: 2 },
  BOB: { locale: "es-BO", symbol: "Bs", dec: 2 },
  DOP: { locale: "es-DO", symbol: "RD$", dec: 2 },
  UYU: { locale: "es-UY", symbol: "$U", dec: 2 },
  PYG: { locale: "es-PY", symbol: "₲", dec: 0 },
  CRC: { locale: "es-CR", symbol: "₡", dec: 0 },
  GTQ: { locale: "es-GT", symbol: "Q", dec: 2 },
};

type Ctx = State & {
  currency: string;
  setCurrency: (c: string) => void;
  fmt: (n: number) => string;
  addMov: (m: Omit<Mov, "id">) => void;
  settle: (kind: "cobrar" | "pagar", id: string) => void;
  setMeta: (id: string, actual: number) => void;
  reset: () => void;
};

const DemoCtx = createContext<Ctx | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [currency, setCurrency] = useState("USD");
  const c = CURRENCIES[currency] ?? CURRENCIES.USD!;
  const fmt = (n: number) =>
    `${n < 0 ? "-" : ""}${c.symbol} ${Math.abs(n).toLocaleString(c.locale, { minimumFractionDigits: c.dec, maximumFractionDigits: c.dec })}`;

  const addMov: Ctx["addMov"] = (m) =>
    setState((s) => ({ ...s, movs: [{ ...m, id: crypto.randomUUID() }, ...s.movs].sort((a, b) => b.fecha.localeCompare(a.fecha)) }));

  const settle: Ctx["settle"] = (kind, id) =>
    setState((s) => {
      const acc = s[kind].find((x) => x.id === id);
      if (!acc || acc.pagada) return s;
      const mov: Mov = {
        id: crypto.randomUUID(),
        tipo: kind === "cobrar" ? "ingreso" : "egreso",
        monto: acc.monto,
        categoria: kind === "cobrar" ? "Cobros" : "Pagos a proveedores",
        fecha: today(),
        desc: `${kind === "cobrar" ? "Cobro" : "Pago"}: ${acc.nombre} — ${acc.concepto}`,
      };
      return { ...s, [kind]: s[kind].map((x) => (x.id === id ? { ...x, pagada: true } : x)), movs: [mov, ...s.movs] };
    });

  const setMeta: Ctx["setMeta"] = (id, actual) =>
    setState((s) => ({ ...s, metas: s.metas.map((m) => (m.id === id ? { ...m, actual } : m)) }));

  const reset = () => {
    setState(initial());
    setCurrency("USD");
  };

  return (
    <DemoCtx.Provider value={{ ...state, currency, setCurrency, fmt, addMov, settle, setMeta, reset }}>
      {children}
    </DemoCtx.Provider>
  );
}

export function useDemo() {
  const v = useContext(DemoCtx);
  if (!v) throw new Error("useDemo outside DemoProvider");
  return v;
}

export const monthKey = (f: string) => f.slice(0, 7);
export const currentMonth = () => today().slice(0, 7);
export const isOverdue = (c: Cuenta) => !c.pagada && c.vence < today();
