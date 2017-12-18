// var MyExample = Quintus();
// MyExample.load('assetName.png', function(){
// 	var object = new MyExample.CanvasSprite({
// 		asset: 'assetName.png', x: 0, y: 0
// 	});
//
// 	object.update = function(dt){
// 		// Code to update the object
// 	}
// 	MyExample.gameLoop(function(dt){
// 		this.clear();
//
// 		object.update(dt);
// 		object.render(this.ctx);
// 	});
// });

var MyGame = Quintus().include("Input, Sprites, Scenes").setup();

var spriteType1 = MyGame.CanvasSprite.extend({
	// Overrides for this type of object
})

var spriteType2 = MyGame.CanvasSprite.extend({
	// Overrides for this type of object
})

MyGame.load(['asset1.png', 'asset2.png', 'sprites.json'], function(){
	var scene1 = new MyGame.Scene(function(stage){
		stage.add(new MyGame.spriteType1({...Options..}));
		stage.add(new MyGame.spriteType2({...Options..}));
	})

	MyGame.stageScene(scene1);
})
