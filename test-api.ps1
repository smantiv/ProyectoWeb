param(
    [string]$BaseUrl = "http://localhost:8080",
    [string]$OutDir = ".\test-report"
)

$ErrorActionPreference = "Stop"

if (!(Test-Path $OutDir)) {
    New-Item -ItemType Directory -Path $OutDir | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$jsonReport = Join-Path $OutDir "api-report_$timestamp.json"
$txtReport  = Join-Path $OutDir "api-report_$timestamp.txt"

$results = New-Object System.Collections.Generic.List[object]
$created = @{
    zonaId = $null
    usuarioId = $null
    docenteId = $null
    turnoId = $null
    asignacionId = $null
    checkpointId = $null
    recorridoId = $null
    incidenteId = $null
    reasignacionId = $null
}

function Add-Result {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [bool]$Success,
        [int]$StatusCode = 0,
        [string]$Message = "",
        $Response = $null
    )

    $results.Add([pscustomobject]@{
        name = $Name
        method = $Method
        url = $Url
        success = $Success
        statusCode = $StatusCode
        message = $Message
        response = $Response
        timestamp = (Get-Date).ToString("s")
    })
}

function Get-ErrorResponseBody {
    param($Exception)

    try {
        if ($Exception.Response -and $Exception.Response.GetResponseStream) {
            $stream = $Exception.Response.GetResponseStream()
            if ($stream) {
                $reader = New-Object System.IO.StreamReader($stream)
                $content = $reader.ReadToEnd()
                $reader.Close()
                if ($content) {
                    try {
                        return ($content | ConvertFrom-Json)
                    } catch {
                        return $content
                    }
                }
            }
        }
    } catch {
    }

    return $null
}

function Invoke-TestRequest {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        $Body = $null,
        [int[]]$ExpectedStatus = @(200),
        [switch]$ReturnBody
    )

    try {
        $headers = @{ "Accept" = "application/json" }
        $response = $null
        $statusCode = 0
        $content = $null

        if ($null -ne $Body) {
            $json = $Body | ConvertTo-Json -Depth 10
            $response = Invoke-WebRequest -Uri $Url -Method $Method -Headers $headers -ContentType "application/json" -Body $json
        } else {
            $response = Invoke-WebRequest -Uri $Url -Method $Method -Headers $headers
        }

        $statusCode = [int]$response.StatusCode

        if ($response.Content) {
            try {
                $content = $response.Content | ConvertFrom-Json
            } catch {
                $content = $response.Content
            }
        }

        if ($ExpectedStatus -contains $statusCode) {
            Add-Result -Name $Name -Method $Method -Url $Url -Success $true -StatusCode $statusCode -Message "OK" -Response $content
        } else {
            Add-Result -Name $Name -Method $Method -Url $Url -Success $false -StatusCode $statusCode -Message "Código inesperado" -Response $content
        }

        if ($ReturnBody) {
            return [pscustomobject]@{
                StatusCode = $statusCode
                Body = $content
            }
        }
    } catch {
        $statusCode = 0
        if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
            try {
                $statusCode = [int]$_.Exception.Response.StatusCode
            } catch {
                $statusCode = 0
            }
        }

        $content = Get-ErrorResponseBody -Exception $_.Exception
        $bodyText = $_.Exception.Message

        if ($ExpectedStatus -contains $statusCode) {
            Add-Result -Name $Name -Method $Method -Url $Url -Success $true -StatusCode $statusCode -Message "OK (codigo esperado)" -Response $content
        } else {
            Add-Result -Name $Name -Method $Method -Url $Url -Success $false -StatusCode $statusCode -Message $bodyText -Response $content
        }

        if ($ReturnBody) {
            return [pscustomobject]@{
                StatusCode = $statusCode
                Body = $content
            }
        }
    }
}

function Cleanup-Delete {
    param(
        [string]$Name,
        [string]$Url
    )

    try {
        $resp = Invoke-WebRequest -Uri $Url -Method DELETE
        $statusCode = [int]$resp.StatusCode
        Add-Result -Name $Name -Method "DELETE" -Url $Url -Success $true -StatusCode $statusCode -Message "Eliminado"
    } catch {
        $statusCode = 0
        if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
            try {
                $statusCode = [int]$_.Exception.Response.StatusCode
            } catch {
                $statusCode = 0
            }
        }
        Add-Result -Name $Name -Method "DELETE" -Url $Url -Success $false -StatusCode $statusCode -Message $_.Exception.Message
    }
}

Write-Host "Verificando aplicacion en $BaseUrl ..." -ForegroundColor Cyan
try {
    Invoke-WebRequest -Uri $BaseUrl -Method GET | Out-Null
    Write-Host "Aplicacion disponible." -ForegroundColor Green
} catch {
    Write-Host "No se pudo conectar a $BaseUrl. Arranca primero la app." -ForegroundColor Red
    exit 1
}

