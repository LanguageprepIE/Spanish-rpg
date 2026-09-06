# El misterio de Salamanca

## Version 0.2 — point-and-click prototype

The game surface has been rebuilt as an original point-and-click adventure. The player character now walks across the scene when the player taps or clicks, approaches visible NPCs before conversations, and enters locations through scene hotspots. Mission guidance and controls are in English; Spanish remains the language used for conversations, clues and puzzles.

All character artwork is original and stored locally. The project does not copy characters, names, dialogue, interface artwork or other protected material from existing adventure games.

Vertical slice de un RPG/aventura educativa de español para alumnado de secundaria en Irlanda.

## Ejecutar

No necesita instalación ni compilación. Abre `index.html` en un navegador moderno o publica la raíz del repositorio con GitHub Pages.

## Arquitectura

- `index.html`: punto de entrada y orden de carga.
- `css/styles.css`: interfaz responsive para ratón y pantalla táctil.
- `js/data.js`: personajes, localizaciones, diálogos, objetos y contenido lingüístico.
- `js/state.js`: esquema de partida extensible y migración/validación básica.
- `js/save.js`: autoguardado local y archivo JSON portátil.
- `js/ui.js`: renderizado de pantallas, HUD, diálogo y modales.
- `js/app.js`: loop de juego, reglas, misiones y eventos.
- `assets/`: recursos visuales locales.

## Vertical slice

El jugador explora tres localizaciones, habla con varios NPCs, resuelve un pedido mediante comprensión de precios y restricciones, reúne pistas e identifica a la persona que tiene una carpeta desaparecida.

El aprendizaje está integrado en acciones del mundo: peticiones educadas, ropa y descripción física, horarios, direcciones, comida y precios.

## Guardado

- Autoguardado con `localStorage`.
- Exportación e importación de `Spanish_RPG_Save.json`.
- El estado incluye campos preparados para capítulos, misiones, inventario, decisiones, conversaciones, logros y progreso lingüístico.

El futuro Save Code podrá serializar una versión compacta del mismo objeto de estado sin cambiar el resto del motor.
