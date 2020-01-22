#include <stdio.h>

#include <GL/glew.h>

#include "GlWindow.hpp"
#include "ShaderProgram.hpp"

void onDrawFrame();

GLuint VBO, VAO;
GlWindow glWindow;
ShaderProgram shader;

void CreateTriangle() {
	GLfloat vertices[] = {
		-1.0f, -1.0f, 0.0f,
		1.0f, -1.0f, 0.0f,
		0.0f, 1.0f, 0.0f
	};

	glGenVertexArrays(1, &VAO);
	glBindVertexArray(VAO);

	glGenBuffers(1, &VBO);
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 0, 0);
	glEnableVertexAttribArray(0);

	glBindBuffer(GL_ARRAY_BUFFER, 0);

	glBindVertexArray(0);
}

int main() {
    glWindow = GlWindow()
        .setOpenglVersion(3, 3)
        .setWindowSize(800, 600)
        .setWindowTitle("Hello GLFW")
        .setDisplayCallback(onDrawFrame);

    if (!glWindow.create()) {
		return 1;
    }

    printf("OpenGL version supported by this platform (%s): \n", 
        glGetString(GL_VERSION));

    shader = ShaderProgram()
        .setVertexShader("simply.vs")
        .setFragmentShader("simply.fs");
    shader.load();

    if(shader.isLoaded()) {
        printf("Shader program loaded successfully!\n");
    }

    CreateTriangle();

	glViewport(0, 0, glWindow.getWidth(), glWindow.getHeight());
    glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
    glWindow.displayLoop();
    return 0;
}

void onDrawFrame() {
    glClear(GL_COLOR_BUFFER_BIT);

    glUseProgram(shader.getId());

    glBindVertexArray(VAO);
    glDrawArrays(GL_TRIANGLES, 0, 3);
    glBindVertexArray(0);
}
