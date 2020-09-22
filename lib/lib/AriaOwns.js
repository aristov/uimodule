import { AriaTypeIdRefList } from './AriaTypeIdRefList'

/**
 * Identifies an element (or elements) in order to define a visual,
 *  functional, or contextual parent/child relationship between DOM elements
 *  where the DOM hierarchy cannot be used to represent the relationship.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-owns
 */
export class AriaOwns extends AriaTypeIdRefList
{
}

/**
 * @alias AriaOwns
 */
export { AriaOwns as Owns }
