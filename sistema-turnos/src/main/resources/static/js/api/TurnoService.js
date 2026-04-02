/**
 * TurnoService - Servicio para operaciones de turnos
 */

class TurnoService {
    constructor(apiClient) {
        this.apiClient = apiClient || new ApiClient();
        this.endpoint = '/turnos';
    }

    async obtenerTodos() {
        const response = await this.apiClient.get(this.endpoint);
        return response.data || [];
    }

    async obtenerPorId(id) {
        const response = await this.apiClient.get(`${this.endpoint}/${id}`);
        return response.data;
    }

    async obtenerPorFecha(fecha) {
        const response = await this.apiClient.get(`${this.endpoint}/fecha/${fecha}`);
        return response.data || [];
    }

    async obtenerPorEstado(estado) {
        const response = await this.apiClient.get(`${this.endpoint}/estado/${estado}`);
        return response.data || [];
    }

    async obtenerPorZona(zonaId) {
        const response = await this.apiClient.get(`${this.endpoint}/zona/${zonaId}`);
        return response.data || [];
    }

    async obtenerPorFechaYEstado(fecha, estado) {
        const response = await this.apiClient.get(`${this.endpoint}/fecha/${fecha}/estado/${estado}`);
        return response.data || [];
    }

    async crear(turno) {
        const response = await this.apiClient.post(this.endpoint, turno);
        return response.data;
    }

    async actualizar(id, turno) {
        const response = await this.apiClient.put(`${this.endpoint}/${id}`, turno);
        return response.data;
    }

    async eliminar(id) {
        return await this.apiClient.delete(`${this.endpoint}/${id}`);
    }

    /**
     * Obtener turnos disponibles (estado = 'disponible')
     */
    async obtenerDisponibles() {
        return this.obtenerPorEstado('disponible');
    }

    /**
     * Obtener turnos asignados (estado = 'asignado')
     */
    async obtenerAsignados() {
        return this.obtenerPorEstado('asignado');
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TurnoService;
}
