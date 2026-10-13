<script>
  import { navigate } from '../router.svelte.js';
</script>

<svelte:head>
  <title>shqip.ee | 404</title>
</svelte:head>

<main>
  <div class="not-found">
    <h1>404</h1>
    <p>this page doesn't exist.</p>
    <a href="/" onclick={(e) => { e.preventDefault(); navigate('/'); }}>back to elbasan</a>
  </div>
</main>

<style>
  .not-found {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 1rem;
    min-height: 100vh;
  }

  h1 {
    padding-bottom: 0;
  }

  p {
    font-size: 1.5rem;
  }

  a {
    font-size: 1rem;
    color: var(--color-ink);
    text-decoration: none;
    border-bottom: 2px solid var(--color-ink);
    padding-bottom: 2px;
  }

  a:hover {
    color: var(--color-accent);
    border-bottom-color: var(--color-accent);
  }
</style>
