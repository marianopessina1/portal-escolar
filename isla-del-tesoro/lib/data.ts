export type Product = {
  id: string;
  name: string;
  format: string;
  price: number;
  detail: string;
  specs: string[];
  badge?: string;
  image: string;
};

export const products: Product[] = [
  {
    id: "coleccion",
    name: "Edición de Colección",
    format: "Tapa dura · Tela grabada en oro",
    price: 24.9,
    detail: "La edición de la portada: lomo numerado, cantos dorados e ilustraciones a página completa.",
    specs: ["320 páginas", "Ilustrada", "Mapa desplegable"],
    badge: "Más vendida",
    image: "/media/cover-flat.jpg",
  },
  {
    id: "bolsillo",
    name: "Edición de Bolsillo",
    format: "Rústica · 11 × 18 cm",
    price: 9.9,
    detail: "Para leer en el colegio, en el colectivo o bajo una palmera. Texto íntegro y notas.",
    specs: ["288 páginas", "Texto íntegro", "Notas del traductor"],
    image: "/media/naufragio.jpg",
  },
  {
    id: "audiolibro",
    name: "Audiolibro",
    format: "Digital · 7 h 12 min",
    price: 14.9,
    detail: "Narrado a varias voces, con el mar y el crujir de la Hispaniola de fondo.",
    specs: ["MP3 + streaming", "Narración dramatizada", "Sin DRM"],
    badge: "Nuevo",
    image: "/media/atardecer.jpg",
  },
  {
    id: "ebook",
    name: "eBook",
    format: "EPUB · Kindle",
    price: 6.99,
    detail: "Llévate la isla a cualquier pantalla, con diccionario náutico integrado.",
    specs: ["EPUB 3", "Glosario pirata", "Mapa interactivo"],
    image: "/media/barco.jpg",
  },
];

export const chapters = [
  {
    act: "Acto I",
    title: "El mapa",
    line: "Un viejo pirata muere en la posada del Almirante Benbow. En su baúl, un mapa marcado con una X.",
    video: "/media/olas.mp4",
    poster: "/media/olas.jpg",
  },
  {
    act: "Acto II",
    title: "La Hispaniola",
    line: "Un barco zarpa de Bristol rumbo a una isla que no figura en ninguna carta.",
    video: "/media/barco.mp4",
    poster: "/media/barco.jpg",
  },
  {
    act: "Acto III",
    title: "El motín",
    line: "Un cocinero de una sola pierna. Una tripulación que susurra. Un barril de manzanas donde nadie debería estar escondido.",
    video: "/media/atardecer.mp4",
    poster: "/media/atardecer.jpg",
  },
  {
    act: "Acto IV",
    title: "La isla",
    line: "Costas de piedra, barcos varados y un hombre abandonado que lleva tres años soñando con queso.",
    video: "/media/naufragio.mp4",
    poster: "/media/naufragio.jpg",
  },
  {
    act: "Acto V",
    title: "El tesoro",
    line: "Setecientas mil libras en oro de Flint. Y una pregunta: ¿qué estás dispuesto a perder por él?",
    video: "/media/delfines.mp4",
    poster: "/media/delfines.jpg",
  },
];

export const characters = [
  { name: "Jim Hawkins", role: "El grumete", quote: "Un grumete con un mapa que todos quieren.", text: "Hijo de posaderos. Encuentra el mapa, escucha la conspiración desde un barril y roba un barco él solo." },
  { name: "Long John Silver", role: "El cocinero", quote: "«Unos tienen miedo de Pew y otros de Flint; pero a mí, Flint me temía.»", text: "Encantador, astuto, de una sola pierna. Puede ser tu mejor amigo y tu peor enemigo en la misma página." },
  { name: "Capitán Flint", role: "El loro", quote: "«¡Doblones! ¡Doblones! ¡Doblones!»", text: "Lleva el nombre del pirata más temido del Caribe y ha visto más saqueos que cualquier marinero." },
  { name: "Billy Bones", role: "El viejo lobo", quote: "«Quince hombres sobre el cofre del muerto…»", text: "Llega a la posada con un baúl, una cicatriz y un miedo terrible a un marinero con una sola pierna." },
  { name: "Ben Gunn", role: "El náufrago", quote: "«¿No tendrás por ahí un pedazo de queso, compañero?»", text: "Abandonado en la isla durante tres años. Sabe algo que nadie más sabe sobre el tesoro." },
  { name: "Doctor Livesey", role: "La razón", quote: "El único que nunca pierde la calma.", text: "Médico y juez. La brújula moral de la expedición cuando todo se tuerce." },
];

export const reasons = [
  { n: "01", title: "Aquí nacieron los piratas", text: "El mapa con la X, el loro en el hombro, la pata de palo, el «¡yo-ho-ho!». Cada película de piratas que viste le debe algo a este libro." },
  { n: "02", title: "Jim Hawkins podrías ser tú", text: "Un chico común que, cuando los adultos dudan, se atreve. Leerlo es preguntarte qué harías en su lugar." },
  { n: "03", title: "El villano que te va a encantar", text: "Long John Silver no es bueno ni malo: es humano. Por eso es uno de los personajes más fascinantes jamás escritos." },
  { n: "04", title: "Una novela sobre crecer", text: "Debajo de la aventura hay una historia sobre elegir quién ser, en quién confiar y qué vale realmente un tesoro." },
  { n: "05", title: "Ritmo de película", text: "Capítulos cortos, cliffhangers constantes y escenas que se ven. Stevenson escribía como si ya existiera el cine." },
  { n: "06", title: "Un clásico que no envejece", text: "Publicada en 1883, leída por millones en todos los idiomas. Ciento cuarenta años después, sigue sin soltarte." },
];
