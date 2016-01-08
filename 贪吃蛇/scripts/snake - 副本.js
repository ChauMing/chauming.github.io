function Snake() {
	this.size = 20;    // //每格大小
	this.count = 0;     //吃掉的目标数
	this.time = 0;     //用时
	this.direction = "left";    //当前方向 
	this.preDirection = this.direction;  // 前一个方向，用于判断是否反向
	this.body = null;     // 蛇的身体是数组， 有XY属性，用于存放每个方块的坐标
	this.fd_target = createPoint(100, 100);  // 食物目标XY坐标位置
	this.gameStatus = 0;  // 游戏状态stop:0; start: 1;
}


Snake.prototype = {
	reDisplay : function (x , y) {    // 清除方块
		context.clearRect(x, y, 20, 20);
	},
	target : function() {
		var X, Y;
		while(1){

			X = Math.round(Math.random()*480/20)*20;
			Y = Math.round(Math.random()*480/20)*20;    // 食物随机坐标

			var tag = 0;    //  0:与蛇身不重合 1:与蛇身重合

			for(var i = 0; i < this.count + 2; i++){
				if(this.body[i].x == X || this.body[i].y == Y){    // 当目标坐标与蛇的身体重合时 tag = 1
					tag = 1;
					break;
				}
					
			}
			if(tag == 0) {
				break;
			}
		}
		this.fd_target.x = X;
		this.fd_target.y = Y;
	},
	initGame : function() {
		this.body = null;
		this.size = 20;
		this.count = 0;
		this.direction = "right";
		this.gameStatus = 0;
		this.fd_target = new createPoint(100, 100);
		this.body = new Array();
		this.body[0] = new createPoint(240, 240);
		this.body[1] = new createPoint(240, 220);
		this.body[2] = new createPoint(240, 200);
		this.target();
	}
};


//响应按键消息，改变蛇的方向
function keyPressed(event) {
	debugger;
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
	}
}
//point类
function createPoint(x, y){
	this.x = x;
	this.y = y;
}





if(confirm("是否进入游戏") == 1){
	var snake = new Snake();
	var context = document.getElementById("snake_context").getContext("2d");
	snake.initGame();
	snake.gameStatus = 1;
	Timer();
}
else{
	alert("不玩拉倒，我求你啊，哼~~~");
}



function Timer() {
	var tag = 0;    // 看看这家伙是不是撞到墙了1 ：撞了0：没撞
	var headPoint = new createPoint(snake.body[0].x, snake.body[0].y)

	switch(snake.direction){
		case "left":
			headPoint.x -= 20;
			snake.preDirection = snake.direction;
			if (headPoint.x < 0) tag = 1;
			break;
		case "right":
			headPoint.x += 20;
			snake.preDirection = snake.direction;
			if (headPoint.x > 480) tag = 1;
			break;
		case "up":
			headPoint.y -= 20;
			snake.preDirection = snake.direction;
			if (headPoint.y < 0) tag = 1;
			break;
		case "down":
			headPoint.y += 20;
			snake.preDirection = snake.direction;
			if (headPoint.y > 480) tag = 1;
			break;	
	}

	// 判断蛇是否撞到了自己
	if(tag == 0) {
		var i = 0;
		for(i in snake.body){
			if((snake.body[i].x == headPoint.x) && (snake.body[i].y == headPoint.y)){
				tag = 1;
				break;
			}
		}
	}

	// 位置重排
	if(tag == 0) {
		if(snake.body[0].x == snake.fd_target.x && snake.body[0].y == snake.fd_target.y) {
			snake.count ++;
			snake.body[snake.count + 2] = new createPoint();
			snake.reDisplay(snake.fd_target.x, snake.fd_target.y);
			snake.target();
		}

		var tempPoint = new createPoint(snake.body[snake.count + 2].x, snake.body[snake.count + 2].y)
		for(var i = snake.count + 2; i > 0; i --) {
			snake.body[i].x = snake.body[i - 1].x;
			snake.body[i].y = snake.body[i - 1].y;
		}
		snake.body[0].x = headPoint.x;
		snake.body[0].y = headPoint.y;
		snake.reDisplay(tempPoint.x, tempPoint.y);
	}

	// 界面的打印
	context.beginPath();
	// 目标
	context.fillStyle = "red";
	context.fillRect(snake.fd_target.x, snake.fd_target.y, snake.size, snake.size);
	// 蛇
	context.fillStyle = "blue";
	var i = 0;
	for(i in snake.body) {
		context.fillRect(snake.body[i].x, snake.body[i].y, snake.size, snake.size);
	}

	if(tag == 1) { // 如果游戏失败
		
		if(confirm("Game Over! Do you want to try again?")) {
			context.clearRect(0,0,500,500);
			snake.initGame();
			snake.gameStatus = 1;
		}
		else{
			context.clearRect(0,0,500,500);
			snake.gameStatus = 0;
		}
	}
	if(snake.gameStatus) {
		setTimeout("Timer()", 200);
	}
}
