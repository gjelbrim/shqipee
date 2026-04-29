<script>
import {ScriptType} from '../utils/scriptTypes.js';
export let scriptType;

let wikiLink = "";
let scriptName = "";

$: {
    if (scriptType === ScriptType.ELBASAN) {
        wikiLink = "https://en.wikipedia.org/wiki/Elbasan_alphabet";
        scriptName = "elbasan";
    } else if (scriptType === ScriptType.VITHKUQI) {
        wikiLink = "https://en.wikipedia.org/wiki/Vithkuqi_alphabet";
        scriptName = "vithkuqi";
    } else if (scriptType === ScriptType.TODHRI) {
        wikiLink = "https://en.wikipedia.org/wiki/Todhri_alphabet";
        scriptName = "todhri";
    }
}
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
                  todhri alphabet has been added to the <span class="highlight">unicode standard in 2024</span>. currently there is <span class="highlight">no font mapping</span> this alphabet. therefore it <span class="highlight">cannot be displayed</span> outside of this site.
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
          <a href="http://github.com/gjelbrim" target="_blank" class="credit-link">gjelbrim haskaj</a>
        </div>
        <div class="credit-block">
          <span class="label">designed by</span>
          <a href="https://github.com/Litorian113" target="_blank" class="credit-link">franz anhäupl</a>
        </div>
      </div>

      <div class="wiki-section">
        <span class="label">learn more</span>
        <a href={wikiLink} target="_blank" class="wiki-link">
          read about {scriptName} on wikipedia <span class="arrow">↗</span>
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
    color: #1d1d1b;
    transition: color 0.2s ease;
  }

  .credit-link:hover {
    color: #c3181e;
  }

  .wiki-section {
    display: flex;
    flex-direction: column;
  }

  .wiki-link {
    font-size: 18px;
    text-decoration: none;
    color: #1d1d1b;
    border-bottom: 1px solid #1d1d1b;
    padding-bottom: 2px;
    display: inline-block;
    width: fit-content;
    transition: all 0.2s ease;
  }

  .wiki-link:hover {
    color: #c3181e;
    border-bottom-color: #c3181e;
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
    border-left: 14px solid #c3181e;
    padding-left: 20px;
    transition: all 0.3s ease;
  }

  .disclaimer-wrapper:hover {
    border-left-width: 18px;
    padding-left: 16px;
  }

  .warning-label {
    color: #c3181e;
    font-weight: 700;
    margin-bottom: 5px;
  }

  .highlight {
    color: #c3181e;
    font-weight: 700;
  }

  .bottom-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .spacer {
    width: 200px;
    min-width: 200px;
  }

  .text-left {
    display: flex;
    flex-direction: row;
    flex: 1;
    min-width: 300px;
  }

  .text-left-item {
    display: flex;
    flex-direction: row;
  }

  .text-right {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 300px;
  }

  a,
  a:visited {
    color: black;
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
      border-left-width: 7px;
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
