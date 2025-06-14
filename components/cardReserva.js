import {
  RiCalendarLine,
  RiDeleteBin6Line,
  RiEditLine,
  RiMapPinLine,
  RiTimeLine,
  RiUserLine,
} from "react-icons/ri";

const CardReserva = ({ reserva }) => {
  // Función para formatear la fecha y hora
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Función para obtener el icono según el tipo de espacio
  const getIcono = (tipo) => {
    switch (tipo) {
      case "SALA_REUNION":
        return "/img/sala-reunion.png";
      case "AUDITORIO":
        return "/img/auditorio.png";
      case "SALA_ESTUDIO":
        return "/img/sala-estudio.png";
      case "CANCHA_DEPORTIVA":
        return "/img/cancha-deportiva.png";
      default:
        return "/img/espacio-generico.png";
    }
  };

  // Función para traducir el estado
  const getEstado = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "Pendiente";
      case "CONFIRMADA":
        return "Confirmada";
      case "CANCELADA":
        return "Cancelada";
      case "COMPLETADA":
        return "Completada";
      default:
        return estado;
    }
  };

  // Color según estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "CONFIRMADA":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "CANCELADA":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "COMPLETADA":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  return (
    <div className="bg-card dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-lg hover:shadow-xl">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-title dark:text-white">
              {reserva.espacio.nombre}
            </h3>
            <span
              className={`text-xs px-2 py-1 rounded-full ${getEstadoColor(
                reserva.estado
              )}`}
            >
              {getEstado(reserva.estado)}
            </span>
          </div>

          <div className="mt-2 space-y-1 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <RiMapPinLine className="mr-2" />
              <span>{reserva.espacio.ubicacion}</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <RiCalendarLine className="mr-2" />
              <span>{formatDateTime(reserva.horaInicio).split(",")[0]}</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <RiTimeLine className="mr-2" />
              <span>
                {new Date(reserva.horaInicio).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -
                {new Date(reserva.horaFin).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {reserva.usuario?.email && (
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <RiUserLine className="mr-2" />
                <span>{reserva.usuario.email}</span>
              </div>
            )}
          </div>

          {reserva.notas && (
            <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-300">
              <p className="font-medium">Notas:</p>
              <p>{reserva.notas}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex justify-end gap-2 border-t pt-2 border-gray-200 dark:border-gray-700">
        <button className="p-2 text-gray-500 hover:text-blue-500 dark:hover:text-blue-300">
          <RiEditLine />
        </button>
        <button className="p-2 text-gray-500 hover:text-red-500 dark:hover:text-red-300">
          <RiDeleteBin6Line />
        </button>
      </div>
    </div>
  );
};

export default CardReserva;
