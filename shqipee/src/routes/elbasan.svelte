<script>
var flipped = false;

const toElbasan = () => {
  flipped = false;
  if (!document.getElementById('inp') || !document.getElementById('out')) return;
  document.getElementById('inp').placeholder = 'Text in Latin';
  document.getElementById('toLatin').checked = false;
  document.getElementById('inp').value = '';
  document.getElementById('out').value = '';
};

const toLatin = () => {
  flipped = true;
  if (!document.getElementById('inp') || !document.getElementById('out')) return;
  document.getElementById('inp').placeholder = 'Text in Elbasan (𐔇𐔐𐔁𐔀𐔛𐔀𐔓)';
  document.getElementById('toElbasan').checked = false;
  document.getElementById('inp').value = '';
  document.getElementById('out').value = '';
};

const convert = () => {
  if (!document.getElementById('inp') || !document.getElementById('out')) return;
  document.getElementById('out').value = transliterate(document.getElementById('inp').value);
};


const transliterate = (word) => {
  word = word.toLowerCase()
  let charCodes = {
    //three letter keys
    ngj: '\u{10514}\u{1050B}',
    //two letter keys
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
    //single letter keys
    a: '\u{10500}',
    b: '\u{10501}',
    c: '\u{10502}',
    ç: '\u{10503}',
    e: '\u{10507}',
    ë: '\u{10508}',
    f: '\u{10509}',
    d: '\u{10504}',
    g: '\u{1050A}',
    h: '\u{1050C}',
    i: '\u{1050D}',
    j: '\u{1050E}',
    k: '\u{1050F}',
    l: '\u{10510}',
    m: '\u{10512}',
    n: '\u{10513}',
    o: '\u{10516}',
    p: '\u{10517}',
    q: '\u{10518}',
    r: '\u{10519}',
    s: '\u{1051B}',
    t: '\u{1051D}',
    u: '\u{1051F}',
    v: '\u{10520}',
    x: '\u{10521}',
    y: '\u{10522}',
    z: '\u{10523}'
  };

  if (flipped) charCodes = objectFlip(charCodes);

  const pattern = new RegExp(
    Object.keys(charCodes).join('|'),
    'g'
  );
  return word.replace(pattern, match => charCodes[match]);
}

function objectFlip(obj) {
  return Object.keys(obj).reduce((ret, key) => {
    ret[obj[key]] = key;
    return ret;
  }, {});
};
</script>

<main>
    <div>
        <!-- roten linie -->
    </div>
    <div>
        <h1>elbasan <br> alphabet</h1>
    </div>
    <div>
        <!-- Router -->
    </div>
    <div>
        <!-- logo -->
    </div>
    <div class="switchArea">
        <div class="input-container">
            <div class="input-header">
              <h2>latin</h2>
              <button class="switch-button" title="Switch"></button>
            </div>
            <input id="inp" class="styled-input" placeholder="input text" on:input={convert}>
            <div class="input-bottom-line"></div>
          </div>
          <div class="swap-container">
            <button class="swap-button" title="Swap"></button>
          </div>
          

      <div class="input-container">
        <div class="input-header">
          <h2>elbasan</h2>
          <button class="copy-button" title="Copy"></button>
        </div>
        <input id="out" class="styled-input" placeholder="transliteration" readonly>
        <div class="input-bottom-line"></div>
      </div>

      </div>

    <div class="bottom-content">
        <div class="text-left">
            <div class="text-left-item">
                <p id="sign">!</p>
            </div>
            <div>
                <p id="disclaimer">elbasanscript is being misused on social media by far-right extremists. the developer of this page explicitly distances himself from such ideologies and condemns them.</p>
            </div>
        </div>
        <div class="text-right">
            <p id="author">
                developed by gjelbrim haskaj <br>
                designed by franz anhäupl
            </p>
            <p id="wiki">
                more info about the elbasan script on wikipedia
            </p>
        </div>
    </div>

</main>


<style>

h2 {
    font-size: 64px;
    margin: 0;
}

.switchArea {
    display: flex;
    flex-direction: row;
    gap: 3%;

}

textarea::placeholder {
  color: rgb(0, 0, 0);
  opacity: 1;
  font-family: "Univers", Arial, sans-serif;
  opacity: 0.7;
}
.swap-button {
    width: 64px; /* Breite des Buttons */
  height: 64px; /* Höhe des Buttons */
  background-image: url("/src/assets/swap.svg"); /* Pfad zum SVG-Bild */
  background-repeat: no-repeat;
  background-size: contain; /* Bildgröße anpassen */
  background-color: transparent; /* Hintergrund transparent */
  border: none; /* Keine Rahmenlinie */
  cursor: pointer; /* Mauszeiger als Zeiger */
}
.swap-button:hover {
  opacity: 0.8; /* Leichter Transparenz-Effekt beim Hover */

}
.copy-button {
    width: 32px; /* Breite des Buttons */
  height: 32px; /* Höhe des Buttons */
  background-image: url("/src/assets/copy.svg"); /* Pfad zum SVG-Bild */
  background-repeat: no-repeat;
  background-size: contain; /* Bildgröße anpassen */
  background-color: transparent; /* Hintergrund transparent */
  border: none; /* Keine Rahmenlinie */
  cursor: pointer; /* Mauszeiger als Zeiger */
}
.copy-button:hover {
  opacity: 0.8; /* Leichter Transparenz-Effekt beim Hover */
}

/* Switch-Button anpassen */
.switch-button {
  width: 32px; /* Breite des Buttons */
  height: 32px; /* Höhe des Buttons */
  background-image: url("/src/assets/switch.svg"); /* Pfad zum SVG-Bild */
  background-repeat: no-repeat;
  background-size: contain; /* Bildgröße anpassen */
  background-color: transparent; /* Hintergrund transparent */
  border: none; /* Keine Rahmenlinie */
  cursor: pointer; /* Mauszeiger als Zeiger */
}

.switch-button:hover {
  opacity: 0.8; /* Leichter Transparenz-Effekt beim Hover */
}

.swap-container {
    display: flex;
}
/* Container-Styling */
.input-container {
display: flex;
flex-direction: column;
  width: 100%;
  max-width: 30%;
  /* margin: 1rem 0;
  padding: 1rem; */
  border-radius: 8px;
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
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
  font-family: Arial, sans-serif;
  resize: none;
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
    /* line-height: 0px; */
    align-items: baseline;
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
#author, #disclaimer { 
line-height: 1.2em;
font-size: 20px;
}
#wiki {
    font-size: 14px;

}

.bottom-content {
    display: flex;
    flex-direction: row;
    display: wrap;
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