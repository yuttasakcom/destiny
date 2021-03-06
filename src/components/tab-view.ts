import { DestinyElement, html, reactive, expression } from "../Destiny/_Destiny.js";
import "./to-do/to-do.js";
import "./visitor-demo.js";
import "./array-demo.js";
import "./time-diff.js";

customElements.define("tab-view", class extends DestinyElement {
  #selected = reactive(0);
  #tabs = reactive([
    {
      title: "Visitor demo",
      content: html`<visitor-demo></visitor-demo>`,
    },
    {
      title: "Todo",
      content: html`<to-do></to-do>`,
    },
    {
      title: "Array demo",
      content: html`<array-demo></array-demo>`,
    },
    {
      title: "Time difference",
      content: html`<time-diff></time-diff>`,
    },
  ]);

  render() {
    return html`
      <style>
        :host {
          --m: 16px;
          --s: 8px;
        }
        ul {
          padding: 0;
          padding-left: var(--m);
          display: flex;
          margin: 0;
        }
        li {
          list-style: none;
          padding: var(--s) var(--m);
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
          transition: background .2s;
          user-select: none;
        }

        li:not(.selected):hover {
          background: rgba(255, 255, 255, .05);
          cursor: pointer;
        }

        .selected, main {
          background: rgba(255,255,255,.1);
        }

        main {
          padding: var(--m);
          border-radius: 3px;
        }
      </style>
      <ul>
        ${this.#tabs.map((tab, i) => html`
          <li
            on:click=${() => this.#selected.value = i.value}
            class=${expression`${i} === ${this.#selected} && "selected"`}
          >${tab.title}</li>
        `)}
      </ul>
      <main>
        ${this.#selected.pipe(selected => this.#tabs[selected].content.value)}
      </main>
    `;
  }
});
