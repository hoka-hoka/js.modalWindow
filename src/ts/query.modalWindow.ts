import aria from './modules/module.Aria/Aria';
import eventEmitter from './modules/module.EventEmitter/EventEmitter';

(function( $ ) {
  class ListModel extends eventEmitter<{
    close: undefined,
    removeClass: removeClassObj | undefined,
    addClass: addClassObj | undefined,
    addElement: addElementObj | undefined,
    removeListeners: undefined,
    addListeners: undefined,
    clearDialog: undefined,
    setFocus: JQuery<HTMLElement> | undefined,
  }> implements ListModelSettings {
    dialogClose!: JQuery<HTMLElement> | false;
    backdropNode!: JQuery<HTMLElement>;
    preNode!: JQuery<HTMLElement>;
    dialogNode!: JQuery<HTMLElement>;
    postNode!:  JQuery<HTMLElement>;
    focusAfterClosed: JQuery<HTMLElement> | false = false;
    focusFirst: JQuery<HTMLElement> | false = false;
    lastFocus!: Element | null;
    overlayDialog: JQuery<HTMLElement> | false = false;

    constructor(public options: modalWindowOptionsSettings) {
      super();
      let elementNode = this.isElement(options.dialogClass);
      if ( elementNode ) {
        this.dialogNode = elementNode;
      }
    }
    init() {
      let options = this.options;

      this.isRole();
      this.addBackdrop();

      this.emit('addClass', {
        el: $('body'),
        cl: aria.Utils.dialogOpenClass,
      });

      this.dialogClose = this.isElement(options.dialogClose);
      this.focusAfterClosed = this.isElement(options.focusAfterClosed);
      this.focusFirst = this.isElement(options.focusFirst);

      this.dialogNode.before($('<div tabindex="0">'));
      this.preNode = this.dialogNode.prev();
      this.dialogNode.after($('<div tabindex="0">'));
      this.postNode = this.dialogNode.next();

      let targetDialog: ListModel =  <ListModel>aria.getCurrentDialog();
      if ( targetDialog ) {
        targetDialog.emit('removeListeners', undefined);
      }
      this.emit('addListeners', undefined);
      if ( aria.OpenDialogList ) {
        aria.OpenDialogList.push( this );
      }
      this.emit('clearDialog', undefined);
      this.dialogNode.toggleClass( this.options.toggleClass );

// Если пользователь передал начало фокусировки, то переносим
      if ( this.focusFirst ) {
        this.setFocus( this.focusFirst );
      }
// Иначе ищем первый возможный
      else {
        aria.Utils.focusFirstDescendant( this.dialogNode );
      }
      this.lastFocus = document.activeElement;

    }
    setFocus( element: JQuery<HTMLElement> | undefined ): void {
      if ( element ) {
        element.focus();
      }
    }
    trapFocus( event: any ) {
      if ( aria.Utils.IgnoreUtilFocusChanges ) {
        return;
      }
      var currentDialog = aria.getCurrentDialog(); // последний диалог
// если фокус внутри дилога div, то lastFocus = event.target
      if ( currentDialog ) {
        if ( currentDialog.dialogNode.has(event.target).length !== 0 ) {
          currentDialog.lastFocus = event.target;
        }
// если фокус вышел за div, то нужно перекинуть фокус на первый фокусируемы в div-е элемент
        else {
          aria.Utils.focusFirstDescendant(currentDialog.dialogNode);
          if ( currentDialog.lastFocus == document.activeElement ) {
            aria.Utils.focusLastDescendant(currentDialog.dialogNode);
          }
          currentDialog.lastFocus = document.activeElement;
        }
      }
    }
    isRole(): void {
      let validRoles: ariaDialog = ['dialog', 'alertdialog'];
      if ( this.dialogNode ) {
        let isDialog: boolean | ariaDialog = (this.dialogNode.attr('role') || '')
          .trim()
          .split('/\s+/g')
          .some((token: string) => {
            return validRoles.some(role => {
               return token === role;
            });
          });
        if ( !isDialog ) {
          $.error('Dialog() требует добавить DOM-едементу роль dialog или alertdialog.');
        }
      }
    }
    addBackdrop(): void {
      let options = this.options;
      let overlayClass = options.overlayClass;

      const getWrapper = (): boolean => {
        const findParent = this.dialogNode.parent().is('.' + overlayClass);
        const findChild = this.dialogNode.parent().find('.' + overlayClass).length;
        if ( findParent ||  findChild ) {
          if ( findChild ) {
            $('.' + overlayClass).append(this.dialogNode);
          }
          return true;
        }
        return false;
      }

      if ( getWrapper() ) {
        this.backdropNode = this.dialogNode.parent();
      }
      else {
        let backdropNode = $('<div class="'+ options.toggleClass +' '+ options.overlayClass +'">');
        this.emit('addElement', {
          el: this.dialogNode,
          wrap: backdropNode,
          method: 'wrap',
        });
        this.backdropNode = this.dialogNode.parent();
      }

      this.overlayDialog = this.dialogNode.closest($('.' + options.overlayClass) );
      if ( this.overlayDialog ) {
        this.emit('removeClass', {
          el: this.overlayDialog,
          cl: this.options.toggleClass,
        });
      }


    }

    isElement( element: element ): JQuery<HTMLElement> | false {
      switch( typeof element ) {
        case 'string': return $('.' + element); break;
        case 'object': return element; break;
        default: return false; break;
      }
    }
  }

  class ListView extends eventEmitter<{}> implements ListViewSettings {
    constructor(public model: ListModel) {
      super();
    }
    close() {
      let topDialog: ListModel = <ListModel>aria.getCurrentDialog();
      if ( aria.OpenDialogList && aria.OpenDialogList.length ) {
        if ( !aria.OpenDialogList ) {
          topDialog.backdropNode.off(); // удалили обработчик оверлейна
        }
        topDialog.emit('removeListeners', undefined); // удалили обработчик фокуса
        if ( topDialog.dialogClose ) {
          topDialog.dialogClose.off(); // удалили обработчик кнопки закрытия
        }
        aria.Utils.remove(topDialog.preNode); // удалили div tabindex=0 сверху
        aria.Utils.remove(topDialog.postNode); // удалили div tabindex=0 снизу
        topDialog.dialogNode.toggleClass( topDialog.options.toggleClass );
        aria.OpenDialogList.pop();
        if ( !aria.OpenDialogList.length && topDialog.overlayDialog ) {
          topDialog.dialogNode.closest(topDialog.overlayDialog).addClass(topDialog.options.toggleClass);
        }
        if ( topDialog.focusAfterClosed ) {
          topDialog.setFocus( topDialog.focusAfterClosed ); // вернули фокус
        }
        if ( topDialog ) {
          topDialog.emit( 'addListeners', undefined );
        }
      }
    }

    removeClass( obj: removeClassObj ): void {
      obj.el.removeClass(obj.cl)
    }
    addClass( obj: addClassObj ): void {
      if ( obj.cl ) {
        obj.el.addClass(obj.cl);
      }
    }
    addElement( obj: addElementObj ): void {
      obj.el[obj.method](obj.wrap);
    }
    clearDialog(): void {
        this.model.dialogNode.find('input').each((i: number, v: HTMLInputElement) => {
        v.value = '';
      });
    }
  }

  class ListController extends eventEmitter<{}> implements ListControllerSettings {
    constructor(public model: ListModel, public view: ListView) {
      super();
      this.model.on('close', ()=>this.close());
      this.model.on('removeClass', ( obj )=>this.removeClass( obj ));
      this.model.on('addClass', ( obj )=>this.addClass( obj ));
      this.model.on('addElement', ( obj )=>this.addElement( obj ));
      this.model.on('removeListeners', ()=>this.removeListeners());
      this.model.on('addListeners', ()=>this.addListeners());
      this.model.on('clearDialog', ()=>this.clearDialog());
      this.model.on('setFocus', ( element )=>this.setFocus( element ));
    }
    init() {
      this.closeDialog();
      this.closeOverlay();
      this.eskapeDown();
    }
    eskapeDown() {
      let backdropNode = this.model.backdropNode;
      backdropNode.on('keydown', event => {
        if ( event.which === 27 ) {
          backdropNode.trigger('click');
        }
      });
    }
    closeOverlay(): void {
      let backdropNode = this.model.backdropNode;
      backdropNode.on('click', function( event ) {
        $.each(aria.OpenDialogList, ( i: number ) => {
          if ( this !== event.target ) {
            return;
          }
          let topDialog = aria.getCurrentDialog() as ListModel;
          if ( topDialog ) {
            topDialog.emit('close', undefined);
          }
        });
      });

    }
    closeDialog() {
      let dialogClose = this.model.dialogClose;
      if ( dialogClose ) {
        dialogClose.one('click', { this: this }, function( event ) {
          let topDialog = aria.getCurrentDialog();
          if ( topDialog ) {
            if ( topDialog.dialogNode.find( dialogClose as JQuery<HTMLElement> ) ) {
              event.data.this.view.close();
            }
          }
        });
      }
    }
    close(): void {
      this.view.close()
    }
    removeClass( obj: removeClassObj | undefined ) {
      if ( obj ) {
        this.view.removeClass( obj );
      }
    }
    addClass( obj: addClassObj | undefined ): void {
      if ( obj ) {
        this.view.addClass( obj );
      }
    }
    addElement( obj: addElementObj | undefined ): void {
      if ( obj ) {
        this.view.addElement( obj );
      }
    }
    clearDialog(): void {
      this.view.clearDialog();
    }
    removeListeners() {
      document.removeEventListener('focus', this.model.trapFocus, true);
    }
    addListeners() {
      document.addEventListener('focus', this.model.trapFocus, true);
    }
    setFocus( element: JQuery<HTMLElement> | undefined ) {
      if ( element ) {
        this.model.setFocus( element );
      }
    }
  }

  $.fn.modalWindow = Object.assign<modalWindowSettings, modalWindowDefaultSettings>(function(this: JQuery, propertys: modalWindowOptionsSettings): JQuery {
    let options = $.extend($.fn.modalWindow.propertys, propertys);
    const model = new ListModel(options);
    const view = new ListView(model);
    const controller = new ListController(model, view);
    model.init();
    controller.init();
    return this;
  },
  {
    propertys: {
      toggleClass: 'default_dialog',
      overlayClass: 'dialog-backdrop',
    }
  });

})(jQuery);