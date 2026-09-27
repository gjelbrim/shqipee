<script>
  import { router } from './router.svelte.js';
  import Elbasan from './routes/elbasan.svelte';
  import Vithkuqi from './routes/vithkuqi.svelte';
  import Todhri from './routes/todhri.svelte';
  import NotFound from './routes/notfound.svelte';
</script>

{#if router.path === '/'}
  <Elbasan />
{:else if router.path === '/vithkuqi'}
  <Vithkuqi />
{:else if router.path === '/todhri'}
  <Todhri />
{:else}
  <NotFound />
{/if}

<footer></footer>

<style>
</style>
