# Literatura Hispanoamericana y Española 📚

Sitio web estático que recopila los **10 libros más importantes** de la historia literaria de cada uno de los 21 países/territorios de habla hispana: los 19 países hispanoamericanos (incluyendo Puerto Rico), España y Guinea Ecuatorial.

## Ver el sitio

Abre `index.html` en tu navegador, o publícalo con GitHub Pages (Settings → Pages → Deploy from branch `main`, carpeta `/`).

## Estructura del proyecto

```
├── index.html          # Página principal
├── css/style.css        # Estilos
├── js/
│   ├── countries.js      # Lista de países con su bandera y código ISO
│   ├── data.js           # Los 10 libros por país (título, autor, año, descripción, género)
│   └── app.js             # Lógica de la interfaz (grilla, búsqueda, filtros, portadas, detalle, mapa, tema)
└── img/world-map.svg     # Mapa interactivo del mundo (dominio público, ver Créditos)
```

## Países incluidos

Argentina, Bolivia, Chile, Colombia, Costa Rica, Cuba, Ecuador, El Salvador, Guatemala, Honduras, México, Nicaragua, Panamá, Paraguay, Perú, Puerto Rico, República Dominicana, Uruguay, Venezuela, España y Guinea Ecuatorial (único país hispanohablante de África).

## Sobre las listas

Las listas se basan en el consenso de crítica literaria y académica sobre las obras más influyentes y representativas de cada literatura nacional (novela, poesía, ensayo, teatro y cuento), priorizando canonicidad histórica sobre popularidad reciente. Son inevitablemente discutibles: la selección de "los 10 mejores" de una tradición literaria entera siempre deja fuera obras valiosas.

## Funcionalidades

- **Filtros por género y época**: desde la cabecera se puede filtrar el catálogo completo (los 210 libros) por género literario (novela, poesía, ensayo, teatro, cuento) y/o por época (antes de 1800, 1800-1899, 1900-1949, 1950-1999, 2000-actualidad), combinables entre sí y con la búsqueda de texto.
- **Portadas**: se cargan dinámicamente desde la [API pública de Open Library](https://openlibrary.org/dev/docs/api/search), con caché en `localStorage` y un icono de repuesto (📖) cuando no hay portada disponible.
- **Ediciones libres**: cada libro incluye enlaces de búsqueda a la Biblioteca Virtual Miguel de Cervantes, Wikisource e Internet Archive, para localizar ediciones de dominio público cuando existen.

## Contribuir

¿Falta un libro clave o hay un error en título/autor/año/género? Abre un issue o un pull request editando `js/data.js`.

## Próximos pasos posibles

- Filtro combinado por época Y género a la vez con resultados aún más específicos por autor o corriente literaria.
- Enlaces directos (no solo de búsqueda) a ediciones libres verificadas manualmente, libro a libro.
- Sección dedicada a la literatura oral y en lenguas originarias (guaraní, quechua, náhuatl, fang, bubi...).

## Créditos

El mapa (`img/world-map.svg`) es una versión adaptada de ["BlankMap-World-Compact.svg"](https://commons.wikimedia.org/wiki/File:BlankMap-World6,_compact.svg), publicado en Wikimedia Commons en el dominio público.
