
LIBPATH = -L/usr/include/GL
LIBS    = -lglfw -lGLEW -lglut -lGLU -lGL -lm
LFLAGS  = $(LIBPATH) $(LIBS)

app: clean
	mkdir out; g++ -o out/app src/*.cpp $(LFLAGS)

start: app
	./out/app

clean:
	rm -rf out

