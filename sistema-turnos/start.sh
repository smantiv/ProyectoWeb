#!/bin/bash
# 🚀 INICIO RÁPIDO - Sistema de Gestión de Turnos

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   SISTEMA DE GESTIÓN DE TURNOS - INICIO RÁPIDO                ║"
echo "║   React 18 + Spring Boot 4.0.5 + MySQL                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 PRECONDICIONES:${NC}"
echo "1. MySQL corriendo en localhost:3306"
echo "2. Node.js v16+ instalado"
echo "3. Java 21+ instalado"
echo ""

echo -e "${BLUE}🔧 CONFIGURACIÓN:${NC}"

# Crear base de datos
echo -e "${YELLOW}→ Creando base de datos MySQL...${NC}"
mysql -u root -e "CREATE DATABASE IF NOT EXISTS sistema_turnos;" 2>/dev/null
echo -e "${GREEN}✓ Base de datos creada${NC}"
echo ""

# Backend
echo -e "${BLUE}🏃 INICIANDO BACKEND (Spring Boot)${NC}"
cd sistema-turnos
echo -e "${YELLOW}→ Compilando Maven...${NC}"
mvn clean install > /dev/null 2>&1 &
MAVEN_PID=$!
echo -e "${GREEN}✓ Maven iniciado (PID: $MAVEN_PID)${NC}"
echo ""

echo -e "${BLUE}🏃 INICIANDO FRONTEND (React + Vite)${NC}"
echo -e "${YELLOW}→ Instalando dependencias npm...${NC}"
npm install > /dev/null 2>&1 &
NPM_PID=$!
echo -e "${GREEN}✓ NPM iniciado (PID: $NPM_PID)${NC}"
echo ""

echo -e "${BLUE}⏳ Esperando compilación...${NC}"
wait $MAVEN_PID
wait $NPM_PID
echo -e "${GREEN}✓ Compilación completada${NC}"
echo ""

echo -e "${BLUE}🚀 LANZANDO SERVICIOS${NC}"
echo -e "${YELLOW}→ Backend en Terminal 1...${NC}"
mvn spring-boot:run &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend iniciado (PID: $BACKEND_PID)${NC}"
sleep 3
echo ""

echo -e "${YELLOW}→ Frontend en Terminal 2...${NC}"
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend iniciado (PID: $FRONTEND_PID)${NC}"
sleep 3
echo ""

echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                ✅ SISTEMA LISTO PARA USAR                     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📌 ACCESOS:${NC}"
echo "  🌐 Frontend:  http://localhost:3000"
echo "  ⚙️  Backend:   http://localhost:8080"
echo "  📊 API:       http://localhost:8080/api"
echo ""
echo -e "${BLUE}🔐 CREDENCIALES DE PRUEBA:${NC}"
echo "  Admin:"
echo "    Email:     admin@test.com"
echo "    Password:  1234"
echo ""
echo "  Profesor:"
echo "    Email:     maria@test.com"
echo "    Password:  1234"
echo ""
echo "  Coordinador:"
echo "    Email:     coordinador@test.com"
echo "    Password:  1234"
echo ""
echo -e "${BLUE}📝 PROCESOS ACTIVOS:${NC}"
echo "  Backend PID:  $BACKEND_PID"
echo "  Frontend PID: $FRONTEND_PID"
echo ""
echo -e "${YELLOW}💡 Para detener:${NC}"
echo "  kill $BACKEND_PID"
echo "  kill $FRONTEND_PID"
echo ""
echo -e "${BLUE}📚 DOCUMENTACIÓN:${NC}"
echo "  Ver: PROYECTO_COMPLETO.md"
echo ""

# Mantener procesos activos
wait
