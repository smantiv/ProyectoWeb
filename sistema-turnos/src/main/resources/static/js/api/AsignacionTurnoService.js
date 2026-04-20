/**
 * AsignacionTurnoService - Servicio para operaciones de asignaciones de turnos
 */

class AsignacionTurnoService {
    constructor(apiClient) {
        this.apiClient = apiClient || new ApiClient();
        this.endpoint = '/asignaciones-turnos';
    }

    async obtenerTodas() {
        const response = await this.apiClient.get(this.endpoint);
        return response.data || [];
    }

    async obtenerPorId(id) {
        const response = await this.apiClient.get(`${this.endpoint}/${id}`);
        return response.data;
    }

    async obtenerPorDocente(docenteId) {
        const response = await this.apiClient.get(`${this.endpoint}/docente/${docenteId}`);
        return response.data || [];
    }

    async crear(asignacion) {
        const response = await this.apiClient.post(this.endpoint, asignacion);
        return response.data;
    }

    async actualizar(id, asignacion) {
        const response = await this.apiClient.put(`${this.endpoint}/${id}`, asignacion);
        return response.data;
    }

    async eliminar(id) {
        return await this.apiClient.delete(`${this.endpoint}/${id}`);
    }

    /**
     * Registrar check-in
     */
    async registrarCheckin(id) {
        const response = await this.apiClient.post(`${this.endpoint}/${id}/checkin`, {});
        return response.data;
    }

    /**
     * Registrar cierre
     */
    async registrarCierre(id, horaCierre) {
        return this.actualizar(id, { horaCierre });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AsignacionTurnoService;
}
