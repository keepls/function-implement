class Observer{
    constructor(data){
        this.$data=data
        this.observer(this.$data)
    }
    observer(obj){
        if (typeof obj !=='object') return;
        Object.keys(obj).forEach(key=>{
            this.defineReactive(obj,key,obj[key]);
        })
    }
    defineReactive(obj,key,value){
        if(typeof value==='object') this.observer(value)
        let dep=new Dep();
        Object.defineProperty(obj,key,{
          get(){
            if (window.target) {
                dep.addSubs();
            }
            return value;
          },
          set:(newVal)=>{
            if(value === newVal) return;
            // 防止newVal为对象的情况，需要重新将对象中的属性变为响应式
            this.observer();
            value=newVal
            dep.notify()
          }
        })
    }
}

class Dep{
    constructor(){
        this.subs=[]
    }
    addSubs(){
        this.subs.push(window.target)
    }
    notify(){
        this.subs.forEach(watcher=>watcher.update())
    }
}

class Watcher{
    constructor(vm,expr,cb){
        this.$vm=vm
        this.expr=expr
        this.cb=cb
        this.getter()
    }
    update(){
        let newVal;
        if (typeof this.expr ==='function') {
            newVal=this.expr()
        }else{
            newVal=compileUtil.getValue(this.expr,this,this.$vm)
        }
        if(this.value ===newVal) return;
        this.value=newVal
        this.cb();
    }
    getter(){
        window.target=this
        if (typeof this.expr==='function') {
            this.value=this.expr()
        }else{
            this.value=compileUtil.getValue(this.expr,this.$vm)
        }
        window.target=null;
    }


}


// class版

class Vue{
    constructor(options){
        this.$data=options.data
        this.$el=options.el
        this.$option=options
        if (this.$el) {
            // 将数据变为响应式
            new Observer(this.$data)
            // 代理$data
            this.proxyVm(this.$data)
            // 代理computed
            this.proxyVm(this.$option.computed)
            // 编译模板
            new Compile(this.$el,this)
        }
    }
    proxyVm(data){
        for (let key in data) {
            Object.defineProperty(this,key,{
                get(){
                    return data[key];
                },
                set(newVal){
                    data[key]=newVal
                }
            })
        }
    }
}

class Compile{
    constructor(el,vm){
        this.$el=this.isElementNode(el) ?el:document.querySelector(el)
        this.$vm=vm
        // 在内存中创建一个和$el相同的元素节点
        let fragment=this.node2fragment(this.$el)
        // 解析模板($el节点)
        this.compile(fragment)
        // 将解析后的节点重新挂载到dom树上
        this.$el.appendChild(fragment)
    }
    // 判断node是否为元素节点
    isElementNode(node){
        return node.nodeType ===1
    }
    // 判断是否为v-开头的vue指令
    isDirective(attr){
        return attr.startsWith('v-')
    }
    isSpecialisDirective(attr){
        return attr.startsWith('@')
    }
    compile(fragment){
        // 获取根节点的子节点
        let childNodes=fragment.childNodes

        [...childNodes].forEach(child=>{
            if (this.isElementNode(child)) {
                // 解析元素节点的属性，查看是否存在vue指令
                this.compileElement(child)
                // 如果子节点也是元素节点，则递归执行该函数
                this.compile(child)
            } else {
                // 解析文本节点，查看是否存在“{{}}”
                this.compileText(child)
            }
        })
    }
    // 编译元素
    compileElement(node){
        // 获取元素节点的所有属性
        let attrs=node.attributes
        // 遍历所有属性，查找是否存在vue指令
        [...attrs].forEach(attr=>{
            // name:属性名，expr:属性值
            let {name,value:expr}=attr
            // 判断是不是指令
            if (this.isDirective(name)) {
                let [,directive]=name.split('-')
                // 如果为指令则去设置该节点的响应式函数
                compileUtil[directive](node,expr,this.$vm)   
            }
            if (this.isSpecialisDirective(name)) {
                let eventName=name.substr(1)
                compileUtil['on'](node,eventName,expr,this.$vm)
            }
        })
    }
    // 编辑文本
    
}
























































































