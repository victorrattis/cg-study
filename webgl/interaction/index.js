
// WebGL Context
var gl;

// Shader Program
var program;

var model;

var tiles;

var canvasWidth;
var canvasHeight;

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
}

var onload = function () {
	var canvas = document.getElementById("canvasGL");
	
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	
	canvas.addEventListener('mousedown', function(evt) {
		var mousePos = getMousePos(canvas, evt);
		console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
		
		for(var i = 0; i < tiles.length; i++){
			tiles[i].interaction(mousePos.x, mousePos.y);
		}
	}, false);
	
	// initialize the WebGL context
	initializeWebGlContext(canvas);
	
	// initialize the shader problem
	initializeShaderProgram(shaderSource);
	
	tiles = [];
	tiles.push(new Tile([100, 200], 100, 100));
	tiles.push(new Tile([200, 200], 100, 100));
	tiles.push(new Tile([200, 300], 100, 100));
	tiles.push(new Tile([100, 300], 100, 100));
	
	for(var i = 0; i < tiles.length; i++){
		tiles[i].create();
		tiles[i].load();
	}
	
	initializeBuffers();
	
	gl.clearColor(0.86, 0.86, 0.86, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.viewport(0, 0, canvasWidth, canvasHeight);
	
	
	tick();
};

var initializeWebGlContext = function (canvasElement) {
	gl = loadWebGLContext(canvasElement);
	
	// If we don't have a GL context, give up now
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
	}
}

var initializeShaderProgram = function (shaderSource) {
	var vertexShader = loadShader(shaderSource.vertex, gl.VERTEX_SHADER);
	var fragmentShader = loadShader(shaderSource.fragment, gl.FRAGMENT_SHADER);
	
	program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	gl.useProgram(program);
	
	shaderSource.load(program);
}

var tick = function () {
	requestAnimFrame(tick);
	
	update();
	drawScene();
};

var update = function () {

};

var drawScene = function () {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	gl.uniform2f(program.resolution, canvasWidth, canvasHeight);
	
	for(var i = 0; i < tiles.length; i++){
		tiles[i].draw(program);
	}
};

var initializeBuffers = function () {
	var vertices = [
		10, 20,
		80, 20,
		10, 30,
		10, 30,
		80, 20,
		80, 30
	];
	var indices = [
		0, 1, 2, 3, 4, 5
	];

	model = new Model();
	
	model.geometry = new Geometry();
	model.geometry.vertices = vertices;
	model.geometry.indices = indices;
	
	model.material = new Material();
	model.material.color = [1, 0, 0, 1];
	
	model.load();
}

var loadWebGLContext = function(canvas) {
  var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
  var context = null;
  
  for (var i = 0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {}
	
    if (context) {
      break;
    }
  }
  
  return context;
}

var loadShader = function(sourceShader, typeShader) {
	var shader = gl.createShader(typeShader);

	gl.shaderSource(shader, sourceShader);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}


