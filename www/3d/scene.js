// (function()
// {

var three_container;

var camera, scene, renderer, ball, shadow;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var ball;
var BALL_SCALE = 0.45;

speed = 10;
// rotation = 0.275;
rotationY = 0;//0.245;
rotationZ = 0;//0.220;
var speedX = 15,
	speedY = 0;

var t = 0,
	TSEC = 60,
	g = 9.8/TSEC,
	BALL_TIGHT = 0.7,
	bounced = 0;



document.addEventListener("DOMContentLoaded", function(event) 
{ 
	init();
	animate();
});


function init() {

	// three_container = document.createElement( 'div' );
	// document.body.appendChild( three_container );

	three_container = document.getElementById('three_scene');

	// camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	camera = new THREE.PerspectiveCamera( 45, three_container.offsetWidth / three_container.offsetHeight, 1, 1000 );
	camera.aspect = three_container.offsetWidth / three_container.offsetHeight;
	// camera.position.z = 250;
	console.log("Aspect:" + three_container.offsetWidth + ' ' + three_container.offsetHeight);

	// camera.position.x += ( 500/*mouseX*/ - camera.position.x ) * .05;
	// camera.position.y += ( - 500/*mouseY*/ - camera.position.y ) * .05;


	// scene

	scene = new THREE.Scene();

	var ambient = new THREE.AmbientLight( 0x404080 );
	scene.add( ambient );

	window.directionalLight1 = new THREE.DirectionalLight( 0xffeedd, 0.4 );
	directionalLight1.position.set( 250, 150, 0 );
	scene.add( directionalLight1 );

	window.directionalLight2 = new THREE.DirectionalLight( 0xffeedd, 0.4 );
	directionalLight2.position.set( 0, 150, 250 );
	scene.add( directionalLight2 );

	window.directionalLight3 = new THREE.DirectionalLight( 0xffeedd, 0.7 );
	directionalLight3.position.set( 50, 150, 50 );
	scene.add( directionalLight3 );

	// texture

	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {

		console.log( item, loaded, total );

	};

	// var texture = new THREE.Texture();

	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};

	var onError = function ( xhr ) {
	};

	var textureLoader = new THREE.TextureLoader();
	var texture = new THREE.MeshPhongMaterial( {
					color: 0xdddddd,
					specular: 0x222222,
					shininess: 35,
					map: textureLoader.load( "3d/diffuse6.jpg" ),
					// bump: textureLoader.load( "3d/height.jpg" ),
					normalMap: textureLoader.load( "3d/normal4.jpg" ),
                    morphTargets: true
				} );


	var loader = new THREE.ImageLoader( manager );
	loader.load( '3d/test.jpg', function ( image ) {

		texture.image = image;
		texture.needsUpdate = true;

	} );

	// model

	var loader = new THREE.OBJLoader( manager );
	loader.load( '3d/test.obj', function ( object ) {

		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				child.material/*.map*/ = texture;

			}

		} );



		ball = object;
		ball.position.y = 0;//400;
		ball.position.x = 0;//-1020;


		ball.children[0].rotation.x = 2;
		ball.children[0].rotation.y = 1.2;
		ball.children[0].rotation.z = -1.4;

		// ball.children[0].rotation.x = 0; //1.6;//-2.454;
		// ball.children[0].rotation.y = 0; //-0.028;
		// ball.children[0].rotation.z = 0; //-1;//0.479;

		// _x=-2.4543773179007813,  _y=-0.028149690151495505,  _z=0.4793663340231782,  ещё...}


		// var BALL_SCALE = 0.45;
		ball.scale.set(BALL_SCALE, BALL_SCALE, BALL_SCALE);

		// ball.geometry.translate( -500, 0, 0 );

		ball.rotateY(-0.4);
		ball.rotateX(-0.4);
      	ball.rotateZ(-0.2);

		if (window.innerWidth < 700 && typeof ball != "undefined")
		{
			var mobScale = BALL_SCALE * window.innerWidth/700;
			ball.scale.set(mobScale,mobScale,mobScale);
		}

		if (window.innerWidth < 450 && typeof ball != "undefined")
		{
			var mobScale = BALL_SCALE * window.innerWidth/450;
			ball.scale.set(mobScale,mobScale,mobScale);
		}

		// console.log( "BALL", ball );

		scene.add( ball );

		setBallClick();

		addShadow();

		// addGround();

		addAxis();

		setCameraAngle();

		onWindowResize();



	}, onProgress, onError );

	//

	// renderer = new THREE.CanvasRenderer({ alpha: true, antialias: true });
	renderer = Detector.webgl? new THREE.WebGLRenderer({ alpha: true }): new THREE.CanvasRenderer({ alpha: true });
	// renderer.setClearColor( 0x000000, 0 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	three_container.appendChild( renderer.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );

	

}




function setBallClick()
{
	var ballArea = document.getElementById('ball_click_area'),
		onClick = function()
		{
			rotationY = 0.135;
			rotationZ = 0.215;
			// ball.rotation.y = 
		};

	if (ballArea)
	{
		ballArea.addEventListener("click", onClick);
		ballArea.addEventListener("touchend", onClick);
	}
}





function addShadow()
{
	var geometry = new THREE.PlaneGeometry( 100, 100 );
	var textureLoader = new THREE.TextureLoader();
	window.shadow_material = new THREE.MeshBasicMaterial({
		color: 0xff0000, 
		map: textureLoader.load( "3d/shadow.png" ),
		// alphaMap: textureLoader.load( "shadow.png" ),
		side: THREE.DoubleSide, 
		transparent: true} 
	 );
	var manager = new THREE.LoadingManager();
	var loader = new THREE.ImageLoader( manager );
	loader.load( '3d/shadow.png', function ( image )
	{
		shadow_material.image = image;
		shadow_material.needsUpdate = true;
	});

	shadow = new THREE.Mesh( geometry, shadow_material );
	// shadow.rotateY(Math.PI / 4);
	shadow.rotateX(Math.PI / 2);
	shadow.position.x = -1020;
	shadow.position.y = -35;
	shadow.position.z = 0;

	scene.add( shadow );
}




