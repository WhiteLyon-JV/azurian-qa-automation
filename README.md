# Azurian QA Automation

Automatización del ciclo de vida de documentos tributarios del laboratorio Azurian, mediante UI y API.

Stack: Playwright, TypeScript estricto, Cucumber/Gherkin, Allure, Page Object Model y clientes API tipados.

Ejecución completa verificada el 20 de octubre de 2026: **53 escenarios y 352 pasos aprobados**, con dos procesos en paralelo. La suite contiene **15 escenarios API y 38 UI**. El tiempo de ejecución depende del equipo y de la latencia del laboratorio.

## Requisitos

- Node.js 22 o 24, o una versión admitida de Node.js 26 o superior. El entorno se preparó con Node.js 22.20.0.
- npm y Git.
- Docker Desktop con Docker Compose para ejecutar el laboratorio.
- Java 17 disponible en el PATH para generar y abrir Allure Report 2.
- Acceso al repositorio privado del laboratorio. Esta solución no incluye el código del laboratorio.

## Levantar el laboratorio

Desde una carpeta distinta a la de esta solución:

```bash
git clone --branch feature/evaluation-qa-auto --single-branch https://bitbucket.org/jiraazurian/com-azurian-qa-evaluacion.git azurian-qa-evaluation
cd azurian-qa-evaluation
docker compose up --build
```

La rama indicada contiene `compose.yaml`. Mantener el laboratorio funcionando durante las pruebas.

Comprobar en otra terminal:

```bash
curl -i http://localhost:3000/api/health
```

Debe responder `200` con `{"status":"ok"}`. El portal se encuentra en `http://localhost:3000/login`.

Si Windows impide publicar el puerto 3000, ejecutar desde Git Bash en la carpeta del laboratorio:

```bash
APP_PORT=3100 docker compose up --build
```

En ese caso, configurar `BASE_URL=http://localhost:3100` para las pruebas.

## Instalar la solución

Desde la raíz de este repositorio:

```bash
npm install
npm run browsers:install
npm run typecheck
```

El navegador utilizado es Chromium. Se conserva `package-lock.json` en el repositorio; `npm ci` permite reinstalar exactamente sus versiones.

TypeScript está fijado en 5.9.3 para mantener compatibilidad con ts-node 10.9.2.

## Configuración

Se centraliza en `src/config/environment.ts`. Los valores se leen de las variables del proceso; no se carga automáticamente un archivo `.env`.

| Variable | Valor por defecto | Uso |
| --- | --- | --- |
| `BASE_URL` | `http://localhost:3000` | URL del laboratorio |
| `LAB_USERNAME` | `admin@azurian.com` | Usuario del laboratorio |
| `LAB_PASSWORD` | `Azurian2026!` | Contraseña del laboratorio |
| `HEADLESS` | `true` | Usar `false` para mostrar Chromium |
| `ALLURE_RESULTS_DIR` | `allure-results` | Carpeta de resultados; se configura en `cucumber.cjs` |

Los ejemplos de asignación de variables de este README utilizan Git Bash en Windows.

```bash
BASE_URL=http://localhost:3100 npm test
HEADLESS=false npm run test:ui
```

En PowerShell, asignar las variables con `$env:BASE_URL = 'http://localhost:3100'` antes de ejecutar npm. A diferencia de las asignaciones en línea de Git Bash, las de PowerShell permanecen en esa sesión hasta cambiarlas o quitarlas.

## Ejecución

```bash
# Suite completa
npm test

# Suite completa con dos procesos en paralelo
npm run test:parallel

# Una capa
npm run test:api
npm run test:ui

# Una operación en ambas capas
npm run test:crear
npm run test:leer
npm run test:editar
npm run test:eliminar

# Combinación de tags
npm test -- --tags "@api and @editar"

# Un escenario individual, incluido un ejemplo del esquema
npm test -- --name "^API-CRUD-01-33 ·"

# Comprobación de TypeScript
npm run typecheck
```

Cada escenario tiene un ID y un título único. Los ejemplos de creación se identifican por `33`, `34` y `39` en su ID.

Para ejecutar las comprobaciones adicionales:

```bash
# Validaciones negativas de API
npm test -- --tags "@api and @validaciones"

# Errores asociados a campos del formulario
npm test -- --tags "@ui and @erroresFormulario"

# Habilitación y limpieza del correo de contacto
npm test -- --tags "@correoCondicional"

# Correo obligatorio y formato inválido
npm test -- --tags "@correoValidacion"

# Tipos de adjuntos y límite de tamaño
npm test -- --tags "@adjuntos"

# Límite y contador de observaciones
npm test -- --tags "@observaciones"

# Documento aceptado: preparación API y verificación UI
npm test -- --tags "@hibrido"

# Reutilización, renovación y concurrencia de la sesión
npm test -- --tags "@vigenciaToken"

# Un caso individual de renovación
npm test -- --name "^API-AUTH-02 ·"
```

