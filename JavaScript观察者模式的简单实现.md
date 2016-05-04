前段时间看了一下发布订阅者模式(也叫观察者模式),今天看<基于mvc的JavaScript的富应用开发>又看到了它,这个设计模式是非常有用的,正好写篇博客来分享一下.(标点符号我是不管的,别打我..)

一些前端MVVM框架就是用的观察者模式实现是双向绑定

先上维基百科看看: 
>观察者模式是软件设计模式的一种。在此种模式中，一个目标对象管理所有相依于它的观察者对象，并且在它本身的状态改变时主动发出通知。这通常透过呼叫各观察者所提供的方法来实现。此种模式通常被用来实时事件处理系统。

<基于mvc的JavaScript的富应用开发>上给的解释: 
>发布/订阅模式(Pub/Sub)是一种消息模式,它有**两个参与者**: ：**发布者和订阅者**。发布者向
某个信道发布一条消息，订阅者绑定这个信道，当有消息发布至信道时就会
接收到一个通知。最重要的一点是，**发布者和订阅者是完全解耦的，彼此并不知晓对方
的存在。两者仅仅共享一个信道名称。**

理解起来很简单: 我去书报亭订了一份报纸,当他把报纸送给我了,我就去领了看.

这里,我就变成了**订阅者**,报亭就是**发布者**,当报纸送到的时候(状态发生改变,通知订阅者),我就去领了看(做一些操作)

废话说完了,我觉得我需要写一个,不然读者都以为我在吹牛,所以,装逼装到位,我就假装写一个吧(如有雷同纯属巧合)

一个发布者应该有三个主要的方法: 订阅,发布,退订.

先来写订阅:

``` js
var PubSub = {};
var eventObj = {};
PubSub.subscribe = function(event, fn) {
     eventObj[event] = fn;
}
```

再来写个发布: 

``` js
PubSub.publish = function(event) {
    if (eventObj[event]) eventObj[event]();
}
```
最后写一个退订:

```js
PubSub.off = function(event, fn) {
    if (eventObj[event]) eventObj[event] = null;
}
```

我们来整理一下代码用闭包隐藏eventObj这个对象:

```js
var PubSub = (function() {
    var eventObj = {};
    return {
        subscribe: function(event, fn) {
            eventObj[event] = fn;
        },
        publish: function(event) {
            if (eventObj[event]) eventObj[event]();
        },
        off: function(event) {
            if (eventObj[event]) delete eventObj[event];
        }
    }
}());
```

用一下试试试能不能跑:

```js
PubSub.subscribe('event', function() {
    console.log('event release');
});
PubSub.publish('event'); // 'event release'
```

OK it work!!

这绝对是最简单无脑的观察者模式的实现了,你以为这就完了吗?

这样..这个一个事件只能绑定一个操作,并且取消订阅把整个事件都删除掉了,这样就不是很好了,我们应该写一个支持一个事件绑定多个操作的,并且退订时是退订一个事件上的一个操作,而不是删除整个事件

再来: 

一个事件绑定多个操作,我们应该用一个数组把操作保存起来,发布时按订阅顺序执行,退订时删除对应的数组元素就好.


```js
var PubSub = (function() {
    var queue = {};
    var subscribe = function(event, fn) {
        if (!queue[event]) queue[event] = [];
        queue[event].push(fn);
    }
    var publish = function(event) {
        var eventQueue = queue[event],
            len = eventQueue.length;
        if (eventQueue) {
            eventQueue.forEach(function(item, index) {
                item();
            });
        }
    }
    var off = function(event, fn) {
        var eventQueue = queue[event];
        if (eventQueue) {
            queue[event] = eventQueue.filter(function(item) {
                return item !== fn;
            });
        }
    }
    return {
        subscribe: on,
        publish: emit,
        off: off
    }
}());
```

以上就是一个简单的观察者模式的实现了.

example: 

```js
function first() {
    console.log('event a publish first');
}
PubSub.subscribe('a', first);
PubSub.subscribe('a', function() {
    console.log('event a publish second');
});
PubSub.publish('a'); // event a emit first, event a emit second

PubSub.off('a', first);
PubSub.publish('a');  //event a emit second
```

以上.