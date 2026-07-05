# Literatura Hispanoamericana y Española 📚

Sitio web estático que recopila los **10 libros más importantes** de la historia literaria de cada uno de los 20 países/territorios de habla hispana: los 19 países hispanoamericanos (incluyendo Puerto Rico) y España.

## Ver el sitio

Abre `index.html` en tu navegador, o publícalo con GitHub Pages (Settings → Pages → Deploy from branch `main`, carpeta `/`).

## Estructura del proyecto

```
├── index.html          # Página principal
├── css/style.css        # Estilos
├── js/
│   ├── countries.js      # Lista de países con su bandera y código ISO
│   ├── data.js           # Los 10 libros por país (título, autor, año, descripción)
│   └── app.js             # Lógica de la interfaz (grilla, búsqueda, detalle, mapa, tema)
└── img/world-map.svg     # Mapa interactivo del mundo (dominio público, ver Créditos)
```

## Países incluidos

Argentina, Bolivia, Chile, Colombia, Costa Rica, Cuba, Ecuador, El Salvador, Guatemala, Honduras, México, Nicaragua, Panamá, Paraguay, Perú, Puerto Rico, República Dominicana, Uruguay, Venezuela y España.

## Sobre las listas

Las listas se basan en el consenso de crítica literaria y académica sobre las obras más influyentes y representativas de cada literatura nacional (novela, poesía, ensayo, teatro y cuento), priorizando canonicidad histórica sobre popularidad reciente. Son inevitablemente discutibles: la selección de "los 10 mejores" de una tradición literaria entera siempre deja fuera obras valiosas.

## Contribuir

¿Falta un libro clave o hay un error en título/autor/año? Abre un issue o un pull request editando `js/data.js`.

## Próximos pasos posibles

- Añadir portadas de los libros.
- Añadir enlaces a ediciones o textos disponibles libremente.
- Incluir Guinea Ecuatorial (único país hispanohablante de África).
- Filtro por época o género literario.

## Créditos

El mapa (`img/world-map.svg`) es una versión adaptada de ["BlankMap-World-Compact.svg"](https://commons.wikimedia.org/wiki/File:BlankMap-World6,_compact.svg), publicado en Wikimedia Commons en el dominio público.