function setCameraAngle() {
	camera.position.x = 250;
	camera.position.y = 100;
	camera.position.z = 250;

	// camera.lookAt( scene.position );
	// camera.lookAt(center.position);
	var x = 56;

	if (window.innerWidth <= 450)
	{
		x = 38;
	}
	camera.lookAt({x:x, y:0, z:0});

	// camera.rotateZ(-Math.PI/2)
}



function addAxis() 
{
	var centerBox = new THREE.BoxGeometry(  20, 20, 20 ),
		materialCenter = new THREE.MeshPhongMaterial( {
			opacity: 0,
			color: 0xff1111,
			emissive: 0xff1111,
			side: THREE.DoubleSide,
			shading: THREE.FlatShading
		} );

		window.center = new THREE.Mesh( centerBox, materialCenter );

	center.position.y = 0;
	center.position.x = 50;

	var axisX = new THREE.BoxGeometry(  1000, 10, 10 );
	var axisY = new THREE.BoxGeometry(  10, 1000, 10 );
	var axisZ = new THREE.BoxGeometry(  10, 10, 1000 );
	// var material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
	// material = new THREE.MeshPhongMaterial( {color: 0xff0000, emissive: 0xff0000, side: THREE.DoubleSide, shading: THREE.FlatShading, opacity: 0.5 } );
	var meshX = new THREE.Mesh( axisX, new THREE.MeshBasicMaterial( {color: 0xff0000, opacity: 0.5 } )  );
	var meshY = new THREE.Mesh( axisY, new THREE.MeshBasicMaterial( {color: 0x00ff00, opacity: 0.5 } )  );
	var meshZ = new THREE.Mesh( axisZ, new THREE.MeshBasicMaterial( {color: 0x0000ff, opacity: 0.5 } )  );
	
	// scene.add( meshX );
	// scene.add( meshY );
	// scene.add( meshZ );
	// scene.add( center );
}




function addGround()
{

var groundGeometry = new THREE.BoxGeometry( 1000, 1000, 10 );
// var material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
material = new THREE.MeshPhongMaterial( {
		color: 0x11ff11,
		emissive: 0x074534,
		side: THREE.DoubleSide,
		shading: THREE.FlatShading,
		opacity: 0.5
	} );
window.ground = new THREE.Mesh( groundGeometry, material );
// ground.position.y = -200;
scene.add( ground );





/*	var length = 1000, width = 100;

var shape = new THREE.Shape();
shape.moveTo( 0,0 );
shape.lineTo( 0, width );
shape.lineTo( length, width );
shape.lineTo( length, 0 );
shape.lineTo( 0, 0 );

var geometry = new THREE.ShapeGeometry( shape );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var mesh = new THREE.Mesh( geometry, material ) ;
scene.add( mesh );*/
}


function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = three_container.offsetWidth / three_container.offsetHeight;
	// camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	// renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setSize( three_container.offsetWidth , three_container.offsetHeight );

	console.log("Aspect:" + three_container.offsetWidth + ' ' + three_container.offsetHeight);

	var mobScale = BALL_SCALE;

	if (window.innerWidth < 700 && window.innerWidth >=450)
	{
		mobScale = BALL_SCALE * window.innerWidth/700;
	}

	if (window.innerWidth <= 450)
	{
		mobScale = BALL_SCALE * window.innerWidth/450;
	}

	if (typeof ball != "undefined") ball.scale.set(mobScale,mobScale,mobScale);

	setCameraAngle();

}

function onDocumentMouseMove( event ) {

	mouseX = ( event.clientX - windowHalfX ) / 2;
	mouseY = ( event.clientY - windowHalfY ) / 2;

	// console.log(mouseX, mouseY);

}

//

function animate() {

	requestAnimationFrame( animate );
	render();

}




function render() {

	

	if (typeof ball != "undefined" && rotationZ > 0 /*&& ball.position.x < 0*/)
	{
		// if (t > 30) return;
		t += 0.1;

		if (ball.position.x < 0)
		{
			speedX = speedX - 0.11;
			if (speedX < 0) speedX = 0;
			ball.position.x += speedX;
			shadow.position.x += speedX;
		}
		// else
		// {
		// 	speedX = 0;
		// 	ball.position.x = 0;
		// }


		// rotation = rotation - 0.002;
		rotationY = rotationY - 0.0012;
		if (rotationY < 0) rotationY = 0;

		rotationZ = rotationZ - 0.001;
		if (rotationZ < 0) rotationZ = 0;

		speedY -= g*t;
		
		if (ball.position.y < 0)
		{
			bounced++;
			speedY = -BALL_TIGHT *BALL_TIGHT* speedY;
			console.info(speedY);
		}

		

		if (bounced > 2) 
		{ 
			speedY = 0; 
			ball.position.y = 0;
		}
		else 
		{ 
			ball.position.y += speedY; 
		}


		// if (ball.position.y < 0) { ball.position.y = 0; }

		
		shadow.material.opacity = 1 - ball.position.y/100;


		

		// if (speedX < 5) ball.rotation.y -= rotationY;
		// else ball.rotation.z -= rotationZ;


		ball.rotation.y -= rotationY;


		// console.log(ball.position.x);
	}

	

	renderer.render( scene, camera );

}

// window.ball = ball;

// })();