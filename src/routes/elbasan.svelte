<script>
  import TopSection from "../components/TopSection.svelte";
  import Transliterator from "../components/Transliterator.svelte";
  import BottomContent from "../components/BottomContent.svelte";
  import { ScriptType } from "../utils/scriptTypes.js";
  const scriptType = ScriptType.ELBASAN;
</script>

<TopSection scriptType={scriptType} />
<Transliterator scriptType={scriptType} />
<BottomContent scriptType={scriptType} />
