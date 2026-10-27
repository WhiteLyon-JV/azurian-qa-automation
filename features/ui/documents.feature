# language: es
@ui
Característica: Gestión de documentos desde el portal
  Como participante del laboratorio
  Quiero gestionar documentos desde el portal
  Para mantener sus datos actualizados

  Antecedentes:
    Dado que he iniciado sesión en el portal

  @crear
  Esquema del escenario: UI-CRUD-01-<caso> · Crear un documento <tipoDte> desde el portal
    Cuando emito desde el portal un documento con los siguientes datos:
      | tipoDte      | <tipoDte>    |
      | rutReceptor  | único válido |
      | monto        | <monto>      |
      | fechaEmision | 2026-09-28   |
    Entonces veo el aviso de creación exitosa
    Y la fila del documento muestra todos sus datos y el estado pendiente

    Ejemplos:
      | caso | tipoDte | monto  |
      | 33   | DTE 33  | 450000 |
      | 34   | DTE 34  | 780000 |
      | 39   | DTE 39  | 120000 |

  @leer
  Escenario: UI-CRUD-02 · Consultar el detalle de un documento propio
    Dado que tengo varios documentos propios del mismo receptor en el portal
    Cuando filtro en el portal por su receptor y tipo
    Entonces la tabla muestra los documentos esperados
    Cuando abro el detalle del documento elegido por su folio
    Entonces veo los datos esperados en el detalle del documento

  @editar
  Escenario: UI-CRUD-03 · Editar un documento propio desde el portal
    Dado que tengo un documento propio pendiente en el portal
    Cuando modifico sus datos desde el portal:
      | monto         | 625000                                 |
      | observaciones | Documento corregido por el participante |
    Entonces veo el aviso de edición exitosa
    Y la fila muestra los datos actualizados
    Y los cambios permanecen después de recargar el portal

  @eliminar
  Escenario: UI-CRUD-04 · Eliminar un documento propio desde el portal
    Dado que tengo un documento propio pendiente en el portal
    Cuando elimino el documento desde el portal y confirmo la acción
    Entonces veo el aviso de eliminación exitosa
    Y la fila del documento desaparece y el listado filtrado queda vacío
    Y el documento sigue ausente después de recargar el portal
