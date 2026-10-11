<script>
  import { router } from './router.svelte.js';
  import { ScriptType } from './utils/scriptTypes.js';
  import ScriptRoute from './routes/ScriptRoute.svelte';
  import NotFound from './routes/notfound.svelte';

  const scriptRoutes = {
    '/': ScriptType.ELBASAN,
    '/vithkuqi': ScriptType.VITHKUQI,
    '/todhri': ScriptType.TODHRI
  };

  const scriptType = $derived(scriptRoutes[router.path]);
</script>

{#if scriptType}
  <!-- remount per script so each page restores its own saved state -->
  {#key scriptType}
    <ScriptRoute {scriptType} />
  {/key}
{:else}
  <NotFound />
{/if}

<footer></footer>

<style>
</style>
