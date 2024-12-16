<script>

  // Initiale Werte für Richtung und Titel
  let isLatinToElbasan = true; // true = Latin -> Elbasan, false = Elbasan -> Latin
  let inputTitle = "latin";
  let outputTitle = "elbasan";

  // Eingabetext und Ausgabetext
  let inputText = ""; // Text im Eingabefeld
  let outputText = ""; // Text im Ausgabefeld

  // Char-Code-Mapping nur einmal definieren
  const charCodes = {
    ngj: '\u{10514}\u{1050B}',
    ng: '\u{10514}\u{1050A}',
    nd: '\u{10505}',
    dh: '\u{10506}',
    gj: '\u{1050B}',
    ll: '\u{10511}',
    nj: '\u{10515}',
    rr: '\u{1051A}',
    sh: '\u{1051C}',
    th: '\u{1051E}',
    zh: '\u{10524}',
    gh: '\u{10525}',
    kh: '\u{10527}',
    xh: '\u{10503}',
    a: '\u{10500}', b: '\u{10501}', c: '\u{10502}', ç: '\u{10503}',
    e: '\u{10507}', ë: '\u{10508}', f: '\u{10509}', d: '\u{10504}',
    g: '\u{1050A}', h: '\u{1050C}', i: '\u{1050D}', j: '\u{1050E}',
    k: '\u{1050F}', l: '\u{10510}', m: '\u{10512}', n: '\u{10513}',
    o: '\u{10516}', p: '\u{10517}', q: '\u{10518}', r: '\u{10519}',
    s: '\u{1051B}', t: '\u{1051D}', u: '\u{1051F}', v: '\u{10520}',
    x: '\u{10521}', y: '\u{10522}', z: '\u{10523}'
  };

  // Funktion, um das Mapping umzukehren
  const flipMapping = (mapping) => {
    return Object.entries(mapping).reduce((flipped, [key, value]) => {
      flipped[value] = key;
      return flipped;
    }, {});
  };

  // Transliteration basierend auf der Richtung
  const transliterate = (word) => {
    const activeMapping = isLatinToElbasan ? charCodes : flipMapping(charCodes);
    const pattern = new RegExp(Object.keys(activeMapping).join('|'), 'g');
    return word.replace(pattern, match => activeMapping[match]);
  };

  // Funktion zum Swappen der Richtung
  const swapDirection = () => {
    isLatinToElbasan = !isLatinToElbasan;

    // Tausche die Titel
    if (isLatinToElbasan) {
      inputTitle = "latin";
      outputTitle = "elbasan";
    } else {
      inputTitle = "elbasan";
      outputTitle = "latin";
    }

    // Resette Eingabe und Ausgabe
    inputText = "";
    outputText = "";
  };

  // Eingabe-Handler: Text transliterieren und Output aktualisieren
  const handleInput = (event) => {
    inputText = event.target.value;
    outputText = transliterate(inputText);
  };



  // Funktion, um den Inhalt aus der Zwischenablage zu lesen und in das Eingabefeld einzufügen
const pasteFromClipboard = async () => {
  try {
    const clipboardText = await navigator.clipboard.readText();
    inputText = clipboardText; // Fügt den Text in das Eingabefeld ein
    outputText = transliterate(inputText); // Transliterate den eingefügten Text direkt
  } catch (error) {
    console.error("Error accessing clipboard: ", error);
  }
};

// Funktion, um den Inhalt des Ausgabefeldes in die Zwischenablage zu kopieren
const copyToClipboard = () => {
  try {
    navigator.clipboard.writeText(outputText);
    console.log("Text copied to clipboard:", outputText);
  } catch (error) {
    console.error("Error copying text: ", error);
  }
};
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
    <!-- Router -->
  </div>
  <div class="logoIcon">
    <p>𐔋</p>
  </div>
