// instanceof的内部实现
// L 左表达式，R右表达式，即L为变量，R为类型
function instance_of(L,R){
    // 取R的显示原型
    var prototype=R.prototype
    // 取L的隐式模型
    L=L.__proto__
    // 判断对象L的类型是否严格等于类型R的显式原型
    while (true) {
        if (L ===null) {
            return false
        }
        // 这里重点：当prototype严格等于L时，返回true
        if (prototype===L) {
            return true
        }
        L=L.__proto__
    }
}