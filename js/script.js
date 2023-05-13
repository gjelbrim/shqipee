const copyToClipboard = () => {
  const outputElement = document.getElementById('out');
  outputElement.select();
  outputElement.setSelectionRange(0, 99999);
  document.execCommand('copy');
  document.getElementById('copy').className = '';
  document.getElementById('copy').innerHTML = '🇦🇱';
  setTimeout(() => {
    document.getElementById('copy').className = 'fa-solid fa-clone';
    document.getElementById('copy').innerHTML = '';
  }, 1000);
};

const paste = () => {
  var inputField = document.getElementById("inp");
  navigator.clipboard.readText().then(function (text) {
    inputField.value = text;
    convert();
    document.getElementById('paste').className = '';
    document.getElementById('paste').innerHTML = '🇦🇱';
    setTimeout(() => {
      document.getElementById('paste').className = 'fa-solid fa-paste';
      document.getElementById('paste').innerHTML = '';
    }, 1000);
  });
};

let firstTitle = false;

const toggleTitle = () => {
  firstTitle = !firstTitle;
  document.title = firstTitle ? "🇦🇱 𐔇𐔐𐔁𐔀𐔛𐔀𐔓𐔛𐔂𐔙𐔍𐔗𐔝" : "elbasanscri.pt 🇦🇱";
  setTimeout(toggleTitle, 2500);
}

toggleTitle();

fetch(`https://api.github.com/repos/gjelbrim/elbasanscript/branches/main`)
  .then(response => response.json())
  .then(branchData => {
    const branchName = branchData.name;

    fetch(`https://api.github.com/repos/gjelbrim/elbasanscript/commits?sha=${branchName}`)
      .then(response => response.json())
      .then(commitData => {
        const latestCommitHash = commitData[0].sha.substring(0, 6);
        const footerText = `v.${branchName}-${latestCommitHash}`;
        const badgeImg = document.getElementById('commit')
        badgeImg.src.replace("commit",footerText);
      })
  })