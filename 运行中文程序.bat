@echo off
echo 中文编程语言运行工具
echo =====================

if "%~1"=="" (
  echo 请提供中文代码文件路径作为参数。
  echo 例如: 运行中文程序.bat 测试.zs
  exit /b 1
)

node run_chinese_code.js %1
pause 