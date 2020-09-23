const wepackbase = require('./webpack.config');
const { merge } = require('webpack-merge');
const pug = require('../webpack/pug');
const babel = require('../webpack/babel-loader');
const fileloader = require('../webpack/fileloader');
const css = require('../webpack/css-loader');
//const ts = require('../webpack/ts-loader');

module.exports = merge(
  wepackbase(),
  pug(),
  //ts(),
  babel(),
  fileloader(),
  css(),
)


/*
Для вынесения общих модулей в отдельную точку входа используется плагин splitChunks.

mode=development || production перенесён из конфигов в манифест, т.к. находиться там приоритетней.

для генерации файла формата json пользовательского графа: webpack --profile --json > compilation-stats.json. На
http://webpack.github.io/analyse/ можно просмотреть.

Из коробки Webpack не требует использования файла конфигурации. При этом он предполагает, что отправной точнкой
для проекта является src/index, а выходной dist/main.js. Обычно ваши проекты будут расширять эту
функциональность, для этого нужно создать webpack.config.js в корневой папке, и веб-пакет будет автоматически
использовать его. Изменить его можно в манифесте. Есть сервис для генерации таких конфигов
(https://generatewebpackconfig.netlify.com/)

При использовании режима dev webpack сохраняет всё в кэш, а не работает с файловой структурой папки dist.
А при использовании плагина CopyWebpackPlugin мы из режима разработки организуем в кэше такую же структуру,
как и при build и работаем с её экземпляром.
При использовании режима build информация из кэша дополняет или создаёт структуру dist.
*/

/*
Загрузчики(loader) трансформируют файлы в модули, выполняют какие-либо с ними действиями и добаляют в граф зависимостей.
Выполняются снизу вверх.
/*

/* Точка входа не должна использоваться ни каким другим модулем. Для многостраничного сайта точек входа может быть несколько.

погрузчики из postcss.config.js webpack определяет сам
*/