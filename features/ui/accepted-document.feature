# language: es
@ui @aceptado @hibrido
Característica: Protección de documentos aceptados
  Como participante del laboratorio
  Quiero conservar los documentos aceptados sin modificaciones
  Para respetar las restricciones de su estado

  Antecedentes:
    Dado que he iniciado sesión en el portal

  Escenario: UI-EST-01 · Bloquear acciones de un documento aceptado
    Dado que tengo un documento propio aceptado en el portal
    Entonces su fila muestra el estado aceptado y sus datos
    Y sus acciones de editar, eliminar y enviar al SII están deshabilitadas
    Y puedo consultar el detalle completo del documento aceptado
    Cuando recargo el portal y busco el documento aceptado
    Entonces su fila muestra el estado aceptado y sus datos
    Y sus acciones de editar, eliminar y enviar al SII están deshabilitadas
