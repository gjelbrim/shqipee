<script>
  import { onMount } from "svelte";

  // current route
  let activeRoute = window.location.hash || "#/";


  const updateRoute = () => {
    activeRoute = window.location.hash || "#/";
  };

  // event listner for route change
  onMount(() => {
    window.addEventListener("hashchange", updateRoute);
    updateRoute(); // Initiale Route setzen

    // clean up of event listeners when component is destroyed
    return () => window.removeEventListener("hashchange", updateRoute);
  });

  // define routes
  const routes = [
    { name: "elbasan", path: "#/" },
    { name: "vithkuqi", path: "#/vithkuqi" },
  ];
</script>

<nav class="navbar">
  {#each routes as route}
    <a href={route.path} class:active={activeRoute === route.path}>
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