## Allure

Para obtener un reporte de una ejecución nueva, ejecutar desde la raíz del proyecto:

```bash
npm run results:prepare
npm test
npm run report:generate
npm run report:open
```

Se puede sustituir `npm test` por `npm run test:parallel` en este procedimiento. Preparar resultados antes de ejecutar las pruebas; hacerlo después archivaría la ejecución que se desea reportar.

`results:prepare` mueve los resultados anteriores de `allure-results` a `work/allure-history/` y crea una carpeta nueva. No borra las evidencias anteriores. Se usa antes de la ejecución que se desea reportar.

`report:generate` reemplaza el HTML de `allure-report`, pero no limpia los resultados de las pruebas. `report:open` sirve el reporte localmente; mantener abierta esa terminal y detener el servidor con Ctrl+C al terminar.

Las pruebas fallidas también generan resultados. Si `npm test` informa un fallo, se pueden ejecutar los comandos de generación y apertura para analizarlo.

Para reportar una ejecución guardada en otra carpeta:

```bash
npx allure generate allure-results-token-lifetime --clean -o allure-report-token-lifetime
npx allure open allure-report-token-lifetime
```

El reporte incluye comparaciones de esperado y recibido, respuestas API completas y capturas de UI. Las respuestas API incluyen URL e identificadores de diagnóstico. Los fallos de UI adjuntan una captura antes de cerrar el navegador.

La configuración mantiene el resumen en consola y dirige el reportador de Allure a una salida separada. El archivo auxiliar `allure-formatter.log` puede quedar vacío; los resultados se guardan en `allure-results`.

## Cobertura de la base obligatoria

| Capa | ID | Comprobaciones principales |
| --- | --- | --- |
| API | `API-CRUD-01-33/34/39` | Creación, `201`, cuerpo completo y consulta posterior |
| API | `API-CRUD-02` | Filtros por RUT y tipo, listado completo, selección por folio y detalle |
| API | `API-READ-404` | Documento inexistente, `404` y cuerpo completo del error |
| API | `API-CRUD-03` | PATCH, cuerpo completo, campos conservados y persistencia |
| API | `API-CRUD-04` | DELETE, `204` sin cuerpo, `404` posterior y listado vacío |
| UI | `UI-CRUD-01-33/34/39` | Login, emisión, aviso de éxito y fila exacta |
| UI | `UI-CRUD-02` | Filtros, selección de fila exacta y datos del detalle |
| UI | `UI-CRUD-03` | Edición, aviso, fila actualizada y persistencia al recargar |
| UI | `UI-CRUD-04` | Confirmación, aviso, desaparición, tabla vacía y ausencia al recargar |

La base contiene 13 escenarios ejecutables: 7 de API y 6 de UI.

## Cobertura adicional

| Capa | IDs | Casos | Comprobaciones |
| --- | --- | ---: | --- |
| API | `API-VAL-01/02` | 2 | Monto ausente y dígito verificador inválido: `400`, cuerpo completo, `code`, `details.field` y mensaje |
| API | `API-VAL-03` | 1 | Folio duplicado: `409` y error completo `DUPLICATE_FOLIO` |
| API | `API-VAL-04` | 1 | Petición sin token: `401`, error completo `UNAUTHORIZED` y encabezado de autenticación |
| API | `API-AUTH-01/02/03/04` | 4 | Reutilización del token, renovación en el umbral y al vencimiento estimado, y una sola renovación para tres consultas simultáneas |
| UI | `UI-VAL-01` a `UI-VAL-08` | 8 | Campos obligatorios, RUT inválido, valores cero y fechas fuera del rango; errores visibles asociados al campo |
| UI | `UI-COR-01` a `UI-COR-06` | 6 | Matriz de canal/copia, habilitación del correo y limpieza al desactivar su uso |
| UI | `UI-COR-VAL-01` a `UI-COR-VAL-06` | 6 | Correo obligatorio y formato inválido en las tres combinaciones que lo requieren |
| UI | `UI-ADJ-01` a `UI-ADJ-06` | 6 | PDF, XML y TXT permitidos; tamaño exacto de 2 MiB; extensión y tamaño rechazados, campo vacío tras el rechazo |
| UI | `UI-OBS-01` a `UI-OBS-05` | 5 | Observaciones vacías, 1, 299 y 300 caracteres, contador e impedimento de escribir un carácter adicional |
| UI | `UI-EST-01` | 1 | Documento aceptado: fila exacta, editar/eliminar/enviar deshabilitados, detalle habilitado y persistencia del bloqueo al recargar |

