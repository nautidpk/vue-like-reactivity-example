var target, // target is global variable that point  to current function that we need to watch for
    total; 


// Dependency class - pub-sub pattern
class Dep{
    constructor(){
        this.subscribers=[];
    }

    depend(){
        if(target)
            this.subscribers.push(target);
    }

    //call all other functions that are dependent on this value change
    notify(){
        this.subscribers.forEach((target)=>target());
    }
}


// function called with function that needs to be watched
function watcher(func){
    target = func;
    target();
    target = null;
}

var data ={
    price:1,
    tax:2
};


// this add getter and setter for all data properties so that whetn properties access we notify all other places
// that need to update
function makeDataReactive(data){
    Object.keys(data).forEach((prop)=>{
        let internalVal = data[prop];
        let d=new Dep();
        Object.defineProperty(data,prop,{
            get(){
                d.depend();
                return internalVal;
            },
            set(val){
                internalVal=val;
                d.notify();
            }
        });
    });
}

makeDataReactive(data);

watcher(()=>{
    total = data.price + data.tax;
});


// test above simple reactivity system

data.price = 10;

console.log(total); //12

data.tax=0;

console.log(total);//10
