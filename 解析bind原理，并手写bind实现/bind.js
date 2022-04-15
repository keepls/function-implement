Function.prototype.bind =function(context){
    // 调用bind的不是函数，需要抛出异常
    if (typeof this !=='function') {
        throw new Error("")
    }
    // this指向调用者
    var self=this
    // 实现第2点，因为第一个参数是指定的this，所以只截取第一个之后的参数
    var args=Array.prototype.slice.call(arguments,1)
    // 实现第3点，返回一个函数
    return function(){
        // 实现第4点，这式的arguments是指bind返回的函数传入的参数
        // 即 return function的参数
        var bindArgs=Array.prototype.slice.call(arguments)
        // 实现第1点
        return self.apply(context,args.concat(bindArgs))
    }
}