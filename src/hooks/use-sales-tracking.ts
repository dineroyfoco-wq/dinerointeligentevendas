import { useEffect } from 'react';
import { trackOnce } from '@/lib/pixel';
export function useSalesTracking(demo = false) {
  useEffect(() => {
    const content = () => trackOnce(demo ? 'content-demo' : 'content-home', 'ViewContent', { content_name: demo ? 'Demo Dinero Inteligente' : 'Dinero Inteligente', content_type: 'product', currency: 'USD' });
    const scroll = () => {
      if (demo) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const depth = Math.min(100, (window.scrollY + 1) / max * 100);
      for (const threshold of [25, 50, 75, 100]) if (depth >= threshold) trackOnce('scroll-' + threshold, 'Scroll' + threshold, undefined, true);
    };
    const ready = () => { content(); scroll(); };
    ready();
    window.addEventListener('meta-ready', ready);
    window.addEventListener('scroll', scroll, { passive: true });
    const plans = document.getElementById('planes');
    const observer = !demo && plans ? new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) trackOnce('plans', 'ViewPlans', undefined, true);
    }) : undefined;
    if (plans) observer?.observe(plans);
    return () => { window.removeEventListener('meta-ready', ready); window.removeEventListener('scroll', scroll); observer?.disconnect(); };
  }, [demo]);
}
