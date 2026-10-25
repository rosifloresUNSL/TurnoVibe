import { TarjetaMetrica } from '../../../shared/components/TarjetaMetrica';
import { formatearPesos } from '../../../shared/utils/fechas';

// Indicadores del mes calculados por el servidor (GET /api/estadisticas, alcance global).
export function ResumenGlobal({ estadisticas }) {
  const { totales, porServicio, peluqueros } = estadisticas;

  const totalServicios = porServicio.reduce((suma, s) => suma + s.cantidad, 0);
  const masPedido = porServicio[0]; // el servidor los devuelve ordenados de más a menos pedido
  const porcentajeMasPedido = masPedido ? Math.round((masPedido.cantidad / totalServicios) * 100) : 0;

  const masSolicitado = [...peluqueros].sort((a, b) => b.turnos - a.turnos)[0];
  const tasaCancelacion = totales.turnos > 0 ? Math.round((totales.cancelados / totales.turnos) * 100) : 0;

  return (
    <div className="row g-3 mb-4">
      <div className="col-md-6 col-lg-3">
        <TarjetaMetrica titulo="Recaudación del mes" valor={formatearPesos(totales.ingresos)} detalle={`${totales.confirmados} turnos confirmados`} color="primary" />
      </div>
      <div className="col-md-6 col-lg-3">
        <TarjetaMetrica
          titulo="Servicio más pedido"
          valor={masPedido ? masPedido.nombre : '—'}
          detalle={masPedido ? `${porcentajeMasPedido}% de los servicios` : 'Sin datos este mes'}
          color="success"
        />
      </div>
      <div className="col-md-6 col-lg-3">
        <TarjetaMetrica
          titulo="Peluquero con más turnos"
          valor={masSolicitado && masSolicitado.turnos > 0 ? masSolicitado.nombre : '—'}
          detalle={masSolicitado && masSolicitado.turnos > 0 ? `${masSolicitado.turnos} turnos` : 'Sin datos este mes'}
          color="info"
        />
      </div>
      <div className="col-md-6 col-lg-3">
        <TarjetaMetrica titulo="Tasa de cancelación" valor={`${tasaCancelacion}%`} detalle={`${totales.cancelados} de ${totales.turnos} turnos`} color="secondary" />
      </div>
    </div>
  );
}