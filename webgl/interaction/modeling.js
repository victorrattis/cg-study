
var Geometry = function () {
	this.vertices;
	this.indices;
	
	this.buffer;
	
	this.load = function () {
		this.buffer = {};
		
		this.buffer.vertex = Buffer.loadArrayBuffer(new Float32Array(this.vertices), 2);
		this.buffer.index = Buffer.loadElementArrayBuffer(new Uint16Array(this.indices), 1);
	};
	
	this.draw = function (program) {
		// gl.uniformMatrix4fv(program.pMatrixUniform, false, pMatrix);
        // gl.uniformMatrix4fv(program.mvMatrixUniform, false, mvMatrix);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.vertex);
        gl.vertexAttribPointer(program.vertex, 2, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.index);
        gl.drawElements(gl.TRIANGLES, this.buffer.index.length, gl.UNSIGNED_SHORT, 0);
	}
};

var Material = function () {
	this.color = [0, 0, 0, 1];
	
	this.load = function () {
	};
	
	this.draw = function (program) {
		gl.uniform3fv(program.materialColor, new Float32Array(this.color));
	};
};

var Model = function () {
	this.geometry;
	this.materia;
	
	this.load = function () {
		this.geometry.load();
		this.material.load();
	};
	
	this.draw = function (program) {
		gl.uniform2f(program.resolution, 500, 500);
	
		// this.material.draw(program);
		this.geometry.draw(program);
	};
};


var Tile = function (center, width, height) {
		
	this.color = [0, 1, 0];
		
	this.vertices;
	this.incides;
	
	this.buffer;
	
	this.primitive = gl.LINES;
	
	this.setPrimitive = function (primitive) {
		this.primitive = primitive;
	};
	
	this.interaction = function (coordinateX, coordinateY) {
		var halfWidth = width / 2;
		var halfHeight = height / 2;
		
		var x = center[0];
		var y = center[1];
		
		var pointInitial = [
			x - halfWidth, y - halfWidth
		];
		
		var pointEnd = [
			x + halfWidth, y + halfWidth
		];
		
		if(pointInitial[0] <= coordinateX && coordinateX <= pointEnd[0]){
			if(pointInitial[1] <= coordinateY && coordinateY <= pointEnd[1]){
				this.color = [1, 0, 0];
				this.setPrimitive(gl.TRIANGLES);
				return;
			}
		}
		
		this.color = [0, 1, 0];
		this.setPrimitive(gl.LINES);
	};
	
	this.create = function () {
		var halfWidth = width / 2;
		var halfHeight = height / 2;
		
		var x = center[0];
		var y = center[1];
		
		this.vertices = [
			x - halfWidth, y - halfHeight,
			x + halfWidth, y - halfHeight,
			x - halfWidth, y + halfHeight,
			x + halfWidth, y + halfHeight
		];
		
		this.indices = [
			0, 1,
			1, 3,
			2, 3, 
			0, 2
		];
		
		this.triangles = [
			0, 1, 2,
			1, 2, 3
		];
	};
	
	this.load = function () {
		this.buffer = {};
		
		this.buffer.vertex = Buffer.loadArrayBuffer(new Float32Array(this.vertices), 2);
		this.buffer.index = Buffer.loadElementArrayBuffer(new Uint16Array(this.indices), 1);
		this.buffer.triangle = Buffer.loadElementArrayBuffer(new Uint16Array(this.triangles), 1);
	};

	this.draw = function (program) {
		gl.uniform3fv(program.materialColor, this.color);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.vertex);
		gl.vertexAttribPointer(program.vertex, this.buffer.vertex.size, gl.FLOAT, false, 0, 0);
		
		if(this.primitive == gl.LINES){
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.index);
			gl.drawElements(this.primitive, this.buffer.index.length, gl.UNSIGNED_SHORT, 0);
		}else {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.triangle);
			gl.drawElements(this.primitive, this.buffer.triangle.length, gl.UNSIGNED_SHORT, 0);
		}
		
		// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.index);
		// gl.drawElements(this.primitive, this.buffer.index.length, gl.UNSIGNED_SHORT, 0);
	};
};


