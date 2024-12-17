<script>
  import TopSection from "../components/TopSection.svelte";
  import Transliterator from "../components/transliterator.svelte";
  import BottomContent from "../components/bottomContent.svelte";
  const scriptType = "elbasan";
</script>

<TopSection scriptType={scriptType} />
<Transliterator scriptType={scriptType} />
<BottomContent scriptType={scriptType} />
