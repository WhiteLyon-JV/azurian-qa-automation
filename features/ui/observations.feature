# language: es
@ui @crear @validaciones @observaciones
Característica: Límite de las observaciones del documento
  Como participante del laboratorio
  Quiero conocer y respetar el límite de las observaciones
  Para ingresar información adicional válida

  Antecedentes:
    Dado que he iniciado sesión en el portal
    Y que he abierto el formulario de nuevo documento

  Esquema del escenario: UI-OBS-<caso> · Mostrar observaciones con <cantidad> <unidad>
    Cuando escribo <cantidad> <unidad> en las observaciones
    Entonces las observaciones conservan <cantidad> <unidad> y el contador coincide

    Ejemplos:
      | caso | cantidad | unidad     |
      | 01   | 0        | caracteres |
      | 02   | 1        | carácter   |
      | 03   | 299      | caracteres |
      | 04   | 300      | caracteres |

  Escenario: UI-OBS-05 · Impedir escribir más de 300 caracteres
    Cuando escribo 300 caracteres en las observaciones
    Y intento escribir un carácter adicional en las observaciones
    Entonces las observaciones conservan 300 caracteres y el contador coincide
