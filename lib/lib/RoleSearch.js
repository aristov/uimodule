import { RoleLandmark } from './RoleLandmark'

/**
 * A landmark region that contains a collection of items and objects that,
 *  as a whole, combine to create a search facility.
 * @see https://www.w3.org/TR/wai-aria-1.1/#search
 */
export class RoleSearch extends RoleLandmark
{
}

RoleSearch.abstract = false

export { RoleSearch as Search }
