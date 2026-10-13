<script>
  import { theme, toggleTheme } from '../theme.svelte.js';
</script>

<button
  class="theme-toggle"
  onclick={toggleTheme}
  aria-label={theme.dark ? 'Switch to light mode' : 'Switch to dark mode'}
  title={theme.dark ? 'Light mode' : 'Dark mode'}
>
  {#if theme.dark}
    <!-- sun -->
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 1.5v2.5M12 20v2.5M1.5 12H4M20 12h2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
    </svg>
  {:else}
    <!-- moon -->
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
    </svg>
  {/if}
</button>

<style>
  .theme-toggle {
    width: 32px;
    height: 32px;
    padding: 2px;
    border: none;
    background: transparent;
    color: var(--color-text);
    cursor: pointer;
  }

  .theme-toggle:hover {
    opacity: 0.8;
  }

  svg {
    width: 100%;
    height: 100%;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
