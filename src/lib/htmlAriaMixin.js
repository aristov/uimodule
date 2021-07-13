import { AriaActiveDescendant } from './AriaActiveDescendant'
import { AriaAtomic } from './AriaAtomic'
// import { AriaAutoComplete } from './AriaAutoComplete'
import { AriaBusy } from './AriaBusy'
// import { AriaChecked } from './AriaChecked'
import { AriaColCount } from './AriaColCount'
import { AriaColIndex } from './AriaColIndex'
// import { AriaColSpan } from './AriaColSpan'
import { AriaControls } from './AriaControls'
import { AriaCurrent } from './AriaCurrent'
import { AriaDescribedBy } from './AriaDescribedBy'
import { AriaDetails } from './AriaDetails'
// import { AriaDisabled } from './AriaDisabled'
// import { AriaDropEffect } from './AriaDropEffect'
import { AriaErrorMessage } from './AriaErrorMessage'
import { AriaExpanded } from './AriaExpanded'
import { AriaFlowTo } from './AriaFlowTo'
// import { AriaGrabbed } from './AriaGrabbed'
import { AriaHasPopup } from './AriaHasPopup'
// import { AriaHidden } from './AriaHidden'
import { AriaInvalid } from './AriaInvalid'
import { AriaKeyShortcuts } from './AriaKeyShortcuts'
import { AriaLabel } from './AriaLabel'
import { AriaLabelledBy } from './AriaLabelledBy'
import { AriaLevel } from './AriaLevel'
import { AriaLive } from './AriaLive'
import { AriaModal } from './AriaModal'
import { AriaMultiLine } from './AriaMultiLine'
import { AriaMultiSelectable } from './AriaMultiSelectable'
import { AriaOrientation } from './AriaOrientation'
import { AriaOwns } from './AriaOwns'
// import { AriaPlaceholder } from './AriaPlaceholder'
import { AriaPosInSet } from './AriaPosInSet'
import { AriaPressed } from './AriaPressed'
// import { AriaReadOnly } from './AriaReadOnly'
import { AriaRelevant } from './AriaRelevant'
// import { AriaRequired } from './AriaRequired'
import { AriaRoleDescription } from './AriaRoleDescription'
import { AriaRowCount } from './AriaRowCount'
import { AriaRowIndex } from './AriaRowIndex'
// import { AriaRowSpan } from './AriaRowSpan'
// import { AriaSelected } from './AriaSelected'
import { AriaSetSize } from './AriaSetSize'
import { AriaSort } from './AriaSort'
import { AriaValueMax } from './AriaValueMax'
import { AriaValueMin } from './AriaValueMin'
import { AriaValueNow } from './AriaValueNow'
import { AriaValueText } from './AriaValueText'

const attrTypes = [
  AriaAtomic,
  AriaBusy,
  AriaControls,
  AriaCurrent,
  AriaDescribedBy,
  AriaDetails,
  AriaFlowTo,
  AriaKeyShortcuts,
  AriaLabel,
  AriaLabelledBy,
  AriaLive,
  AriaOwns,
  AriaRelevant,
  AriaRoleDescription,
]

export function htmlAriaMixin(constructor) {
  for(const type of attrTypes) {
    const name = type.name.slice(4)
    const prop = name[0].toLowerCase() + name.slice(1)
    Object.defineProperty(constructor.prototype, prop, {
      configurable : true,
      get() {
        return this.getAttr(type)
      },
      set(value) {
        this.setAttr(type, value)
      },
    })
  }
}
