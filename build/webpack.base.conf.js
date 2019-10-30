
// npm i - установка зависимострей

/*
При использовании режима dev webpack сохраняет всё в кэш, а не работает с файловой структурой папки dist.
А при использовании плагина CopyWebpackPlugin мы из режима разработки организуем в кэше такую же структуру,
как и при build и работаем с её экземпляром.
При использовании режима build информация из кэша дополняет или создаёт структуру dist.
*/

/*
погрузчики из postcss.config.js webpack определяет сам
*/
const fs = require('fs') // утилиты для работы с файлами
const path = require('path') // утилиты для работы с путями
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // позволяет разделить js от css в dist
const CopyWebpackPlugin = require('copy-webpack-plugin') // для копирования файлов при build
const HtmlWebpackPlugin = require('html-webpack-plugin') // создаёт автоматически index.html, может
// подставлять в конец путей js-файлов кэш-сумму (одного из алгоритма, например: crc, md5, sha-1), для указания
// браузеру, что он работает с новой версией файла во избежании ккширования.

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  assets: 'assets/'
}

const PAGES_DIR = `${PATHS.src}/pug/pages/`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
  externals: { // для обращения к path из build и dev
    paths: PATHS
  },

  entry: {
  	app: PATHS.src // первая точка входа (сам найдёт index.js)
  },
  output: {
    filename: `${PATHS.assets}js/[name].js`, // для каждой точки входа свой выход (EC6 - ${})  
    path: PATHS.dist, // __dirname + 'dist' (конкатенация путей)
    publicPath: '/' // путь выходного каталога
  },
  module: { // погрузщики преобразований
    rules: [
      {
        test: /\.pug$/,
        use: ['pug-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // исключаем
        use: ['babel-loader']
      }, {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)$/,
        use: [ { 
            loader: 'file-loader', 
            options: { 
              name: '[name].[ext]', 
            }
          }]
      }, {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: { name: '[name].[ext]' }
      }, {
        test: /\.scss$/,
        use: [
          'style-loader', // подключение подгрузчика (помещает css-строку в <style> в DOM index.html)
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader', // заменяеи все импорты стилей на модули js
// importLoaders - сообщает сколько загрузчиков должно быть выполнено перед для найденный импортов            
            options: { importLoaders : 2, sourceMap: true }
          }, {
            loader: 'postcss-loader', // добавляет погрузчики из post.config.js
            options: { sourceMap: true }
          }, 
          {
            loader: 'sass-loader', // компилирует в css
            options: { sourceMap: true }
          }
        ]
      }, {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders : 1, sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } } 
        ]
      }
    ]
  },
  performance: {
    hints: process.env.NODE_ENV === 'production' ? "warning" : false
  },

  plugins: [ // регистрация плагина
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}css/[name].css`,
    }),
// "Ручной" файл index.html можно удалить. В результате сгенерируется пустой index.html с тегом
// script, по пути точки выхода. Если мы хотим, чтобы в сгенерированном файле был и пользовательский
// контент, то нужно указать HtmlWebpackPlugin шаблон, на который он будет ссылаться

/*new HtmlWebpackPlugin({
  hash: true, // md5 ?
  template: `${PATHS.src}/index.html`, // тот шаблон
  filename: './index.html'
}),*/

    new CopyWebpackPlugin([
      { from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img`},
      { from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts`},
      { from: `${PATHS.src}/static`, to: ''}
    ]),
    ...PAGES.map(page => new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/${page}`,
      filename: `./${page.replace(/\.pug/,'.html')}` // исходный index с заменой
    }))
  ]

}
