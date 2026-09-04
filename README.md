# Apex Garage

PoC de portafolio: una plataforma web premium, dark mode, centrada en la cultura de track racing de SoCal — garage digital, descubrimiento de eventos en un mapa en vivo, y clasificados ligeros.

Referencia de tono: Porsche / Apple / Rivian. Sin gamificación, sin backend real — todos los datos son mock (`src/data/*.json`) y las publicaciones del flujo "Crear" viven solo en memoria durante la sesión del navegador.

## Stack

- **Next.js 14** (App Router) + React + TypeScript
- **Tailwind CSS** con el theme extendido usando los design tokens del proyecto (`tailwind.config.ts`)
- **Framer Motion** para todas las animaciones e interacciones
- **Mapbox GL JS** con estilo oscuro (`mapbox://styles/mapbox/dark-v11`) para el mapa en vivo
- **Zustand** para estado global ligero (filtros, pin seleccionado, RSVPs, items creados)
- Datos mock en JSON, sin backend ni base de datos

## Pantallas

1. **Home / Mapa en vivo** (`/`) — mapa Mapbox a pantalla completa con pines de eventos, filtros por categoría, bottom sheet de detalle
2. **Perfil de Auto** (`/cars/[carId]`) — hero con parallax, specs y mods en acordeón, galería con lightbox
3. **Garage / Perfil de usuario** (`/garage`) — mis autos en carrusel, actividad reciente
4. **Detalle de Evento** (`/events/[eventId]`) — info, asistentes, ubicación (con link de regreso al mapa), RSVP
5. **Clasificados** (`/classifieds`, `/classifieds/[listingId]`) — grid filtrable + detalle con carrusel de imágenes
6. **Crear** (`/create`) — flujo de dos pasos para publicar un evento o un clasificado
7. **Onboarding** (`/onboarding`) — ligero, no bloqueante (accesible desde un banner descartable en el mapa)

`Perfil` (`/profile`) es una pantalla adicional ligera para cuenta/comunidades, separada de `Garage` para darle un destino propio a cada tab de la barra de navegación.

## Requisitos

- Node.js 18.18+ (recomendado 20+)
- Un token público de Mapbox — gratis en [account.mapbox.com/access-tokens](https://account.mapbox.com/access-tokens/)

## Setup local

```bash
npm install
cp .env.local.example .env.local
# Edita .env.local y pega tu NEXT_PUBLIC_MAPBOX_TOKEN
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Sin el token de Mapbox, el mapa muestra un estado vacío con instrucciones — el resto de la app funciona igual.

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run start` — sirve el build de producción
- `npm run lint` — ESLint (config de Next.js)

## Deploy en Vercel

1. Sube este repo a GitHub (ver abajo).
2. En [vercel.com](https://vercel.com), importa el repositorio.
3. En **Environment Variables**, agrega `NEXT_PUBLIC_MAPBOX_TOKEN` con tu token.
4. Deploy. A partir de ahí, cada push a `main` dispara un deploy automático.

## Notas de alcance (PoC)

- No hay autenticación real — el usuario "activo" está hardcodeado en `src/lib/data.ts` (`CURRENT_USER_ID`).
- No hay backend ni base de datos — todo el contenido inicial vive en `src/data/*.json`.
- Los eventos y clasificados publicados desde `/create` se guardan en el store de Zustand (session-only) y aparecen de inmediato en el mapa y en clasificados, pero se pierden al recargar la página — es el comportamiento esperado sin backend.
