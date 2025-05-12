import './style.css'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>PHZR BLZR!</h1>
        
    <h3>Server-Sent Events with htmx</h3>
      <div
        id="inventoryPanel"
        hx-ext="sse"
        sse-connect="/api/sse"
        sse-swap="inventoryUpdate"
      >
        "Waiting for server updates..."
      </div>

    <div>
      <h1>Raid Activity</h1>
      <button 
        id="attack-button" 
        hx-post="/api/attack" 
        hx-trigger="click" 
        hx-include="[name=damage]" 
        hx-target="#bossPanel"
        hx-swap="innerHTML"
      >
        Attack Boss
      </button>
      <input type="hidden" name="damage" value="50" />

      <div id="bossPanel">
        <p id="boss-health">Boss Health: 1000</p>
        <p id="boss-status">Boss Status: alive</p>
      </div>
    </div>

  </div>
`
