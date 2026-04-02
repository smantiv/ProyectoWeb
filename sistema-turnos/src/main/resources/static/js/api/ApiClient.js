/**
 * ApiClient - Cliente base para todas las llamadas a la API REST
 * Proporciona métodos HTTP reutilizables (GET, POST, PUT, DELETE)
 * Manejo centralizado de errores y autenticación
 */

class ApiClient {
    constructor(baseUrl = '/api/v1', timeout = 10000) {
        this.baseUrl = baseUrl;
        this.timeout = timeout;
    }

    /**
     * Realiza una solicitud HTTP genérica
     * @param {string} method - Método HTTP (GET, POST, PUT, DELETE, etc.)
     * @param {string} endpoint - Endpoint de la API
     * @param {object} data - Datos a enviar (para POST y PUT)
     * @param {object} headers - Headers personalizados
     * @returns {Promise} Respuesta de la API
     */
    async request(method, endpoint, data = null, headers = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...headers
        };

        const options = {
            method,
            headers: defaultHeaders,
            signal: AbortSignal.timeout(this.timeout)
        };

        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            
            // Manejo de respuestas vacías o no JSON
            if (response.status === 204) {
                return { success: true, status: response.status };
            }

            let responseData = null;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            }

            if (!response.ok) {
                throw new ApiError(
                    responseData?.message || `HTTP ${response.status}: ${response.statusText}`,
                    response.status,
                    responseData
                );
            }

            return {
                success: true,
                status: response.status,
                data: responseData
            };

        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            
            if (error.name === 'AbortError') {
                throw new ApiError('Solicitud agotada por tiempo límite', 'TIMEOUT', null);
            }

            throw new ApiError(
                error.message || 'Error de red desconocido',
                'NETWORK_ERROR',
                null
            );
        }
    }

    /**
     * GET - Obtener datos
     */
    async get(endpoint, headers = {}) {
        return this.request('GET', endpoint, null, headers);
    }

    /**
     * POST - Crear datos
     */
    async post(endpoint, data = {}, headers = {}) {
        return this.request('POST', endpoint, data, headers);
    }

    /**
     * PUT - Actualizar datos (reemplazo completo)
     */
    async put(endpoint, data = {}, headers = {}) {
        return this.request('PUT', endpoint, data, headers);
    }

    /**
     * DELETE - Eliminar datos
     */
    async delete(endpoint, headers = {}) {
        return this.request('DELETE', endpoint, null, headers);
    }

    /**
     * PATCH - Actualizar datos (parcial)
     */
    async patch(endpoint, data = {}, headers = {}) {
        return this.request('PATCH', endpoint, data, headers);
    }

    /**
     * Establece el token de autenticación
     */
    setAuthToken(token) {
        this.authToken = token;
    }

    /**
     * Obtiene el token de autenticación
     */
    getAuthToken() {
        return this.authToken;
    }

    /**
     * Limpia el token de autenticación
     */
    clearAuthToken() {
        this.authToken = null;
    }
}

/**
 * Clase personalizada para errores de API
 */
class ApiError extends Error {
    constructor(message, code = null, responseData = null) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.responseData = responseData;
    }
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ApiClient, ApiError };
}
