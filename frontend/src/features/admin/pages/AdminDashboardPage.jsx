import { estadisticasApi, peluquerosApi } from '../../../api/endpoints';
import { useCargaDatos } from '../../../shared/hooks/useCargaDatos';
import { EstadoCarga } from '../../../shared/components/EstadoCarga';
import { primerDiaDelMes, ultimoDiaDelMes } from '../../../shared/utils/fechas';
import { ResumenGlobal } from '../components/ResumenGlobal';
import { GestionPeluqueros } from '../components/GestionPeluqueros';
import { AgendaConsolidada } from '../components/AgendaConsolidada';

export function AdminDashboardPage() {
  const peluqueros = useCargaDatos(peluquerosApi.listar);
  const estadisticas = useCargaDatos(
    () => estadisticasApi.obtener({ desde: primerDiaDelMes(), hasta: ultimoDiaDelMes() }),
    []
  );

  // Al crear o borrar un peluquero cambian la lista y los números del dashboard.
  const alCambiarPeluqueros = () => {
    peluqueros.recargar();
    estadisticas.recargar();
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-1">Panel de Administración</h2>
      <p className="text-muted mb-4">Estadísticas del mes, equipo y agenda</p>

      <EstadoCarga cargando={estadisticas.cargando && !estadisticas.datos} error={estadisticas.error} onReintentar={estadisticas.recargar}>
        {estadisticas.datos && <ResumenGlobal estadisticas={estadisticas.datos} />}
      </EstadoCarga>

      <EstadoCarga cargando={peluqueros.cargando && !peluqueros.datos} error={peluqueros.error} onReintentar={peluqueros.recargar}>
        <GestionPeluqueros peluqueros={peluqueros.datos ?? []} onCambio={alCambiarPeluqueros} />
        <AgendaConsolidada peluqueros={peluqueros.datos ?? []} />
      </EstadoCarga>
    </div>
  );
}