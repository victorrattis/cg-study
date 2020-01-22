
// the instance of WebGl Context
var gl;

var shaderProgram;

var squareVertexPositionBuffer;
var cubeVertexIndices;
var planeBuffer;
var cubeTrianglesIndexBuffer;
var separateFacesBuffer;
var cubeVertexTextureCoordBuffer;

var projectionVertex;

var viewMatrix = mat4.create();
var modelMatrix = mat4.create();
var projectionMatrix = mat4.create();
var transform33 = mat3.create();

var planeVertex;
var planeIndices;

function initGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
}


function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "modelMatrix");
	shaderProgram.viewMatrix = gl.getUniformLocation(shaderProgram, "viewMatrix");
    
	shaderProgram.colorMaterial = gl.getUniformLocation(shaderProgram, "colorMaterial");
    
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
}

function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, projectionMatrix);
	gl.uniformMatrix4fv(shaderProgram.viewMatrix, false, viewMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, modelMatrix);
}

function initBuffers() {
    var size = 100;
    var halfSize = size / 2;

    planeBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, planeBuffer);
	vertices = [
       -halfSize, 0, 0,
        halfSize, 0, 0,
        0, halfSize, 0,
        0,-halfSize, 0,
        0, 0, halfSize,
        0, 0, -halfSize
    ];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	planeBuffer.itemSize = 3;
	planeBuffer.numItems = vertices.length / planeBuffer.itemSize;

	var w = 10;
    var h = 10;
    var d = 10;
    
    var halfWidth  = w / 2;
    var halfHeight = h / 2;
    var halfDepth  = d / 2;
    
    
    var vertices2 = [
        -halfWidth,  halfHeight,  halfDepth,
         halfWidth,  halfHeight,  halfDepth,
         halfWidth, -halfHeight,  halfDepth,
        -halfWidth,  halfHeight,  halfDepth,
         halfWidth, -halfHeight,  halfDepth,
        -halfWidth, -halfHeight,  halfDepth,
         
        -halfWidth,  halfHeight, -halfDepth,
         halfWidth,  halfHeight, -halfDepth,
         halfWidth, -halfHeight, -halfDepth,
        -halfWidth,  halfHeight, -halfDepth,
         halfWidth, -halfHeight, -halfDepth,
        -halfWidth, -halfHeight, -halfDepth,
        
         halfWidth,  halfHeight,  halfDepth,
         halfWidth,  halfHeight, -halfDepth,
         halfWidth, -halfHeight, -halfDepth,
         halfWidth,  halfHeight,  halfDepth,
         halfWidth, -halfHeight, -halfDepth,
         halfWidth, -halfHeight,  halfDepth,
        
        -halfWidth,  halfHeight,  halfDepth,
        -halfWidth,  halfHeight, -halfDepth,
        -halfWidth, -halfHeight, -halfDepth,
        -halfWidth,  halfHeight,  halfDepth,
        -halfWidth, -halfHeight, -halfDepth,
        -halfWidth, -halfHeight,  halfDepth,
        
        -halfWidth,  halfHeight,  halfDepth,
         halfWidth,  halfHeight,  halfDepth,
        -halfWidth,  halfHeight, -halfDepth,
         halfWidth,  halfHeight,  halfDepth,
        -halfWidth,  halfHeight, -halfDepth,
         halfWidth,  halfHeight, -halfDepth,
        
        -halfWidth, -halfHeight,  halfDepth,
         halfWidth, -halfHeight,  halfDepth,
        -halfWidth, -halfHeight, -halfDepth,
         halfWidth, -halfHeight,  halfDepth,
        -halfWidth, -halfHeight, -halfDepth,
         halfWidth, -halfHeight, -halfDepth
    ];
    
    separateFacesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, separateFacesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices2), gl.STATIC_DRAW);
	separateFacesBuffer.itemSize = 3;
	separateFacesBuffer.numItems = vertices2.length / separateFacesBuffer.itemSize;
    
	squareVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	vertices = [
        -halfWidth,  halfHeight,  halfDepth,
         halfWidth,  halfHeight,  halfDepth,
         halfWidth, -halfHeight,  halfDepth,
        -halfWidth, -halfHeight,  halfDepth,
        
        -halfWidth,  halfHeight, -halfDepth,
         halfWidth,  halfHeight, -halfDepth,
         halfWidth, -halfHeight, -halfDepth,
        -halfWidth, -halfHeight, -halfDepth
    ];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	squareVertexPositionBuffer.itemSize = 3;
	squareVertexPositionBuffer.numItems = vertices.length / squareVertexPositionBuffer.itemSize;
    
    cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    var textureCoords = [
      // Front face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,

      // Back face
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      // Top face
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,

      // Bottom face
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,
      1.0, 0.0,

      // Right face
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
      0.0, 0.0,

      // Left face
      0.0, 0.0,
      1.0, 0.0,
      1.0, 1.0,
      0.0, 1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    cubeVertexTextureCoordBuffer.itemSize = 2;
    cubeVertexTextureCoordBuffer.numItems = 24;
    
    cubeVerticesIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
    var cubeVertexIndices = [
        0, 1, 1, 2,   2, 0,   2, 3, 3, 0,
        4, 5, 5, 6,   6, 4,   6, 7, 7, 4,
        1, 5, 5, 6,   6, 1,   6, 2, 2, 1, 
        0, 4, 4, 7,   7, 0,   7, 3, 3, 0,
        0, 1, 1, 4,   4, 0,   4, 5, 5, 1,
        3, 2, 2, 7,   7, 3,   7, 6, 6, 2
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    
    cubeTrianglesIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeTrianglesIndexBuffer);
    var cubeTrianglesIndices = [
        0, 1, 2,  0, 2, 3, 
        4, 5, 6,  4, 6, 7, 
        1, 5, 6,  1, 6, 2, 
        0, 4, 7,  0, 7, 3,
        0, 1, 4,  1, 4, 5,
        3, 2, 7,  2, 7, 6
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeTrianglesIndices), gl.STATIC_DRAW);
    
    var widthPlane = 30;
    var heightPlane = 30;
    
    planeVertex = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, planeVertex);
	var planeVertices = [ ];
    
    var n = 30;
    var v = 0;
    var x = 0;
    for(var i = 0; i < n; i++){
        x = widthPlane - (i * (2*widthPlane/(n-1)));
    
        planeVertices[v++] =  x;
        planeVertices[v++] =  0;
        planeVertices[v++] =  heightPlane;
        
        planeVertices[v++] =  x;
        planeVertices[v++] =  0;
        planeVertices[v++] = -heightPlane;
    }
    
    x = 0;
    for(var i = 0; i < n; i++){
        x = heightPlane - (i * (2*heightPlane/(n-1)));
    
        planeVertices[v++] =  widthPlane;
        planeVertices[v++] =  0;
        planeVertices[v++] =  x;
        
        planeVertices[v++] = -widthPlane;
        planeVertices[v++] =  0;
        planeVertices[v++] = x;
    }
    
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeVertices), gl.STATIC_DRAW);
	planeVertex.itemSize = 3;
	planeVertex.numItems = planeVertices.length / planeVertex.itemSize;
    
    projectionVertex = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, projectionVertex);
	var projectionVertices = [
        0, 0, 25,
       -halfWidth,  halfHeight,  halfDepth,
        
        0, 0, 25,
        halfWidth,  halfHeight,  halfDepth,
         
        0, 0, 25,
         halfWidth, -halfHeight,  halfDepth,
         
        0, 0, 25,
        -halfWidth, -halfHeight,  halfDepth
    ];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(projectionVertices), gl.STATIC_DRAW);
	projectionVertex.itemSize = 3;
	projectionVertex.numItems = projectionVertices.length / projectionVertex.itemSize;
}

