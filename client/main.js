var serverURL = 'localhost:9000'
var socket = require('socket.io-client')(serverURL)

var stop = false
var gridwidth = 10
var playerNum = 2
var manager = new PlayerMng(playerNum, gridwidth)
var turnElapse = 0

var debug = true;
var preventer = function (evt) {
//if (condition) evt.preventDefault();
};

var keyboard = new KeyboardJS(debug, preventer);
var renderer = new PIXI.WebGLRenderer(gridwidth * 50 + 100, gridwidth * 50 + 100);
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();
var tileLayer = new PIXI.Container();
//tileLayer.z = 10;
var playerLayer = new PIXI.Container();
//playerLayer.z = 20;
renderer.backgroundColor = 0xFFFFFF;

/*
	stage.updateLayersOrder = function () {
  stage.children.sort(function(a,b) {
		a.z = a.z || 0;
		b.z = b.z || 0;
		return a.z - b.z
  });
};
*/

var gridmargin = rectangle(50, 50, 50 + 50 * gridwidth, 50 + 50 * gridwidth, 0xFFFFFF, 0x000000, 2);
//gridmargin.z = 0;
stage.addChild(gridmargin);


var splatTexture = PIXI.Texture.fromImage('splat.png');
var playerTexture = PIXI.Texture.fromImage('arrow.png');

for(var i = 0; i < manager.player.length; ++i) {
  manager.player[i].sprite = new PIXI.Sprite(playerTexture);
  manager.player[i].sprite.tint = parseInt(manager.player[i].color,16);
	
	manager.player[i].sprite.position.x = 100 + 50*manager.player[i].pos.x;
	manager.player[i].sprite.position.y = 100 + 50*manager.player[i].pos.y;
	manager.player[i].sprite.height = 50;
	manager.player[i].sprite.width = 50;
	
	manager.player[i].sprite.rotation = getAngle(manager.player[i].dir);
	
	playerLayer.addChild(manager.player[i].sprite);
	manager.player[i].sprite.anchor.set(0.5,0.5);
	
	
}

for(var i = 0; i < manager.tiles.length; ++i) {
  for(var j = 0; j < manager.tiles[0].length; ++j) {
		manager.tiles[i][j].sprite = new PIXI.Sprite(splatTexture);
		
		manager.tiles[i][j].sprite.position.x = 100 + 50*i;
		manager.tiles[i][j].sprite.position.y = 100 + 50*j;
		manager.tiles[i][j].sprite.height = 50;
		manager.tiles[i][j].sprite.width = 50;
		manager.tiles[i][j].sprite.anchor.set(0.5,0.5);
		manager.tiles[i][j].sprite.z = 10;
		
		if(manager.tiles[i][j].player_id > 0) {
			manager.tiles[i][j].sprite.tint = parseInt(manager.player[tiles[i][j].player_id -1].color,16);
			tileLayer.addChild(manager.tiles[i][j].sprite);
		}
  }
}

stage.addChild(tileLayer);
stage.addChild(playerLayer);
//stage.updateLayersOrder();

var nextDir = [];

animate();

function animate() {

	requestAnimationFrame(animate);

	if(keyboard.char('W'))
		nextDir[0] = 'up';
	if (keyboard.char('S'))
		nextDir[0] = 'down';
	if (keyboard.char('A'))
		nextDir[0] = 'left';
	if (keyboard.char('D'))
		nextDir[0] = 'right';
	
	if(keyboard.char('I'))
		nextDir[1] = 'up';
	if (keyboard.char('K'))
		nextDir[1] = 'down';
	if (keyboard.char('J'))
		nextDir[1] = 'left';
	if (keyboard.char('L'))
		nextDir[1] = 'right';
	
	if (keyboard.char('P'))
		stop = !stop;
	
		drawGridnPaint();

	renderer.render(stage);
}

function getAngle(dir, angle) {
	//console.log('pointing ' + dir)
	if(dir === 'up') return 0
	else if(dir === 'right') return Math.PI/2
	else if(dir === 'down') return Math.PI
	else if(dir === 'left') return Math.PI*3/2
	else return angle
}

function drawGridnPaint() {
	var movingPlayers = []
	if(turnElapse === 0) {
		for(var i = 0; i < manager.player.length; ++i) {
			if(nextDir[i]) {
				manager.player[i].dir = nextDir[i]
				nextDir[i] = undefined
			}
		}
		movingPlayers = manager.turn()
	}

	for(var i = 0; i < manager.player.length; ++i) {
		manager.player[i].sprite.rotation = getAngle(nextDir[i], manager.player[i].sprite.rotation)
	
		if(turnElapse === 0) {
			manager.player[i].sprite.position.x = (100 + 50*manager.player[i].pos.x)
			manager.player[i].sprite.position.y = (100 + 50*manager.player[i].pos.y)
		}
	}

	var pos_it = {x: 0, y: 0}

	for(var i = 0; i < movingPlayers.length; ++i) {
		pos_it.x = manager.player[movingPlayers[i]].pos.x
		pos_it.y = manager.player[movingPlayers[i]].pos.y
	
		if(manager.tiles[pos_it.x][pos_it.y].paint_id === 0) {
			tileLayer.addChild(manager.tiles[pos_it.x][pos_it.y].sprite);
		}
		manager.tiles[pos_it.x][pos_it.y].paint_id = movingPlayers[i] + 1
		manager.tiles[pos_it.x][pos_it.y].sprite.tint = parseInt(manager.player[movingPlayers[i]].color,16);
	}

	turnElapse += 1;
	if(turnElapse === 50) turnElapse = 0;
}

function rectangle( x, y, width, height, backgroundColor, borderColor, borderWidth ) { 
	var box = new PIXI.Graphics();
	box.beginFill(backgroundColor);
	box.lineStyle(borderWidth , borderColor);
	box.drawRect(0, 0, width - borderWidth, height - borderWidth);
  box.endFill();
	box.position.x = x + borderWidth/2;
	box.position.y = y + borderWidth/2;
	return box;
};
