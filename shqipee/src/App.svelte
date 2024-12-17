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
  <Router {routes} />
</main>

<footer></footer>

<style>

</style>
