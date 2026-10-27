# Azurian QA Automation

Proyecto de pruebas automatizadas desarrollado por [Javier Vieytes](https://github.com/WhiteLyon-JV) para comprobar la creación, consulta, edición y eliminación de documentos tributarios en el portal Azurian.

La suite contiene **53 escenarios: 15 de API y 38 de interfaz web (UI)**. En la última ejecución, realizada el **27 de octubre de 2026**, aprobaron los 53 escenarios y los 352 pasos informados por Cucumber.

## Antes de empezar: hay dos proyectos

Para ejecutar estas pruebas se necesitan dos carpetas:

| Carpeta | Qué contiene | Para qué se usa |
| --- | --- | --- |
| `azurian-qa-evaluation` | La aplicación de laboratorio proporcionada por Azurian | Iniciar el portal que vamos a probar |
| `azurian-qa-automation` | La suite de pruebas de este repositorio | Ejecutar las pruebas y generar el reporte |

**El laboratorio pertenece a un repositorio privado de Bitbucket.** Se necesita una cuenta con acceso autorizado para descargarlo. Tener acceso a este GitHub público permite descargar las pruebas, pero no concede acceso al laboratorio. Si la descarga de Bitbucket falla por permisos, se debe solicitar acceso al responsable del laboratorio.

Esta guía explica la **primera instalación desde cero**. Si ya tienes las dos carpetas instaladas, consulta [cómo volver a ejecutar las pruebas](#volver-a-ejecutar-las-pruebas-otro-día).

Los comandos están escritos para **Git Bash en Windows**. Copia solamente el contenido de los bloques, sin agregar el símbolo `$` del terminal.

## 1. Preparar el equipo

Se necesita:

- **Git y Git Bash**, para descargar los proyectos y ejecutar estos comandos.
- **Node.js 22 con npm**. La suite se verificó con Node.js 22.20.0.
- **Docker Desktop**, abierto y con el motor de contenedores en funcionamiento.
- **Java 17**, para generar y abrir los reportes de Allure.
- Acceso al repositorio privado del laboratorio, mencionado arriba.

Comprueba las instalaciones desde Git Bash:

```bash
git --version
node --version
npm --version
docker version
docker compose version
java -version
```

Cada comando debe mostrar su versión; comprueba que Node.js sea de la versión 22 y Java de la versión 17. En `docker version` deben aparecer las secciones `Client` y `Server`; si falta el servidor, abre Docker Desktop y espera a que termine de iniciar. Si un comando indica `command not found`, instala esa herramienta y vuelve a abrir Git Bash.

## 2. Iniciar la aplicación de Azurian — terminal 1

Abre una terminal de Git Bash. Crea una carpeta para guardar ambos proyectos:

```bash
mkdir -p ~/Documents/azurian
cd ~/Documents/azurian
```

Descarga el laboratorio y entra en su carpeta:

```bash
git clone \
  --branch feature/evaluation-qa-auto \
  --single-branch \
  https://bitbucket.org/jiraazurian/com-azurian-qa-evaluacion.git \
  azurian-qa-evaluation
cd azurian-qa-evaluation
```

La barra `\` al final de cada línea permite escribir el mismo comando en varias líneas de Git Bash. La rama seleccionada es la que contiene la aplicación y su archivo `compose.yaml`.

Inicia la aplicación:

```bash
docker compose up --build
```

La primera ejecución puede tardar mientras Docker prepara la aplicación. **Deja esta terminal abierta y el laboratorio funcionando** durante las pruebas. Los comandos siguientes se ejecutan en una segunda terminal.

Si aparece un error porque el puerto 3000 está ocupado o reservado, consulta [cómo usar el puerto 3100](#si-el-puerto-3000-no-está-disponible).

## 3. Descargar e instalar las pruebas — terminal 2

Abre **otra terminal de Git Bash**. Primero comprueba que la aplicación está disponible:

```bash
curl -i http://localhost:3000/api/health
```

El resultado esperado es `HTTP/1.1 200 OK` y el cuerpo `{"status":"ok"}`. También puedes abrir [el login del portal](http://localhost:3000/login) en el navegador. Si no responde, revisa la terminal 1 antes de continuar.

Desde esta segunda terminal, descarga las pruebas en la misma carpeta de trabajo:

```bash
cd ~/Documents/azurian
git clone https://github.com/WhiteLyon-JV/azurian-qa-automation.git
cd azurian-qa-automation
npm install
npm run browsers:install
npm run typecheck
```

- `npm install` instala las dependencias del proyecto.
- `browsers:install` descarga Chromium, el navegador que utilizarán las pruebas.
- `typecheck` comprueba el código TypeScript. Debe terminar sin errores.

Las carpetas quedan una al lado de la otra:

```text
Documents/azurian/
  azurian-qa-evaluation/    Aplicación de Azurian; terminal 1
  azurian-qa-automation/    Pruebas automatizadas; terminal 2
```

**Desde este punto, todos los comandos de npm se ejecutan en `azurian-qa-automation`, en la terminal 2.** Si guardaste los proyectos en otra ubicación, utiliza esas carpetas en lugar de las rutas de este ejemplo.

## 4. Ejecutar la suite completa — terminal 2

Prepara una carpeta de resultados nueva y ejecuta las pruebas:

```bash
npm run results:prepare
npm test
```

La suite inicia sesión por sí misma y prepara sus datos. No es necesario iniciar sesión manualmente ni crear documentos antes de ejecutarla. Chromium trabaja sin mostrar una ventana de forma predeterminada.

La ejecución puede tardar varios minutos. Al finalizar, el resultado esperado para esta versión es:

```text
53 scenarios (53 passed)
352 steps (352 passed)
```

Si una prueba falla, conserva la salida y genera el reporte del paso siguiente para revisar el diagnóstico.

**Ejecuta `results:prepare` antes de las pruebas.** Ese comando archiva los resultados anteriores; ejecutarlo después movería los resultados que acabas de obtener.

## 5. Generar y abrir el reporte — terminal 2

Cuando las pruebas hayan terminado, ejecuta:

```bash
npm run report:generate
npm run report:open
```

Allure abrirá un reporte local en el navegador. Si no se abre automáticamente, copia en el navegador la dirección que muestre la terminal.

En el reporte puedes consultar cada escenario, sus pasos, los resultados esperados y obtenidos, las respuestas de la API y las capturas. Deja abierta la terminal 2 mientras lo consultas. Al terminar, usa **Ctrl+C en la terminal 2** para cerrar el servidor del reporte.

## Otras formas de ejecutar las pruebas

Estos comandos también se ejecutan desde `azurian-qa-automation`. La aplicación debe seguir funcionando en la terminal 1.

| Qué quieres ejecutar | Comando |
| --- | --- |
| Todas las pruebas | `npm test` |
| Todas, con dos procesos en paralelo | `npm run test:parallel` |
| Sólo API, sin abrir un navegador | `npm run test:api` |
| Sólo interfaz web | `npm run test:ui` |
| Casos relacionados con crear documentos | `npm run test:crear` |
| Casos relacionados con leer documentos | `npm run test:leer` |
| Casos relacionados con editar documentos | `npm run test:editar` |
| Casos relacionados con eliminar documentos | `npm run test:eliminar` |
| Comprobar TypeScript | `npm run typecheck` |

Para ver la ventana del navegador mientras se ejecutan las pruebas de interfaz:

```bash
HEADLESS=false npm run test:ui
```

Para combinar etiquetas de Cucumber, por ejemplo API y edición:

```bash
npm test -- --tags "@api and @editar"
```

Para ejecutar un único escenario, utiliza su ID:

```bash
npm test -- --name "^API-CRUD-01-33 ·"
```

El símbolo `·` forma parte del título; copia el comando completo. Los IDs pueden consultarse en los archivos `.feature` de `features/api` y `features/ui`.

Para seleccionar validaciones concretas:

| Grupo | Comando |
| --- | --- |
| Validaciones de datos en API | `npm test -- --tags "@api and @validaciones"` |
| Errores de campos del formulario | `npm test -- --tags "@ui and @erroresFormulario"` |
| Habilitación y limpieza del correo | `npm test -- --tags "@correoCondicional"` |
| Correo obligatorio o con formato inválido | `npm test -- --tags "@correoValidacion"` |
| Archivos adjuntos | `npm test -- --tags "@adjuntos"` |
| Longitud de las observaciones | `npm test -- --tags "@observaciones"` |
| Preparación por API y comprobación en pantalla | `npm test -- --tags "@hibrido"` |
| Reutilización y renovación del token | `npm test -- --tags "@vigenciaToken"` |

## Configuración y problemas frecuentes

### Si el puerto 3000 no está disponible

En la **terminal 1**, dentro de `azurian-qa-evaluation`, inicia el laboratorio en el puerto 3100:

```bash
APP_PORT=3100 docker compose up --build
```

En la **terminal 2**, dentro de `azurian-qa-automation`, configura la URL de las pruebas y comprueba el servicio:

```bash
export BASE_URL=http://localhost:3100
curl -i http://localhost:3100/api/health
```

Después continúa con la instalación y ejecución de la suite. El login estará en `http://localhost:3100/login`. La variable `BASE_URL` permanece en esa terminal; si abres otra, debes configurarla de nuevo. Si ya usas otro puerto, aplica el mismo procedimiento con su número.

### Variables disponibles

Con el laboratorio en el puerto 3000 y las credenciales originales puedes seguir la guía sin cambiar nada. Los valores se centralizan en `src/config/environment.ts` y se leen de las variables de la terminal.

| Variable | Valor por defecto | Qué permite cambiar |
| --- | --- | --- |
| `BASE_URL` | `http://localhost:3000` | Dirección de la aplicación |
| `LAB_USERNAME` | `admin@azurian.com` | Usuario del laboratorio |
| `LAB_PASSWORD` | `Azurian2026!` | Contraseña del laboratorio |
| `HEADLESS` | `true` | Usar `false` para ver Chromium |
| `ALLURE_RESULTS_DIR` | `allure-results` | Carpeta de resultados, leída en `cucumber.cjs` |

La suite de automatización **no carga automáticamente un archivo `.env`**. Para cambiar un valor en Git Bash se puede usar `export`, como en el ejemplo del puerto 3100.

Si utilizas PowerShell, la asignación equivalente es `$env:BASE_URL = 'http://localhost:3100'`. Los bloques de esta guía utilizan la sintaxis de Git Bash.

### Volver a ejecutar las pruebas otro día

No necesitas descargar los proyectos ni instalar de nuevo las dependencias cada vez. Abre Docker Desktop y usa dos terminales:

**Terminal 1: iniciar el laboratorio**, usando la carpeta donde lo guardaste:

```bash
cd ~/Documents/azurian/azurian-qa-evaluation
docker compose up -d
```

**Terminal 2: entrar en las pruebas**, comprobar la aplicación y repetir los pasos de ejecución y reporte:

```bash
cd ~/Documents/azurian/azurian-qa-automation
curl -i http://localhost:3000/api/health
npm run results:prepare
npm test
npm run report:generate
npm run report:open
```

Estas rutas corresponden a la primera instalación de esta guía. Si tus carpetas están directamente en `~/Documents` o en otro lugar, utiliza su ubicación real. Si usaste el puerto 3100, inicia el laboratorio en la terminal 1 con `APP_PORT=3100 docker compose up -d`. En la terminal 2 configura de nuevo `export BASE_URL=http://localhost:3100` y utiliza `http://localhost:3100/api/health` para comprobarlo.

Para detener el laboratorio al terminar, ejecuta `docker compose down` dentro de `azurian-qa-evaluation`.

### Guardar un reporte de sólo API en otra carpeta

Este procedimiento es opcional; permite separar sus resultados del reporte completo:

```bash
ALLURE_RESULTS_DIR=allure-results-api npm run test:api
npx allure generate allure-results-api --clean -o allure-report-api
npx allure open allure-report-api
```

Reutilizar la misma carpeta acumula resultados. Para un reporte completo de una sola ejecución, utiliza el procedimiento de los pasos 4 y 5 con `results:prepare`.

## Información técnica de la solución

La guía de ejecución termina arriba. Esta sección amplía la cobertura, la arquitectura y las decisiones de implementación.

<details>
<summary>Ver cobertura de escenarios y arquitectura</summary>

## Cobertura del CRUD

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

El CRUD se comprueba mediante 13 escenarios ejecutables: 7 de API y 6 de UI. La creación se ejecuta con los tres tipos de DTE admitidos.

## Validaciones y escenarios complementarios

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

Estas comprobaciones reúnen 40 escenarios. Junto con los 13 escenarios de CRUD, completan los 53 casos ejecutables de la suite.

Los flujos híbridos preparan documentos por API y comprueban en UI el folio, RUT y monto inyectados. Se utilizan en lectura, edición, eliminación y protección del documento aceptado. El caso `@hibrido` permite ejecutar explícitamente este último flujo.

Los archivos de respaldo se generan en memoria para comprobar las reglas de nombre, extensión y tamaño aplicadas por el formulario. Estas pruebas no comprueban la estructura interna de un PDF o XML.

## Sesión, aislamiento y paralelismo

`AuthSession` obtiene un token mediante login real y reutiliza la sesión mientras conserva vigencia suficiente. Los clientes de documentos consultan el proveedor del token antes de cada solicitud. La renovación utiliza `expiresIn` y un margen de hasta 30 segundos; si varias peticiones requieren renovar a la vez, comparten el mismo login pendiente. Cada escenario tiene su propia sesión.

Las cuatro pruebas de vigencia inyectan un reloj controlado únicamente en esta clase. Las llamadas de login, creación y consulta siguen siendo reales. Se comprueban la política de renovación del cliente, el número de logins y el cuerpo completo de cada consulta; no se adelanta el reloj del servidor ni se espera al vencimiento real del JWT. La política implementada es renovación preventiva; no incluye reintentar automáticamente operaciones después de un `401` del servidor.

La ejecución con `npm run test:parallel` utiliza dos procesos de Cucumber. Cada escenario crea sus propios contextos de API o navegador, utiliza su propio `runId` y cierra los recursos al terminar. La regresión completa de 53 escenarios se verificó con esta modalidad.

Los límites de espera se centralizan en `src/config/timeouts.ts`: 15 segundos para peticiones API, acciones y expectativas UI; 30 segundos para navegación y para cada step de Cucumber. Todos los Page Objects y verificadores UI importan el `expect` configurado en `src/support/ui-expect.ts`. Estos límites son tiempos máximos de espera de condiciones observables, no pausas fijas. La lectura de evidencia de diagnóstico tiene un límite separado de 1 segundo.

## Arquitectura del proyecto

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

## Contenido del repositorio

Este repositorio contiene los escenarios Gherkin, las definiciones de pasos, los Page Objects, los clientes API, los generadores de datos y los verificadores que componen la suite. También incluye la configuración de TypeScript y Cucumber, el archivo de versiones de dependencias y los scripts de ejecución y reportes.

El portal Azurian se ejecuta por separado a partir del repositorio del laboratorio indicado en el paso 2. Para reproducir los resultados se necesita ese laboratorio en funcionamiento y ejecutar los comandos de instalación, pruebas y Allure descritos en este documento.

Las dependencias instaladas, los resultados, los reportes HTML y los archivos temporales se generan localmente y quedan excluidos mediante `.gitignore`.

El archivo `package-lock.json` conserva las versiones de las dependencias; `npm ci` permite reinstalarlas desde ese archivo. TypeScript está fijado en 5.9.3 para mantener compatibilidad con ts-node 10.9.2.

`results:prepare` mueve los resultados anteriores a `work/allure-history`. `report:generate` reemplaza el HTML de `allure-report` y `report:open` lo sirve localmente. El archivo auxiliar `allure-formatter.log` puede quedar vacío: las evidencias se escriben en la carpeta de resultados configurada.

</details>
