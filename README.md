# 中文编程语言

这是一个VSCode扩展，允许你使用中文编写程序。它将中文代码转译为JavaScript，并在VSCode中提供语法高亮、代码补全和其他语言功能。

## 功能

- 使用中文关键字和函数名编写程序
- 将中文代码转译为JavaScript
- 在VSCode中直接运行中文程序
- 提供语法高亮和代码补全
- 支持悬停提示，显示中文关键字含义

## 安装

### 方法一：从 VS Code Marketplace 安装
1. 在VS Code中打开扩展面板（按Ctrl+Shift+X）
2. 搜索"中文编程语言"
3. 点击安装按钮

### 方法二：手动安装
1. 下载[发布页面](https://github.com/wangyang622/chinese-progra/releases)的最新VSIX文件
2. 在VS Code中，按Ctrl+Shift+P打开命令面板
3. 输入"扩展：从VSIX安装"并选择下载的文件
4. 重启VS Code

### 方法三：从源码安装
1. 克隆仓库：`git clone https://github.com/wangyang622/chinese-progra.git`
2. 将整个项目复制到`.vscode/extensions`目录下
3. 重启VSCode

开始使用：创建一个`.zs`后缀的文件，开始编写中文代码

## 使用方法

1. 创建一个带有`.zs`扩展名的文件
2. 使用中文关键字和函数编写代码
3. 点击编辑器右上角的"Run Chinese Code"按钮，或使用命令面板执行"Chinese: Run Chinese Code"命令

## 支持的中文关键字

- `如果` - if
- `否则` - else
- `否则如果` - else if
- `循环` - for
- `当` - while
- `函数` - function
- `返回` - return
- `变量` - let
- `常量` - const
- `类` - class
- `继承` - extends
- `实现` - implements
- `接口` - interface
- `导入` - import
- `导出` - export
- `从` - from
- `异步` - async
- `等待` - await
- `尝试` - try
- `捕获` - catch
- `最终` - finally
- `抛出` - throw
- `新建` - new
- `删除` - delete
- `真` - true
- `假` - false
- `空` - null
- `未定义` - undefined

## 支持的中文函数

- `输出` - console.log
- `警告` - console.warn
- `错误` - console.error
- `信息` - console.info
- `断言` - console.assert
- `计时开始` - console.time
- `计时结束` - console.timeEnd
- `日期` - Date
- `数学` - Math
- `随机` - Math.random
- `最大值` - Math.max
- `最小值` - Math.min
- `绝对值` - Math.abs
- `四舍五入` - Math.round
- `上取整` - Math.ceil
- `下取整` - Math.floor
- `解析整数` - parseInt
- `解析浮点数` - parseFloat
- `定时器` - setTimeout
- `间隔器` - setInterval
- `清除定时器` - clearTimeout
- `清除间隔器` - clearInterval

## 示例代码

```
// 中文编程示例
变量 计数 = 0;
常量 最大值 = 100;

函数 计算阶乘(数字) {
  如果 (数字 <= 1) {
    返回 1;
  }
  返回 数字 * 计算阶乘(数字 - 1);
}

变量 结果 = 计算阶乘(5);
输出("5的阶乘结果: " + 结果);  // 输出: 120
```

将上述代码保存为`.zs`扩展名的文件，然后点击"Run Chinese Code"按钮执行。

## 实现原理

这个扩展通过以下方式工作：

1. 解析中文代码，识别中文关键字和函数
2. 将中文关键字和函数转换为等效的JavaScript代码
3. 运行转换后的JavaScript代码并在同一目录下生成同名的`.js`文件
4. 显示执行结果

内部使用简单的字符串替换将中文代码转换为JavaScript。

## 限制

- 目前只支持基本的JavaScript功能
- 不支持所有JavaScript库和API的中文映射
- 错误信息可能仍然是英文（来自JavaScript运行时）

## 贡献

欢迎提交问题和建议来帮助改进这个扩展！请访问我们的[GitHub仓库](https://github.com/wangyang622/chinese-progra)提交问题或发起拉取请求。

## 关于

- **发布者**: Sun
- **版本**: 0.1.0
- **GitHub**: [https://github.com/wangyang622/chinese-progra](https://github.com/wangyang622/chinese-progra)

## 许可证

MIT 