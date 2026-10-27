# language: es
@api @leer @vigenciaToken
Característica: Manejo de la vigencia del token
  Como participante del laboratorio
  Quiero reutilizar y renovar mi sesión cuando corresponde
  Para consultar documentos con una autenticación vigente

  Antecedentes:
    Dado que tengo un documento propio y una sesión autenticada
    Y una ejecución aislada para mis documentos

  @tokenReutilizado
  Escenario: API-AUTH-01 · Reutilizar el token mientras está vigente
    Cuando consulto el documento en 2 ocasiones
    Entonces recibo el documento completo en cada consulta
    Y puedo seguir consultando sin volver a iniciar sesión

  @tokenRenovado
  Esquema del escenario: API-AUTH-<caso> · Mantener el acceso cuando la sesión <condicion>
    Cuando la sesión "<condicion>"
    Y consulto nuevamente el documento
    Entonces recibo el documento completo en cada consulta
    Y puedo seguir consultando con una única renovación de sesión

    Ejemplos:
      | caso | condicion                         |
      | 02   | requiere renovación preventiva    |
      | 03   | alcanzó su vencimiento previsto    |

  @tokenConcurrente
  Escenario: API-AUTH-04 · Compartir una renovación entre consultas simultáneas
    Cuando la sesión "requiere renovación preventiva"
    Y 3 consultas simultáneas necesitan acceder al documento
    Entonces recibo el documento completo en cada consulta
    Y puedo seguir consultando con una única renovación de sesión
