
#include <GL/glew.h>

class ShaderProgram {
    public:
        ShaderProgram setVertexShader(const char *filePath);
        ShaderProgram setFragmentShader(const char *filePath);
        void load();
        bool isLoaded() { return this->isProgramLoaded; }
        GLuint getId() { return this->shaderProgramId; }

    private:
        const char *vertexShaderFile;
        const char *fragmentShaderFile;

        GLuint shaderProgramId;
        GLuint vertexShaderId;
        GLuint fragmentShaderId;
        bool isProgramLoaded;
};