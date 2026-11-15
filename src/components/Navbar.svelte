<script>
  import { router, navigate } from '../router.svelte.js';
  const MOCK_LINK = new URLSearchParams(location.search).get('link');

  const routes = [
    { name: "elbasan", path: "/" },
    { name: "vithkuqi", path: "/vithkuqi" },
    { name: "todhri", path: "/todhri" }
  ];
</script>

<nav class="navbar" aria-label="Scripts">
  {#each routes as route}
    <a
      href={route.path}
      onclick={(e) => { e.preventDefault(); navigate(route.path); }}
      class:active={router.path === route.path}
      aria-current={router.path === route.path ? 'page' : undefined}
    >
      {route.name}
    </a>
  {/each}
  {#if MOCK_LINK === 'a'}
    <a
      href="/about"
      class="about-link"
      onclick={(e) => { e.preventDefault(); navigate('/about' + location.search); }}
      class:active={router.path === '/about'}
      aria-current={router.path === '/about' ? 'page' : undefined}
    >about</a>
  {/if}
</nav>

<style>
  .navbar {
    display: flex;
    align-items: center;
    gap: 30px;
  }

  .navbar a {
    text-decoration: none;
    font-size: 1.2rem;
    color: var(--color-text-muted);
    position: relative;
  }

  /* set apart from the three scripts */
  .about-link {
    margin-left: 30px;
  }

  .navbar a.active {
    color: var(--color-accent);
  }

  .navbar a.active::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--color-accent);
  }
</style>
