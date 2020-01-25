
VULKAN_SDK_PATH = /home/vhra/apps/vulkan/1.1.130.0/x86_64
CFLAGS = -std=c++17 -I$(VULKAN_SDK_PATH)/include
LDFLAGS = -L$(VULKAN_SDK_PATH)/lib `pkg-config --static --libs glfw3` -lvulkan

OUTPUT = output
SRC_DIR := src
SRC_FILES := $(wildcard $(SRC_DIR)/*.cpp)

VulkanTest: makeOutput
	g++ $(CFLAGS) -o $(OUTPUT)/VulkanTest $(SRC_FILES) $(LDFLAGS)

.PHONY: start clean

start: clean VulkanTest 
	LD_LIBRARY_PATH=$(VULKAN_SDK_PATH)/lib VK_LAYER_PATH=$(VULKAN_SDK_PATH)/etc/vulkan/explicit_layer.d \
	$(OUTPUT)/VulkanTest

compile: 
	./compile.sh

clean:
	rm -rf $(OUTPUT)

makeOutput:
	mkdir -p $(OUTPUT)

