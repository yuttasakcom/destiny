import { DestinyElement, html, reactive, expression } from "../Destiny/_Destiny.js";

function formatTimeFragment (
  input: number,
) {
  return String(input).padStart(2, "0");
}

function formatTime (
  duration: number,
) {
  const days    = Math.floor(duration / 1000 / 60 / 60 / 24);
  const hours   = Math.floor(duration / 1000 / 60 / 60 % 24);
  const minutes = Math.floor(duration / 1000 / 60 % 60);
  const seconds = Math.floor(duration / 1000 % 60);
  const daysString = days ? `${days}, ` : "";
  const hoursString = `${hours}:`;
  const minutesString = formatTimeFragment(minutes);
  const secondsString = seconds ? `:${formatTimeFragment(seconds)}`: "";
  return [daysString, hoursString, minutesString, secondsString].join("");
}

customElements.define("time-diff", class extends DestinyElement {
  #tasks = reactive([this.createTask()]); //initialize an array of tasks, with one task in it

  createTask () {
    return {
      start: new Date(0),
      end: new Date(0),
      name: "new task",
    };
  }

  render() {
    return html`
      ${this.#tasks.map(task => html`
        <div>
          <label>
            Start:
            <input
              type=time
              prop:value-as-date=${task.start}
            >
          </label>
          <label>
            End: 
            <input
              type=time
              prop:value-as-date=${task.end}
            >
          </label>
          <label>
            Name:
            <input
              type="text"
              prop:value=${task.name}
            >
          </label>
          <br>
          Duration of "${task.name}": ${expression`
            ${formatTime}(Number(${task.end}) - Number(${task.start}))
          `}
        </div>`
      )}
      <input
        type=button
        on:click=${() => this.#tasks.push(this.createTask())}
        value="New task"
      >
    `;
  }
});