$api = "$BaseUrl/api/v1"
$unique = Get-Date -Format "yyyyMMddHHmmss"

# =========================
# GET basicos
# =========================
Invoke-TestRequest -Name "GET usuarios" -Method GET -Url "$api/usuarios"
Invoke-TestRequest -Name "GET docentes" -Method GET -Url "$api/docentes"
Invoke-TestRequest -Name "GET docente actual" -Method GET -Url "$api/docentes/actual"
Invoke-TestRequest -Name "GET zonas" -Method GET -Url "$api/zonas"
Invoke-TestRequest -Name "GET turnos" -Method GET -Url "$api/turnos"
Invoke-TestRequest -Name "GET asignaciones" -Method GET -Url "$api/asignaciones-turnos"
Invoke-TestRequest -Name "GET panel docente actual" -Method GET -Url "$api/asignaciones-turnos/actual/panel"
Invoke-TestRequest -Name "GET turnos activos" -Method GET -Url "$api/asignaciones-turnos/activas"
Invoke-TestRequest -Name "GET checkpoints" -Method GET -Url "$api/checkpoints"
Invoke-TestRequest -Name "GET recorridos" -Method GET -Url "$api/recorridos"
Invoke-TestRequest -Name "GET incidentes" -Method GET -Url "$api/incidentes"
Invoke-TestRequest -Name "GET reasignaciones" -Method GET -Url "$api/reasignaciones"
Invoke-TestRequest -Name "GET reasignaciones actual" -Method GET -Url "$api/reasignaciones/actual"
Invoke-TestRequest -Name "GET analiticas mapa calor 7 dias" -Method GET -Url "$api/analiticas/mapa-calor?rango=7"
Invoke-TestRequest -Name "GET analiticas mapa calor 30 dias tipo ACCIDENTE" -Method GET -Url "$api/analiticas/mapa-calor?rango=30&tipo=ACCIDENTE"

# =========================
# Crear zona
# =========================
$zonaBody = @{
    nombre = "Zona Test $unique"
    descripcion = "Zona creada por script de prueba"
}
$zonaResp = Invoke-TestRequest -Name "POST zona" -Method POST -Url "$api/zonas" -Body $zonaBody -ExpectedStatus @(201) -ReturnBody
if ($zonaResp.Body -and $zonaResp.Body.id) {
    $created.zonaId = $zonaResp.Body.id
    Invoke-TestRequest -Name "GET zona por id" -Method GET -Url "$api/zonas/$($created.zonaId)"
}

# =========================
# Crear usuario
# =========================
$usuarioBody = @{
    nombre = "Usuario Test $unique"
    email = "test_$unique@example.com"
    password = "1234"
    rol = "DOCENTE"
    activo = $true
}
$usuarioResp = Invoke-TestRequest -Name "POST usuario" -Method POST -Url "$api/usuarios" -Body $usuarioBody -ExpectedStatus @(201) -ReturnBody
if ($usuarioResp.Body -and $usuarioResp.Body.id) {
    $created.usuarioId = $usuarioResp.Body.id
    Invoke-TestRequest -Name "GET usuario por id" -Method GET -Url "$api/usuarios/$($created.usuarioId)"
}

# =========================
# Crear docente
# =========================
if ($created.usuarioId) {
    $docenteBody = @{
        codigoInstitucional = "DOC$unique"
        usuario = @{
            id = $created.usuarioId
        }
    }
    $docenteResp = Invoke-TestRequest -Name "POST docente" -Method POST -Url "$api/docentes" -Body $docenteBody -ExpectedStatus @(201) -ReturnBody
    if ($docenteResp.Body -and $docenteResp.Body.id) {
        $created.docenteId = $docenteResp.Body.id
        Invoke-TestRequest -Name "GET docente por id" -Method GET -Url "$api/docentes/$($created.docenteId)"
    }
}

# =========================
# Crear turno
# =========================
if ($created.zonaId) {
    $tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
    $turnoBody = @{
        fecha = $tomorrow
        horaInicio = "08:00:00"
        horaFin = "09:30:00"
        estado = "PENDIENTE"
        zonaId = $created.zonaId
    }
    $turnoResp = Invoke-TestRequest -Name "POST turno" -Method POST -Url "$api/turnos" -Body $turnoBody -ExpectedStatus @(201) -ReturnBody
    if ($turnoResp.Body -and $turnoResp.Body.id) {
        $created.turnoId = $turnoResp.Body.id
        Invoke-TestRequest -Name "GET turno por id" -Method GET -Url "$api/turnos/$($created.turnoId)"
        Invoke-TestRequest -Name "GET turno por zona" -Method GET -Url "$api/turnos/zona/$($created.zonaId)"
    }
}

