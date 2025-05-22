import { useEffect } from 'react'

export function useTooltipStyle(isDark: boolean) {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const tooltipEls = document.querySelectorAll('.tooltip-inner');
      tooltipEls.forEach(el => {
        const style = el as HTMLElement;
        style.style.color = isDark ? '#fff' : '#212529';
        style.style.backgroundColor = isDark ? '#333' : '#f8f9fa';
        style.style.borderRadius = '6px';
        style.style.padding = '6px 12px';
        style.style.fontSize = '12px';
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [isDark]);
}
