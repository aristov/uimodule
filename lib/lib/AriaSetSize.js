import { AriaTypeInteger } from './AriaTypeInteger'

/**
 * Defines the number of items in the current set of listitems or treeitems.
 *  Not required if all elements in the set are present in the DOM.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-setsize
 */
export class AriaSetSize extends AriaTypeInteger
{
}

/**
 * @alias AriaSetSize
 */
export { AriaSetSize as SetSize }
