<script>
  import { Router, Route } from "svelte-routing";
  import Elbasan from "./routes/elbasan.svelte";
  import Vithkuqi from "./routes/vithkuqi.svelte";
  import Todhri from "./routes/todhri.svelte";
</script>

<main>
  <Router>
    <Route path="/" component={Elbasan} />
    <Route path="/vithkuqi" component={Vithkuqi} />
    <Route path="/todhri" component={Todhri} />
  </Router>
</main>

<footer></footer>

<style>
</style>
