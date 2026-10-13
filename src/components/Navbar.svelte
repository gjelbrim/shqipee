<script>
  import { router, navigate } from '../router.svelte.js';

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
</nav>

<style>
  .navbar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    margin-bottom: 20px;
  }

  .navbar a {
    text-decoration: none;
    font-size: 1.2rem;
    color: var(--color-text-muted);
    position: relative;
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
