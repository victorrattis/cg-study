#include <stdio.h>
#include <string.h>

#include "GlWindow.hpp"

// Public methods ---

GlWindow GlWindow::setOpenglVersion(int major, int minor) {
    this->contextVersionMajor = major;
    this->contextVersionMinor = minor;
    return *this;
}

GlWindow GlWindow::setWindowSize(int widht, int height) {
    this->windowWidth = widht;
    this->windowHeight = height;
    return *this;
}

GlWindow GlWindow::setWindowTitle(const char* title) {
    this->windowTitle = title;
    return *this;
}

GlWindow GlWindow::setDisplayCallback(callback_function callback) {
    this->drawFrameCallback = callback;
    return *this; 
}

bool GlWindow::create(void) {
    if (this->initializeGlfw()) {
        printf("GLFW initialisation failed!");
        return false;
    }

    if (this->createWindow()) {
		printf("GLFW window creation failed!");
        return false;
    }

    if (this->initializeGlContext()) {
		printf("GL initialization failed!");
        return false;
    }

    this->updateWindowSize();
    return true;
}

void GlWindow::displayLoop() {
    // Loop until window closed
	while (!glfwWindowShouldClose(this->mainWindow)) {
        // Get + Handle user input eventsdrawWindowFrame
		glfwPollEvents();
        if (this->drawFrameCallback) this->drawFrameCallback();
        glfwSwapBuffers(this->mainWindow);
    }
}

// private methods ---

int GlWindow::initializeGlfw() {
    if (!glfwInit()) {
		glfwTerminate();
		return 1;
	}

    // Setup GLFW window properties
	// OpenGL version
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, contextVersionMajor);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, contextVersionMinor);

	// Core Profile
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	// Allow Forward Compatbility
	glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);

    return 0;
}

int GlWindow::createWindow() {
	this->mainWindow = glfwCreateWindow(
        windowWidth,
        windowHeight,
        windowTitle,
        NULL,
        NULL
    );

	if(!this->mainWindow) {
		glfwTerminate();
		return 1;
	}

    return 0;
}

int GlWindow::initializeGlContext() {
    // Set context for GLEW to use
	glfwMakeContextCurrent(this->mainWindow);

    // Allow modern extension features
	glewExperimental = GL_TRUE;
	if (glewInit() != GLEW_OK) {
		printf("GLEW initialisation failed!");
		glfwDestroyWindow(this->mainWindow);
		glfwTerminate();
		return 1;
	}

    return 0;
}

void GlWindow::updateWindowSize() {
	glfwGetFramebufferSize(
        this->mainWindow,
        &this->windowWidth,
        &this->windowHeight
    );
}
