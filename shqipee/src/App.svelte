<script>
    import { goto } from '$app/navigation'; // Gilt für SvelteKit

let selected = 'elbasan';

// Wenn sich der Wert ändert, wird die Navigation ausgeführt
$: if (selected) {
    goto(`/${selected}`);
}
</script>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/> 
    <title>Elbasan Alphabet</title>
</head>
<body>
  <header>
   <div>
    <h1>
      elbasans alphabet
    </h1>
   </div> 
   <div>
    <select bind:value={selected}>
      <option value="elbasan">elbasan</option>
      <option value="vithkuqi">vithkuqi</option>
  </select>
   </div>
</header>
</body>



<style>


</style>