# language: es
@ui @crear @validaciones
Característica: Validación del formulario de documentos
  Como participante del laboratorio
  Quiero identificar los datos incorrectos del formulario
  Para corregirlos antes de emitir un documento

  Antecedentes:
    Dado que he iniciado sesión en el portal

  @erroresFormulario
  Esquema del escenario: UI-VAL-<caso> · Mostrar el error de <condicion>
    Cuando intento emitir desde el portal un documento con "<condicion>"
    Entonces el formulario muestra el error correspondiente junto a "<campo>"
    Y el formulario permanece abierto para corregir los datos

    Ejemplos:
      | caso | condicion                          | campo        |
      | 01   | folio ausente                      | folio        |
      | 02   | RUT ausente                        | rutReceptor  |
      | 03   | monto ausente                      | monto        |
      | 04   | RUT con dígito verificador inválido | rutReceptor  |
      | 05   | folio igual a cero                 | folio        |
      | 06   | monto igual a cero                 | monto        |
      | 07   | fecha anterior al año 2000         | fechaEmision |
      | 08   | fecha futura                       | fechaEmision |
