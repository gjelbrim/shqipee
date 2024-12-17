<script>
    import Navbar from "./Navbar.svelte";
    import {ScriptType} from '../utils/scriptTypes.js';
    export let scriptType;
</script>

  <div class="top-section">
    <div class="redLine">
      <!-- red line -->
    </div>
    <div class="headingTop">
        {#if scriptType === ScriptType.ELBASAN}
            <h1>elbasan <br> alphabet</h1>
        {:else if scriptType === ScriptType.VITHKUQI}
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
  .top-section {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-bottom: 10%;
  }

  .headingTop {
  display: flex;
  flex: 2;
  border-left: 14px solid #C3181E;
  padding-left: 10px;
  }

  .insertNav {
    display: flex;
  }

  .logoIcon {
    font-size: 128px;
    display: flex;
    flex: 1;
    color: #C3181E;
    margin: 0px;
    justify-content:center;
  }
</style>