</div>
  <div class="switchArea">
    <div class="input-container">
      <div class="input-header">
        <h2>{inputTitle}</h2>
        <button class="switch-button" title="Switch" aria-label="paste" on:click={pasteFromClipboard}></button>
      </div>
      <!-- Eingabetextfeld -->
      <textarea
        id="inp"
        class="styled-input"
        placeholder="input text"
        on:input={handleInput}
        bind:value={inputText}
      ></textarea>
      <div class="input-bottom-line"></div>
    </div>

    <div class="swap-container">
      <button class="swap-button" title="Swap" aria-label="Swap direction" on:click={swapDirection}></button>
    </div>

    <div class="input-container">
      <div class="input-header">
        <h2>{outputTitle}</h2>
        <button class="copy-button" title="Copy" aria-label="Copy text" on:click={copyToClipboard}></button>
      </div>
      <!-- Ausgabe in Echtzeit -->
      <textarea
        id="out"
        class="styled-input"
        placeholder="transliteration"
        readonly
        bind:value={outputText}
      ></textarea>
      <div class="input-bottom-line"></div>
    </div>
  </div>

  <div class="bottom-content">
    <div class="text-left">
      <div class="text-left-item">
        <p id="sign">!</p>
      </div>
      <div>
        <p id="disclaimer">
          elbasanscript is being misused on social media by far-right extremists. the developer of
          this page explicitly distances himself from such ideologies and condemns them.
        </p>
      </div>
    </div>
    <div class="text-right">
      <p id="author">
        developed by gjelbrim haskaj <br />
        designed by franz anhäupl
      </p>
      <p id="wiki">more info about the elbasan script on wikipedia</p>
    </div>
  </div>
</main>

<style>

.top-section {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  /* justify-content: baseline; */

}
.headingTop {
  display: flex;
  flex: 2;
}

.logoIcon {
  font-size: 128px;
  display: flex;
  flex: 1;
  color: #C3181E;
  margin: 0px;

}
/* Bestehende CSS bleibt wie es ist */
h2 {
  font-size: 64px;
  margin: 0;
}

.switchArea {
  display: flex;
  flex-direction: row;
  gap: 3%;
}

.swap-button {
  width: 64px;
  height: 64px;
  background-image: url("/src/assets/swap.svg");
  background-repeat: no-repeat;
  background-size: contain;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.swap-button:hover {
  opacity: 0.8;
}

.copy-button {
  width: 32px;
  height: 32px;
  background-image: url("/src/assets/copy.svg");
  background-repeat: no-repeat;
  background-size: contain;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.copy-button:hover {
  opacity: 0.8;
}

.switch-button {
  width: 32px;
  height: 32px;
  background-image: url("/src/assets/switch.svg");
  background-repeat: no-repeat;
  background-size: contain;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.switch-button:hover {
  opacity: 0.8;
}

.swap-container {
  display: flex;
}

.input-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 30%;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.styled-input {
  width: 100%;
  height: 150px;
  border: none;
  outline: none;
  background: none;
  font-size: 1rem;
  resize: none;
  padding-top: 10px;
  box-sizing: border-box;
}

.styled-input::placeholder {
  color: rgb(0, 0, 0);
  opacity: 0.7;
  font-family: "Univers", Arial, sans-serif;
}

.input-bottom-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #1d1d1b;
}

#sign {
  font-size: 120px;
  color: #C3181E;
  line-height: 1em;
  margin: auto;
}

main {
  width: 100%;
  padding-left: 10%;
}

h1 {
  font-size: 92px;
  line-height: 0.9em;
  padding-bottom: 5%;
}

#author,
#disclaimer {
  line-height: 1.2em;
  font-size: 20px;
}

#wiki {
  font-size: 14px;
}

.bottom-content {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 10%;
}

.text-left {
  display: flex;
  flex-direction: row;
  width: 30%;
}

.text-left-item {
  display: flex;
  flex-direction: row;
}

.text-right {
  display: flex;
  flex-direction: column;
  width: 30%;
}
</style>
