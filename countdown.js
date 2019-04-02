var WINDOW_WIDTH=100%;
var WINDOW_HEIGHT=100%;
var RADIUS=8;//半径
var MARGIN_TOP=60;//距离画布上边的距离
var MARGIN_LEFT=30;//距离画布左边的距离

var endTime=new Date();//计算机里的7月为6，采用0到11
endTime.setTime(endTime.getTime()+(6*3600+14*60+10)*1000)
//此处表示距离当前时间的1个小时开始倒计时

var curShowTimeSeconds=0;//毫秒 计算

var balls=[];//小球的数组
//小球颜色数组
const colors=["#D8BFD8","#FFC0CB","#DB7093","#FFE4E1","#FFB6C1","#E6E6FA","#FFEBCD","00BFFF","FFF0F5","FFFACD"];

window.onload=function(){
	
	var canvas=document.getElementById('canvas');
	var context=canvas.getContext("2d");
	
	canvas.width=WINDOW_WIDTH;
	canvas.height=WINDOW_HEIGHT;
	
	curShowTimeSeconds=getCurrentShowTimeSeconds();
	  
	setInterval(
		function(){//动画函数
		render(context);
		update();//对数据进行调整
	}
	,
	50
	);	
}

function getCurrentShowTimeSeconds(){
	var curTime=new Date();//获取当前的时间
	var ret=endTime.getTime()-curTime.getTime();//截止时间减去当前时间的差值
	ret=Math.round(ret/1000);//毫秒转换为秒
	
	return ret >= 0 ? ret: 0 ;//判断是否大于0
}

function update(){
	var nextShowTimeSeconds=getCurrentShowTimeSeconds();//下一次小时的时间
	
	var nextHours=parseInt(nextShowTimeSeconds/3600);
	var nextMinutes=parseInt((nextShowTimeSeconds-nextHours*3600)/60);
	var nextSeconds=nextShowTimeSeconds%60;
	
	var curHours=parseInt(curShowTimeSeconds/3600);
	var curMinutes=parseInt((curShowTimeSeconds-curHours*3600)/60);
	var curSeconds=curShowTimeSeconds%60;
	
	//只需要判断秒位即可比较
	if(nextSeconds!=curSeconds){
		//对小时的十位部分进行判断
		if(parseInt(curHours/10)!=parseInt(nextHours/10)){
			addBalls(MARGIN_LEFT+0,MARGIN_TOP,parseInt(curHours/10));
		}
		//对小时的个位进行判断
		if(parseInt(curHours%10)!=parseInt(nextHours%10)){
			addBalls(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curHours/10));
		}
		//对分的十位进行判断
		if(parseInt(curMinutes/10)!=parseInt(nextMinutes/10)){
			addBalls(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes/10));
		}
		//对分的个位进行判断
		if(parseInt(curMinutes%10)!=parseInt(nextMinutes%10)){
			addBalls(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes/10));
		}
		//对秒的十位进行判断
		if(parseInt(curSeconds/10)!=parseInt(nextSeconds/10)){
			addBalls(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes/10));
		}
		//对秒的个位进行判断
		if(parseInt(curMinutes%10)!=parseInt(nextSeconds%10)){
			addBalls(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds/10));
		}
		
		curShowTimeSeconds=nextShowTimeSeconds;
	}
	
	
	updateBalls();//对所有已经存在的小球的状态进行更新
	
	//console.log(balls.length);//打印小球数组的数量
}

function updateBalls(){
	for(var i=0;i<balls.length;i++){
		balls[i].x+=balls[i].vx;//速度引起的x位置变化
		balls[i].y+=balls[i].vy;//速度引起的y位置变化
		balls[i].vy+=balls[i].g;//加速度引起的速度变化
		
		//碰撞检测
		if(balls[i].y>=WINDOW_HEIGHT-RADIUS){
			balls[i].y=WINDOW_HEIGHT-RADIUS;
			balls[i].vy=-balls[i].vy*0.75;//摩擦因子导致的速度变化，反弹
		}
	}
	
	//删除多余小球
	var cnt=0;//记录有多少小球保留在画布中
	for(var i=0;i<balls.length;i++)
		if(balls[i].x+RADIUS>0 && balls[i].x-RADIUS<WINDOW_WIDTH)
		balls[cnt++]=balls[i];
	
	while(balls.length > cnt){
		balls.pop();
	}
}
//传入参数为数字的相对原点位置x,y和数
function addBalls(x,y,num){
	for(var i=0;i<digit[num].length;i++){
		for(var j=0;j<digit[num][i].length;j++){
			if(digit[num][i][j]==1){
				var aBall={
					//这里的x,y为相对这个数来说的具体的小球位置
					x:x+j*2*(RADIUS+1)+(RADIUS+1),
					y:y+i*2*(RADIUS+1)+(RADIUS+1),
					g:1.5+Math.random(),//加速度，使用一个随机数
					vx:Math.pow(-1,Math.ceil(Math.random()+1000))*4,//x方向的速度
					vy:-5,//y方向的速度
					color:colors[Math.floor(Math.random()*colors.length)]//小球的颜色随机
				}
				
				balls.push(aBall);//将建立好的小球存储在小球数组中
			}
		}
	}
}

function render(cxt){
	cxt.clearRect(0,0,canvas.width,canvas.height);//对矩形空间的图像进行一次刷新操作
	
	var hours=parseInt(curShowTimeSeconds/3600);
	var minutes=parseInt((curShowTimeSeconds-hours*3600)/60);
	var seconds=curShowTimeSeconds%60;
	
	renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),cxt);//小时的十位，数字的宽度为15
	renderDigit(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),cxt);//小时的个位
	renderDigit(MARGIN_LEFT+30*(RADIUS+1),MARGIN_TOP,10,cxt);//冒号，冒号宽度为9
	renderDigit(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),cxt);//分钟的十位
	renderDigit(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(minutes%10),cxt);//分钟的个位
	renderDigit(MARGIN_LEFT+69*(RADIUS+1),MARGIN_TOP,10,cxt);//冒号
	renderDigit(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(seconds/10),cxt);//秒钟的十位
	renderDigit(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(seconds%10),cxt);//秒钟的个位
	
	//通过遍历小球来绘制小球
	for(var i=0;i<balls.length;i++){
		cxt.fillStyle=balls[i].color;
		
		cxt.beginPath();
		cxt.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI,true);
		cxt.closePath();
		
		cxt.fill();
	}
	
}

function renderDigit(x,y,num,cxt){
	cxt.fillStyle="#9393FF";//"rgb(0,102,153)";
	
	for(var i=0;i<digit[num].length;i++)
		for(var j=0;j<digit[num][i].length;j++)
			if(digit[num][i][j]==1){
				cxt.beginPath();
				cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1) , y+i*2*(RADIUS+1)+(RADIUS+1) , RADIUS , 0 ,2*Math.PI)
				cxt.closePath()
				
				cxt.fill()
			}
	
}
