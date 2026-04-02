/**
 * CheckpointService - Servicio para operaciones de checkpoints
 */

class CheckpointService {
    constructor(apiClient) {
        this.apiClient = apiClient || new ApiClient();
        this.endpoint = '/checkpoints';
    }

    async obtenerTodos() {
        const response = await this.apiClient.get(this.endpoint);
        return response.data || [];
    }

    async obtenerPorId(id) {
        const response = await this.apiClient.get(`${this.endpoint}/${id}`);
        return response.data;
    }

    async obtenerPorNombre(nombre) {
        const response = await this.apiClient.get(`${this.endpoint}/nombre/${nombre}`);
        return response.data;
    }

    async crear(checkpoint) {
        const response = await this.apiClient.post(this.endpoint, checkpoint);
        return response.data;
    }

    async actualizar(id, checkpoint) {
        const response = await this.apiClient.put(`${this.endpoint}/${id}`, checkpoint);
        return response.data;
    }

    async eliminar(id) {
        return await this.apiClient.delete(`${this.endpoint}/${id}`);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CheckpointService;
}
