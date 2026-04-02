/**
 * ZonaService - Servicio para operaciones de zonas
 */

class ZonaService {
    constructor(apiClient) {
        this.apiClient = apiClient || new ApiClient();
        this.endpoint = '/zonas';
    }

    async obtenerTodas() {
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

    async crear(zona) {
        const response = await this.apiClient.post(this.endpoint, zona);
        return response.data;
    }

    async actualizar(id, zona) {
        const response = await this.apiClient.put(`${this.endpoint}/${id}`, zona);
        return response.data;
    }

    async eliminar(id) {
        return await this.apiClient.delete(`${this.endpoint}/${id}`);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZonaService;
}
