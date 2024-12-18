<script>
  import { link, useLocation } from "svelte-routing";

  const routes = [
    { name: "elbasan", path: "/" },
    { name: "vithkuqi", path: "/vithkuqi" },
  ];

  const location = useLocation();
  let currentLocation;
  location.subscribe(value => currentLocation = value);
</script>

<nav class="navbar">
  {#each routes as route}
    <a href={route.path} use:link class:active={currentLocation?.pathname === route.path}>
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
