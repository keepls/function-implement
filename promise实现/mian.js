// 三种状态
const PENDING="pending"
const FULFILLED="fulfilled"
const REJECTED="rejected"

function MyPromise(callback){
    var _this=this
    _this.currentState=PENDING //promise当前的状态
    _this.value=void 0 //promise的值
    // 用于保存then的回调，只有当promise状态为pending时才会缓存，并且每个实例至多缓存一个
    _this.onResolvedCallbacks=[] //promise resolve时的回调函数集
    _this.onRejectedCallbacks=[] //promise reject时的回调函数集
    _this.resolve=function(value){
        if (value instanceof MyPromise) {
            // 如果value是个promise,递归执行
            return value.then(_this.resolve,_this,reject)
        }
        setTimeout(() => {
            //异步执行，保证顺序执行
            if (_this.currentState===PENDING) {
                _this.currentState=FULFILLED //状态管理
                _this.value=value
                _this.onResolvedCallbacks.forEach(cb=>cb())
            } 
        });
    } // resolve处理函数

    // reject处理函数
    _this.reject=function(value){
        setTimeout(() => {
            //异步执行，保证顺序执行
            if (_this.currentState===PENDING) {
                _this.currentState=REJECTED //状态管理
                _this.value=value
                _this.onRejectedCallbacks.forEach(cb=>cb())
            } 
        });
    }

    // 异常处理
    // new promise(()=>throw error(""))
    try {
        // 执行callback并传入相应的参数
        callback(_this.resolve,_this.reject)
    } catch (e) {
        _this.reject(e)
    }
}
// then方法接受两个参数，onFulfilled,onRejected,分别为promise成功或失败的回调

MyPromise.prototype.then=function(onFulfilled,onRejected){
    var _this=this
    //规范2.2.7，then必须返回一个新的promise
    var promise2
    //根据规范2.2.1，onFulfilled,onRejected都是可选参数
    //onFulfilled,onRejected不是函数需要忽略，同时也实现了值穿透
    onFulfilled=typeof onFulfilled==='function' ? onFulfilled:value=>value
    onRejected=typeof onRejected==='function' ? onRejected:error=>{throw error}
    if (_this.currentState===FULFILLED) {
        // 如果promise(此处为self/this)的状态已经确实并且为fulfilled,我们调用onFulfilled
        // 如果考虑到有可能throw,所以我们将其包在try/catch快中
        return promise2=new MyPromise(function(resolve,reject){
            try {
                var x=onFulfilled(_this.value)
                // 如果onFulfilled的返回值是一个promise对象，直接取它的结果作为promise2的结果
                resolutionProcedure(promise2,x,resolve,reject)
            } catch (error) {
                // 如果出错，以捕获到的错误作为promise2的结果
                reject(error)
            }
        })
    }
    
}























