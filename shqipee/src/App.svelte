<script>
  import Router from "svelte-spa-router";
  import Elbasan from "./routes/elbasan.svelte";
  import Vithkuqi from "./routes/vithkuqi.svelte";

  const routes = {
    "/": Elbasan,
    "/vithkuqi": Vithkuqi
  };
</script>



<main>
  <!-- Hier wird entsprechend der Route Elbasan oder Vithkuqi angezeigt -->
  <Router {routes} />
</main>

<footer></footer>

<style>

</style>
