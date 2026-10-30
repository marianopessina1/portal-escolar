# Fuego Negro — landing de salsas gourmet

Landing page de e-commerce para una marca ficticia de salsas de autor. Paleta naranja/negro,
tipografía gigante, frasco 3D procedural y narrativa guiada por scroll.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** — tokens de marca en `tailwind.config.ts`
- **React Three Fiber / drei / three.js** — escena 3D (`components/scene`)
- **GSAP ScrollTrigger** — pins, scrub y coreografía del frasco
- **Framer Motion** — microinteracciones (botones magnéticos, cursor, carrito, transiciones de sabor)
- **Lenis** — scroll inercial sincronizado con el ticker de GSAP

## Puesta en marcha

```bash
cd salsa-gourmet
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Cómo está construido

| Pieza | Archivo |
| --- | --- |
| Frasco (vidrio con transmisión, salsa con semillas, tapa moleteada, etiqueta en canvas) | `components/scene/Jar.tsx` |
| Vapor (sprites procedurales) | `components/scene/Steam.tsx` |
| Partículas de especias (instanced meshes) | `components/scene/Spices.tsx` |
| Luces dinámicas, halo y entorno de estudio con Lightformers | `components/scene/Scene.tsx` |
| Recorrido del frasco por la página | `components/JarChoreography.tsx` |
| Estado compartido DOM ↔ WebGL sin re-renders | `lib/jarState.ts` |
| Contenido (sabores, productos, ingredientes) | `lib/data.ts` |

El canvas es una capa `fixed` entre los fondos de las secciones (z-0/1) y el contenido (z-10),
lo que permite que «FUEGO» quede detrás del frasco y «NEGRO» delante. La sección de sabores,
al estar pineada, crea su propio contexto de apilamiento, por eso su decorado de fondo vive en
una capa fija aparte.

Todas las texturas (etiqueta, salsa, humo, halo) se generan en canvas: no hay assets binarios.
