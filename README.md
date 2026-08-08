# My Routine

Aplicación web mobile-first para registrar una rutina personal de hipertrofia de cinco días desde el gimnasio.

Permite guardar peso, repeticiones por serie, RIR, notas y ejercicios completados directamente en el navegador. No necesita cuenta, backend ni base de datos: todos los registros se conservan automáticamente en `localStorage` y se separan por semana ISO.

## Características principales

- Rutina fija de cinco días y 30 ejercicios.
- Navegación rápida entre sesiones.
- Registro de peso con decimales.
- Un input de repeticiones por cada serie prescrita.
- Registro opcional de RIR y notas.
- Indicadores discretos cuando las repeticiones están por encima o debajo del rango esperado.
- Marcado táctil de ejercicios completados.
- Progreso por día y progreso semanal derivado de los registros reales.
- Resumen diario listo para copiar y pegar en ChatGPT.
- Temporizador flotante con accesos de 90 segundos, 2 minutos y 3 minutos.
- Vibración y confirmación visual al finalizar el descanso, cuando el dispositivo lo permite.
- GIF, información de equipamiento e instrucciones de cada ejercicio.
- Persistencia automática, sin botón de guardado.
- Separación de registros por semana ISO, sin destruir semanas anteriores.
- Migración no destructiva del formato utilizado por el prototipo HTML original.
- Diseño accesible y optimizado para pantallas de aproximadamente 360–430 px.

## Stack

- React 19
- TypeScript strict
- Vite
- Motion for React (evolución de Framer Motion)
- CSS moderno sin framework de UI
- React Hooks
- `localStorage`
- Vitest
- ESLint

No utiliza:

- Backend o API propia.
- Base de datos.
- Autenticación.
- Redux, Zustand u otro gestor global.
- Tailwind CSS.
- Servicios externos, excepto los GIF de referencia de los ejercicios.

## Rutina incluida

| Día | Sesión | Enfoque | Ejercicios |
| --- | --- | --- | ---: |
| Lunes | Lower A | Cuádriceps + glúteos | 6 |
| Martes | Upper A | Espalda + pecho | 6 |
| Jueves | Lower B | Femorales + glúteos | 6 |
| Viernes | Upper B | Espalda + hombros + brazos | 6 |
| Sábado | Especialización | Glúteos + deltoides | 6 |

La definición completa de ejercicios, series, rangos, equipamiento y referencias visuales está centralizada en [`src/data/routine.ts`](src/data/routine.ts).

## Requisitos

- Node.js compatible con Vite 8.
- npm.
- Un navegador moderno con soporte para `localStorage`.
- Conexión a internet para cargar los GIF de referencia.

La aplicación y los registros siguen funcionando si los GIF no están disponibles.

## Instalación

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

Vite mostrará una dirección local y una dirección de red.

Para probar desde un teléfono:

1. Conecta el teléfono y la computadora a la misma red Wi-Fi.
2. Ejecuta `npm run dev`.
3. Abre desde el teléfono la dirección `Network` mostrada por Vite.
4. Si Windows solicita permiso para la red local, permite únicamente el acceso necesario para la red privada.

El servidor se inicia con `--host`, por lo que queda disponible dentro de la red local mientras el proceso esté activo.

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo accesible desde la red local. |
| `npm run build` | Ejecuta TypeScript y genera la SPA de producción en `dist/`. |
| `npm run lint` | Revisa el código con ESLint. |
| `npm run test` | Ejecuta las pruebas unitarias con Vitest. |

Antes de desplegar se recomienda ejecutar:

```bash
npm run lint
npm run test
npm run build
```

## Uso durante el entrenamiento

1. Selecciona el día desde la navegación superior.
2. Abre el GIF de un ejercicio si necesitas revisar la técnica.
3. Registra el peso utilizado.
4. Escribe las repeticiones de cada serie en su propio input.
5. Añade el RIR y una nota corta si aportan contexto.
6. Marca el ejercicio como completado.
7. Usa el temporizador flotante entre series.
8. Al finalizar, pulsa **Copiar resumen**.

