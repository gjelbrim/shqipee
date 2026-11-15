<script>
  // MOCK: three layouts, chosen with ?v=1|2|3
  import TopSection from "../components/TopSection.svelte";

  const V = new URLSearchParams(location.search).get('v') ?? '1';

  // each paragraph: [label for layout 3, segments; a segment in an array is highlighted]
  /** @type {[string, (string | [string])[]][]} */
  const PARAGRAPHS = [
    ['ulm', ['this is a project by gjelbrim haskaj and franz anhäupl. we met in ulm, germany, where we both studied. ulm is also the home of the hfg ulm and the legacy of otl aicher. we were taught by a student of a student of aicher. we are, in a way, ', ['the fourth generation'], '.']],
    ['lowercase', ['we built this tool as a homage to the elbasan alphabet—a script from 18th-century central albania. gjelbrim grew up in germany with albanian roots and loves both languages. he also loves the work of the brothers grimm, who advocated for lowercase as a way to democratize language. this is why everything here is written in ', ['lowercase'], '. for otl aicher, lowercase was not a stylistic choice—it was ', ['a political one'], '. it removes the artificial hierarchy of capital letters and lets the content speak for itself. hierarchy should come from position and size, not from grammar. we share this belief.']],
    ['calm', ['we wanted to make something that feels ', ['calm'], '. gjelbrim is autistic and easily overwhelmed by visual noise. so we removed everything that distracts: no animations, no confirmation buttons, no unnecessary steps. the transliteration happens live, letter by letter, as you type. it is fully accessible and readable by screen readers. we used svelte to make it fast and quiet.']],
    ['giants', ['we have deep respect for the giants of design — otl aicher, josef müller-brockmann, max bill, armin hofmann, and the hfg ulm. we did not try to reinvent them. we tried to ', ['carry their spirit into the 21st century'], '.']]
  ];
  const STATEMENT = 'this is not just a tool. it is a small artwork. the transliterator is just the vessel.';
</script>

{#snippet text(/** @type {(string | [string])[]} */ segments, /** @type {boolean} */ marks)}
  {#each segments as segment}{#if typeof segment === 'string'}{segment}{:else if marks}<span class="highlight">{segment[0]}</span>{:else}{segment[0]}{/if}{/each}
{/snippet}

<main>
  <TopSection heading={['about this', 'project']} />

  {#if V === '1'}
    <!-- 1: running text in the two columns of the transliterator -->
    <div class="columns">
      {#each PARAGRAPHS as [, segments]}<p>{@render text(segments, false)}</p>{/each}
      <p>{STATEMENT}</p>
    </div>
  {:else if V === '2'}
    <!-- 2: text in the left column, lead paragraph with the red bar; credits on the right;
         closing statement large across both columns -->
    <div class="two">
      <div class="left">
        {#each PARAGRAPHS as [, segments], i}
          {#if i === 0}<p class="lead">{@render text(segments, true)}</p>{:else}<p>{@render text(segments, true)}</p>{/if}
        {/each}
      </div>
      <div class="gap"></div>
      <div class="right">
        <span class="label">developed by</span><span class="name">gjelbrim haskaj</span>
        <span class="label">designed by</span><span class="name">franz anhäupl</span>
        <span class="label">made in</span><span class="name">ulm, germany</span>
      </div>
    </div>
    <p class="statement">{STATEMENT}</p>
  {:else}
    <!-- 3: one keyword per paragraph in the left column, the text in the right column -->
    <div class="rows">
      {#each PARAGRAPHS as [label, segments]}
        <h2 class="keyword">{label}</h2><p>{@render text(segments, false)}</p>
      {/each}
      <h2 class="keyword accent">artwork</h2><p class="statement-small">{STATEMENT}</p>
    </div>
  {/if}
</main>

<style>
  p {
    font-size: 20px;
    line-height: 1.3em;
    font-weight: 500;
    margin-bottom: 1em;
  }

  .highlight {
    color: var(--color-accent);
    font-weight: 700;
  }

  /* 1 */
  .columns {
    columns: 2;
    column-gap: var(--column-gap);
  }

  .columns p {
    break-inside: avoid;
  }

  /* 2 */
  .two {
    display: grid;
    grid-template-columns: minmax(var(--column-min-width), 1fr) var(--column-gap) minmax(var(--column-min-width), 1fr);
    align-items: start;
  }

  .lead {
    border-left: var(--accent-bar-width) solid var(--color-accent);
    padding-left: 20px;
    font-size: 24px;
  }

  .right {
    display: flex;
    flex-direction: column;
  }

  .label {
    font-size: 14px;
    opacity: 0.6;
  }

  .name {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 15px;
  }

  .statement {
    font-size: var(--font-size-h2);
    font-weight: 700;
    line-height: 1.05em;
    margin-top: var(--space-section);
    max-width: 18em;
  }

  /* 3 */
  .rows {
    display: grid;
    grid-template-columns: minmax(var(--column-min-width), 1fr) var(--column-gap) minmax(var(--column-min-width), 1fr);
    row-gap: var(--space-section);
    align-items: start;
  }

  .keyword {
    grid-column: 1;
    font-size: var(--font-size-h2);
    line-height: 1;
  }

  .accent {
    color: var(--color-accent);
  }

  .rows p {
    grid-column: 3;
    margin: 0;
  }

  .statement-small {
    font-size: 28px !important;
    font-weight: 700 !important;
  }

  @media (max-width: 1200px) {
    .columns {
      columns: 1;
    }

    .two,
    .rows {
      grid-template-columns: 1fr;
      row-gap: var(--space-block);
    }

    .gap {
      display: none;
    }

    .right {
      margin-top: var(--space-block);
    }

    .keyword,
    .rows p {
      grid-column: 1;
    }

    .rows p {
      margin-bottom: var(--space-block);
    }
  }

  @media (max-width: 768px) {
    p {
      font-size: 16px;
    }

    .lead {
      font-size: 18px;
      padding-left: 15px;
    }

    .statement-small {
      font-size: 20px !important;
    }
  }
</style>
