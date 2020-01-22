#include <GL/glew.h>
#include <GLFW/glfw3.h>

typedef void (*callback_function)(void);

class GlWindow {
    public:
        GlWindow setOpenglVersion(int major, int minor);
        GlWindow setWindowSize(int widht, int height);
        GlWindow setWindowTitle(const char* title);
        GlWindow setDisplayCallback(callback_function callback);
        int getWidth() { return this->windowWidth; }
        int getHeight() { return this->windowHeight; }
        bool create(void);
        void displayLoop();

    private:
        int contextVersionMajor;
        int contextVersionMinor;
        int windowWidth;
        int windowHeight;
        const char* windowTitle;
        callback_function drawFrameCallback;
        GLFWwindow *mainWindow;

        int initializeGlfw();
        int createWindow();
        int initializeGlContext();
        void updateWindowSize();
};