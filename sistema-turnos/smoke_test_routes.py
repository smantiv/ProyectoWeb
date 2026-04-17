import sys
from typing import Iterable
import requests

BASE_URL = "http://localhost:8080"

ROUTES = [
    ("/", ["Sistema", "Vigilancia", "Escolar"]),
    ("/zonas", ["Gestión de Zonas"]),
    ("/profesores", ["Gestión de Profesores"]),
    ("/turnos", ["Gestión de Turnos"]),
    ("/reportar-incidente", ["Reportar Incidente"]),
    ("/registrar-punto", ["Registrar Punto"]),
]

TIMEOUT_SECONDS = 5


def check_route(path: str, expected_snippets: Iterable[str]) -> bool:
    url = f"{BASE_URL}{path}"
    try:
        response = requests.get(url, timeout=TIMEOUT_SECONDS)
    except requests.RequestException as e:
        print(f"❌ {path} -> error de conexión: {e}")
        return False

    if response.status_code != 200:
        print(f"❌ {path} -> status {response.status_code}")
        return False

    body = response.text
    missing = [snippet for snippet in expected_snippets if snippet not in body]

    if missing:
        print(f"⚠️  {path} -> status 200, pero faltan textos esperados: {missing}")
        return False

    print(f"✅ {path} -> OK")
    return True


def main() -> int:
    print(f"Probando rutas en {BASE_URL}\n")
    results = [check_route(path, snippets) for path, snippets in ROUTES]

    passed = sum(results)
    total = len(results)

    print(f"\nResultado: {passed}/{total} rutas OK")

    return 0 if all(results) else 1


if __name__ == "__main__":
    sys.exit(main())