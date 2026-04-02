/**
 * RecorridoService - Servicio para operaciones de recorridos
 */

class RecorridoService {
    constructor(apiClient) {
        this.apiClient = apiClient || new ApiClient();
        this.endpoint = '/recorridos';
    }

    async obtenerTodos() {
        const response = await this.apiClient.get(this.endpoint);
        return response.data || [];
    }

    async obtenerPorId(id) {
        const response = await this.apiClient.get(`${this.endpoint}/${id}`);
        return response.data;
    }

    async obtenerPorAsignacion(asignacionId) {
        const response = await this.apiClient.get(`${this.endpoint}/asignacion/${asignacionId}`);
        return response.data || [];
    }

    async obtenerPorCheckpoint(checkpointId) {
        const response = await this.apiClient.get(`${this.endpoint}/checkpoint/${checkpointId}`);
        return response.data || [];
    }

    async crear(recorrido) {
        const response = await this.apiClient.post(this.endpoint, recorrido);
        return response.data;
    }

    async actualizar(id, recorrido) {
        const response = await this.apiClient.put(`${this.endpoint}/${id}`, recorrido);
        return response.data;
    }

    async eliminar(id) {
        return await this.apiClient.delete(`${this.endpoint}/${id}`);
    }

    /**
     * Registrar paso por checkpoint
     */
    async registrarPaso(checkpointId, asignacionId) {
        return this.crear({
            checkpointId,
            asignacionId,
            fechaHora: new Date().toISOString()
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = RecorridoService;
}
