模块：实现一系列功能的方法集合
插件：可配置的模块，可复用
组件：拆分逻辑结构与样式，写法与插件相似

安装依赖：
yarn add webpack webpack -D

<!-- uglify 引入和实例化方式不正确，且该插件不支持 Webpack 5+
uglifyjs-webpack-plugin 已被 terser-webpack-plugin 替代 -->
yarn add terser-webpack-plugin -D // 压缩JS 
yarn add html-webpack-plugin -D // 压缩HTML
yarn add clean-webpack-plugin -D // 清理打包的文件

<!-- @babel/core @babel/preset-env babel-loader  babel-preset-latest过时-->
yarn add babel-loader babel-core babel-preset-latest -D // ES6转ES5
yarn add sass-loader sass -D // 编译为CSS node-sass已经被弃用，用sass平替
yarn add postcss postcss-loader autoprefixer -D// 自动加前缀
yarn add css-loader -D // 解析CSS
yarn add style-loader -D // 把解析好的CSS放到HTML中
yarn add file-loader url-loader image-webpack-loader -D // 对图片进行识别，然后通过url-loader能判断是否base64、重命名，压缩图片
yarn add ejs ejs-loader -D // 配置index.html的标题 也可以处理 以tpl结尾的文件

--display-modules --colors --display-reasons 看到打包的模块，彩色，打包的信息

Unable to preventDefault inside passive event listener due to target being treated as passive. See <URL>
touch-action: none;

方法尽量放在组件中，不要放在子组件中，因为子组件多个地方调用
数据渲染逻辑方面的放在入口文件中
