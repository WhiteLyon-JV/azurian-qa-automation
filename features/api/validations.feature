# language: es
@api @crear @validaciones
Característica: Validación de la emisión de documentos
  Como participante del laboratorio
  Quiero que se rechacen documentos con datos inválidos
  Para mantener información tributaria consistente

  Antecedentes:
    Dado que tengo una sesión válida del laboratorio
    Y una ejecución aislada para mis documentos

  @datosInvalidos
  Esquema del escenario: API-VAL-<caso> · Rechazar la emisión con <condicion>
    Cuando intento emitir un documento con "<condicion>"
    Entonces se rechaza la emisión por datos inválidos en "<campo>"

    Ejemplos:
      | caso | condicion                              | campo       |
      | 01   | monto ausente                          | monto       |
      | 02   | RUT con dígito verificador inválido     | rutReceptor |

  @folioDuplicado
  Escenario: API-VAL-03 · Rechazar un folio duplicado
    Dado que tengo un documento propio pendiente
    Cuando intento emitir otro documento con el mismo folio
    Entonces se rechaza la emisión por folio duplicado

  @sinToken
  Escenario: API-VAL-04 · Rechazar una petición sin autenticación
    Cuando intento emitir un documento sin autenticar la petición
    Entonces se rechaza la emisión por falta de autenticación