# =========================
# Crear asignacion
# =========================
if ($created.docenteId -and $created.turnoId) {
    $asignacionBody = @{
        horaCheckin = $null
        horaCierre = $null
        calificacionLimpieza = $null
        estadoCobertura = "pendiente"
        docenteId = $created.docenteId
        turnoId = $created.turnoId
    }
    $asignacionResp = Invoke-TestRequest -Name "POST asignacion" -Method POST -Url "$api/asignaciones-turnos" -Body $asignacionBody -ExpectedStatus @(201) -ReturnBody
    if ($asignacionResp.Body -and $asignacionResp.Body.id) {
        $created.asignacionId = $asignacionResp.Body.id
        Invoke-TestRequest -Name "GET asignacion por id" -Method GET -Url "$api/asignaciones-turnos/$($created.asignacionId)"
        Invoke-TestRequest -Name "GET asignaciones por docente" -Method GET -Url "$api/asignaciones-turnos/docente/$($created.docenteId)"
    }
}

# =========================
# Checkin y cierre
# =========================
if ($created.asignacionId) {
    Invoke-TestRequest -Name "POST checkin asignacion" -Method POST -Url "$api/asignaciones-turnos/$($created.asignacionId)/checkin" -Body @{} -ExpectedStatus @(200)

    $cierreBody = @{
        horaCierre = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
        calificacionLimpieza = 4
        estadoCobertura = "cerrado"
    }
    Invoke-TestRequest -Name "POST cierre asignacion valido" -Method POST -Url "$api/asignaciones-turnos/$($created.asignacionId)/cierre" -Body $cierreBody -ExpectedStatus @(200)

    $cierreInvalido = @{
        horaCierre = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
        calificacionLimpieza = 9
        estadoCobertura = "cerrado"
    }
    Invoke-TestRequest -Name "POST cierre asignacion invalido" -Method POST -Url "$api/asignaciones-turnos/$($created.asignacionId)/cierre" -Body $cierreInvalido -ExpectedStatus @(400)
}

# =========================
# Crear checkpoint
# =========================
$checkpointBody = @{
    nombre = "Checkpoint Test $unique"
}
$checkpointResp = Invoke-TestRequest -Name "POST checkpoint" -Method POST -Url "$api/checkpoints" -Body $checkpointBody -ExpectedStatus @(201) -ReturnBody
if ($checkpointResp.Body -and $checkpointResp.Body.id) {
    $created.checkpointId = $checkpointResp.Body.id
    Invoke-TestRequest -Name "GET checkpoint por id" -Method GET -Url "$api/checkpoints/$($created.checkpointId)"
}

# =========================
# Crear recorrido
# =========================
if ($created.checkpointId -and $created.asignacionId) {
    $recorridoBody = @{
        fechaHora = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
        checkpointId = $created.checkpointId
        asignacionId = $created.asignacionId
    }
    $recorridoResp = Invoke-TestRequest -Name "POST recorrido" -Method POST -Url "$api/recorridos" -Body $recorridoBody -ExpectedStatus @(201) -ReturnBody
    if ($recorridoResp.Body -and $recorridoResp.Body.id) {
        $created.recorridoId = $recorridoResp.Body.id
        Invoke-TestRequest -Name "GET recorrido por id" -Method GET -Url "$api/recorridos/$($created.recorridoId)"
        Invoke-TestRequest -Name "GET recorridos por asignacion" -Method GET -Url "$api/recorridos/asignacion/$($created.asignacionId)"
        Invoke-TestRequest -Name "GET recorridos por checkpoint" -Method GET -Url "$api/recorridos/checkpoint/$($created.checkpointId)"
    }
}

# =========================
# Crear incidente
# =========================
if ($created.asignacionId) {
    $incidenteBody = @{
        tipo = "ACCIDENTE"
        severidad = "media"
        descripcion = "Incidente generado por script"
        fechaHora = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
        estado = "reportado"
        asignacionId = $created.asignacionId
        ubicacion = "Zona de prueba"
    }
    $incidenteResp = Invoke-TestRequest -Name "POST incidente" -Method POST -Url "$api/incidentes" -Body $incidenteBody -ExpectedStatus @(201) -ReturnBody
    if ($incidenteResp.Body -and $incidenteResp.Body.id) {
        $created.incidenteId = $incidenteResp.Body.id
        Invoke-TestRequest -Name "GET incidente por id" -Method GET -Url "$api/incidentes/$($created.incidenteId)"
        Invoke-TestRequest -Name "GET incidentes por asignacion" -Method GET -Url "$api/incidentes/asignacion/$($created.asignacionId)"
        Invoke-TestRequest -Name "GET incidentes por tipo" -Method GET -Url "$api/incidentes/tipo/ACCIDENTE"
        Invoke-TestRequest -Name "GET incidentes por severidad" -Method GET -Url "$api/incidentes/severidad/media"
        Invoke-TestRequest -Name "GET incidentes por estado" -Method GET -Url "$api/incidentes/estado/reportado"
    }
}

