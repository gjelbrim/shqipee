<script>
  import Navbar from "../components/Navbar.svelte";
  import Transliterator from "../components/transliterator.svelte";
  import BottomContent from "../components/bottomContent.svelte";
</script>


<main>
  <div class="top-section">
  <div class="redLine">
    <!-- rote Linie -->
  </div>
  <div class="headingTop">
    <h1>elbasan <br> alphabet</h1>
  </div>
  <div class="insertNav">
    <!-- nav -->
    <Navbar />
    <!-- Router -->
  </div>
  <div class="logoIcon">
    <p>𐔋</p>
  </div>
</div>


<Transliterator scriptType={"elbasan"} />
<BottomContent scriptType={"elbasan"} />
</main>
