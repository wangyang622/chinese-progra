import {
  createConnection,
  TextDocuments,
  Diagnostic,
  DiagnosticSeverity,
  ProposedFeatures,
  InitializeParams,
  TextDocumentPositionParams,
  CompletionItem,
  CompletionItemKind,
  TextDocumentSyncKind,
  DidChangeConfigurationNotification,
  HoverParams,
  Hover,
  MarkupKind
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { ChineseTranslator } from './translator';

// 创建连接
const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
const translator = new ChineseTranslator();

// 定义设置接口
interface ServerSettings {
  maxNumberOfProblems: number;
  enableDiagnostics: boolean;
}

const defaultSettings: ServerSettings = { 
  maxNumberOfProblems: 1000,
  enableDiagnostics: true
};

// 全局设置是基于用户的配置
const globalSettings: ServerSettings = defaultSettings;

connection.onInitialize(() => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: ['.']
      },
      hoverProvider: true,
      definitionProvider: true
    }
  };
});

// 文档变更时检查
documents.onDidChangeContent(change => {
  validateTextDocument(change.document);
});

// 提供代码补全
connection.onCompletion((): CompletionItem[] => {
  // 返回中文关键字和函数补全列表
  return [
    // 基本控制结构
    {
      label: '如果',
      kind: CompletionItemKind.Keyword,
      data: 1,
      detail: '条件语句',
      documentation: '如果 (条件) { ... }'
    },
    {
      label: '否则',
      kind: CompletionItemKind.Keyword,
      data: 2,
      detail: '条件语句',
      documentation: '否则 { ... }'
    },
    {
      label: '否则如果',
      kind: CompletionItemKind.Keyword,
      data: 3,
      detail: '条件语句',
      documentation: '否则如果 (条件) { ... }'
    },
    {
      label: '函数',
      kind: CompletionItemKind.Keyword,
      data: 4,
      detail: '函数定义',
      documentation: '函数 名称(参数) { ... }'
    },
    {
      label: '变量',
      kind: CompletionItemKind.Keyword,
      data: 5,
      detail: '变量定义',
      documentation: '变量 名称 = 值;'
    },
    {
      label: '常量',
      kind: CompletionItemKind.Keyword,
      data: 6,
      detail: '常量定义',
      documentation: '常量 名称 = 值;'
    },
    {
      label: '循环',
      kind: CompletionItemKind.Keyword,
      data: 7,
      detail: '循环语句',
      documentation: '循环 (初始化; 条件; 增量) { ... }'
    },
    {
      label: '当',
      kind: CompletionItemKind.Keyword,
      data: 8,
      detail: '循环语句',
      documentation: '当 (条件) { ... }'
    },
    {
      label: '返回',
      kind: CompletionItemKind.Keyword,
      data: 9,
      detail: '返回语句',
      documentation: '返回 值;'
    },
    
    // 错误处理
    {
      label: '尝试',
      kind: CompletionItemKind.Keyword,
      data: 11,
      detail: '异常处理',
      documentation: '尝试 { ... } 捕获 (错误) { ... }'
    },
    {
      label: '捕获',
      kind: CompletionItemKind.Keyword,
      data: 12,
      detail: '异常处理',
      documentation: '尝试 { ... } 捕获 (错误) { ... }'
    },
    {
      label: '最终',
      kind: CompletionItemKind.Keyword,
      data: 13,
      detail: '异常处理',
      documentation: '尝试 { ... } 捕获 (错误) { ... } 最终 { ... }'
    },
    {
      label: '抛出',
      kind: CompletionItemKind.Keyword,
      data: 14,
      detail: '异常处理',
      documentation: '抛出 new 错误("错误信息");'
    },
    
    // 面向对象
    {
      label: '类',
      kind: CompletionItemKind.Keyword,
      data: 15,
      detail: '类定义',
      documentation: '类 类名 { ... }'
    },
    {
      label: '继承',
      kind: CompletionItemKind.Keyword,
      data: 16,
      detail: '类继承',
      documentation: '类 子类 继承 父类 { ... }'
    },
    {
      label: '这个',
      kind: CompletionItemKind.Keyword,
      data: 17,
      detail: '指向当前对象',
      documentation: '这个.属性'
    },
    
    // 异步编程
    {
      label: '异步',
      kind: CompletionItemKind.Keyword,
      data: 18,
      detail: '异步函数',
      documentation: '异步 函数 名称() { ... }'
    },
    {
      label: '等待',
      kind: CompletionItemKind.Keyword,
      data: 19,
      detail: '等待异步操作完成',
      documentation: '等待 异步操作;'
    },
    
    // 函数
    {
      label: '输出',
      kind: CompletionItemKind.Function,
      data: 20,
      detail: '控制台输出',
      documentation: '输出(内容);'
    },
    {
      label: '警告',
      kind: CompletionItemKind.Function,
      data: 21,
      detail: '控制台警告',
      documentation: '警告(内容);'
    },
    {
      label: '错误',
      kind: CompletionItemKind.Function,
      data: 22,
      detail: '控制台错误',
      documentation: '错误(内容);'
    },
    {
      label: '定时器',
      kind: CompletionItemKind.Function,
      data: 23,
      detail: '延时执行',
      documentation: '定时器(() => { ... }, 毫秒时间);'
    },
    {
      label: '间隔器',
      kind: CompletionItemKind.Function,
      data: 24,
      detail: '定时重复执行',
      documentation: '间隔器(() => { ... }, 间隔毫秒);'
    },
    
    // 常量
    {
      label: '真',
      kind: CompletionItemKind.Keyword,
      data: 25,
      detail: '布尔值',
      documentation: '布尔值true'
    },
    {
      label: '假',
      kind: CompletionItemKind.Keyword,
      data: 26,
      detail: '布尔值',
      documentation: '布尔值false'
    },
    {
      label: '空',
      kind: CompletionItemKind.Keyword,
      data: 27,
      detail: '空值',
      documentation: '空值null'
    },
    {
      label: '未定义',
      kind: CompletionItemKind.Keyword,
      data: 28,
      detail: '未定义值',
      documentation: '未定义值undefined'
    }
  ];
});

