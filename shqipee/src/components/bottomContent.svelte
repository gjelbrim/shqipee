<script>
export let isElbasan = false;
</script>

<div class="bottom-content">
    <div class="text-left">
      <div class="text-left-item">
        <p id="sign">!</p>
        <p id="disclaimer">
            {#if isElbasan}
                elbasanscript is being misused on social media by far-right extremists. the developer of
                this page explicitly distances himself from such ideologies and condemns them.
            {:else}
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
      <p id="wiki"><br>more info about the elbasan alphabet on <a href="https://en.wikipedia.org/wiki/Elbasan_alphabet">wikipedia</a></p>
    </div>
  </div>

<style>

</style>