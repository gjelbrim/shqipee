<script>
    import Navbar from "./Navbar.svelte";

    const ScriptType = {
        ELBASAN: 'elbasan',
        VITHKUQI: 'vithkuqi'
    }
    export let scriptType;
</script>

<div class="top-section">
    <div class="redLine">
      <!-- red line -->
    </div>
    <div class="headingTop">
        {#if scriptType === 'elbasan'}
            <h1>elbasan <br> alphabet</h1>
        {:else if scriptType === 'vithkuqi'}
            <h1>vithkuqi <br> alphabet</h1>
        {/if}
    </div>
    <div class="insertNav">
      <!-- nav -->
      <Navbar />
    </div>
    <div class="logoIcon">
      <p>𐔋</p>
    </div>
  </div>

<style>

</style>