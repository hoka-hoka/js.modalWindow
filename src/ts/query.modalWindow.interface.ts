type element = JQuery<HTMLElement> | string | undefined;
type ariaDialog = ['dialog', 'alertdialog'];

interface JQuery {
  modalWindow: modalWindow,
}

interface modalWindow extends modalWindowSettings, modalWindowDefaultSettings {}

interface replace {
  newDialogClose: element,
}

interface modalWindowOptionsSettings {
  toggleClass: string,
  overlayClass?: element,
  dialogClass?: element,
  focusAfterClosed?: JQuery<HTMLElement> | string,
  focusFirst?: JQuery<HTMLElement> | string,
  dialogClose?: JQuery<HTMLElement> | string,
  dialogReplace?: replace,
}

interface modalWindowSettings {
  (propertys: modalWindowOptionsSettings): JQuery,
}

interface modalWindowDefaultSettings {
  propertys: modalWindowOptionsSettings,
}

interface ariaSettings {
  Utils: ariaUtils,
  OpenDialogList?: ListModelSettings[] | undefined,
  getCurrentDialog(): ListModelSettings | undefined,
}

interface ariaUtils {
  IgnoreUtilFocusChanges: boolean,
  dialogOpenClass: string,
  remove( item: JQuery<HTMLElement> ): boolean | JQuery<HTMLElement>,
  focusLastDescendant( element: JQuery<HTMLElement> ): boolean,
  focusFirstDescendant( element: JQuery<HTMLElement> ): boolean,
  attemptFocus( element: HTMLElement ): boolean,
  isFocusable( element: HTMLElement ): boolean,
}

interface addClassObj {
  el: JQuery<HTMLElement>,
  cl: string | undefined,
  method?: 'wrap',
}

interface removeClassObj extends addClassObj {}

interface addElementObj {
  el: JQuery<HTMLElement>,
  wrap: JQuery<HTMLElement>,
  method: 'wrap',
}

interface ListModelSettings {
  options: modalWindowOptionsSettings,
  backdropNode: JQuery<HTMLElement>,
  preNode: JQuery<HTMLElement>,
  dialogNode: JQuery<HTMLElement>,
  postNode:  JQuery<HTMLElement>,
  focusAfterClosed: JQuery<HTMLElement> | false,
  focusFirst: JQuery<HTMLElement> | false,
  lastFocus: Element | null,
  overlayDialog: JQuery<HTMLElement> | false,
  init(): void,
  setFocus( element: JQuery<HTMLElement> | undefined ): void,
  trapFocus( event: any ): void,
  isRole(): void,
  addBackdrop(): void,
  isElement( element: JQuery<HTMLElement> | string | undefined ): JQuery<HTMLElement> | false,
}

interface ListViewSettings {
  removeClass( obj: removeClassObj | undefined ): void,
  addClass( obj: addClassObj | undefined ): void,
  addElement( obj: addElementObj | undefined ): void,
  clearDialog(): void,
}

interface ListControllerSettings {
  closeOverlay(): void,
  closeDialog(): void,
  close( controller: this | undefined ): void,
  removeClass( obj: removeClassObj | undefined ): void,
  addClass( obj: addClassObj | undefined ): void,
  addElement( obj: addElementObj | undefined ): void,
  removeListeners(): void,
  addListeners(): void,
  setFocus( element: JQuery<HTMLElement> | undefined ): void,
}