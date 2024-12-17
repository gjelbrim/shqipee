<script>
export const ScriptType = {
  ELBASAN: 'elbasan',
  VITHKUQI: 'vithkuqi'
}
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
                Language and pronunciation change over time. Therefore, Vithkuqi cannot be transliterated 1:1 into Latin and vice versa. Support outside of this site is very limited.
            {/if}
        </p>
      </div>
      <div>
      </div>
    </div>
    <div class="text-right">
      <p id="author">
        developed by <a href="http://github.com/gjelbrim">gjelbrim haskaj</a> <br />
        designed by <a href="https://github.com/Litorian113">franz anhäupl</a>
      </p>
      <p id="wiki">
        {#if scriptType === ScriptType.ELBASAN}
            more info about the elbasan alphabet on <a href="https://en.wikipedia.org/wiki/Elbasan_alphabet">wikipedia</a>
        {:else if scriptType === ScriptType.VITHKUQI}
            more info about the vithkuqi alphabet on <a href="https://en.wikipedia.org/wiki/Vithkuqi_alphabet">wikipedia</a>
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
color: #C3181E;
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

a, a:visited {
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
</style>