<script>
  import { router, navigate } from '../router.svelte.js';

  const routes = [
    { name: "elbasan", path: "/" },
    { name: "vithkuqi", path: "/vithkuqi" },
    { name: "todhri", path: "/todhri" }
  ];
</script>

<nav class="navbar">
  {#each routes as route}
    <a
      href={route.path}
      onclick={(e) => { e.preventDefault(); navigate(route.path); }}
      class:active={router.path === route.path}
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
    background-color: #DBE1D5;
  }

  .navbar a {
    text-decoration: none;
    font-size: 1.2rem;
    color: #333;
    position: relative;
  }

  .navbar a.active {
    color: #C3181E;
  }

  .navbar a.active::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #C3181E;
  }
</style>
