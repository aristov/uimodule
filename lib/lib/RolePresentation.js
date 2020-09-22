import { RoleStructure } from './RoleStructure'

/**
 * An element whose implicit native role semantics will not be mapped to the accessibility API.
 * @see https://www.w3.org/TR/wai-aria-1.1/#presentation
 */
export class RolePresentation extends RoleStructure
{
}

RolePresentation.abstract = false

export { RolePresentation as Presentation }
