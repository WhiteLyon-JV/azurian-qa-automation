# language: es
@ui @crear @validaciones @adjuntos
Característica: Validación del documento de respaldo
  Como participante del laboratorio
  Quiero seleccionar archivos de respaldo admitidos
  Para adjuntarlos al documento tributario

  Antecedentes:
    Dado que he iniciado sesión en el portal
    Y que he abierto el formulario de nuevo documento

  @adjuntoPermitido
  Esquema del escenario: UI-ADJ-<caso> · Aceptar el respaldo <nombre> de <bytes> bytes
    Cuando selecciono como respaldo el archivo "<nombre>" de <bytes> bytes
    Entonces veo el archivo de respaldo seleccionado

    Ejemplos:
      | caso | nombre       | bytes   |
      | 01   | respaldo.pdf | 32      |
      | 02   | respaldo.xml | 32      |
      | 03   | respaldo.txt | 32      |
      | 04   | respaldo.pdf | 2097152 |

  @adjuntoRechazado
  Esquema del escenario: UI-ADJ-<caso> · Rechazar el respaldo por <motivo>
    Cuando selecciono como respaldo el archivo "<nombre>" de <bytes> bytes
    Entonces veo el error "<motivo>" asociado al documento de respaldo
    Y el archivo rechazado no queda seleccionado
    Y el formulario permanece abierto para corregir los datos

    Ejemplos:
      | caso | nombre       | bytes   | motivo                 |
      | 05   | respaldo.exe | 32      | extensión no permitida |
      | 06   | respaldo.pdf | 2097153 | tamaño excedido        |
