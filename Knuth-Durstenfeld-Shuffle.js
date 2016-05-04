function randomRange(min, max) {
	if(max == null) {
		max = min;
		min = 0
	}
	return min + Math.floor(Math.random() * (max - min +1));
}

// function shuffle(arr) {
// 	var len = arr.length,
// 		shuffled = Array(len);
// 	for(var i = 0, len = arr.length; i < len; i++) {
// 		rand = randomRange(i);
// 		shuffled[i] = 
// 	}
// }
// 
// 

function shuffle(arr) {
	var len = arr.len,
		shuffledArr = Array(len);
	for(var i = 0, rand; i < len; i++) {
		rand = randomRange(i);
		if(rand !== i) shuffledArr[i] = shuffledArr[rand];
		shuffledArr[rand] = arr[i];
	}
	return shuffledArr;
}
shuffle = function(obj) {
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
}

// function shuffle(arr) {
// 	var rand = 0,
// 		temp = 0,
// 		shuffledArr = [];

// 	while(arr[0] !== void 0) {
// 		rand = randomRange(0, arr.length);
// 		temp = arr.splice(rand, 1)[0];       // 取出第rand个元素
// 		shuffledArr.push(temp);
// 	}

// 	return shuffledArr;
// }
// function shuffle(arr) {
// 	var rand,
// 		temp;
	
// 	for(var i = 0, len = arr.length; i < len; i++) {
// 		rand = randomRange(i);
// 		temp = arr[rand];
// 		arr[rand] = arr[i]
// 		arr[i] = temp;
// 	}
// 	return arr;
// }