# =========================
# Crear reasignacion
# =========================
if ($created.turnoId) {
    $reasignacionBody = @{
        turnoId = $created.turnoId
        motivo = "Prueba automatizada"
        docenteReemplazoId = $created.docenteId
    }
    $reasignacionResp = Invoke-TestRequest -Name "POST reasignacion" -Method POST -Url "$api/reasignaciones" -Body $reasignacionBody -ExpectedStatus @(201) -ReturnBody
    if ($reasignacionResp.Body -and $reasignacionResp.Body.id) {
        $created.reasignacionId = $reasignacionResp.Body.id
        Invoke-TestRequest -Name "GET reasignacion por id" -Method GET -Url "$api/reasignaciones/$($created.reasignacionId)"
        Invoke-TestRequest -Name "GET candidatos por turno" -Method GET -Url "$api/reasignaciones/candidatos/$($created.turnoId)"
        Invoke-TestRequest -Name "GET reasignaciones por estado pendiente" -Method GET -Url "$api/reasignaciones/estado/pendiente"
    }
}

# =========================
# Cleanup
# =========================
Write-Host "Ejecutando limpieza..." -ForegroundColor Yellow

if ($created.reasignacionId) { Cleanup-Delete -Name "DELETE reasignacion cleanup" -Url "$api/reasignaciones/$($created.reasignacionId)" }
if ($created.incidenteId)    { Cleanup-Delete -Name "DELETE incidente cleanup" -Url "$api/incidentes/$($created.incidenteId)" }
if ($created.recorridoId)    { Cleanup-Delete -Name "DELETE recorrido cleanup" -Url "$api/recorridos/$($created.recorridoId)" }
if ($created.asignacionId)   { Cleanup-Delete -Name "DELETE asignacion cleanup" -Url "$api/asignaciones-turnos/$($created.asignacionId)" }
if ($created.turnoId)        { Cleanup-Delete -Name "DELETE turno cleanup" -Url "$api/turnos/$($created.turnoId)" }
if ($created.checkpointId)   { Cleanup-Delete -Name "DELETE checkpoint cleanup" -Url "$api/checkpoints/$($created.checkpointId)" }
if ($created.docenteId)      { Cleanup-Delete -Name "DELETE docente cleanup" -Url "$api/docentes/$($created.docenteId)" }
if ($created.usuarioId)      { Cleanup-Delete -Name "DELETE usuario cleanup" -Url "$api/usuarios/$($created.usuarioId)" }
if ($created.zonaId)         { Cleanup-Delete -Name "DELETE zona cleanup" -Url "$api/zonas/$($created.zonaId)" }

# =========================
# Reporte final
# =========================
$passed = @($results | Where-Object { $_.success }).Count
$failed = @($results | Where-Object { -not $_.success }).Count

$summary = [pscustomobject]@{
    baseUrl = $BaseUrl
    generatedAt = (Get-Date).ToString("s")
    total = $results.Count
    passed = $passed
    failed = $failed
    details = $results
}

$summary | ConvertTo-Json -Depth 10 | Set-Content -Path $jsonReport -Encoding UTF8

$txt = @()
$txt += "REPORTE DE PRUEBAS API"
$txt += "Base URL: $BaseUrl"
$txt += "Fecha: $((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))"
$txt += ""
$txt += "Resumen:"
$txt += "  Total  : $($summary.total)"
$txt += "  Exitos : $($summary.passed)"
$txt += "  Fallos : $($summary.failed)"
$txt += ""
$txt += "Detalle:"
foreach ($r in $results) {
    $state = if ($r.success) { "OK" } else { "FAIL" }
    $txt += "[$state] $($r.method) $($r.url) -> $($r.statusCode) :: $($r.name) :: $($r.message)"
}
$txt | Set-Content -Path $txtReport -Encoding UTF8

Write-Host ""
Write-Host "Pruebas finalizadas." -ForegroundColor Green
Write-Host "JSON: $jsonReport"
Write-Host "TXT : $txtReport"
Write-Host "Resumen -> Total: $($summary.total) | OK: $($summary.passed) | FAIL: $($summary.failed)"

if ($failed -gt 0) {
    exit 1
} else {
    exit 0
}
