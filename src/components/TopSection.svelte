<script>
    import Navbar from "./Navbar.svelte";
    import {ScriptType} from '../utils/scriptTypes.js';
    /** @type {{scriptType: import('../utils/scriptTypes.js').Script}} */
    let { scriptType } = $props();
</script>

  <!-- same columns as the transliterator below (left column, gap, right column), so the
       nav starts on the edge of the right column; stacked and mobile: nav under the heading -->
  <div class="top-section">
    <div class="headingTop">
        {#if scriptType === ScriptType.ELBASAN}
            <h1>elbasan <br> alphabet</h1>
        {:else if scriptType === ScriptType.VITHKUQI}
            <h1>vithkuqi <br> alphabet</h1>
        {:else if scriptType === ScriptType.TODHRI}
            <h1>todhri <br> alphabet</h1>
        {/if}
    </div>
    <div class="insertNav">
      <Navbar />
    </div>
    <div class="logoIcon" aria-hidden="true">
      <p>𐔋</p>
    </div>
  </div>

<style>
  .top-section {
    display: grid;
    grid-template-columns: minmax(var(--column-min-width), 1fr) var(--column-gap) minmax(var(--column-min-width), 1fr);
    grid-template-areas: "heading . nav";
    align-items: start;
    padding-bottom: var(--space-section);
  }

  .headingTop {
    grid-area: heading;
    border-left: var(--accent-bar-width) solid var(--color-accent);
    padding-left: 10px;
  }

  .insertNav {
    grid-area: nav;
  }

  /* sits in the right column with the nav, flush right */
  .logoIcon {
    grid-area: nav;
    justify-self: end;
    font-size: 128px;
    line-height: 0.8;
    color: var(--color-accent);
  }

  @media (max-width: 1200px) {
    .top-section {
      grid-template-columns: 1fr auto;
      grid-template-areas:
        "heading logo"
        "nav nav";
      row-gap: var(--space-block);
    }

    .logoIcon {
      grid-area: logo;
    }
  }

  @media (max-width: 768px) {
    .top-section {
      grid-template-columns: 1fr;
      grid-template-areas:
        "heading"
        "nav";
    }

    .headingTop {
      padding-left: 5px;
    }

    .logoIcon {
      display: none;
    }
  }
</style>
