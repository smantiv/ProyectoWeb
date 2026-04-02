/**
 * IncidenteService - Servicio para operaciones de incidentes
 */

class IncidenteService {
    constructor(apiClient) {
        this.apiClient = apiClient || new ApiClient();
        this.endpoint = '/incidentes';
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

    async obtenerPorTipo(tipo) {
        const response = await this.apiClient.get(`${this.endpoint}/tipo/${tipo}`);
        return response.data || [];
    }

    async crear(incidente) {
        const response = await this.apiClient.post(this.endpoint, incidente);
        return response.data;
    }

    async actualizar(id, incidente) {
        const response = await this.apiClient.put(`${this.endpoint}/${id}`, incidente);
        return response.data;
    }

    async eliminar(id) {
        return await this.apiClient.delete(`${this.endpoint}/${id}`);
    }

    /**
     * Reportar incidente
     */
    async reportar(asignacionId, tipo, severidad, descripcion) {
        return this.crear({
            asignacionId,
            tipo,
            severidad,
            descripcion,
            fechaHora: new Date().toISOString()
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = IncidenteService;
}
