import { useEffect, useState } from 'react';

// Carga datos de la API y expone { datos, cargando, error, recargar }.
// Al recargar se conservan los datos anteriores mientras llegan los nuevos (cargando = true),
// así la pantalla no parpadea ni pierde el estado de los formularios que muestra.
// - "cargar": función que devuelve una promesa (por ejemplo, () => serviciosApi.listar()).
// - "dependencias": cuando cambian, se vuelve a cargar (igual que en useEffect).
// Si el componente se desmonta o las dependencias cambian mientras hay un pedido en vuelo,
// la respuesta vieja se descarta: así una respuesta lenta nunca pisa a una más nueva.
export function useCargaDatos(cargar, dependencias = []) {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: null });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let descartada = false;
    setEstado((previo) => ({ ...previo, cargando: true, error: null }));

    cargar()
      .then((datos) => {
        if (!descartada) setEstado({ datos, cargando: false, error: null });
      })
      .catch((error) => {
        if (!descartada) setEstado({ datos: null, cargando: false, error });
      });

    return () => {
      descartada = true;
    };
    // La lista de dependencias la define quien usa el hook; "intento" fuerza la recarga manual.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencias, intento]);

  return { ...estado, recargar: () => setIntento((n) => n + 1) };
}