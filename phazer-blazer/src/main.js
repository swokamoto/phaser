import './style.css'

let attackValue = 50;

document.querySelector('#app').innerHTML = /*html*/ `
  <div>
    <h1>PHZR BLZR!</h1>

    <div
      hx-ext="sse"
      sse-connect="/api/raid"
      sse-swap="updateBoss"
    >
      Boss Health:
    </div>

    <div>
      <h2>Incoming Threat</h2>

      <div>Attack Value: <span id="attack-display">${attackValue}</span></div>
      <input type="hidden" id="attack-value" name="damage" value="${attackValue}" />
      <button 
        id="attack-button" 
        hx-post="/api/attack"
        hx-swap="none"
        hx-include="#attack-value"
      >
        Attack
      </button>



    </div>
  </div>
`; // <-- This closing backtick and parenthesis were missing!