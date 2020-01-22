
var shaderSource = {
	load: function (program) {
		program.vertex = gl.getAttribLocation(program, "vertexPosition");
		gl.enableVertexAttribArray(program.vertex);
		
		program.materialColor = gl.getUniformLocation(program, "materialColor");
		
		program.resolution = gl.getUniformLocation(program, "u_resolution");
	},

	vertex: [
		"attribute vec2 vertexPosition;",
		"uniform vec2 u_resolution;",

		"void main() {",
		"	gl_PointSize = 2.0;",
		"   vec2 zeroToOne = vertexPosition.xy / u_resolution * 2.0;",
		"   vec2 clipSpace = vec2(zeroToOne.x - 1.0, -zeroToOne.y + 1.0);",
		
		"   gl_Position = vec4(clipSpace, 0, 1);",
		"}",
	].join("\n"),
	
	fragment: [
		"precision mediump float;",
		
		"uniform vec3 materialColor;",
		
		"void main(void) {",
		"    gl_FragColor = vec4(materialColor, 1.0);",
		"}",
	].join("\n")
};
