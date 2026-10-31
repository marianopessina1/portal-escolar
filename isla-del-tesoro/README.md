# La Isla del Tesoro — Tráiler interactivo

Proyecto de Informática: un tráiler de película para la novela **La Isla del Tesoro** de Robert Louis Stevenson,
convertido en una experiencia web de comercio electrónico. Termina con la portada del libro en 3D y las razones para leerlo.

## Qué incluye

| Sección | Tecnología |
| --- | --- |
| Cuenta regresiva de cine (3 · 2 · 1) | Framer Motion |
| Hero con video, franjas *letterbox* 2.39:1 y título dorado | Framer Motion + GSAP ScrollTrigger |
| **Tráiler por scroll**: 5 actos con cortes de cine y código de tiempo | GSAP ScrollTrigger (pin + scrub) |
| Reparto de personajes con scroll horizontal | GSAP ScrollTrigger (`containerAnimation`) |
| **La portada en 3D**: el libro gira y aterriza entre monedas de oro | React Three Fiber + drei |
| ¿Por qué leerlo? (6 razones) | Framer Motion |
| Tienda de ediciones + carrito | React context + Framer Motion |
| Tráiler en video (MP4 de 1:08 con música) | `public/media/trailer.mp4` |

El **tráiler en MP4** se puede ver con el botón «Ver el tráiler» o descargarlo desde el reproductor.

## Cómo ejecutarlo

```bash
npm install
npm run dev      # http://localhost:3000
# o en producción:
npm run build && npm start
```

## Cómo se hizo el tráiler MP4

`scripts/trailer/build_trailer.py` arma el video a partir de los clips originales:

- Títulos con Pillow (fuentes Cinzel y Cormorant Garamond, dorado con brillo).
- Banda sonora sintetizada con numpy: mar, drone grave, golpes «braam», latidos y acorde final.
- Montaje, encuadre cinemascope 2.39:1, color y grano de película con ffmpeg.
- La portada se «aplanó» con una corrección de perspectiva de ffmpeg (`public/media/cover-flat.jpg`) y se usó como textura del libro 3D.

```bash
python3 scripts/trailer/build_trailer.py <carpeta_clips_originales> <carpeta_fuentes> public/media/trailer.mp4
```

> La tienda es una simulación para el proyecto escolar: no se realiza ningún cobro.
