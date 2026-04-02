/**
 * API Services Index - Punto de entrada para acceder a todos los servicios
 * 
 * Uso:
 * const { apiClient, turnoService, docenteService } = ApiServices;
 * 
 * O cargar en HTML:
 * <script src="/js/api/ApiClient.js"></script>
 * <script src="/js/api/TurnoService.js"></script>
 * <script src="/js/api/ApiServices.js"></script>
 */

// Crear instancia única del cliente API
const apiClient = new ApiClient('/api/v1');

// Crear instancias de todos los servicios
const turnoService = new TurnoService(apiClient);
const usuarioService = new UsuarioService(apiClient);
const docenteService = new DocenteService(apiClient);
const zonaService = new ZonaService(apiClient);
const asignacionTurnoService = new AsignacionTurnoService(apiClient);
const incidenteService = new IncidenteService(apiClient);
const checkpointService = new CheckpointService(apiClient);
const recorridoService = new RecorridoService(apiClient);
const reasignacionService = new ReasignacionService(apiClient);

// Objeto central con todos los servicios
const ApiServices = {
    // Cliente base
    apiClient,
    
    // Servicios
    turnoService,
    usuarioService,
    docenteService,
    zonaService,
    asignacionTurnoService,
    incidenteService,
    checkpointService,
    recorridoService,
    reasignacionService,

    /**
     * Método helper para establecer token de autenticación
     */
    setAuthToken(token) {
        apiClient.setAuthToken(token);
    },

    /**
     * Método helper para limpiar autenticación
     */
    logout() {
        apiClient.clearAuthToken();
    }
};

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiServices;
}
