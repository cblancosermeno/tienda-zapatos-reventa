// Conversión de talla US a centímetros de largo de pie (tablas estándar
// tipo Nike/Adidas):
//   Hombre: cm = talla + 18      (ej. 8 US -> 26 cm)
//   Mujer:  cm = talla + 17      (ej. 8 US -> 25 cm)
//   Unisex: cm = talla + 18.5    (ej. 5 US -> 23.5 cm, 6 US -> 24.5 cm)
export function tallaACm(talla, genero) {
  const t = Number(talla);
  if (Number.isNaN(t)) return null;

  const offset = genero === "mujer" ? 17 : genero === "unisex" ? 18.5 : 18;
  const cm = t + offset;

  return Number.isInteger(cm) ? String(cm) : cm.toFixed(1);
}
