// 函数和条件测试
function 计算阶乘(数字) {
  if (数字 <= 1) {
    return 1;
  }
  return 数字 * 计算阶乘(数字 - 1);
}

function 判断奇偶(数字) {
  if (数字 % 2 === 0) {
    return "偶数";
  } else {
    return "奇数";
  }
}

let 数字 = 5;
let 阶乘结果 = 计算阶乘(数字);
console.log(数字 + "的阶乘是: " + 阶乘结果);
console.log(数字 + "是" + 判断奇偶(数字)); 