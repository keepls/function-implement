Function.prototype.call=function(context){
    // 将函数设为对象的属性
    // 注意：非严格模式下，
    // 指定为null和undefined的this值会自动指向全局对象（浏览器中就是window对象）
    // 值为原始值（数字，字符窜，布尔值）的this会指向该原始值的自动包装对象（用object（）转换）
    context=context? Object(context):window
    context.fn=this
    // 执行该函数
    let args=[...arguments].slice(1)
    let result=context.fn(...args)
    // 删除该函数
    delete context.fn
    // 注意：函数是可以有返回值的
    return result
}