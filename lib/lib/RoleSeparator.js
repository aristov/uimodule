import { RoleStructure } from './RoleStructure'

/**
 * A divider that separates and distinguishes sections of content or groups of menuitems.
 * @see https://www.w3.org/TR/wai-aria-1.1/#separator
 * @mixes RoleWidget
 */
export class RoleSeparator extends RoleStructure
{
}

RoleSeparator.abstract = false

export { RoleSeparator as Separator }
