# language: es
@ui @crear @correoCondicional
Característica: Disponibilidad del correo de contacto
  Como participante del laboratorio
  Quiero ingresar un correo cuando la entrega lo requiere
  Para configurar correctamente el envío del documento

  Antecedentes:
    Dado que he iniciado sesión en el portal

  Esquema del escenario: UI-COR-<caso> · Disponibilidad del correo con canal <canal> y copia <copia>
    Cuando configuro el formulario con canal "<canal>" y envío de copia "<copia>"
    Entonces el correo de contacto queda "<estado>"

    Ejemplos:
      | caso | canal              | copia | estado        |
      | 01   | Portal             | no    | deshabilitado |
      | 02   | Portal             | sí    | habilitado    |
      | 03   | Correo electrónico | no    | habilitado    |
      | 04   | Correo electrónico | sí    | habilitado    |

  Esquema del escenario: UI-COR-<caso> · Limpiar el correo al desactivar su uso desde <canal>
    Cuando configuro el formulario con canal "<canal>" y envío de copia "<copia>"
    Y escribo un correo de contacto válido
    Y cambio a entrega por portal sin enviar copia
    Entonces el correo de contacto queda "deshabilitado"
    Y el campo de correo de contacto queda vacío

    Ejemplos:
      | caso | canal              | copia |
      | 05   | Portal             | sí    |
      | 06   | Correo electrónico | no    |
