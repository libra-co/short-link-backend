const fs = require('fs-extra');
const { minify } = require("terser");
const htmlMinify = require('html-minifier').minify;
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const path = require('path');


// define the source and destination paths
const sourcePath = path.join(__dirname, 'public');
const destPath = path.join(__dirname, 'dist', 'public');

const handleMiniJsPlugin = (srcPath, desPath) => {
  // Read the content of the file
  const fileCode = fs.readFileSync(srcPath, { encoding: 'utf8' });
  minify(fileCode, {
    ecma: 2015, // 设置 ECMAScript 目标版本，这里指定为 ES6（2015年版）
    compress: { // 启用压缩选项，这些选项将移除代码中的冗余部分
      arrows: true, // 转换箭头函数
      collapse_vars: true, // 合并变量声明
      comparisons: true, // 优化比较操作
      computed_props: true, // 优化计算属性
      hoist_vars: true, // 提升变量声明到函数顶部
      if_return: true, // 优化 if 语句中的 return 语句
      inline: 3, // 内联函数和小函数
      keep_infinity: true, // 保留 Infinity 而不是将其优化为 1/0
      loops: true, // 优化循环
      negate_iife: true, // 优化立即调用的函数表达式（IIFE）
      properties: true, // 优化属性访问
      reduce_funcs: true, // 减少函数声明的数量
      reduce_vars: true, // 减少变量声明的数量
      sequences: true, // 将多个语句序列化为单个语句
      side_effects: true, // 删除没有副作用的语句
      switches: true, // 优化 switch 语句
      toplevel: true, // 压缩顶级作用域的代码
      typeofs: true, // 优化 typeof 表达式
      unused: true, // 删除未使用的变量和函数
      warnings: false, // 关闭压缩过程中的警告信息
    },
    mangle: { // 启用名称混淆
      reserved: ['$', 'exports', 'require'], // 保留在压缩过程中不会更改的特定名称
      // properties: true, // 混淆对象属性名
    },
    format: { // 控制输出格式
      comments: false, // 不保留任何注释
      semicolons: true, // 保留分号
      beautify: false, // 不美化输出的代码
    },
    sourceMap: true, // 生成 source map 文件，便于调试混淆后的代码
  }).then((result) => {

    const writeCode = result.code.replace(/[\r\n]/g, '');
    fs.writeFileSync(desPath, writeCode, { encoding: 'utf8' });

  });
  return true;
};

const handleMiniCssExtractPlugin = (srcPath, desPath) => {
  const fileCode = fs.readFileSync(srcPath, { encoding: 'utf8' });
  postcss([autoprefixer, cssnano])
    .process(fileCode, { from: srcPath, to: desPath })
    .then(result => {
      fs.writeFileSync(desPath, result.css, { encoding: 'utf8' });
    });
  return true;
};

const handleMinifyHtmlPlugin = (srcPath, desPath) => {
  const fileCode = fs.readFileSync(srcPath, { encoding: 'utf8' });
  const minifiedCode = htmlMinify(fileCode, {
    decodeEntities: true, // 尽可能使用直接的Unicode字符。	
    removeAttributeQuotes: true,
    removeRedundantAttributes: true, // 删除多余的属性
    minifyJS: true, // 压缩页面中的 JS 代码
    minifyCSS: true, // 压缩页面中的 CSS 代码
    collapseWhitespace: true, // 删除空格
    removeComments: true, // 删除注释, 但是会保留script和style中的注释
    removeCommentsFromCDATA: true, // 删除 CDATA 中的注释,从脚本和样式删除的注释	
    minifyURLs: true, // 压缩URL

  });
  fs.writeFileSync(desPath, minifiedCode, { encoding: 'utf8' });
  return true;
};

// If the file is not handled by the plugins, copy it to the destination path
const cb = (srcPath, desPath, fileName) => {
  if (fileName.endsWith('.js')) {
    return handleMiniJsPlugin(srcPath, desPath);
  } else if (fileName.endsWith('.css')) {
    return handleMiniCssExtractPlugin(srcPath, desPath);
  } else if (fileName.endsWith('.html')) {
    return handleMinifyHtmlPlugin(srcPath, desPath);
  }
};

const copyDirWithCallback = async (sourcePath, destPath, callback) => {
  try {
    // Get the files in the source directory
    const files = await fs.readdir(sourcePath);

    for (const fileName of files) {
      const srcPath = path.join(sourcePath, fileName);
      const desPath = path.join(destPath, fileName);
      // Get file stats
      const stat = await fs.stat(srcPath);
      if (stat.isFile()) {
        const isCopied = callback(srcPath, desPath, fileName);
        if (!isCopied) {
          // Copy the file to the destination path
          await fs.copyFile(srcPath, desPath);
        }
      } else if (stat.isDirectory()) {
        // Create a new directory in the destination path
        await fs.ensureDir(desPath);
        // Copy the directory (recursively)
        await copyDirWithCallback(srcPath, desPath, callback);
      }
    }

  } catch (error) {
  }
};
copyDirWithCallback(sourcePath, destPath, cb);