Son 40 escenarios adicionales, que junto a los 13 de la base completan los 53 escenarios ejecutables.

Los flujos híbridos preparan documentos por API y comprueban en UI el folio, RUT y monto inyectados. Se utilizan en lectura, edición, eliminación y protección del documento aceptado. El caso `@hibrido` permite ejecutar explícitamente este último flujo.

Los archivos de respaldo se generan en memoria para comprobar las reglas de nombre, extensión y tamaño aplicadas por el formulario. Estas pruebas no comprueban la estructura interna de un PDF o XML.

## Sesión, aislamiento y paralelismo

`AuthSession` obtiene un token mediante login real y reutiliza la sesión mientras conserva vigencia suficiente. Los clientes de documentos consultan el proveedor del token antes de cada solicitud. La renovación utiliza `expiresIn` y un margen de hasta 30 segundos; si varias peticiones requieren renovar a la vez, comparten el mismo login pendiente. Cada escenario tiene su propia sesión.

Las cuatro pruebas de vigencia inyectan un reloj controlado únicamente en esta clase. Las llamadas de login, creación y consulta siguen siendo reales. Se comprueban la política de renovación del cliente, el número de logins y el cuerpo completo de cada consulta; no se adelanta el reloj del servidor ni se espera al vencimiento real del JWT. La política implementada es renovación preventiva; no incluye reintentar automáticamente operaciones después de un `401` del servidor.

La ejecución con `npm run test:parallel` utiliza dos procesos de Cucumber. Cada escenario crea sus propios contextos de API o navegador, utiliza su propio `runId` y cierra los recursos al terminar. La regresión completa de 53 escenarios se verificó con esta modalidad.

Los límites de espera se centralizan en `src/config/timeouts.ts`: 15 segundos para peticiones API, acciones y expectativas UI; 30 segundos para navegación y para cada step de Cucumber. Todos los Page Objects y verificadores UI importan el `expect` configurado en `src/support/ui-expect.ts`. Estos límites son tiempos máximos de espera de condiciones observables, no pausas fijas. La lectura de evidencia de diagnóstico tiene un límite separado de 1 segundo.

## Organización

```text
features/
  api/                 Escenarios Gherkin de API
  ui/                  Escenarios Gherkin de UI
src/
  api/
    auth/              Proveedor de token y manejo de vigencia
    clients/           Clientes HTTP tipados
    data/              Preparación de datos API
    steps/             Definiciones de pasos API
    verifiers/         Verificación de respuestas completas
  ui/
    data/              Preparación por API para escenarios UI
    models/            Tipos de formulario, contacto y adjuntos
    pages/             Page Objects y localizadores semánticos
    steps/             Definiciones de pasos UI
    verifiers/         Verificaciones y evidencias UI
  shared/
    data/              Generadores de datos de negocio
    models/            Tipos compartidos
    reporting/         Helpers de evidencias
    time/              Reloj controlado para pruebas de vigencia
    verifiers/         Verificación del runId y selección por folio
  config/              URL y credenciales centralizadas
  support/             Contexto por escenario, preparación y limpieza
scripts/               Utilidades de ejecución
```

Cada escenario tiene un `runId` propio. API lo envía en `x-lab-run-id`; UI lo establece en `localStorage.azurian_lab_run_id` antes de abrir el portal. Los datos preparados por API para UI utilizan el mismo identificador del navegador.

Los escenarios generan folios y RUT válidos, y preparan sus propios documentos. En lectura, varios documentos comparten receptor de forma deliberada para verificar la selección por folio. Las pruebas no dependen de una ejecución anterior.

Los Page Objects utilizan roles, etiquetas y relaciones de tabla. La sincronización usa expectativas y eventos observables. No se alteran PostgreSQL, las latencias ni los datos semilla del laboratorio.

## Entrega

Publicar la solución con sus fuentes, archivos `.feature`, `package.json`, `package-lock.json`, configuración y este README. `.gitignore` excluye dependencias, reportes y resultados generados, archivos de entorno y trabajo temporal.

El enlace del repositorio público debe enviarse por el canal indicado en la convocatoria. La publicación y el envío no se realizan mediante los scripts de pruebas.
