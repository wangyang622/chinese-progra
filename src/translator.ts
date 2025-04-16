export interface TokenMap {
  [key: string]: string;
}

export class ChineseTranslator {
  private keywordMap: TokenMap = {
    '如果': 'if',
    '否则': 'else',
    '否则如果': 'else if',
    '循环': 'for',
    '当': 'while',
    '函数': 'function',
    '返回': 'return',
    '变量': 'let',
    '常量': 'const',
    '类': 'class',
    '继承': 'extends',
    '实现': 'implements',
    '接口': 'interface',
    '导入': 'import',
    '导出': 'export',
    '从': 'from',
    '异步': 'async',
    '等待': 'await',
    '尝试': 'try',
    '捕获': 'catch',
    '最终': 'finally',
    '抛出': 'throw',
    '新建': 'new',
    '删除': 'delete',
    '真': 'true',
    '假': 'false',
    '空': 'null',
    '未定义': 'undefined',
    '结构': 'struct',
    '枚举': 'enum'
  };
  
  private functionMap: TokenMap = {
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
    '窗口': 'window'
  };
  
  /**
   * 转译中文代码到JavaScript
   */
  translate(sourceCode: string): string {
    let translatedCode = sourceCode;
    
    // 创建一个排序后的关键字数组，确保较长的关键字（如"否则如果"）先被替换
    const sortedKeywords = Object.keys(this.keywordMap).sort((a, b) => b.length - a.length);
    for (const chineseKeyword of sortedKeywords) {
      const targetKeyword = this.keywordMap[chineseKeyword];
      // 使用零宽断言确保我们替换的是独立的单词
      const regex = new RegExp(`(^|[\\s;{}\\(\\)])${chineseKeyword}([\\s;{}\\(\\)]|$)`, 'g');
      translatedCode = translatedCode.replace(regex, `$1${targetKeyword}$2`);
    }
    
    // 替换函数名，同样排序并处理
    const sortedFunctions = Object.keys(this.functionMap).sort((a, b) => b.length - a.length);
    for (const chineseFunc of sortedFunctions) {
      const targetFunc = this.functionMap[chineseFunc];
      const regex = new RegExp(`(^|[\\s;{}\\(\\)])${chineseFunc}([\\s;{}\\(\\)]|$)`, 'g');
      translatedCode = translatedCode.replace(regex, `$1${targetFunc}$2`);
    }
    
    return translatedCode;
  }
} 