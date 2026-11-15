<script>
  // MOCK variant c: a footer line under every script page
  import { navigate } from '../router.svelte.js';
</script>

<div class="project-footer">
  <a href="/about" onclick={(e) => { e.preventDefault(); navigate('/about' + location.search); }}>about this project <span aria-hidden="true">→</span></a>
</div>

<style>
  .project-footer {
    margin-top: var(--space-section);
    padding-top: var(--space-block);
    border-top: 3px solid var(--color-ink);
  }

  a {
    font-size: 1.2rem;
    color: var(--color-text-muted);
    text-decoration: none;
  }

  a:hover {
    color: var(--color-accent);
  }
</style>
