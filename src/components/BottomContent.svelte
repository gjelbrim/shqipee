<script>
import {ScriptType} from '../utils/scriptTypes.js';
export let scriptType;
</script>

<div class="bottom-content">
    <div class="text-left">
      <div class="text-left-item">
        <p id="sign">!</p>
        <p id="disclaimer">
            {#if scriptType === ScriptType.ELBASAN}
                elbasanscript is being misused on social media by far-right extremists. the developer of
                this page explicitly distances himself from such ideologies and condemns them.
            {:else if scriptType === ScriptType.VITHKUQI}
                language and pronunciation change over time. therefore, vithkuqi cannot be transliterated 1:1 into latin and vice versa. support outside of this site is very limited.
            {:else if scriptType === ScriptType.TODHRI}
                todhri alphabet has been added to the unicode standard in 2024. currently there is no font mapping this alphabet. therefore it cannot be displayed outside of this site.
            {/if}
        </p>
      </div>
      <div>
      </div>
    </div>
    <div class="text-right">
      <p id="author">
        developed by <a href="http://github.com/gjelbrim" target="_blank">gjelbrim haskaj</a> <br />
        designed by <a href="https://github.com/Litorian113" target="_blank">franz anhäupl</a>
      </p>
      <p id="wiki">
        {#if scriptType === ScriptType.ELBASAN}
            more info about the elbasan alphabet on <a href="https://en.wikipedia.org/wiki/Elbasan_alphabet" target="_blank">wikipedia</a>
        {:else if scriptType === ScriptType.VITHKUQI}
            more info about the vithkuqi alphabet on <a href="https://en.wikipedia.org/wiki/Vithkuqi_alphabet" target="_blank">wikipedia</a>
        {:else if scriptType === ScriptType.TODHRI}
            more info about the todhri alphabet on <a href="https://en.wikipedia.org/wiki/Todhri_alphabet" target="_blank">wikipedia</a>
        {/if}
      </p>
    </div>
  </div>

<style>
  #author,
  #disclaimer {
    line-height: 1.2em;
    font-size: 20px;
    margin-top: 10px;
  }

  #wiki {
    font-size: 14px;
  }

  .bottom-content {
    display: flex;
    flex-direction: row;
    gap: 20%;
  }

  #sign {
    font-size: 120px;
    color: #c3181e;
    line-height: 1em;
    margin: auto;
  }

  .text-left {
    display: flex;
    flex-direction: row;
    flex: 2;
    min-width: 300px;
    max-width: 450px;
  }

  .text-left-item {
    display: flex;
    flex-direction: row;
  }

  .text-right {
    display: flex;
    flex-direction: column;
    flex: 2;
    min-width: 300px;
    max-width: 450px;
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

    .text-right {
      padding-top: 40px;
      padding-left: 45px;
      padding-bottom: 80px;
    }
  }

  @media (max-width: 768px) {
    #author,
    #disclaimer {
      font-size: 16px;
    }

    #sign {
      font-size: 80px;
    }

    .text-right {
      padding-left: 20px;
    }
  }
</style>
