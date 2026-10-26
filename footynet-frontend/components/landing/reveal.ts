// One-time scroll reveals for the landing page.
// Mark leaf groups with data-reveal="rise|slide|media|scale|bars" (optional data-reveal-delay in ms).
// CSS keeps every element visible by default; only elements still below the viewport get a paused
// entrance that plays once when they approach. Reduced motion and cleanup restore the final state.

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

const FRAMES: Record<string, { from: string; duration: number }> = {
  rise: { from: 'translateY(20px)', duration: 600 },
  slide: { from: 'translateX(20px)', duration: 600 },
  media: { from: 'scale(1.025)', duration: 700 },
  scale: { from: 'scale(0.96)', duration: 550 },
  bars: { from: 'scaleY(0.2)', duration: 500 },
};

export function installReferenceReveals(root: ParentNode = document) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Map<HTMLElement, Animation>();
  const elements = [...root.querySelectorAll<HTMLElement>('[data-reveal]')];

  const finish = (element: HTMLElement) => {
    element.dataset.revealPlayed = 'true';
    animations.get(element)?.cancel();
    animations.delete(element);
  };

  const observer =
    typeof IntersectionObserver === 'function'
      ? new IntersectionObserver(
          entries => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              const element = entry.target as HTMLElement;
              observer?.unobserve(element);
              element.dataset.revealPlayed = 'true';
              if (reduced.matches || document.visibilityState === 'hidden' || entry.boundingClientRect.bottom <= 0) finish(element);
              else animations.get(element)?.play();
            }
          },
          { threshold: 0, rootMargin: '0px 0px 96px 0px' },
        )
      : undefined;

  const stop = () => {
    observer?.disconnect();
    elements.forEach(finish);
  };
  const onPreference = () => {
    if (reduced.matches) stop();
  };
  reduced.addEventListener('change', onPreference);

  for (const element of elements) {
    if (element.dataset.revealPlayed === 'true') continue;
    const rect = element.getBoundingClientRect();
    // Never hide content that is already visible (first paint or restored scroll position)
    if (reduced.matches || !observer || !element.animate || rect.top < innerHeight || document.visibilityState === 'hidden') {
      finish(element);
      continue;
    }
    const frame = FRAMES[element.dataset.reveal ?? 'rise'] ?? FRAMES.rise;
    const animation = element.animate(
      [
        { opacity: 0, transform: frame.from },
        { opacity: 1, transform: 'none' },
      ],
      { duration: frame.duration, delay: Number(element.dataset.revealDelay ?? 0), easing: EASE, fill: 'backwards' },
    );
    animation.pause();
    animation.onfinish = () => finish(element);
    animations.set(element, animation);
    observer.observe(element);
  }

  return () => {
    stop();
    reduced.removeEventListener('change', onPreference);
  };
}
