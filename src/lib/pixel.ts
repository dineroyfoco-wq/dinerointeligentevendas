import { readChoice } from './consent';
type Fbq = ((...args: unknown[]) => void) & { queue?: unknown[][]; callMethod?: (...a: unknown[]) => void; loaded?: boolean; version?: string; push?: unknown };
declare global {
  interface Window { fbq?: Fbq; _fbq?: Fbq; __metaAllowed?: boolean; __metaBootstrapped?: boolean; }
}
export function track(event: string, params?: Record<string, unknown>, custom = false): boolean {
  try {
    if (typeof window === 'undefined' || !window.__metaAllowed || readChoice('advertising') === 'denied' || typeof window.fbq !== 'function') return false;
    window.fbq(custom ? 'trackCustom' : 'track', event, params ?? {});
    return true;
  } catch { return false; }
}
const sent = new Set<string>();
export function trackOnce(key: string, event: string, params?: Record<string, unknown>, custom = false) {
  if (sent.has(key)) return;
  if (track(event, params, custom)) sent.add(key);
}
export function trackPlan(plan: 'mensual' | 'anual') {
  track('InitiateCheckout', { content_name: plan === 'mensual' ? 'Plan mensual' : 'Plan anual', value: plan === 'mensual' ? 4.9 : 49.9, currency: 'USD' });
  track(plan === 'mensual' ? 'ClickPlanMensual' : 'ClickPlanAnual', undefined, true);
}
