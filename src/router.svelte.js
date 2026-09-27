export const router = $state({
  path: typeof window !== 'undefined' ? window.location.pathname : '/'
});

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    router.path = window.location.pathname;
  });
}

export function navigate(href) {
  history.pushState({}, '', href);
  router.path = href;
}
