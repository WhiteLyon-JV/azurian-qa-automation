# language: es
@api
Característica: Gestión de documentos tributarios
  Como participante del laboratorio
  Quiero gestionar mis documentos tributarios
  Para mantener sus datos actualizados

  Antecedentes:
    Dado que tengo una sesión válida del laboratorio
    Y una ejecución aislada para mis documentos

  @crear
  Esquema del escenario: API-CRUD-01-<caso> · Crear un documento <tipoDte>
    Cuando emito un documento tributario con los siguientes datos:
      | tipoDte      | <tipoDte>    |
      | rutReceptor  | único válido |
      | monto        | <monto>      |
      | fechaEmision | 2026-09-28   |
    Entonces el documento se crea correctamente en estado pendiente
    Y al consultarlo obtengo exactamente el documento creado

    Ejemplos:
      | caso | tipoDte | monto  |
      | 33   | DTE 33  | 450000 |
      | 34   | DTE 34  | 780000 |
      | 39   | DTE 39  | 120000 |

  @leer
  Escenario: API-CRUD-02 · Leer documentos filtrados por receptor y tipo
    Dado que tengo varios documentos propios del mismo receptor y distintos tipos
    Cuando busco sus documentos por receptor y tipo
    Entonces el listado contiene exactamente los documentos esperados
    Cuando consulto uno de ellos por su folio
    Entonces el detalle coincide completamente con el documento esperado

  @leer @inexistente
  Escenario: API-READ-404 · Consultar un documento inexistente
    Cuando consulto un documento que no existe en mi ejecución
    Entonces recibo el error completo de documento inexistente

  @editar
  Escenario: API-CRUD-03 · Editar un documento tributario propio
    Dado que tengo un documento propio pendiente
    Cuando actualizo sus datos:
      | monto         | 625000                                 |
      | observaciones | Documento corregido por el participante |
    Entonces el documento refleja los cambios y conserva los demás datos
    Y al consultarlo nuevamente los cambios persisten

  @eliminar
  Escenario: API-CRUD-04 · Eliminar un documento tributario propio
    Dado que tengo un documento propio pendiente
    Cuando elimino el documento
    Entonces la eliminación se confirma sin contenido
    Y al consultar el documento eliminado recibo el error completo de documento inexistente
    Y el documento ya no aparece en el listado de su receptor y tipo
