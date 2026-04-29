/**
 * DocenteService - Servicio para operaciones de docentes
 */

class DocenteService {
    constructor(apiClient) {
        this.apiClient = apiClient || new ApiClient();
        this.endpoint = '/docentes';
    }

    async obtenerTodos() {
        const response = await this.apiClient.get(this.endpoint);
        return response.data || [];
    }

    async obtenerPorId(id) {
        const response = await this.apiClient.get(`${this.endpoint}/${id}`);
        return response.data;
    }

    async obtenerPorCodigo(codigo) {
        const response = await this.apiClient.get(`${this.endpoint}/codigo/${codigo}`);
        return response.data;
    }

    async obtenerPorUsuario(usuarioId) {
        const response = await this.apiClient.get(`${this.endpoint}/usuario/${usuarioId}`);
        return response.data;
    }

    async obtenerActual() {
        const response = await this.apiClient.get(`${this.endpoint}/actual`);
        return response.data;
    }

    async crear(docente) {
        const response = await this.apiClient.post(this.endpoint, docente);
        return response.data;
    }

    async actualizar(id, docente) {
        const response = await this.apiClient.put(`${this.endpoint}/${id}`, docente);
        return response.data;
    }

    async eliminar(id) {
        return await this.apiClient.delete(`${this.endpoint}/${id}`);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DocenteService;
}
