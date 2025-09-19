const path = require('path'),
  webpack = require('webpack'),
  autoprefixer = require('autoprefixer'),
  htmlWebpackPlugin = require('html-webpack-plugin'),
  { CleanWebpackPlugin } = require('clean-webpack-plugin'),
  TerserPlugin = require('terser-webpack-plugin');

// 区分开发/生产环境（关键）
const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: {
    index: path.resolve(__dirname, "./src/js/index.js"),
    detail: path.resolve(__dirname, "./src/js/detail.js"),
    cart: path.resolve(__dirname, "./src/js/cart.js")
  },
  output: {
    filename: "js/[name]-[hash].js",
    path: path.resolve(__dirname, "dist"),
    // clean: true, // 🌟 内置清理，等同于 CleanWebpackPlugin 默认效果

    publicPath: isProduction ? '../' : '/',

    // 指定所有模块资源的输出路径模板 script中引入的也可以打包到JS文件夹
    assetModuleFilename: 'js/[name]-[hash][ext]'
  },
  mode: "development",
  module: {
    rules: [
      // ES6->ES5
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, 'node_modules'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                modules: 'commonjs', // 强制转换ES6模块
                targets: 'last 2 versions'
              }]
            ],
            sourceType: 'module'
          }
        }
      },

      // 处理tpl模板
      {
        test: /\.tpl$/,
        use: [
          {
            loader: 'ejs-loader',
            options: {
              esModule: false, // 禁用ES Module模式，使用CommonJS
              // 可以保留其他配置
              // attributes: []
            }
          }
        ]
      },

      // 处理CSS
      {
        test: /\.(css|sass|scss)$/,
        use: [
          {
            //  将 CSS 插入到 DOM 中
            // loader: process.env.NODE_ENV === 'production' 
            //   ? MiniCssExtractPlugin.loader 
            //   : 'style-loader'
            loader: "style-loader"
          },
          {
            // 识别css @import 语法 
            loader: 'css-loader'
          },
          {
            // 添加属性前缀
            loader: 'postcss-loader',
            options: {
              // 旧版本写法
              // plugins: function () {
              //   return [autoprefixer('last 5 versions')];
              // }
              postcssOptions: {
                plugins: [
                  autoprefixer({
                    overrideBrowserslist: 'last 5 versions' // 配置浏览器兼容版本
                  })
                ]
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },

      // 处理图片
      {
        test: /\.(png|jpg|jpeg|gif|ico|webp)$/i,
        exclude: /node_modules/,
        // 关闭Webpack 5的asset模块自动处理，避免与url-loader冲突
        type: 'javascript/auto',
        use: [
          {
            loader: 'url-loader',
            options: {
              // 小于转base64，大于file-loader处理
              // 小于1KB转Base64（不生成文件），大于1KB输出到dist/img
              limit: 1024,

              // 1.img/[name].[ext]，则不需要outputPath
              // 2.[name].[ext]，需要outputPath
              name: '[name].[ext]',

              // 输出到dist/img
              outputPath: 'img',

              // 为引用路径添加"img/"（如CSS/JS中引用时指向img目录）
              publicPath: '../img',
              // 关闭 ES 模块语法（避免 HTML 中图片路径出现 [object Module]）
              esModule: false,
              // 关键：配置file-loader兜底（大图片必须由file-loader处理）
              fallback: {
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                  // 与url-loader保持一致，确保大图片也输出到img目录
                  outputPath: 'img',
                  publicPath: '../img',
                  esModule: false
                }
              }
            }
          },

          // 图片压缩（可选，生产环境推荐，需安装 image-webpack-loader）
          // {
          //   loader: 'image-webpack-loader',
          //   options: {
          //     mozjpeg: { quality: 80 }, // JPG 压缩质量
          //     optipng: { enabled: false }, // PNG 压缩（可根据需求开启）
          //     pngquant: { quality: [0.6, 0.8] }, // PNG 压缩质量范围
          //     gifsicle: { interlaced: false }, // GIF 压缩
          //   }
          // }  
        ]
      },

      // 处理字体
      {
        test: /\.(svg|eot|ttf|woff|woff2)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader', // 字体文件通常不转 Base64，直接输出文件
            options: {
              name: '[name].[hash:8].[ext]', // 加哈希避免缓存
              outputPath: 'fonts', // 输出到 dist/fonts 目录
              publicPath: '../fonts', // 解决 CSS 中字体路径引用问题
              esModule: false,
            },
          },
        ]
      },

      // 官方推荐的HTML处理loader
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          // 保留EJS模板语法不被转义
          sources: {
            list: [
              {
                // 处理img标签的src属性（图片）
                tag: 'img',
                attribute: 'src',
                type: 'src',
              },
              // 处理script标签，但排除utils.js
              {
                tag: 'script',
                attribute: 'src',
                type: 'src'
              },
              {
                tag: 'link',
                attribute: 'href',
                type: 'src',
              }
            ],
          },
          // 禁用压缩
          minimize: false
        },
      }
    ]
  },

  plugins: [
    // 这个插件可以配置多个页面
    new htmlWebpackPlugin({
      // 生成的HTML文件名（路径相对于output.path）
      filename: 'public/index.html',
      // 模板文件路径
      template: path.resolve(__dirname, 'src/index.html'),
      // HTML标题
      title: '商品列表',

      // 由 html-webpack-plugin 负责 HTML 压缩（此时 EJS 已解析完成）
      minify: {
        // 移除注释
        removeComments: true,
        // 压缩空白（不影响已解析的内容）
        collapseWhitespace: true,
      },

      // 打包不包括的模块
      excludeChunks: ['node_modules'],

      // index.html 中希望带有打包后的index.js
      // 指定需要引入的chunk（与entry中的key对应）
      chunks: ['index'],

      // 给资源加 hash 防缓存
      hash: true,
      // 关键：JS 注入到 </body> 前
      // inject: 'body' 
    }),
    new htmlWebpackPlugin({
      filename: 'public/detail.html',
      template: path.resolve(__dirname, 'src/detail.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
      excludeChunks: ['node_modules'],
      chunks: ['detail'],
      hash: true,
    }),
    new htmlWebpackPlugin({
      filename: 'public/cart.html',
      template: path.resolve(__dirname, 'src/cart.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
      excludeChunks: ['node_modules'],
      chunks: ['cart'],
      hash: true
    }),

    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.resolve(__dirname, 'dist/js/*.js'),
        // 清理dist目录下的所有html文件
        path.resolve(__dirname, 'dist/public/*.html'),
        // 清理dist目录下的img文件夹
        path.resolve(__dirname, 'dist/img/*')
      ]
    })
  ],

  optimization: {
    // 是否压缩
    minimize: true,
    minimizer: [
      // 实现JS压缩
      new TerserPlugin({
        // 🌟 关键配置：禁止提取注释到单独的LICENSE文件
        extractComments: false,
      }),
      // 实现CSS压缩 抽离css, 通过link引入
      // new OptimizeCssAssetsWebpackPlugin()
    ]
  },

  devServer: {
    static: {
      // 指向dist（与output.path一致）
      directory: path.join(__dirname, 'dist'),
      publicPath: '/' // 静态资源基础路径，必须与 output.publicPath 一致
    },
    host: 'localhost',
    port: 3300,
    open: true,
    hot: true,
    historyApiFallback: {
      // 当访问的路径不存在时，默认返回public/index.html
      rewrites: [
        { from: /^\/$/, to: '/public/index.html' }, // 根路径指向首页
        { from: /^\/detail\.html/, to: '/public/detail.html' }, // detail页面
        { from: /^\/cart\.html/, to: '/public/cart.html' } // cart页面
      ]
    }
  }
};

module.exports = config;