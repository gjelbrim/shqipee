<script>
  import TopSection from "../components/TopSection.svelte";
  import Transliterator from "../components/Transliterator.svelte";
  import BottomContent from "../components/BottomContent.svelte";

  let { scriptType } = $props();
</script>

<svelte:head>
  <title>shqip.ee | {scriptType}</title>
</svelte:head>

<main>
  <TopSection {scriptType} />
  <Transliterator {scriptType} />
  <BottomContent {scriptType} />
</main>
