<script>
import {ScriptType} from '../utils/scriptTypes.js';
let { scriptType } = $props();

const SCRIPT_INFO = {
    [ScriptType.ELBASAN]: {
        wikiLink: "https://en.wikipedia.org/wiki/Elbasan_alphabet"
    },
    [ScriptType.VITHKUQI]: {
        wikiLink: "https://en.wikipedia.org/wiki/Vithkuqi_alphabet"
    },
    [ScriptType.TODHRI]: {
        wikiLink: "https://en.wikipedia.org/wiki/Todhri_alphabet"
    }
};

const wikiLink = $derived(SCRIPT_INFO[scriptType]?.wikiLink ?? "");
const scriptName = $derived(SCRIPT_INFO[scriptType] ? scriptType : "");
</script>

<div class="bottom-content">
    <div class="text-left">
      <div class="text-left-item">
        <div class="disclaimer-wrapper">
          <span class="label warning-label">important note</span>
          <p id="disclaimer">
              {#if scriptType === ScriptType.ELBASAN}
                  elbasanscript is being misused on social media by far-right extremists. the developer of
                  this page explicitly <span class="highlight">distances himself</span> from such ideologies and condemns them.
              {:else if scriptType === ScriptType.VITHKUQI}
                  language and pronunciation <span class="highlight">change over time</span>. therefore, vithkuqi <span class="highlight">cannot be transliterated 1:1</span> into latin and vice versa. support outside of this site is <span class="highlight">very limited</span>.
              {:else if scriptType === ScriptType.TODHRI}
                  todhri alphabet has been added to the <span class="highlight">unicode standard in 2024</span>. so far <span class="highlight">very few fonts</span> support it, so it will <span class="highlight">often not display</span> outside of this site.
              {/if}
          </p>
        </div>
      </div>
    </div>
    <div class="spacer"></div>
        <div class="text-right">
      <div class="credits-section">
        <div class="credit-block">
          <span class="label">developed by</span>
          <a href="https://github.com/gjelbrim" target="_blank" rel="noopener noreferrer" class="credit-link">gjelbrim haskaj<span class="visually-hidden"> (opens in a new tab)</span></a>
        </div>
        <div class="credit-block">
          <span class="label">designed by</span>
          <a href="https://github.com/Litorian113" target="_blank" rel="noopener noreferrer" class="credit-link">franz anhäupl<span class="visually-hidden"> (opens in a new tab)</span></a>
        </div>
      </div>

      <div class="wiki-section">
        <span class="label">learn more</span>
        <a href={wikiLink} target="_blank" rel="noopener noreferrer" class="wiki-link">
          read about {scriptName} on wikipedia <span class="arrow" aria-hidden="true">↗</span><span class="visually-hidden"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  </div>

<style>
  .credits-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
  }

  .credit-block {
    display: flex;
    flex-direction: column;
  }

  .label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.6;
    margin-bottom: 2px;
  }

  .credit-link {
    font-size: 24px;
    font-weight: bold;
    text-decoration: none;
    color: var(--color-ink);
    transition: color 0.2s ease;
  }

  .credit-link:hover {
    color: var(--color-accent);
  }

  .wiki-section {
    display: flex;
    flex-direction: column;
  }

  .wiki-link {
    font-size: 18px;
    text-decoration: none;
    color: var(--color-ink);
    border-bottom: 1px solid var(--color-ink);
    padding-bottom: 2px;
    display: inline-block;
    width: fit-content;
    transition: all 0.2s ease;
  }

  .wiki-link:hover {
    color: var(--color-accent);
    border-bottom-color: var(--color-accent);
  }

  .arrow {
    font-size: 0.8em;
    margin-left: 5px;
  }

  #disclaimer {
    line-height: 1.3em;
    font-size: 20px;
    margin-top: 5px;
    max-width: 500px;
    font-weight: 500;
  }

  .disclaimer-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-left: var(--accent-bar-width) solid var(--color-accent);
    padding-left: 20px;
    transition: all 0.3s ease;
  }

  .disclaimer-wrapper:hover {
    border-left-width: 18px;
    padding-left: 16px;
  }

  .warning-label {
    color: var(--color-accent);
    opacity: 1;  /* .label's 0.6 would drop the red below 4.5:1 contrast */
    font-weight: 700;
    margin-bottom: 5px;
  }

  .highlight {
    color: var(--color-accent);
    font-weight: 700;
  }

  .bottom-content {
    /* opaque so Chrome keeps subpixel text antialiasing; this block ends up on its
       own compositing layer next to the output textarea */
    background: var(--color-bg);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .spacer {
    width: var(--column-gap);
    min-width: var(--column-gap);
  }

  .text-left {
    display: flex;
    flex-direction: row;
    flex: 1;
    min-width: var(--column-min-width);
  }

  .text-left-item {
    display: flex;
    flex-direction: row;
  }

  .text-right {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: var(--column-min-width);
  }

  a,
  a:visited {
    color: var(--color-text);
    text-decoration: underline;
  }

  @media (max-width: 1200px) {
    .bottom-content {
      flex-direction: column;
    }

    .spacer {
      display: none;
    }

    .text-right {
      padding-top: 40px;
      padding-left: 45px;
      padding-bottom: 80px;
    }
  }

  @media (max-width: 768px) {
    #disclaimer {
      font-size: 16px;
    }

    .disclaimer-wrapper {
      padding-left: 15px;
    }

    .disclaimer-wrapper:hover {
      border-left-width: 10px;
      padding-left: 12px;
    }

    .text-right {
      padding-left: 20px;
    }
  }
</style>
