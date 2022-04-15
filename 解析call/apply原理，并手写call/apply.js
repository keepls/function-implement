Function.prototype.apply=function(context,arr){
    context=context ?Object(context) :window
    context.fn=this
    let result
    if (!arr) {
        result=context.fn()       
    }else{
        result=context.fn(...arr)
    }
    delete context.fn
    return result;
}