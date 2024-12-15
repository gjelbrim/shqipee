<script>
  import Router from "svelte-spa-router";
  import Elbasan from "./routes/Elbasan.svelte";
  import Vithkuqi from "./routes/Vithkuqi.svelte";

  const routes = {
    "/": Elbasan,
    "/vithkuqi": Vithkuqi
  };
</script>

<header>
  <h1>elbasans alphabet</h1>
  <nav>
    <!-- Navigation mittels Hash-Routing -->
    <a href="#/">elbasan</a>
    <a href="#/vithkuqi">vithkuqi</a>
  </nav>
</header>

<main>
  <!-- Hier wird entsprechend der Route Elbasan oder Vithkuqi angezeigt -->
  <Router {routes} />
</main>

<footer></footer>

<style>
  /* Deine Styles hier */
</style>
