"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChineseFormatter = void 0;
const vscode_1 = __importDefault(require("vscode"));
/**
 * 中文代码格式化器类
 */
class ChineseFormatter {
    /**
     * 格式化代码
     * @param document 要格式化的文档
     * @param range 要格式化的范围，如果为null则格式化整个文档
     * @param options 格式化选项
     * @returns 格式化的文本编辑
     */
    provideDocumentFormattingEdits(document, options) {
        const edits = [];
        const text = document.getText();
        const formattedText = this.formatText(text, options);
        // 如果格式化后的文本与原文本不同，则创建一个编辑
        if (formattedText !== text) {
            const fullRange = new vscode_1.default.Range(document.positionAt(0), document.positionAt(text.length));
            edits.push(vscode_1.default.TextEdit.replace(fullRange, formattedText));
        }
        return edits;
    }
    /**
     * 提供选区格式化
     * @param document 要格式化的文档
     * @param range 要格式化的范围
     * @param options 格式化选项
     * @returns 格式化的文本编辑
     */
    provideDocumentRangeFormattingEdits(document, range, options) {
        const text = document.getText(range);
        const formattedText = this.formatText(text, options);
        // 如果格式化后的文本与原文本不同，则创建一个编辑
        if (formattedText !== text) {
            return [vscode_1.default.TextEdit.replace(range, formattedText)];
        }
        return [];
    }
    /**
     * 格式化文本
     * @param text 要格式化的文本
     * @param options 格式化选项
     * @returns 格式化后的文本
     */
    formatText(text, options) {
        // 分割为行
        let lines = text.split('\n');
        const formattedLines = [];
        // 保存当前缩进级别
        let indentLevel = 0;
        // 处理每一行
        for (const line of lines) {
            // 去除行首尾空白
            let trimmedLine = line.trim();
            // 忽略空行
            if (!trimmedLine) {
                formattedLines.push('');
                continue;
            }
            // 检查行结束是否包含右花括号，如果是，则减少缩进
            if (trimmedLine.endsWith('}')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }
            // 添加适当的缩进
            const indentation = options.insertSpaces
                ? ' '.repeat(options.tabSize * indentLevel)
                : '\t'.repeat(indentLevel);
            // 将格式化后的行添加到结果中
            formattedLines.push(indentation + trimmedLine);
            // 检查行是否包含左花括号，如果是，则增加缩进
            if (trimmedLine.endsWith('{')) {
                indentLevel++;
            }
        }
        // 合并所有行
        return formattedLines.join('\n');
    }
}
exports.ChineseFormatter = ChineseFormatter;
//# sourceMappingURL=formatter.js.map