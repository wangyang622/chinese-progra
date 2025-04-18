// 中文编程示例
// 这个文件展示了如何使用中文编程语言

// 1. 变量和常量
let 计数 = 0;
const 最大值 = 100;
let 名字 = "张三";
let 是否完成 = false;

// 2. 函数定义
function 计算阶乘(数字) {
  if (数字 <= 1) {
    return 1;
  }
  return 数字 * 计算阶乘(数字 - 1);
}

function 打印消息(消息) {
  console.log("消息: " + 消息);
}

// 3. 条件语句
let 分数 = 85;

if (分数 >= 90) {
  打印消息("优秀");
} else if (分数 >= 80) {
  打印消息("良好");
} else if (分数 >= 60) {
  打印消息("及格");
} else {
  打印消息("不及格");
}

// 4. 循环语句
console.log("循环示例:");
for (let i = 0; i < 5; i++) {
  console.log("循环计数: " + i);
}

console.log("当循环示例:");
let j = 0;
while (j < 3) {
  console.log("当前j值: " + j);
  j++;
}

// 5. 数组和对象
let 水果列表 = ["苹果", "香蕉", "橙子"];
console.log("水果列表的第一项: " + 水果列表[0]);

let 学生 = {
  姓名: "李四",
  年龄: 18,
  成绩: [95, 85, 90]
};
console.log("学生姓名: " + 学生.姓名);
console.log("学生平均成绩: " + (学生.成绩[0] + 学生.成绩[1] + 学生.成绩[2]) / 3);

// 6. 阶乘函数调用
let 阶乘结果 = 计算阶乘(5);
console.log("5的阶乘结果: " + 阶乘结果);  // 应该输出120

// 7. 异常处理
尝试 {
  let x = 10 / 0;  // 除以零错误
  console.log("这行不会执行");
} 捕获 (console.error) {
  console.log("捕获到错误: " + 错误.message);
}

// 8. 定时器示例
console.log("程序执行完毕，等待3秒后将显示另一条消息...");
定时器(() => {
  console.log("3秒后的消息!");
}, 3000); 