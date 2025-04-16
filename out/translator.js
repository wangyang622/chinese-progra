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
            '空': 'null'
        };
        this.functionMap = {
            '输出': 'console.log',
            '警告': 'console.warn',
            '错误': 'console.error'
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