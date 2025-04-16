const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 加载translator.js
const translatorPath = path.join(__dirname, 'out', 'translator.js');
// 检查translator.js是否存在
if (!fs.existsSync(translatorPath)) {
    console.error('错误: 找不到 translator.js 文件，请确保已编译扩展！');
    process.exit(1);
}

// 使用相对路径导入translator.js
const { ChineseTranslator } = require('./out/translator');

if (process.argv.length < 3) {
    console.log('用法: node run_chinese_code.js <中文代码文件路径>');
    process.exit(1);
}

const filePath = process.argv[2];

// 检查文件是否存在
if (!fs.existsSync(filePath)) {
    console.error(`错误: 文件 "${filePath}" 不存在！`);
    process.exit(1);
}

// 读取文件内容
const sourceCode = fs.readFileSync(filePath, 'utf8');
console.log('源代码:');
console.log('-----------------------------------');
console.log(sourceCode);
console.log('-----------------------------------');

try {
    // 创建翻译器实例
    const translator = new ChineseTranslator();
    
    // 翻译中文代码为JavaScript
    const translatedCode = translator.translate(sourceCode);
    console.log('转译后代码:');
    console.log('-----------------------------------');
    console.log(translatedCode);
    console.log('-----------------------------------');
    
    // 创建临时文件
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }
    
    const tempFile = path.join(tempDir, 'translated.js');
    fs.writeFileSync(tempFile, translatedCode);
    
    console.log('临时文件路径:', tempFile);
    console.log('运行中文程序...');
    
    // 使用Node.js运行转译后的代码
    exec(`node "${tempFile}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`错误: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`输出:\n${stdout}`);
    });
} catch (error) {
    console.error(`转译错误: ${error.message || error}`);
} 