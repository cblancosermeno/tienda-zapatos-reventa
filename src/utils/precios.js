// Esta tienda es una copia de reventa: muestra los mismos productos que la
// tienda principal pero con un recargo fijo por par, para dejar margen de
// reventa. El recargo se aplica SOLO para mostrar/guardar el precio en esta
// copia — nunca se toca el precio real que vive en la base de datos.
const RECARGO = 10;

function conRecargo(precio) {
  const numero = Number(precio);
  if (Number.isNaN(numero)) return precio;
  return (numero + RECARGO).toFixed(2);
}

export { RECARGO, conRecargo };
