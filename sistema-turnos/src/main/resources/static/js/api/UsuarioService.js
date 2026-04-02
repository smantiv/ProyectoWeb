/**
 * UsuarioService - Servicio para operaciones de usuarios
 * Utiliza ApiClient para realizar llamadas HTTP
 */

class UsuarioService {
    constructor(apiClient) {
        this.apiClient = apiClient || new ApiClient();
        this.endpoint = '/usuarios';
    }

    /**
     * Obtener todos los usuarios
     */
    async obtenerTodos() {
        const response = await this.apiClient.get(this.endpoint);
        return response.data || [];
    }

    /**
     * Obtener usuario por ID
     */
    async obtenerPorId(id) {
        const response = await this.apiClient.get(`${this.endpoint}/${id}`);
        return response.data;
    }

    /**
     * Obtener usuario por email
     */
    async obtenerPorEmail(email) {
        const response = await this.apiClient.get(`${this.endpoint}/email/${email}`);
        return response.data;
    }

    /**
     * Obtener usuarios por rol
     */
    async obtenerPorRol(rol) {
        const response = await this.apiClient.get(`${this.endpoint}/rol/${rol}`);
        return response.data || [];
    }

    /**
     * Crear nuevo usuario
     */
    async crear(usuario) {
        const response = await this.apiClient.post(this.endpoint, usuario);
        return response.data;
    }

    /**
     * Actualizar usuario
     */
    async actualizar(id, usuario) {
        const response = await this.apiClient.put(`${this.endpoint}/${id}`, usuario);
        return response.data;
    }

    /**
     * Eliminar usuario
     */
    async eliminar(id) {
        return await this.apiClient.delete(`${this.endpoint}/${id}`);
    }

    /**
     * Validar credenciales (ejemplo)
     */
    async validarCredenciales(email, password) {
        try {
            const usuario = await this.obtenerPorEmail(email);
            // En producción, validar en backend
            return usuario && usuario.email === email;
        } catch (error) {
            return false;
        }
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UsuarioService;
}
