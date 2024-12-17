<script>
  import TopSection from "../components/TopSection.svelte";
  import Transliterator from "../components/Transliterator.svelte";
  import BottomContent from "../components/BottomContent.svelte";
  const scriptType = "elbasan";
</script>

<TopSection scriptType={scriptType} />
<Transliterator scriptType={scriptType} />
<BottomContent scriptType={scriptType} />
