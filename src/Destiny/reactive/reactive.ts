import { ReactiveArray, ReactivePrimitive, reactiveObject } from "../_Destiny.js";
import { isObject } from "../typeChecks/isObject.js";
import { IReactiveValueType } from "./types/IReactiveRecursive.js";
import { IReactive } from "./types/IReactive.js";
import { isSpecialCaseObject } from "./reactiveObject/specialCaseObjects.js";
import { isReactive } from "../typeChecks/isReactive.js";

/**
 * A polymorphic convenience function that will convert any value into a reactive value recursively. `Array`s are converted into `ReactiveArray`s. Most `Object`s get their keys converted into reactive items using the same algorithm (see `reactiveObject.js` for more details). Other values are converted into `ReactivePrimitive`s.
 * 
 * @param initialValue The value to be made reactive
 * @param options.fallback A fallback value to be displayed when the initial value is a pending `Promise`
 * @param options.parent Another reactive object to whom any reactive items created should report to when updating, so updates can correctly propagate to the highest level
 */
function reactive<T extends Promise<any>> (
  initialValue: T,
  options: {
    fallback: T,
    parent?: IReactive<any>,
  },
): ReactivePrimitive<T extends Promise<infer V> ? V : never>;
function reactive<T> (
  initialValue: T,
  options?: {
    parent?: IReactive<any>,
  },
): IReactiveValueType<T>;
function reactive<T> (
  initialValue: T,
  options: {
    fallback?: T,
    parent?: IReactive<any>,
  } = {},
) {
  if (isReactive(initialValue)) {
    // console.log(initialValue, "was already reactive");
    return initialValue;
  } else if (initialValue instanceof Array) {
    const newArr = new ReactiveArray(...initialValue);
    newArr.bind(() => options?.parent?.update());
    // console.log(initialValue, "was an Array, and became", newArr);
    return newArr;
  } else if (initialValue instanceof Promise) {
    const ref = new ReactivePrimitive(options?.fallback);
    ref.bind(() => options?.parent?.update())
    initialValue.then(value => ref.value = value);
    // console.log(initialValue, "was a Promise, and became", ref);
    return ref;
  } else if (isSpecialCaseObject(initialValue)) {
    const ref = new ReactivePrimitive(initialValue);
    options.parent && ref.bind(() => options?.parent?.update());
    // console.log(initialValue, "was an Object, and became", ref);
    return ref;
  } else if (isObject(initialValue)) {
    const ref = reactiveObject(initialValue, options?.parent);
    // console.log(initialValue, "was an Object, and became", ref);
    return ref;
  } else {
    const ref = new ReactivePrimitive(initialValue);
    ref.bind(() => options?.parent?.update());
    // console.log(initialValue, "was a primitive, and became", ref);
    return ref;
  }
}

export {reactive};
