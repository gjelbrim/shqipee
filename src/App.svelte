<script>
  import { Router, Route } from "svelte-routing";
  import Elbasan from "./routes/elbasan.svelte";
  import Vithkuqi from "./routes/vithkuqi.svelte";
  import Todhri from "./routes/todhri.svelte";
  import NotFound from "./routes/NotFound.svelte";
</script>

<Router>
  <Route path="/" component={Elbasan} />
  <Route path="/vithkuqi" component={Vithkuqi} />
  <Route path="/todhri" component={Todhri} />
  <Route path="*" component={NotFound} />
</Router>

<footer></footer>

<style>
</style>
