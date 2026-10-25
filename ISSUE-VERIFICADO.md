# Problema verificado: una pestaña desactualizada sobrescribe notas

Encontrado durante la revisión de la primera implementación, commit `8ce4065`. No existía código de aplicación en el repositorio inicial.

## Reproducción en la versión afectada

1. Servir la aplicación y abrir el mismo origen en dos pestañas A y B antes de guardar ninguna nota.
2. Crear y guardar una nota en A.
3. Sin recargar B, crear y guardar otra nota en B.
4. Recargar A: desaparece la primera nota.

Causa: cada pestaña escribía su copia completa de la lista, aunque el almacenamiento ya hubiera cambiado.

## Solución y evidencia

Antes de escribir, comparar los datos actuales con la lista cargada. Si difieren, rechazar el guardado, conservar el borrador y explicar que hay que copiarlo y recargar. La prueba `does not overwrite a note saved from another tab` falló antes del arreglo (Missing expected exception) y pasa después. Ejecutar `node --test`.

Límite: es una detección de estado desactualizado, no una transacción entre pestañas que escriben exactamente al mismo tiempo.

## Registrar y cerrar desde tu cuenta

1. Publicar la rama `feat/notas-locales` desde tu clon con `git push -u origin feat/notas-locales`. No hacer push a main.
2. En GitHub, entrar en NadiaEnoaRizoAvalos/Bloc-notas → Issues → New issue.
3. Título sugerido: «Una pestaña desactualizada sobrescribe notas guardadas desde otra pestaña».
4. Usar la reproducción, causa y evidencia anteriores. Aclarar que fue descubierto y corregido durante el desarrollo, y que afecta al commit `8ce4065`. No presentarlo como un fallo de main: main todavía no contiene la aplicación.
5. Agregar un comentario con el enlace al commit de corrección y el resultado de las siete pruebas. Una vez verificada la solución en la rama publicada, cerrar como resuelto y aclarar que está corregido en esa rama, pendiente de integración. También podés mantenerlo abierto hasta integrar un PR.

No se creó ni cerró ningún Issue automáticamente. El reconocimiento Quickdraw depende de GitHub; estos pasos no garantizan obtenerlo. El Issue debe documentar el problema real y la solución comprobada, sin simular fechas ni condiciones.
