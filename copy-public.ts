 const fs = require('fs-extra');
const path = require('path');

// define the source and destination paths
const sourcePath = path.join(__dirname, 'public');
const destPath = path.join(__dirname, 'dist', 'public');

// 使用 fs-extra 模块的 copy 方法来复制文件夹
fs.copy(sourcePath, destPath)
  .then(() => {
    console.log('Public folder copied successfully!');
  })
  .catch(err => {
    console.error('Error copying public folder:', err);
  });
