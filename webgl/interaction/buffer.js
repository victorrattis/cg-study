
var Buffer = {};

Buffer.loadBuffer = function (bufferData, bufferType, bufferSize) {
	var buffer = gl.createBuffer();
	gl.bindBuffer(bufferType, buffer);
	
	gl.bufferData(bufferType, bufferData, gl.STATIC_DRAW);
	buffer.size = bufferSize;
    buffer.length = bufferData.length / bufferSize;
	
	return buffer;
};

Buffer.loadArrayBuffer = function (bufferData, bufferSize) {
	return Buffer.loadBuffer(bufferData, gl.ARRAY_BUFFER, bufferSize);
};

Buffer.loadElementArrayBuffer = function (bufferData, bufferSize) {
	return Buffer.loadBuffer(bufferData, gl.ELEMENT_ARRAY_BUFFER, bufferSize);
};
