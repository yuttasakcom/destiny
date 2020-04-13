import isText from "../typeChecks/isText.js";
import isElement from "../typeChecks/isElement.js";
import { prepareContentSlots } from "./prepareContentSlots.js";
import { IUnpreparedContentSlot } from "./interfaces.js";

export function resolveSlots (
  template: HTMLTemplateElement,
) {
  const walker = document.createTreeWalker(
    template.content,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
  );
  const contentSlots: IUnpreparedContentSlot[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (isText(node)) {
      const matches = node.wholeText.matchAll(/@internal_([0-9]+)/g);
      const fragment = {
        node,
        slots: [...matches].map(match => ({
          index: Number(match[1]),
          start: match.index!,
          end: match.index! + match[0].length,
        })),
      }
      if (fragment.slots.length) {
        contentSlots.push(fragment);
      }
    } else if (isElement(node)) {
      for (const {value, name} of node.attributes) {
        if (
          value.startsWith("@internal_") ||
          name.startsWith("@internal_")
        ) {
          node.setAttribute("data-DestinyAttributeSlot", "");
        }
      }
    }
  }

  prepareContentSlots(contentSlots);
}