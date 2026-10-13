<script>
  import { router } from './router.svelte.js';
  import { ScriptType } from './utils/scriptTypes.js';
  import ScriptRoute from './routes/ScriptRoute.svelte';
  import NotFound from './routes/notfound.svelte';
  import ThemeToggle from './components/ThemeToggle.svelte';
  import { panel } from './panel.svelte.js';

  /** @type {Record<string, import('./utils/scriptTypes.js').Script | undefined>} */
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

<!-- fixed to the bottom-right corner of the viewport on every page; on mobile it's
     hidden while the alphabet or history panel is open so it doesn't cover them -->
<div class="theme-float" class:panel-open={panel.open}><ThemeToggle /></div>

<style>
  .theme-float {
    position: fixed;
    /* keep clear of the iPhone home indicator / rounded corners */
    right: max(20px, env(safe-area-inset-right));
    bottom: max(20px, env(safe-area-inset-bottom));
    z-index: 10;
    padding: 8px;
    background: var(--color-bg);
    border: 1px solid var(--color-ink);
    line-height: 0;
  }

  @media (max-width: 768px) {
    .theme-float.panel-open {
      display: none;
    }
  }
</style>
