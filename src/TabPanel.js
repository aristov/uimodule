import { RoleSection } from './lib/RoleSection'

/**
 * @summary A container for the resources associated with a tab,
 *  where each tab is contained in a tablist.
 * @see https://www.w3.org/TR/wai-aria-1.1/#tabpanel
 */
export class TabPanel extends RoleSection
{
  /**
   * @return {Tab|null}
   */
  get tab() {
    return this.labelledBy[0] || null
  }

  /**
   * @param {Tab|null} tab
   */
  set tab(tab) {
    this.labelledBy = tab
  }

  /**
   * @returns {boolean}
   */
  static get abstract() {
    return false
  }
}
