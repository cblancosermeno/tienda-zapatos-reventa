// Esta tienda es una copia de reventa: muestra los mismos productos que la
// tienda principal pero con un recargo por par, para dejar margen de
// reventa. El recargo lo trae cada revendedor desde el backend (ver
// context/RevendedorContext.jsx) y se aplica SOLO para mostrar/guardar el
// precio en esta copia — nunca se toca el precio real que vive en la base
// de datos.
function conRecargo(precio, recargo) {
  const numero = Number(precio);
  if (Number.isNaN(numero)) return precio;

  const extra = Number(recargo);
  if (Number.isNaN(extra)) return numero.toFixed(2);

  return (numero + extra).toFixed(2);
}

export { conRecargo };
