import { createTemplateObject } from "./createTemplateObject.js";
import { hookSlotsUp } from "./hookSlotsUp/_hookSlotsUp.js";

/** Used to cache parsed `DocumentFragment`s so looped templates don't need to be reparsed on each iteration. */
const templateCache = new WeakMap<
  TemplateStringsArray,
  HTMLTemplateElement
>();

/**
 * Parses the template into a `DocumentFragment` and hooks up reactivity logic to keep the view synchronized with the state of the reactive items prived in the slots.
 * @param strings The straing parts of the template
 * @param props The slotted values in the template
 */
export function html (
  strings: TemplateStringsArray,
  ...props: unknown[]
) {
  let template = templateCache.get(strings);

  if (!template) {
    templateCache.set(
      strings,
      template = createTemplateObject(strings),
    );
  };

  return () => {
    const content = template!.content.cloneNode(true) as DocumentFragment;
  
    hookSlotsUp(
      content,
      props,
    );
  
    return content;
  }
}
