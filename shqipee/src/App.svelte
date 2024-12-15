<script>
  import Router from "svelte-spa-router";
  import Elbasan from "./routes/Elbasan.svelte";
  import Vithkuqi from "./routes/Vithkuqi.svelte";

  const routes = {
    "/": Elbasan,
    "/vithkuqi": Vithkuqi
  };
</script>



<main>
  <nav class="navbar">
    <!-- Navigation mittels Hash-Routing -->
    <a href="#/">elbasan</a>
    <a href="#/vithkuqi">vithkuqi</a>
  </nav>
  <!-- Hier wird entsprechend der Route Elbasan oder Vithkuqi angezeigt -->
  <Router {routes} />
</main>

<footer></footer>

<style>

</style>
