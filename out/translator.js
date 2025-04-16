"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChineseTranslator = void 0;
class ChineseTranslator {
    constructor() {
        this.keywordMap = {
            '如果': 'if',
            '否则': 'else',
            '否则如果': 'else if',
            '循环': 'for',
            '当': 'while',
            '函数': 'function',
            '返回': 'return',
            '变量': 'let',
            '常量': 'const',
            '真': 'true',
            '假': 'false',
            '空': 'null',
            '未定义': 'undefined',
            '尝试': 'try',
            '捕获': 'catch',
            '最终': 'finally',
            '类': 'class',
            '继承': 'extends',
            '实现': 'implements',
            '接口': 'interface',
            '导入': 'import',
            '导出': 'export',
            '从': 'from',
            '异步': 'async',
            '等待': 'await',
            '抛出': 'throw',
            '新建': 'new',
            '删除': 'delete',
            '打断': 'break',
            '继续': 'continue',
            '开关': 'switch',
            '情况': 'case',
            '默认': 'default',
            '这个': 'this',
            '超级': 'super',
            '与': '&&',
            '或': '||',
            '非': '!'
        };
        this.functionMap = {
            '输出': 'console.log',
            '警告': 'console.warn',
            '错误': 'console.error',
            '信息': 'console.info',
            '断言': 'console.assert',
            '计时开始': 'console.time',
            '计时结束': 'console.timeEnd',
            '日期': 'Date',
            '数学': 'Math',
            '随机': 'Math.random',
            '最大值': 'Math.max',
            '最小值': 'Math.min',
            '绝对值': 'Math.abs',
            '四舍五入': 'Math.round',
            '上取整': 'Math.ceil',
            '下取整': 'Math.floor',
            '解析整数': 'parseInt',
            '解析浮点数': 'parseFloat',
            '定时器': 'setTimeout',
            '间隔器': 'setInterval',
            '清除定时器': 'clearTimeout',
            '清除间隔器': 'clearInterval',
            '承诺': 'Promise',
            '文档': 'document',
            '窗口': 'window',
            '对象': 'Object',
            '数组': 'Array',
            '字符串': 'String',
            '数字': 'Number',
            '布尔值': 'Boolean',
            '正则表达式': 'RegExp'
        };
    }
    /**
     * 转译中文代码到JavaScript
     */
    translate(sourceCode) {
        let translatedCode = sourceCode;
        // 替换关键字
        const sortedKeywords = Object.keys(this.keywordMap).sort((a, b) => b.length - a.length);
        for (const chineseKeyword of sortedKeywords) {
            const targetKeyword = this.keywordMap[chineseKeyword];
            const regex = new RegExp(`(^|[\\s;{}\\(\\)])${chineseKeyword}([\\s;{}\\(\\)]|$)`, 'g');
            translatedCode = translatedCode.replace(regex, `$1${targetKeyword}$2`);
        }
        // 替换函数名
        const sortedFunctions = Object.keys(this.functionMap).sort((a, b) => b.length - a.length);
        for (const chineseFunc of sortedFunctions) {
            const targetFunc = this.functionMap[chineseFunc];
            const regex = new RegExp(`(^|[\\s;{}\\(\\)])${chineseFunc}([\\s;{}\\(\\)]|$)`, 'g');
            translatedCode = translatedCode.replace(regex, `$1${targetFunc}$2`);
        }
        return translatedCode;
    }
}
exports.ChineseTranslator = ChineseTranslator;
//# sourceMappingURL=translator.js.map