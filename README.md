# modalWindow

js.modalWindow - это крошечный плагин javascript для создания модального окна(-он). Он полностью настраивается и не требует зависимостей. Его можно использовать для раскрытия несколько окон поверх друг друга.  
Построен на основе [шаблона проектирования модального диалога в методиках разработки WAI-ARIA 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal)


1. Должен быть хотя бы один фокусируемый элемент.
2. Когда диалоговое окно раскрывается, то фокус должен автоматически переместиться на первое рабочее поле.
3. Фокусировака в пределах активного окна.
4. После закрытия диалогового окна фокус следует вернуть в исходную позицию.
5. Порядок табуляции должен соответствовать диалогу. 
6. Если диалоговое окно модальное, то при его появлении невозможно взаимодействовать с другим содержимым. 
7. Модальные окна инертны. То есть пользователь может взаимодействовать с контентом страницы за пределами окна.
8. Озвучиваться скринридерами. 

[Демо](https://hoka-hoka.github.io/multirange/ "Необязательная подсказка")

### Монтаж

1. Клонирование репозитория  
`git clone https://github.com/hoka-hoka/js.modalWindow.git`

2. Установка пакетов NPM  
`npm install`

3. Выполнение тестов в командной строке  
`npm run test`

4. Сборка проекта  
`npm run build`

### Опции

|     Свойства     |                  Тип(TS)               |                    Описание               |
|------------------|:---------------------------------------|:------------------------------------------|
| toggleClass      | string                                 | Переключатель                             |
| overlayClass     | JQuery<HTMLElement>, string, undefined | Оверлей                                   |
| dialogClass      | JQuery<HTMLElement>, string, undefined | Диалог                                    |
| focusAfterClosed | JQuery<HTMLElement>, string, undefined | Куда вернуть фокус                        |
| focusFirst       | JQuery<HTMLElement>, string, undefined | Чему назначить фокус после раскрытия окна |
| dialogClose      | JQuery<HTMLElement>, string, undefined | Кнопка закрытия                           |
| dialogReplace    | interface replace {...}                | Следующий диалог                           |

```
interface replace {
  newDialogClose: element,
}
```

dialogReplace:
|     Свойства     |                  Тип(TS)               |                    Описание               |
|------------------|:--------------------------------------:|:------------------------------------------|
| newDialogClose   | JQuery<HTMLElement>, string, undefined | Новый следующий диалог                    |

### API
Для работы требуется JQuery не ниже 3.x version.
Плагин построен на основе использования модели проектирования MVP, а также патерна Publisher Subscriber реализованного в виде класса eventEmitter.

index.pug
```
button.btn1-js Add Delivery Address
.dialog1-js.hidden.dialog( role="dialog"
             aria-labelledby="dialog1_label"
             aria-modal="true")
  ...
  
  button.dialog1-close Close
  button.btn2-js Open

.dialog2-js.hidden.dialog( role="dialog"
             aria-labelledby="dialog2_label"
             aria-describedby="dialog2_desc"
             aria-modal="true")
  ...

  button.dialog2-close Close

```
Параметры для работы плагина передаются в функцию JQuery.modalWindow().
При получении входных параметров выполняется инициализация программных слоёв модели MVP, а именно модели и контроллера. Это необходимо для того, чтобы проверить все параметры на присутствие, обязательность и типизацию.

script.js
```
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
```
### Взаимодействие с клавиатурой
`Tab` Перемещает фокус на следующий фокусируемый элемент диалогового окна. Если фокус находится на последнем элементе диалога, возвращает его на первый возможный элеиент внутри диалогового окна.
`Shift + Tab` Перемещает фокус на предыдущий фокусируемый элемент диалогового окна. Если фокус находится на первом элементе диалога, возвращает его на последний возможный элеиент внутри диалогового окна.

### Дорожная карта
См. [открытые проблемы](https://github.com/hoka-hoka/js.modalWindow/issues) для получения списка предлагаемых функций (и известных проблем).

### Лицензия
Распространяется по лицензии MIT. См. `LICENSE`.

### Связаться с нами
Ссылка на проект: [https://github.com/hoka-hoka/js.modalWindow](https://github.com/hoka-hoka/multirange)

Почта: sff1.tpu.ru

### Вдохновлён
[шаблона проектирования модального диалога в методиках разработки WAI-ARIA 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal) 


