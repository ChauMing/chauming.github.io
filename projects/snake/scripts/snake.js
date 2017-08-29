// 食物类，包含位置，大小，
function Food() {
	this.pos = createPoint(100, 100);
	this.count = 0;
	this.size = snake.size;
}
Food.prototype = {
	clearTarget : function(x, y) {     // 清除食物
		context.clearRect(x, y, snake.size, snake.size);
	},
	createTarget : function() {    // 创造食物的随机坐标
		var X, Y;
		while(1){
			X = Math.round(Math.random()*(sence.width - snake.size)/snake.size)*snake.size;
			Y = Math.round(Math.random()*(sence.height - snake.size)/snake.size)*snake.size;
			var flag = 0;     //  0:与蛇身不重合 1:与蛇身重合

			for(var i = 0; i < snake.body.length - 1; i ++) {
				if(snake.body[i].x == X && snake.body[i].y == Y){
					flag = 1;
					break;
				}
			}
			if(flag == 0) break;
		}
		this.pos = new createPoint(X, Y);
	},
	initFood : function() {
		this.createTarget();
	}
}
function Sence() {
	this.width = 500;
	this.height = 500;
	this.gameStatus = 0;    // 游戏状态stop:0; start: 1;
	this.flag = 0;
	this.isStop = 0;    // 游戏是否暂停; 
}
Sence.prototype = {
	clearUp : function() {
		context.clearRect(0, 0, this.width, this.height);
	},
	initSence : function() {
		this.isStop = 0;
		this.flag = 0;
		this.clearUp();
		this.gameStatus = 1;
	}
}
function Snake () {
	this.size = 20;    // //每格大小
	this.direction = "down";    //当前方向 
	this.preDirection = this.direction;  // 前一个方向，用于判断是否反向
	this.body = null;     // 蛇的身体是数组， 有XY属性，用于存放每个方块的坐标
	this.headPoint = null;
}
Snake.prototype = {
	initSnake : function() {
		this.size = 20;
		this.direction = "down";
		this.body = new Array();
		this.body[0] = new createPoint(240, 240);
		this.body[1] = new createPoint(240, 220);
		this.body[2] = new createPoint(240, 200);
	}
}

//point  用于创建坐标
function createPoint(x, y){
	this.x = x;
	this.y = y;
}
// 键盘事件
function keyPressed(event) {
	switch(event.keyCode){
		case 38:    //up
			if(snake.preDirection != "down")
            	snake.direction = "up";
            break;
        case 40:    //down
	        if(snake.preDirection != "up")
	        	snake.direction = "down";
            break;
        case 37:    //left
        	if(snake.preDirection != "right")
           		snake.direction = "left";
            break;
        case 39:    //right
	        if(snake.preDirection != "left")
	        	snake.direction = "right";
            break;
        case 32:     // space
        	sence.isStop? sence.isStop = 0:  sence.isStop = 1;
	}
}
// touch 事件
function Touch() {
	this.start = new createPoint(100, 100);
	this.end = new createPoint(100, 100);
	_this = this;
}
Touch.prototype = {
	touchStart : function(event){
		_this.start.x = event.changedTouches[0].screenX;
		_this.start.y = event.changedTouches[0].screenY;
	},
	touchEnd : function(event){
		_this.end.x = event.changedTouches[0].screenX;
		_this.end.y = event.changedTouches[0].screenY;
		console.log(event.changedTouches[0]);
		_this.touchDirect();
	},
	touchDirect : function(){
		var _x = _this.end.x - _this.start.x;
		var _y = _this.end.y - _this.start.y;
		if(!_x && _y > 0) if(snake.preDirection != "up")snake.direction = "down";
		if(!_x && _y < 0) if(snake.preDirection != "down")snake.direction = "up";
		if(!_y && _x > 0) if(snake.preDirection != "left")snake.direction = "right";
		if(!_y && _x < 0) if(snake.preDirection != "right")snake.direction = "left";
		if((_x > 0) && (_y / _x < 1) && ( _y / _x > -1)) if(snake.preDirection != "left")snake.direction = "right";
		if((_x < 0) && (_y / _x < 1) && ( _y / _x > -1)) if(snake.preDirection != "right")snake.direction = "left";
		if((_y > 0) && (_x / _y < 1) && (_x / _y > -1)) if(snake.preDirection != "up")snake.direction = "down";
		if((_y < 0) && (_x / _y < 1) && (_x / _y > -1)) if(snake.preDirection != "down")snake.direction = "up";
	}
}
// 游戏初始化
function initGame() {
	document.body.onkeydown = keyPressed;
	document.body.ontouchstart = touch.touchStart;
	document.body.ontouchend = touch.touchEnd;
	sence.initSence();
	snake.initSnake();
	food.initFood();
}

