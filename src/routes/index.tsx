import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight, BarChart3, Boxes, CalendarDays, CalendarRange, Check, ClipboardList, Eye, Gauge,
  HandCoins, LayoutDashboard, Monitor, PenLine, Receipt, Scissors, ShieldCheck, ShoppingBag,
  Store, Target, Users, Wallet, X, Zap, Cake, Briefcase, Calculator, Minus, PlayCircle,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { CashFlowMockup, DashboardMockup } from "@/components/landing/Mockups";
import {
  DIAS_GARANTIA, HOTMART_URL_ANUAL, HOTMART_URL_MENSUAL, PRECIO_ANUAL, PRECIO_MENSUAL,
} from "@/lib/config";
import { track } from "@/lib/pixel";

const TITLE = "Dinero Inteligente | Control del dinero de tu negocio, online";
const DESC = `Panel online para pequeños emprendedores: flujo de caja, cobros, pagos, inventario, metas e indicadores en un solo lugar. Prueba la demo gratis. Garantía de ${DIAS_GARANTIA} días.`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
  }),
  component: Index,
});

function Cta({ href = "#planes", children }: { href?: string; children: React.ReactNode }) {
  return (
    <a href={href} className="btn-cta">
      {children} <ArrowRight className="h-4 w-4" />
    </a>
  );
}

function Guarantee() {
  return (
    <div className="inline-flex items-center gap-2.5 rounded-2xl border-2 border-emerald bg-emerald-soft px-4 py-3 text-sm font-semibold text-navy">
      <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-dark" />
      Garantía de {DIAS_GARANTIA} días: si no es para ti, te devolvemos tu dinero
    </div>
  );
}

function SectionTitle({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-dark">{eyebrow}</p>}
      <h2 className="text-2xl font-bold leading-tight text-navy sm:text-4xl">{title}</h2>
      {sub && <p className="mt-4 text-muted-foreground">{sub}</p>}
    </div>
  );
}

const modules = [
  { icon: LayoutDashboard, n: "Dashboard Ejecutivo", d: "Tu negocio completo en una pantalla" },
  { icon: Wallet, n: "Flujo de Caja", d: "Entradas, salidas y saldo real" },
  { icon: HandCoins, n: "Cuentas por Cobrar", d: "Quién te debe y cuánto falta cobrar" },
  { icon: Receipt, n: "Cuentas por Pagar", d: "Lo que debes y cuándo vence" },
  { icon: ClipboardList, n: "Control Diario", d: "Lo que pasó hoy, en orden" },
  { icon: CalendarDays, n: "Planificador Semanal", d: "Organiza tu semana de trabajo" },
  { icon: CalendarRange, n: "Planificador Mensual", d: "Prepara el mes con anticipación" },
  { icon: Boxes, n: "Inventario", d: "Valor de tu stock y alertas de mínimos" },
  { icon: Users, n: "Clientes", d: "Tus clientes registrados en un lugar" },
  { icon: Target, n: "Metas", d: "Objetivos con avance automático" },
  { icon: Gauge, n: "Indicadores", d: "Margen, liquidez y rotación" },
];

const profiles = [
  { icon: Store, t: "Comercios y restaurantes", q: "“Quiero saber si el mes realmente me dejó ganancia.”" },
  { icon: Cake, t: "Reposteros, artesanos y costureras", q: "“Quiero dejar de anotar todo en cuadernos sueltos.”" },
  { icon: Scissors, t: "Peluqueros y salones", q: "“Quiero ver cuánto entra cada semana sin hacer cuentas.”" },
  { icon: ShoppingBag, t: "Vendedores online", q: "“Quiero controlar mi stock y lo que me deben.”" },
  { icon: Briefcase, t: "Profesionales independientes", q: "“Quiero que no se me pase ningún cobro ni pago.”" },
];

const included = ["Los 11 módulos", "Alertas de cobros y pagos vencidos", "Selector de moneda", "Datos privados por usuario"];

const faqs: [string, string][] = [
  ["¿Cómo recibo el acceso?", "Después de confirmar el pago recibirás por correo las instrucciones para entrar."],
  ["¿Qué diferencia hay con la planilla de Excel?", "Es el mismo método, ahora en un panel online: cálculos y alertas automáticas, y acceso desde cualquier dispositivo con tu correo y contraseña."],
  ["¿Funciona en el celular?", "Sí, desde el navegador de tu celular o de tu computadora, sin instalar nada."],
  ["¿Mis datos son privados?", "Sí. Cada usuario ve únicamente sus propios datos."],
  ["¿Puedo usar mi moneda?", "Sí, puedes elegir la moneda que se muestra en tus módulos."],
  ["¿Puedo cancelar?", "Sí, puedes cancelar tu suscripción cuando quieras."],
  ["¿Y si no sé de finanzas?", "No necesitas saber. Registras lo que entra y lo que sale, y el sistema hace las cuentas. Si sabes usar WhatsApp, sabes usar esta app."],
  ["¿Cómo funciona la garantía?", `Tienes ${DIAS_GARANTIA} días desde tu compra para solicitar la devolución de tu dinero.`],
];

