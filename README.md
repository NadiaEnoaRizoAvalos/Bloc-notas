# Bloc-notas

Una aplicación de notas en HTML, CSS y JavaScript, sin dependencias de producción.

## Iniciar

Con Python 3 instalado, ejecutar `python -m http.server 8000 --bind 127.0.0.1` desde esta carpeta y abrir http://localhost:8000. Usar siempre el mismo origen (host y puerto) para acceder a las mismas notas. Los módulos JavaScript requieren servir la página por HTTP.

## Usar

Completá título y contenido y pulsá **Guardar nota**. Podés editar una nota desde su tarjeta. Cancelar descarta los cambios de edición. Las notas sobreviven a una recarga mediante localStorage; no se sincronizan con otros dispositivos. Borrar los datos del sitio elimina las notas. Evitá guardar información sensible en equipos compartidos.

Si el almacenamiento está lleno o bloqueado, la app conserva el borrador y muestra el error. Si hay datos corruptos, bloquea el guardado para evitar sobrescribirlos.

## Pruebas

Con Node.js 20 o posterior: `npm test` (o `node --test`).

Comprobación manual: crear dos notas, recargar, editar una y recargar de nuevo; comprobar navegación por teclado y diseño a 375 px y 1280 px. Para simular un fallo de guardado en la consola del navegador: `Storage.prototype.setItem = () => { throw new DOMException('Cuota agotada', 'QuotaExceededError'); }`. Intentar guardar: el borrador debe seguir visible, debe aparecer el error y la lista no debe cambiar. Recargar restaura el método original.
