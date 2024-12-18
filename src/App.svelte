<script>
  import { Router, Route } from "svelte-routing";
  import Elbasan from "./routes/elbasan.svelte";
  import Vithkuqi from "./routes/vithkuqi.svelte";
</script>

<main>
  <Router>
    <Route path="/" component={Elbasan} />
    <Route path="/vithkuqi" component={Vithkuqi} />
  </Router>
</main>

<footer></footer>

<style>
</style>