Ejemplo de salida:

```text
Upper B
Espalda + hombros + brazos

Jalón / dominada asistida | 100 kg | 12/11/10 | RIR 2 | Buena técnica
Remo unilateral | 75 kg | 12/12/10 | RIR 1 | Mantener peso
Elevaciones laterales | 10 kg | 20/20/18/17 | RIR 1 | -
```

Para una plancha sin carga externa:

```text
Plancha | peso corporal | 45s/45s/40s | RIR 2 | -
```

## Persistencia local

La aplicación utiliza una única clave versionada:

```text
gym-workout:v1
```

Su estructura conceptual es:

```text
storage
└── weeks
    ├── 2026-W32
    │   └── days
    │       └── exercises
    └── 2026-W33
```

Esto permite crear una semana nueva sin sobrescribir las anteriores y deja una base sencilla para implementar una pantalla de historial en el futuro.

Se persisten automáticamente:

- Día seleccionado.
- Peso.
- Repeticiones por serie.
- RIR.
- Notas.
- Estado completado.

El progreso y los resúmenes no se guardan por separado: se calculan desde los registros reales para evitar estados duplicados o inconsistentes.

### Privacidad y alcance de los datos

Los registros permanecen únicamente en el navegador y dispositivo donde fueron creados. No se transmiten a ningún servidor propio.

Consideraciones importantes:

- Limpiar los datos del navegador elimina los registros.
- El modo privado puede descartar los datos al cerrar la sesión.
- Los registros no se sincronizan entre teléfono y computadora.
- Cambiar de navegador o dominio produce un almacenamiento independiente.

## Migración del prototipo HTML

El prototipo anterior almacenaba cada semana en claves como:

```text
gym-routine-v1:2026-08-03
```

La aplicación busca esas claves una sola vez, convierte sus registros al modelo actual y marca la migración como completada. Las claves originales no se eliminan.

La migración solo puede funcionar cuando el prototipo y la aplicación comparten el mismo origen. Por seguridad, un navegador no permite que una aplicación desplegada en otro dominio lea el `localStorage` de un archivo abierto mediante `file://` o de un dominio diferente.

## Arquitectura

```text
src/
├── components/
│   ├── DailySummary.tsx
│   ├── DayTabs.tsx
│   ├── ExerciseCard.tsx
│   ├── ExerciseModal.tsx
│   ├── RestTimer.tsx
│   └── WorkoutProgress.tsx
├── data/
│   └── routine.ts
├── hooks/
│   └── useWorkoutStorage.ts
├── lib/
│   ├── storage.ts
│   ├── week.ts
│   ├── workout-summary.ts
│   └── *.test.ts
├── types/
│   └── workout.ts
├── App.tsx
├── main.tsx
└── styles.css
```

### Flujo de datos

```text
Definición tipada de la rutina
            ↓
Registro de la semana actual
            ↓
Interfaz, progreso y resumen derivados
            ↓
Persistencia automática en localStorage
```

La lógica de lectura, validación, fallback, migración y escritura de `localStorage` está centralizada. Los componentes visuales no acceden directamente al almacenamiento.

## Modelo de datos

Los tipos principales están definidos en [`src/types/workout.ts`](src/types/workout.ts):

- `ExerciseDefinition`: definición inmutable del ejercicio.
- `ExerciseLog`: datos registrados durante el entrenamiento.
- `WorkoutDayLog`: registros de un día.
- `WorkoutWeek`: registros de una semana.
- `WorkoutStorage`: contenedor versionado de todas las semanas.

El proyecto utiliza TypeScript strict y no depende de `any` para modelar los datos.

## Resiliencia

