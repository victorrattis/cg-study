
# Variables
MESA = /usr/bin/Mesa-5.0 
INCPATH = -I$(MESA)/include
LIBPATH = -L/usr/include/GL
LIBS        = -lglfw -lGLEW -lglut -lGLU -lGL -lm
CFLAGS  = $(INCPATH) -g
LFLAGS  = $(LIBPATH) $(LIBS)

test-make:
	gcc -o test-make main.cpp $(LFLAGS)