// 提供悬停提示
connection.onHover((params: HoverParams): Hover | null => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return null;
  }

  const text = document.getText();
  const offset = document.offsetAt(params.position);
  
  // 获取当前单词
  let start = offset;
  let end = offset;
  
  while (start > 0 && /[\u4e00-\u9fa5a-zA-Z0-9_]/.test(text.charAt(start - 1))) {
    start--;
  }
  
  while (end < text.length && /[\u4e00-\u9fa5a-zA-Z0-9_]/.test(text.charAt(end))) {
    end++;
  }
  
  const word = text.substring(start, end);
  
  // 检查是否是关键字或函数
  const keywordMap: {[key: string]: string} = {
    '如果': '条件语句，等同于JavaScript中的if',
    '否则': '条件语句，等同于JavaScript中的else',
    '否则如果': '条件语句，等同于JavaScript中的else if',
    '循环': '循环语句，等同于JavaScript中的for',
    '当': '循环语句，等同于JavaScript中的while',
    '函数': '函数定义，等同于JavaScript中的function',
    '返回': '返回语句，等同于JavaScript中的return',
    '变量': '变量定义，等同于JavaScript中的let',
    '常量': '常量定义，等同于JavaScript中的const',
    '输出': '输出函数，等同于JavaScript中的console.log',
    '尝试': '异常处理，等同于JavaScript中的try',
    '捕获': '异常处理，等同于JavaScript中的catch',
    '最终': '异常处理，等同于JavaScript中的finally',
    '抛出': '抛出异常，等同于JavaScript中的throw',
    '类': '类定义，等同于JavaScript中的class',
    '继承': '类继承，等同于JavaScript中的extends',
    '实现': '接口实现，等同于JavaScript中的implements',
    '接口': '接口定义，等同于JavaScript中的interface',
    '异步': '异步函数，等同于JavaScript中的async',
    '等待': '等待异步操作完成，等同于JavaScript中的await',
    '定时器': '延迟执行函数，等同于JavaScript中的setTimeout',
    '间隔器': '定时重复执行，等同于JavaScript中的setInterval',
    '真': '布尔值真，等同于JavaScript中的true',
    '假': '布尔值假，等同于JavaScript中的false',
    '空': '空值，等同于JavaScript中的null',
    '未定义': '未定义值，等同于JavaScript中的undefined'
  };
  
  if (word in keywordMap) {
    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: `**${word}**\n\n${keywordMap[word]}`
      }
    };
  }
  
  return null;
});

// 解析文档
async function validateTextDocument(textDocument: TextDocument): Promise<void> {
  const diagnostics: Diagnostic[] = [];
  
  try {
    // 尝试转译代码，检查语法错误
    translator.translate(textDocument.getText());
  } catch (e) {
    // 添加错误诊断
    if (e instanceof Error) {
      diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
          start: textDocument.positionAt(0),
          end: textDocument.positionAt(textDocument.getText().length)
        },
        message: `转译错误: ${e.message}`,
        source: '中文编程'
      });
    }
  }
  
  // 发送诊断结果
  connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

// 启动服务
documents.listen(connection);
connection.listen(); 