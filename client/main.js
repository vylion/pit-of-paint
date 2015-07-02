
//var PlayerMng = require('/src/PlayerMng')
var gridwidth = 10
var playerNum = 2
var manager = new PlayerMng(playerNum, gridwidth)
var i
var j
var turnElapse = 0

var debug = true;
var preventer = function (evt) {
//if (condition) evt.preventDefault();
};

var keyboard = new KeyboardJS(debug, preventer);
var renderer = new PIXI.WebGLRenderer(700, 700);
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();
renderer.backgroundColor = 0xFFFFFF;

stage.updateLayersOrder = function () {
  stage.children.sort(function(a,b) {
		a.z = a.z || 0;
		b.z = b.z || 0;
		return a.z - b.z
  });
};

var gridLines = rectangle(50, 50, 550, 550, 0xFFFFFF, 0x000000, 2);
gridLines.z = 0;
stage.addChild(gridLines);

var splatTexture = PIXI.Texture.fromImage('splat.png');
var playerTexture = PIXI.Texture.fromImage('arrow.png');

for(i = 0; i < manager.player.length; ++i) {
  manager.player[i].sprite = new PIXI.Sprite(playerTexture);
  manager.player[i].sprite.tint = parseInt(manager.player[i].color,16);
	
	manager.player[i].sprite.position.x = 100 + 50*manager.player[i].pos.x;
	manager.player[i].sprite.position.y = 100 + 50*manager.player[i].pos.y;
	manager.player[i].sprite.height = 50;
	manager.player[i].sprite.width = 50;
	
	manager.player[i].sprite.rotation = getAngle(manager.player[i].dir);
	
	manager.player[i].sprite.z = 20 + (manager.player.length - i);
	stage.addChild(manager.player[i].sprite);
	manager.player[i].sprite.anchor.set(0.5,0.5);
	
	
}

for(i = 0; i < manager.tiles.length; ++i) {
  for(j = 0; j < manager.tiles[0].length; ++j) {
		manager.tiles[i][j].sprite = new PIXI.Sprite(splatTexture);
		
		manager.tiles[i][j].sprite.position.x = 100 + 50*i;
		manager.tiles[i][j].sprite.position.y = 100 + 50*j;
		manager.tiles[i][j].sprite.height = 50;
		manager.tiles[i][j].sprite.width = 50;
		manager.tiles[i][j].sprite.anchor.set(0.5,0.5);
		manager.tiles[i][j].sprite.z = 10;
		
		if(manager.tiles[i][j].player_id > 0) {
			manager.tiles[i][j].sprite.tint = parseInt(manager.player[tiles[i][j].player_id -1].color,16);
			stage.addChild(manager.tiles[i][j].sprite);
		}
  }
}

stage.updateLayersOrder();
animate();

function animate() {

requestAnimationFrame(animate);

if(keyboard.char('W'))
	manager.player[0].dir = 'up';
if (keyboard.char('S'))
	manager.player[0].dir = 'down';
if (keyboard.char('A'))
	manager.player[0].dir = 'left';
if (keyboard.char('D'))
	manager.player[0].dir = 'right';
	
if(keyboard.char('I'))
	manager.player[1].dir = 'up';
if (keyboard.char('K'))
	manager.player[1].dir = 'down';
if (keyboard.char('J'))
	manager.player[1].dir = 'left';
if (keyboard.char('L'))
	manager.player[1].dir = 'right';
	
	drawGridnPaint();

renderer.render(stage);
}

function getAngle(dir) {
	//console.log('pointing ' + dir)
	if(dir === 'up') return 0
	else if(dir === 'right') return Math.PI/2
	else if(dir === 'down') return Math.PI
	else if(dir === 'left') return Math.PI*3/2
}

function drawGridnPaint() {
	var movingPlayers = []
	if(turnElapse === 0) movingPlayers = manager.turn()
	
	for(i = 0; i < manager.player.length; ++i) {
		/*manager.player[i].sprite.position.x = 100 + 50*manager.player[i].pos.x;
		manager.player[i].sprite.position.y = 100 + 50*manager.player[i].pos.y;
		manager.player[i].sprite.height = 50;
		manager.player[i].sprite.width = 50;*/
		if(getAngle(manager.player[i].dir) !== undefined) manager.player[i].sprite.rotation = getAngle(manager.player[i].dir);
		
		if(turnElapse === 0) {
			manager.player[i].sprite.position.x = (100 + 50*manager.player[i].pos.x)
			manager.player[i].sprite.position.y = (100 + 50*manager.player[i].pos.y)
		}
	}
	
	var pos_it = {x: 0, y: 0}
	
	for(i = 0; i < movingPlayers.length; ++i) {
		pos_it.x = manager.player[movingPlayers[i]].pos.x
		pos_it.y = manager.player[movingPlayers[i]].pos.y
		
		if(manager.tiles[pos_it.x][pos_it.y].paint_id === 0) {
			stage.addChild(manager.tiles[pos_it.x][pos_it.y].sprite);
			stage.updateLayersOrder();
		}
		
		manager.tiles[pos_it.x][pos_it.y].paint_id = manager.tiles[pos_it.x][pos_it.y].player_id = movingPlayers[i] + 1;
		manager.tiles[pos_it.x][pos_it.y].sprite.tint = parseInt(manager.player[tiles[pos_it.x][pos_it.y].player_id - 1].color,16);
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
