<script>
    import { onMount } from "svelte";
  
    // Aktuelle Route
    let activeRoute = window.location.hash || "#/";
  
    // Funktion, um die Route zu aktualisieren
    const updateRoute = () => {
      activeRoute = window.location.hash || "#/";
    };
  
    // Event-Listener hinzufügen, um Änderungen der Route zu überwachen
    onMount(() => {
      window.addEventListener("hashchange", updateRoute);
      updateRoute(); // Initiale Route setzen
  
      // Cleanup des Event-Listeners beim Verlassen der Komponente
      return () => window.removeEventListener("hashchange", updateRoute);
    });
  </script>
  
  <nav class="navbar">
    <a
      href="#/"
      class:active={activeRoute === "#/"}
    >
      elbasan
    </a>
    <a
      href="#/vithkuqi"
      class:active={activeRoute === "#/vithkuqi"}
    >
      vithkuqi
    </a>
  </nav>
  
  <style>
  .navbar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    margin-bottom: 20px;
    background-color: #DBE1D5;
  }
  
  .navbar a {
    text-decoration: none;
    font-size: 1.2rem;
    color: #333;
    position: relative; /* Für die Unterstreichung */
  }
  
  .navbar a.active {
    color: #C3181E; /* Rot für aktive Seite */
  }
  
  .navbar a.active::after {
    content: "";
    position: absolute;
    bottom: -5px; /* Position der Unterstreichung */
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #C3181E; /* Unterstrich-Farbe */
  }
  </style>
  