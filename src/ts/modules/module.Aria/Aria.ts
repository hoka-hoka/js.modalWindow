var aria: ariaSettings = {
  OpenDialogList: [],
  Utils: {
    IgnoreUtilFocusChanges: false,
    dialogOpenClass: 'has-dialog',
    remove( item: JQuery<HTMLElement>) {

      if (item.remove && typeof item.remove === 'function') {
        return item.remove();
      }
      return false;
    },
    focusFirstDescendant( element: JQuery<HTMLElement> ) {
      for (let i = 0, len = element.children().length; i < len; i++) {
        var child = element.children()[i];
        if ( aria.Utils.attemptFocus(child) || aria.Utils.focusFirstDescendant( $(child) ) ) {
          return true;
// находит первый фокусируемый элемент и при выходе из диалога устанавливает на него фокус
        }
      }
      return false;
    },
    focusLastDescendant (element: JQuery<HTMLElement>) {
      for (var i = element.children().length - 1; i >= 0; i--) {
        var child = element.children()[i];
        if ( aria.Utils.attemptFocus(child) ||
            aria.Utils.focusLastDescendant($(child)) ) {
          return true;
// находит последний фокусируемый элемент и при выходе из диалога вверх устанавливает на него фокус
        }
      }
      return false;
    },
    attemptFocus( element: HTMLElement ) {
      if ( !aria.Utils.isFocusable(element) ) {
        return false; // если елемент может быть фокусируемым, то завершить, как false
      }
      aria.Utils.IgnoreUtilFocusChanges = true;
      try { // установить фокус на проверенный элемент
        element.focus();
      }
      catch (e) {
      }
      aria.Utils.IgnoreUtilFocusChanges = false;
      return document.activeElement === element; // проверка стал-ли элемент фокусируемым?
    },
    isFocusable( element: HTMLElement ) {
      if (element.tabIndex > 0 || (element.tabIndex === 0 && element.getAttribute('tabIndex') !== null)) {
        return true;
      }
      if ( element.nodeName === 'INPUT' && (element as HTMLInputElement).disabled ) {
        return false;
      }
      switch (element.nodeName) {
        case 'A':
          let anhor = <HTMLAnchorElement>element;
          return !!anhor.href && anhor.rel != 'ignore';
        case 'INPUT':
          let input = <HTMLInputElement>element;
          return input.type != 'hidden' && input.type != 'file';
        case 'BUTTON':
        case 'SELECT':
        case 'TEXTAREA':
          return true;
        default:
          return false;
      }
    }
  },
  getCurrentDialog() {
    if ( aria.OpenDialogList && aria.OpenDialogList.length ) {
      return aria.OpenDialogList[aria.OpenDialogList.length - 1]; // get last element
    }
    return;
  }
};

export default aria;