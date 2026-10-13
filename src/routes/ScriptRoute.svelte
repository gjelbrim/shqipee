<script>
  import TopSection from "../components/TopSection.svelte";
  import Transliterator from "../components/Transliterator.svelte";
  import BottomContent from "../components/BottomContent.svelte";
  import { PAGE_META, applyPageMeta } from "../utils/pageMeta.js";

  /** @type {{scriptType: import('../utils/scriptTypes.js').Script}} */
  let { scriptType } = $props();

  // title, description, canonical and Open Graph tags of this page (see pageMeta.js)
  $effect(() => applyPageMeta(PAGE_META[scriptType]));
</script>

<main>
  <TopSection {scriptType} />
  <Transliterator {scriptType} />
  <BottomContent {scriptType} />
</main>
