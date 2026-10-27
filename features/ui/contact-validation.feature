# language: es
@ui @crear @validaciones @correoValidacion
Característica: Validación del correo de contacto
  Como participante del laboratorio
  Quiero corregir el correo cuando sea necesario
  Para emitir documentos con datos de contacto válidos

  Antecedentes:
    Dado que he iniciado sesión en el portal

  Esquema del escenario: UI-COR-VAL-<caso> · Validar el correo de contacto: <motivo>, canal <canal> y copia <copia>
    Cuando intento emitir desde el portal con canal "<canal>", copia "<copia>" y correo "<correo>"
    Entonces veo el error "<motivo>" asociado al correo de contacto
    Y el formulario permanece abierto para corregir los datos

    Ejemplos:
      | caso | canal              | copia | correo          | motivo            |
      | 01   | Portal             | sí    |                 | correo obligatorio |
      | 02   | Correo electrónico | no    |                 | correo obligatorio |
      | 03   | Correo electrónico | sí    |                 | correo obligatorio |
      | 04   | Portal             | sí    | correo-invalido | formato inválido  |
      | 05   | Correo electrónico | no    | correo-invalido | formato inválido  |
      | 06   | Correo electrónico | sí    | correo-invalido | formato inválido  |