function Index() {
  const [showBar, setShowBar] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 650);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-grid bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <a href="#" className="flex items-center gap-2 font-display text-base font-bold text-navy">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald text-primary-foreground">
              <BarChart3 className="h-4 w-4" />
            </span>
            Dinero Inteligente
          </a>
          <a href="#planes" className="rounded-full bg-navy px-4 py-2 text-sm font-bold text-primary-foreground">
            Ver planes
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 sm:pt-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 lg:grid-cols-2 lg:pb-20">
          <div>
            <span className="inline-block rounded-full bg-emerald-soft px-3 py-1 text-xs font-bold text-emerald-dark">
              Sistema online para pequeños emprendedores
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-[1.1] text-navy sm:text-5xl">
              Deja de adivinar si tu negocio gana dinero: controla tus finanzas en un solo panel.
            </h1>
            <p className="mt-5 text-lg text-navy-soft">
              Dinero Inteligente es el panel online que calcula solo tu saldo, tus cobros y tus pagos, para que veas la salud de tu negocio desde el celular.
            </p>
            <p className="mt-4 text-sm font-semibold text-muted-foreground">
              Sin instalar nada · Sin fórmulas · Desde {PRECIO_MENSUAL} al mes
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Cta>Ver planes</Cta>
              <Link to="/demo" className="btn-ghost-cta">
                <PlayCircle className="h-4 w-4" /> Probar la demo gratis
              </Link>
            </div>
            <div className="mt-5"><Guarantee /></div>
          </div>
          <DashboardMockup />
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-grid bg-muted/50">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 sm:grid-cols-3">
          {[
            [Zap, "Acceso inmediato"],
            [Monitor, "Funciona en celular y computadora"],
            [ShieldCheck, `Garantía de ${DIAS_GARANTIA} días`],
          ].map(([I, t]) => {
            const Icon = I as typeof Zap;
            return (
              <div key={t as string} className="flex items-center justify-center gap-2 text-sm font-semibold text-navy">
                <Icon className="h-5 w-5 text-emerald-dark" /> {t as string}
              </div>
            );
          })}
        </div>
      </section>

      {/* Social proof */}
      <section className="border-b border-grid bg-emerald-soft">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-7 text-center sm:flex-row sm:gap-6 sm:text-left">
          <div className="shrink-0 text-center">
            <p className="font-display text-4xl font-extrabold text-emerald-dark">+80</p>
            <p className="text-xs font-semibold text-emerald-dark">emprendedores</p>
          </div>
          <p className="font-semibold text-navy">Más de 80 emprendedores ya ordenaron sus finanzas con nuestra planilla. Ahora llega la versión app.</p>
        </div>
      </section>

      {/* Problem */}
      <section className="cv-auto px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <SectionTitle eyebrow="El problema" title="El problema no es vender. Es no ver con claridad qué pasa con el dinero después de cada venta." />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Anotas ventas y gastos en cuadernos, mensajes y hojas distintas.",
              "No sabes con certeza cuánto queda al final del mes.",
              "Se te pasan cobros y pagos pendientes.",
              "Decides mirando el saldo del banco, no el negocio completo.",
            ].map((t) => (
              <div key={t} className="flex gap-3 rounded-2xl border border-grid bg-card p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                  <X className="h-4 w-4 text-destructive" />
                </span>
                <p className="font-medium text-navy">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Without / with comparison */}
      <section className="cv-auto px-4 pb-16 sm:pb-24">
        <div className="mx-auto max-w-5xl">
          <SectionTitle title="Sin / Con el Centro de Control" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
              <h3 className="flex items-start gap-3 text-lg font-bold text-navy">
                <X className="mt-0.5 h-6 w-6 shrink-0 text-destructive" />
                Sin el Centro de Control
              </h3>
              <ul className="mt-5 space-y-4">
                {[
                  "Dinero que desaparece sin saber en qué",
                  "Clientes que no pagan y se te olvida cobrar",
                  "Pagos que te sorprenden",
                  "Compras de stock «a ojo»",
                  "Decisiones por intuición",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-navy">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald bg-emerald-soft p-6">
              <h3 className="flex items-start gap-3 text-lg font-bold text-navy">
                <Check className="mt-0.5 h-6 w-6 shrink-0 text-emerald-dark" />
                Con el Centro de Control
              </h3>
              <ul className="mt-5 space-y-4">
                {[
                  "Saldo real y claro todos los días",
                  "Alertas automáticas de cobros vencidos",
                  "Aviso de pagos próximos",
                  "Alertas de inventario mínimo",
                  "Indicadores de margen, liquidez y rotación",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-navy">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-dark" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="cv-auto bg-muted/50 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <SectionTitle eyebrow="La solución" title="Tu planilla de control, convertida en un sistema online." />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [PenLine, "Registras lo que sucede", "Ventas, gastos, cobros y pagos, en segundos."],
              [Calculator, "El sistema hace las cuentas", "Saldo, ganancia y avance de metas se calculan solos."],
              [Eye, "Ves tu negocio completo", "Gráficos y alertas para decidir con claridad."],
            ].map(([I, t, d], i) => {
              const Icon = I as typeof Zap;
              return (
                <div key={t as string} className="rounded-2xl border border-grid bg-card p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-soft text-emerald-dark"><Icon className="h-5 w-5" /></span>
                    <span className="font-display text-xs font-bold text-muted-foreground">0{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-navy">{t as string}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d as string}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-grid bg-card">
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 bg-navy px-4 py-3 text-xs font-bold text-primary-foreground sm:gap-x-8 sm:text-sm">
              <span>Función</span><span className="w-16 text-center sm:w-24">Planilla</span><span className="w-20 text-center sm:w-32">Dinero Inteligente</span>
            </div>
            {[
              "Alertas automáticas de cobros y pagos vencidos",
              "Gráficos mensuales automáticos",
              "Acceso desde cualquier dispositivo con tu correo y contraseña",
              "Selector de moneda",
            ].map((f) => (
              <div key={f} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 border-t border-grid px-4 py-3 text-sm text-navy sm:gap-x-8">
                <span>{f}</span>
                <span className="flex w-16 justify-center sm:w-24"><Minus className="h-4 w-4 text-muted-foreground" /></span>
                <span className="flex w-20 justify-center sm:w-32"><Check className="h-5 w-5 text-emerald-dark" /></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="cv-auto px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl rounded-[2rem] border-2 border-emerald bg-emerald-soft p-6 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-navy sm:text-4xl">Pruébalo tú mismo, sin registrarte</h2>
          <p className="mx-auto mt-4 max-w-xl text-navy-soft">
            Entra a una cuenta de ejemplo de un negocio ficticio y mira cómo funciona por dentro.
          </p>
          <div className="mt-7">
            <Link to="/demo" className="btn-cta">Abrir la demo <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mx-auto mt-8 max-w-md"><CashFlowMockup /></div>
          <p className="mt-3 text-xs font-semibold text-emerald-dark">Datos ficticios · No se guarda nada</p>
        </div>
      </section>

      {/* Modules */}
      <section className="cv-auto bg-muted/50 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Todo incluido" title="Los 11 módulos de tu Centro de Control" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <div key={m.n} className="flex items-start gap-3 rounded-2xl border border-grid bg-card p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-primary-foreground"><m.icon className="h-5 w-5" /></span>
                <div>
                  <h3 className="font-bold text-navy">{m.n}</h3>
                  <p className="text-sm text-muted-foreground">{m.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* This is for you */}
      <section className="cv-auto px-4 pt-16 sm:pt-24">
        <div className="mx-auto max-w-5xl">
          <SectionTitle title="Esto es para ti si…" />
          <ul className="space-y-4">
            {[
              "Tienes un negocio pequeño o emprendimiento y mezclas el dinero personal con el del negocio.",
              "Vendes y no sabes cuánto ganas realmente al final del mes.",
              "Te olvidas de cobrar o de pagar a tiempo.",
              "Usas cuadernos, notas del celular o planillas que nunca terminas de llenar.",
              "Quieres tomar decisiones con números, sin ser experto en finanzas.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 font-medium text-navy">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-dark" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* For whom */}
      <section className="cv-auto px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <SectionTitle eyebrow="Para quién es" title="Hecho para quien vende todos los días" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((p) => (
              <div key={p.t} className="rounded-2xl border border-grid bg-card p-5">
                <p.icon className="h-6 w-6 text-emerald-dark" />
                <h3 className="mt-3 font-bold text-navy">{p.t}</h3>
                <p className="mt-2 text-sm italic text-navy-soft">{p.q}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-navy-soft/40 bg-muted/50 p-5 text-sm text-navy-soft">
            <b className="text-navy">Puede no ser para ti</b> si buscas un sistema contable fiscal, facturación electrónica o una promesa de ganar dinero sin registrar tus números.
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="cv-auto bg-muted/50 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <SectionTitle title="Cómo empezar en 3 pasos" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "Elige tu plan y crea tu acceso.",
              "Elige tu moneda y registra tus primeros movimientos.",
              "Mira tu Dashboard y tus alertas cada día.",
            ].map((s, i) => (
              <div key={s} className="rounded-2xl border border-grid bg-card p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald font-display font-bold text-primary-foreground">{i + 1}</span>
                <p className="mt-4 font-semibold text-navy">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="planes" className="scroll-mt-20 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <SectionTitle eyebrow="Planes" title="Elige cómo quieres pagar" />
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { name: "Plan mensual", price: PRECIO_MENSUAL, per: "/ mes", note: "Pago mes a mes", cta: "Empezar con el plan mensual", url: HOTMART_URL_MENSUAL },
              { name: "Plan anual", price: PRECIO_ANUAL, per: "/ año", note: "Pago una vez al año", cta: "Empezar con el plan anual", url: HOTMART_URL_ANUAL },
            ].map((p) => (
              <div key={p.name} className="flex flex-col rounded-3xl border-2 border-grid bg-card p-7 shadow-[var(--shadow-card)]">
                <h3 className="text-lg font-bold text-navy">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.note}</p>
                <p className="mt-5 font-display text-4xl font-extrabold text-navy">
                  {p.price} <span className="text-base font-semibold text-muted-foreground">{p.per}</span>
                </p>
                <ul className="my-6 space-y-2.5">
                  {included.map((i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-navy">
                      <Check className="h-4 w-4 text-emerald-dark" /> {i}
                    </li>
                  ))}
                </ul>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("InitiateCheckout")}
                  className="btn-cta mt-auto"
                >
                  {p.cta} <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-sm text-muted-foreground">Al pagar, el valor se muestra en tu moneda local.</p>
          <p className="mt-1 text-center text-sm font-semibold text-navy">Pago seguro · Acceso inmediato · Garantía de {DIAS_GARANTIA} días</p>
          <div className="mt-6 flex flex-col items-center gap-4 rounded-3xl border-2 border-emerald bg-emerald-soft p-6 text-center sm:flex-row sm:text-left">
            <ShieldCheck className="h-14 w-14 shrink-0 text-emerald-dark" />
            <p className="text-navy">
              <b>Garantía de {DIAS_GARANTIA} días.</b> Pruébalo con calma: si en los primeros {DIAS_GARANTIA} días ves que no es para ti, solicita la devolución y recibirás tu dinero de vuelta.
            </p>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="cv-auto px-4 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl rounded-[2rem] border-2 border-emerald bg-emerald-soft p-8 text-center sm:p-12">
          <ShieldCheck className="mx-auto h-20 w-20 text-emerald" strokeWidth={1.5} />
          <h2 className="mt-4 text-2xl font-bold text-navy sm:text-4xl">Tienes {DIAS_GARANTIA} días para probarlo sin riesgo</h2>
          <p className="mx-auto mt-4 max-w-xl text-navy-soft">
            Quiero que entres, registres tus primeros datos y compruebes si se adapta a tu negocio. Si dentro de los primeros {DIAS_GARANTIA} días no es para ti, solicitas la devolución y te devuelvo tu dinero, sin preguntas ni burocracia.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="cv-auto bg-muted/50 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <SectionTitle title="Preguntas frecuentes" />
          <Accordion type="single" collapsible className="rounded-2xl border border-grid bg-card px-5">
            {faqs.map(([q, a]) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger className="text-left font-semibold text-navy">{q}</AccordionTrigger>
                <AccordionContent className="text-navy-soft">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy px-4 py-16 text-center sm:py-24">
        <h2 className="mx-auto max-w-2xl text-2xl font-bold text-primary-foreground sm:text-4xl">
          Tus ventas ya están sucediendo. Ahora puedes ver con claridad qué pasa con el dinero.
        </h2>
        <div className="mt-8"><Cta>Ver planes</Cta></div>
        <p className="mt-4 text-sm text-primary-foreground/70">Garantía de {DIAS_GARANTIA} días · Acceso inmediato</p>
      </section>

      <footer className="px-4 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Dinero Inteligente · Dinero con Foco™ · Todos los derechos reservados
      </footer>

      {/* Mobile sticky bar */}
      <div className={`fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-grid bg-background p-3 transition-transform md:hidden ${showBar ? "translate-y-0" : "translate-y-full"}`}>
        <a href="#planes" className="btn-cta flex-1 !py-3">Ver planes <ArrowRight className="h-4 w-4" /></a>
        <span className="flex items-center gap-1 text-xs font-bold text-emerald-dark">
          <ShieldCheck className="h-4 w-4" /> Garantía {DIAS_GARANTIA} días
        </span>
      </div>
    </div>
  );
}