function darwSnake() {
	context.beginPath();
	context.fillStyle = "red";
	context.fillRect(food.pos.x, food.pos.y, snake.size, snake.size);
	context.fillStyle = "blue";
	var i = 0;
	for(i in snake.body) {
		context.fillRect(snake.body[i].x, snake.body[i].y, snake.size, snake.size);    // 蛇的身体
	}
}

if(confirm("是否进入游戏") == 1){
	var snake = new Snake();
	var food = new Food();
	var sence = new Sence();
	var touch = new Touch();
	var context = document.getElementById("snake_context").getContext("2d");
	initGame();
	Timer();
}
else{
	alert("不玩拉倒，我求你啊，哼~~~");
}

function Timer() {
	if(!sence.isStop){
	
	sence.flag = 0;    // 看看这家伙是不是撞到墙了1 ：撞了0：没撞
	snake.headPoint = new createPoint(snake.body[0].x, snake.body[0].y);

	switch(snake.direction){
		case "left":
			snake.headPoint.x -= 20;
			snake.preDirection = snake.direction;
			if (snake.headPoint.x < 0) sence.flag = 1;
			break;
		case "right":
			snake.headPoint.x += 20;
			snake.preDirection = snake.direction;
			if (snake.headPoint.x > 480) sence.flag = 1;
			break;
		case "up":
			snake.headPoint.y -= 20;
			snake.preDirection = snake.direction;
			if (snake.headPoint.y < 0) sence.flag = 1;
			break 
		case "down":
			snake.headPoint.y += 20;
			snake.preDirection = snake.direction;
			if (snake.headPoint.y > 480) sence.flag = 1;
			break;	
	}

	// 判断蛇是否撞到了自己
	if(sence.flag == 0) {
		var i = 0;
		for(i in snake.body){
			if((snake.body[i].x == snake.headPoint.x) && (snake.body[i].y == snake.headPoint.y)){
				sence.flag = 1;
				break;
			}
		}
	}

	// 位置重排
	if(sence.flag == 0) {
		if(snake.body[0].x == food.pos.x && snake.body[0].y == food.pos.y) {
			snake.count ++;
			snake.body[snake.body.length] = new createPoint();
			food.clearTarget(food.pos.x, food.pos.y);
			food.createTarget();
		}

		var tempPoint = new createPoint(snake.body[snake.body.length - 1].x, snake.body[snake.body.length - 1].y);
		for(var i = snake.body.length - 1; i > 0; i --) {
			snake.body[i].x = snake.body[i - 1].x;
			snake.body[i].y = snake.body[i - 1].y;
		}
		snake.body[0].x = snake.headPoint.x;
		snake.body[0].y = snake.headPoint.y;
		food.clearTarget(tempPoint.x, tempPoint.y);
	}

	darwSnake();
	if(sence.flag) { // 如果游戏失败
		if(confirm("Game Over! Do you want to try again?")) {
			initGame();		
		}
		else{
			context.clearRect(0,0,500,500);
			sence.gameStatus = 0;
		}
	}
}
	if(sence.gameStatus) {
		setTimeout("Timer()", 200);
	}
}
