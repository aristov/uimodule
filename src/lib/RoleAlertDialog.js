import { RoleDialog } from './RoleDialog'

/**
 * A type of dialog that contains an alert message,
 *  where initial focus goes to an element within the dialog.
 * @see https://www.w3.org/TR/wai-aria-1.1/#alertdialog
 * @mixes RoleAlert
 */
export class RoleAlertDialog extends RoleDialog
{
  /**
   * @param {{}} init
   */
  create(init) {
    super.create(init)
    this.modal = true
  }
}

export { RoleAlertDialog as AlertDialog }
