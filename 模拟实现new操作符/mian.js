function new_object() {
    // 创建一个空对象
    let obj=new Object()
    // 获得构造函数
    let Con=[].shift.call(arguments)
    // 链接到原型（不推荐使用）
    obj.__proto__=Con.prototype
    // 绑定this，执行构造函数
    let result=Con.apply(obj,arguments)
    // 确保new 出来的是个对象
    return typeof result === 'object' ?result:obj
}

// 进一步优化new 实现

function create(){
    // 1.获得构造函数，同时删除arguments中第一个参数
    Con=[].shift.call(arguments)
    // 2.创建一个空的对象并链接到原型，obj可以访问构造函数原型中的属性
    let obj=Object.create(Con.prototype)
    // 3.绑定this实现继承，obj可以访问到构造函数中的属性
    let ret=Con.apply(obj,arguments)
    // 4.优先返回构造函数返回的对象
    return ret instanceof Object?ret:obj
}