var a = 0;
var numberOfLines = 0;
var numberOfPoints = 0;
var isRotate = false;
var numberOfTriangles = 12;

var identityMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

var rx = 25; ry = 30; rz = 0;

function toRad(deg) {
	return deg * Math.PI / 180;
} 

function drawScene() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
	// // Projection Matrix
    // mat4.identity(projectionMatrix);
	// mat4.perspective(45, gl.viewportWidth/gl.viewportHeight, 1.0, 1000.0, projectionMatrix);
 	
	// // View Matrix
	// mat4.identity(viewMatrix);
    // mat4.lookAt([50, 50, -30], [0, 0, 0], [0, 1, 0], viewMatrix);

    // // MODEL TRANSFORMATIONS    // mat4.identity(modelMatrix);
	// mat4.translate(modelMatrix, [0.0, 0.0, -60.0]);
    // // mat4.scale(modelMatrix, [0.75, 0.75, 0.5]); 
	// mat4.rotateX(modelMatrix, toRad(rx));
	// mat4.rotateY(modelMatrix, toRad(ry));
	// mat4.rotateZ(modelMatrix, toRad(rz));
	// mat4.rotate(modelMatrix, toRad(a), [1, 1, 0]);
    // if(isRotate) { a++; }
    
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, projectionMatrix);
	gl.uniformMatrix4fv(shaderProgram.viewMatrix, false, viewMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, identityMatrix);
	
    // DRAW AXES
    gl.uniform4fv(shaderProgram.colorMaterial, [0.0, 1.0, 1.0, 1.0]);
	gl.bindBuffer(gl.ARRAY_BUFFER, planeBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, planeBuffer.itemSize, gl.FLOAT, false, 0, 0);
	// setMatrixUniforms();
	gl.drawArrays(gl.LINES, 0, 2);
    gl.uniform4fv(shaderProgram.colorMaterial, [1.0, 0.0, 0.0, 1.0]);
    gl.drawArrays(gl.LINES, 2, 2);
    gl.uniform4fv(shaderProgram.colorMaterial, [0.0, 1.0, 0.0, 1.0]);
    gl.drawArrays(gl.LINES, 4, 2);
    
	// DRAW POINTS
    gl.uniform4fv(shaderProgram.colorMaterial, [0.0, 0.0, 1.0, 1.0]);
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	// setMatrixUniforms();
	gl.drawArrays(gl.POINTS, 0, numberOfPoints);

    // PLANE LINES
    gl.uniform4fv(shaderProgram.colorMaterial, [0.6, 0.6, 0.6, 1.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, planeVertex);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, planeVertex.itemSize, gl.FLOAT, false, 0, 0);
	// setMatrixUniforms();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, planeVertex);
	gl.drawArrays(gl.LINES, 0, planeVertex.numItems);
	
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, modelMatrix);
	
	
    // CUBE: DRAW FACES LINES
    gl.uniform4fv(shaderProgram.colorMaterial, [1.0, 0.0, 0.0, 1]);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	// setMatrixUniforms();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
    gl.drawElements(gl.LINES, numberOfLines * 2, gl.UNSIGNED_SHORT, 0);
 
	// FRONTAL
    gl.bindBuffer(gl.ARRAY_BUFFER, separateFacesBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, separateFacesBuffer.itemSize, gl.FLOAT, false, 0, 0);
	// setMatrixUniforms();
    gl.uniform4fv(shaderProgram.colorMaterial, [0.6, 0.6, 0.6, 1]);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
}

function webGLStart(canvasElement) {
	initGL(canvasElement);
	initShaders();
	initBuffers();
    initTexture();
	
	// Projection Matrix
    mat4.identity(projectionMatrix);
	mat4.perspective(45, gl.viewportWidth/gl.viewportHeight, 1.0, 1000.0, projectionMatrix);
 	
	// View Matrix
	mat4.identity(viewMatrix);
    mat4.lookAt([50, 50, -30], [0, 0, 0], [0, 1, 0], viewMatrix);

    // Model Matrix
    mat4.identity(modelMatrix);
	
	// gl.clearColor(0.86, 0.86, 0.86, 1.0);
	gl.enable(gl.DEPTH_TEST);
    
    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	
	tick()
}

function tick() {
	requestAnimFrame(tick);
	drawScene();
}

function handleLoadedTexture(texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
}


var neheTexture;

function initTexture() {
    neheTexture = gl.createTexture();
    neheTexture.image = new Image();
    neheTexture.image.onload = function () {
        handleLoadedTexture(neheTexture)
    }

    neheTexture.image.src = "qmark1.png";
}

/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();