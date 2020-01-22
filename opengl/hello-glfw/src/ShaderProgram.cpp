#include <string.h>
#include <iostream>
#include <fstream>

#include "ShaderProgram.hpp"

using namespace std;

GLuint loadShader(const char *shaderPath, GLenum shaderType);
void attachShader(GLuint programId, GLuint shaderId);
string readFile(const char *filePath);

// =============================================================================
// public methods ---

ShaderProgram ShaderProgram::setVertexShader(const char *filePath) {
    this->vertexShaderFile = filePath;
    return *this;
}

ShaderProgram ShaderProgram::setFragmentShader(const char *filePath) {
    this->fragmentShaderFile = filePath;
    return *this;
}

void ShaderProgram::load() {
    this->isProgramLoaded = false;
    this->shaderProgramId = glCreateProgram();
    if (!this->shaderProgramId) {
		return;
	}

    this->vertexShaderId = loadShader(
        this->vertexShaderFile, GL_VERTEX_SHADER);
    attachShader(this->shaderProgramId, this->vertexShaderId);

    this->fragmentShaderId = loadShader(
        this->fragmentShaderFile, GL_FRAGMENT_SHADER);
    attachShader(this->shaderProgramId, this->fragmentShaderId);

    GLint result = 0;
	glLinkProgram(this->shaderProgramId);
	glGetProgramiv(this->shaderProgramId, GL_LINK_STATUS, &result);
	if (!result) {
	    GLchar eLog[1024] = { 0 };
		glGetProgramInfoLog(this->shaderProgramId, sizeof(eLog), NULL, eLog);
		printf("Error linking program: '%s'\n", eLog);
		return;
	}

    glValidateProgram(this->shaderProgramId);
	glGetProgramiv(this->shaderProgramId, GL_VALIDATE_STATUS, &result);
	if (!result) {
	    GLchar eLog[1024] = { 0 };
		glGetProgramInfoLog(this->shaderProgramId, sizeof(eLog), NULL, eLog);
		printf("Error validating program: '%s'\n", eLog);
		return;
	}

    this->isProgramLoaded = true;
}

// =============================================================================
// Internal functions ---

GLuint loadShader(const char *shaderPath, GLenum shaderType) {
    string shaderStr = readFile(shaderPath);
    if (shaderStr.length() <= 0) {
        fprintf(stderr, "Error reading file '%s'\n", shaderPath);
        return -1;
    }

    const GLchar* shaderSource[1];
	shaderSource[0] = shaderStr.c_str();

    GLint shaderSourceLength[1];
	shaderSourceLength[0] = strlen(shaderSource[0]);

    GLuint shaderId = glCreateShader(shaderType);
    glShaderSource(shaderId, 1, shaderSource, shaderSourceLength);
	glCompileShader(shaderId);

	GLint result = 0;
	glGetShaderiv(shaderId, GL_COMPILE_STATUS, &result);
	if (!result) {
	    GLchar eLog[1024] = { 0 };
		glGetShaderInfoLog(shaderId, 1024, NULL, eLog);
		fprintf(stderr, "Error compiling the %d shader: '%s'\n",
            shaderType, eLog);
		return -1;
	}

    return shaderId;
}

void attachShader(GLuint programId, GLuint shaderId) {
    if (shaderId != -1) {
        glAttachShader(programId, shaderId);
    }
}

string readFile(const char *filePath) {
    string content = "";
    ifstream fileStream(filePath, ios::in);
    if(fileStream.is_open()) {
        string line = "";
        while(!fileStream.eof()) {
            getline(fileStream, line);
            content.append(line + "\n");
        }
        fileStream.close();
    }
    return content;
}