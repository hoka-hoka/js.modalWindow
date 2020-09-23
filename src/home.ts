// ищет вначале в текущей директории, затем в node_modules

import './assets/css/main.css';
import './assets/scss/main.scss';
import './ts/query.modalWindow';


$('.btn1-js').on('click', function(event) {
  $(event.target).modalWindow({
    toggleClass: 'hidden',
    overlayClass: 'dialog-backdrop',
    dialogClass: 'dialog1-js',
    focusAfterClosed: 'btn1-js',
    focusFirst: undefined,
    dialogClose: 'dialog1-close',
  });
});

$('.btn2-js').on('click', function(event) {
  $(event.target).modalWindow({
    toggleClass: 'hidden',
    overlayClass: 'dialog-backdrop',
    dialogClass: 'dialog2-js',
    focusAfterClosed: 'btn2-js',
    focusFirst: undefined,
    dialogClose: 'dialog2-close',
    dialogReplace: {
      newDialogClose: 'dialog2-close',
    },
  });
});

