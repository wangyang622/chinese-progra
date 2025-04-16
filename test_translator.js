// 测试转译器
const fs = require('fs');
const path = require('path');

// 导入转译器
const ChineseTranslator = require('./out/translator').ChineseTranslator;

// 创建转译器实例
const translator = new ChineseTranslator();

// 读取测试文件
const sourceCode = fs.readFileSync(path.join(__dirname, 'test/functions.zs'), 'utf8');

console.log('源代码:');
console.log('-----------------------------------');
console.log(sourceCode);
console.log('-----------------------------------');

// 转译代码
const translatedCode = translator.translate(sourceCode);

console.log('转译后代码:');
console.log('-----------------------------------');
console.log(translatedCode);
console.log('-----------------------------------');

// 将转译后的代码写入临时文件
const tempFile = path.join(__dirname, 'temp/translated.js');
fs.writeFileSync(tempFile, translatedCode);

console.log('临时文件已写入: ' + tempFile);
console.log('尝试执行转译后的代码...');

// 尝试执行代码
try {
  require(tempFile);
  console.log('执行成功！');
} catch (error) {
  console.error('执行失败：', error);
} 