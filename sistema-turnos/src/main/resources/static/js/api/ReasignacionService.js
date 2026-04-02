/**
 * ReasignacionService - Servicio para operaciones de reasignaciones
 */

class ReasignacionService {
    constructor(apiClient) {
        this.apiClient = apiClient || new ApiClient();
        this.endpoint = '/reasignaciones';
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

    async obtenerPorEstado(estado) {
        const response = await this.apiClient.get(`${this.endpoint}/estado/${estado}`);
        return response.data || [];
    }

    async obtenerPorDocenteYEstado(docenteId, estado) {
        const response = await this.apiClient.get(`${this.endpoint}/docente/${docenteId}/estado/${estado}`);
        return response.data || [];
    }

    async crear(reasignacion) {
        const response = await this.apiClient.post(this.endpoint, reasignacion);
        return response.data;
    }

    async actualizar(id, reasignacion) {
        const response = await this.apiClient.put(`${this.endpoint}/${id}`, reasignacion);
        return response.data;
    }

    async eliminar(id) {
        return await this.apiClient.delete(`${this.endpoint}/${id}`);
    }

    /**
     * Solicitar reasignación
     */
    async solicitarReasignacion(docenteId, motivo) {
        return this.crear({
            docenteId,
            motivo,
            fechaSolicitud: new Date().toISOString(),
            estado: 'pendiente'
        });
    }

    /**
     * Obtener solicitudes pendientes
     */
    async obtenerPendientes() {
        return this.obtenerPorEstado('pendiente');
    }

    /**
     * Aprobar reasignación
     */
    async aprobar(id) {
        return this.actualizar(id, {
            estado: 'aprobada',
            fechaRespuesta: new Date().toISOString()
        });
    }

    /**
     * Rechazar reasignación
     */
    async rechazar(id) {
        return this.actualizar(id, {
            estado: 'rechazada',
            fechaRespuesta: new Date().toISOString()
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReasignacionService;
}