- El contenido de `localStorage` se parsea dentro de `try/catch`.
- Un JSON corrupto no impide que la aplicación inicie.
- Los datos desconocidos o incompatibles se normalizan antes de llegar a la interfaz.
- Las repeticiones se ajustan al número de series definido por el ejercicio.
- La migración legacy no sobrescribe un registro ya existente en el formato nuevo.
- Reiniciar una semana no modifica semanas anteriores.

## Accesibilidad

La interfaz incluye:

- Botones y controles semánticos.
- Labels asociados a los inputs.
- Objetivos táctiles de al menos 44 px en acciones principales.
- Indicadores de estado mediante texto y símbolos, no solo color.
- Focus visible para navegación con teclado.
- Modal basado en `dialog`, cerrable mediante botón, `Escape` o interacción sobre el fondo.
- `aria-label`, `aria-live`, `aria-pressed` y progreso semántico donde corresponde.
- Compatibilidad con `prefers-reduced-motion`.

## Diseño

La dirección visual deriva de la identidad **The Cesar Times**:

- Estética editorial técnica.
- Paleta monocromática.
- Fondo oscuro preferido.
- Playfair Display para titulares.
- Geist para interfaz.
- Geist Mono para metadata y etiquetas.
- GIF en escala de grises.
- Jerarquía inspirada en publicaciones editoriales.

Las fuentes están empaquetadas dentro del build. No se descargan desde Google Fonts durante el uso.

## Referencias visuales y atribución

La aplicación utiliza un mapping estático con únicamente las referencias necesarias para esta rutina. No descarga ni procesa el dataset completo en cada carga.

- Dataset: [hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset)
- Recursos visuales: [Gym visual](https://gymvisual.com/)

> © Gym visual — https://gymvisual.com/

Los GIF pertenecen a sus respectivos titulares. Revisa los términos y avisos del dataset antes de utilizar esta aplicación con fines comerciales.

## Pruebas

La suite se concentra en lógica con riesgo real:

- Cálculo de semana ISO.
- Cruce de año calendario y año ISO.
- Formato del resumen de ejercicios.
- Formato especial para ejercicios por tiempo y peso corporal.
- Recuperación ante JSON corrupto.
- Migración del almacenamiento legacy sin eliminar el original.

Ejecutar:

```bash
npm run test
```

## Despliegue en Vercel

El proyecto genera una SPA estática estándar mediante Vite.

Configuración esperada al importar el repositorio en Vercel:

| Campo | Valor |
| --- | --- |
| Framework Preset | Vite |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

No requiere variables de entorno.

Después del despliegue, verifica desde el dominio HTTPS:

1. Cambio entre los cinco días.
2. Carga de los GIF.
3. Persistencia después de recargar y cerrar el navegador.
4. Copia del resumen al portapapeles.
5. Temporizador y vibración en móvil.

El Clipboard API funciona de forma más confiable bajo HTTPS. Vercel proporciona HTTPS en los despliegues normales.

## Alcance actual

Esta versión está deliberadamente limitada a una aplicación personal y local.

No incluye:

- Historial visual de semanas anteriores.
- Sincronización entre dispositivos.
- Edición de la rutina desde la interfaz.
- Series adicionales.
- Gráficos o analytics avanzados.
- Exportación de archivos.
- Usuarios o autenticación.
- Backend o almacenamiento en la nube.

Estas funcionalidades pueden añadirse posteriormente sin reemplazar el modelo de almacenamiento actual, pero no son necesarias para el objetivo principal: registrar un entrenamiento de forma rápida y confiable desde el teléfono.

## Estado del proyecto

- Build de producción: correcto.
- TypeScript strict: correcto.
- ESLint: correcto.
- Pruebas unitarias: 6 pruebas aprobadas.
- Dependencias auditadas durante la instalación: sin vulnerabilidades reportadas.

## Licencia

El repositorio no define actualmente una licencia propia. La ausencia de una licencia no modifica los derechos ni las atribuciones de los recursos visuales externos.
