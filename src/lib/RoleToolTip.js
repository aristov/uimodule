import { RoleSection } from './RoleSection'

/**
 * A contextual popup that displays a description for an element.
 * @see https://www.w3.org/TR/wai-aria-1.1/#tooltip
 */
export class RoleToolTip extends RoleSection
{
}

RoleToolTip.abstract = false

export { RoleToolTip as ToolTip }
