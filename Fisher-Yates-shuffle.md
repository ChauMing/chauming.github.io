#Fisher-Yates-shuffle洗牌算法

最近在看underscorejs的时候看到了_.shuffle (打乱集合)用的就是这个Fisher-Yates-shuffle算法,然后在_.simple(取样,从集合中随机取n个元素)中很好的依赖了_.shuffle

我不由得想起以前写通信软件基础作业的时候懵逼懵逼的想从数组中随机取n个元素该怎么
避免随机数重复

以下是underscore中的实现

shuffle: 
​    
```javascript
_.shuffle = function(obj) {
    var set = obj && obj.length === +obj.length ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
        rand = _.random(0, index);     // 产生0到index的随机数
        if (rand !== index) 
            shuffled[index] = shuffled[rand];
        shuffled[rand] = set[index];
    }
    return shuffled;
 };
```


 sample:

```javascript
 _.sample = function(obj, n, guard) {
    if (n == null || guard) {
        if (obj.length !== +obj.length) obj = _.values(obj);
        return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
};
```

sample依赖于shuffle,先用shuffle將集合打乱,再从中取出n个元素,这个效果就和从集合中任取n个元素是一样的了,不得不说这个依赖很巧妙,反正我是没想到过.

以下简绍一下shuffle的算法

 + Fisher–Yates shuffle

 Fisher–Yates shuffle(以Ronald Fisher和Frank Yates的名字命名的) 最早在1938年Ronald Fisher和Frank Yates的书*tatistical tables for biological, agricultural and medical research*里被描述,他们是这样描述这个算法的(其实是我自己理解翻译的,毕竟1938年哪有什么数组啊):
    1. 有一个长度为len的数组arr

    2. 生成一个0到len的随机数rand

    3. 將array[rand]取出push到另一个数组shuffledArr(此时len减1了)

    4. 重复2,3步直到arr中没有元素

 js 代码实现:

```javascript
    function randomRange(min, max) {
  	  if(max == null) {
            max = min;
	    	min = 0;
        }
        return min + Math.floor(Math.random() * (max - min +1));
    }

    function shuffle(arr) {
        var rand = 0,
            temp = 0,
            shuffledArr = [];
        
       while(arr[0] !== void 0) {
           rand = randomRange(0, arr.length);
           temp = arr.splice(rand, 1)[0];       // 取出第rand个元素
           shuffledArr.push(temp);
       }
    return shuffledArr;
    }
```

 但是这样因为删除数组中的元素的时候要前移
所以时间复杂度是O(n<sup>2</sup>)

  + Knuth-Durstenfeld Shuffle

     到了1964年,这个算法的现代版本被Richard Durstenfeld提出,随着Donald E. Knuth的(The Art of Computer Programming)[http://]被推广
     Durstenfeld和Knuth在Fisher和Yates的基础上改进了这个算法
     时间复杂度从O(n<sup>2</sup>)降低到了O(n);

 来看看伪代码描述
​    
        -- To shuffle an array a of n elements (indices 0..n-1):
            for i from n−1 downto 1 do					
    	        j ← random integer such that 0 ≤ j ≤ i 		// 生成一个从0到i的随机数
     	       exchange a[j] and a[i] 						// 交换j和i的值

 js实现:
​	
```javascript
    function shuffle(arr) {
        var rand,
            temp;	
        for(var i = 0, len = arr.length; i < len; i++) {
            rand = randomRange(i);
            temp = arr[rand];
            arr[rand] = arr[i]
            arr[i] = temp;
        }
        return arr;
    }
```

 但是这个算法是一个in-place shuffle(就地洗牌),打乱了原始数据,我们有时候希望原始数据不会被打乱,所以我们需要另一个不打乱原始数据的算法

 + The "inside-out" algorithm

 Inside-Out Algorithm 算法的基本思想是设一个迭代器i从前向后扫描原始数据，在[0, i]之间生成一个随机数rand，然后对拷贝数据用下标为rand的元素替换掉位置i的元素，再用原始数据位置i的元素替换掉拷贝数据位置rand的元素。其作用相当于在拷贝数据中交换i与rand位置处的值。 伪代码如下：

        To initialize an array a of n elements to a randomly shuffled copy of source, both 0-based:
  		for i from 0 to n − 1 do
      	    j ← random integer such that 0 ≤ j ≤ i
      	       if j ≠ i
                    a[i] ← a[j]
                 a[j] ← source[i]

 js实现:
​    
```javascript
    function shuffle(arr) {
        var len = arr.length,
            shuffledArr = Array(len);
        for(var i = 0, rand; i < len; i++) {
            rand = randomRange(i);
            if(rand !== i) shuffledArr[i] = shuffledArr[rand];
            shuffledArr[rand] = arr[i];
        }
        return shuffledArr;
    }
```
 其实这样就和underscore里面的实现一样一样的了~不过我写这个没有考虑集合

参考: [Fisher-Yates-shuffle --wikipedia](http://en.wikipedia.org/wiki/Fisher-Yates_shuffle)