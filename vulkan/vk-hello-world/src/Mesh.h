
#include <vulkan/vulkan.h>
#include <vector>

#include "Vertex.h"

class Mesh {
    public:
        ~Mesh();
        VkBuffer getVertexBuffer() {
            return vertexBuffer;
        }
        int getVertexNumber() {
            return vertices.size();
        }
        std::vector<VkBuffer> uniformBuffers;

        void create(
            VkDevice device,
            VkPhysicalDevice physicalDevice,
            VkCommandPool commandPool,
            VkQueue graphicsQueue,
            std::vector<Vertex> vertices,
            std::vector<uint16_t> indices,
            int size);

        void bind(VkCommandBuffer commandBuffer);
        
        void cleanup(VkDevice device);

        void updateUniformBuffer(
            VkDevice device,
            VkExtent2D swapChainExtent,
            uint32_t currentImage);

    private:
        VkDevice *device;
        VkBuffer vertexBuffer;
        VkDeviceMemory vertexBufferMemory;
        VkBuffer indexBuffer;
        VkDeviceMemory indexBufferMemory;
        std::vector<VkDeviceMemory> uniformBuffersMemory;

        std::vector<Vertex> vertices;
        std::vector<uint16_t> indices;
        VkDeviceSize createVertexBuffer(VkDevice device);

        void createVertexBuffer(
            VkDevice device,
            VkPhysicalDevice physicalDevice,
            VkCommandPool commandPool,
            VkQueue graphicsQueue);

        void createIndexBuffer(
            VkDevice device,
            VkPhysicalDevice physicalDevice,
            VkCommandPool commandPool,
            VkQueue graphicsQueue);

        void createUniformBuffers(
            VkDevice device,
            VkPhysicalDevice physicalDevice,
            int size);
};
