import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useState } from "react";
import { RiAddLine, RiCloseLine } from "react-icons/ri";

const CardComida = ({ espacio }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [franjas, setFranjas] = useState([]);
  const [selectedHora, setSelectedHora] = useState("");
  const [nota, setNota] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reservaSuccess, setReservaSuccess] = useState(false);
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

  // Función para traducir el tipo de espacio
  const getTipoEspacio = (tipo) => {
    switch (tipo) {
      case "SALA_REUNION":
        return "Sala de Reuniones";
      case "AUDITORIO":
        return "Auditorio";
      case "SALA_ESTUDIO":
        return "Sala de Estudio";
      case "CANCHA_DEPORTIVA":
        return "Cancha Deportiva";
      default:
        return tipo;
    }
  };

  const openModal = async () => {
    setIsOpen(true);
    setIsLoading(true);
    try {
      // Formatear fecha actual como YYYY-MM-DD con ceros iniciales
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const fecha = `${year}-${month}-${day}`;

      const response = await axios.get(
        `http://localhost:3000/espacios/${
          espacio.id
        }/disponibilidad?fecha=${encodeURIComponent(fecha)}`
      );
      setFranjas(response.data.franjasDisponibles);
    } catch (error) {
      console.error("Error al obtener disponibilidad:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleReservar = async () => {
    if (!selectedHora) {
      alert("Por favor selecciona un horario");
      return;
    }

    try {
      setIsLoading(true);

      // Parsear la franja horaria seleccionada (ej: "10:00 - 12:00")
      const [horaInicioStr, horaFinStr] = selectedHora.split(" - ");

      // Obtener fecha del DÍA SIGUIENTE en formato YYYY-MM-DD
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1); // Sumamos 1 día

      const year = tomorrow.getFullYear();
      const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
      const day = String(tomorrow.getDate()).padStart(2, "0");

      // Crear fechas ISO completas con la hora seleccionada para el día siguiente
      const horaInicio = `${year}-${month}-${day}T${horaInicioStr}:00Z`;
      const horaFin = `${year}-${month}-${day}T${horaFinStr}:00Z`;

      // Obtener token si es necesario
      const token = localStorage.getItem("authToken");

      // Configurar headers
      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      // Hacer la petición POST
      const response = await axios.post(
        "http://localhost:3000/reservas",
        {
          idEspacio: espacio.id,
          horaInicio: horaInicio,
          horaFin: horaFin,
          notas: nota || "Sin notas adicionales",
        },
        config
      );

      if (response.status === 201) {
        setReservaSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setReservaSuccess(false);
          setSelectedHora("");
          setNota("");
        }, 2000);
      }
    } catch (error) {
      console.error("Error al realizar reserva:", error);
      alert(
        `Error al realizar reserva: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="px-4 pt-10">
        <div className="bg-card dark:bg-gray-800 px-3 pt-6 pb-8 rounded-xl flex flex-col items-center mt-16 shadow-lg hover:shadow-xl">
          <h2
            className="text-section dark:text-white text-xl font-bold text-center mb-2"
            onClick={() => openModal()}
          >
            {espacio.nombre}
          </h2>
          <div className="text-gray-600 dark:text-gray-300 text-sm mb-3 text-center">
            {espacio.descripcion}
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs px-3 py-1 rounded-full">
              Capacidad: {espacio.capacidad} personas
            </span>
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs px-3 py-1 rounded-full">
              {getTipoEspacio(espacio.tipoEspacio)}
            </span>
          </div>
          <div className="text-gray-700 dark:text-gray-200 text-sm mb-4">
            <span className="font-semibold">Ubicación:</span>{" "}
            {espacio.ubicacion}
          </div>

          <button
            className="flex items-center gap-2 bg-[#012970] dark:bg-[#ec7c6a] text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90"
            onClick={openModal}
          >
            <RiAddLine /> Reservar Espacio
          </button>
        </div>
      </div>
      {/* Modal de reserva */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 z-50"
      >
        <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold text-title dark:text-white">
              Reservar {espacio.nombre}
            </Dialog.Title>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <RiCloseLine size={24} />
            </button>
          </div>

          {reservaSuccess ? (
            <div className="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-md mb-4">
              ¡Reserva realizada con éxito!
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="text-center py-8">
                  Cargando horarios disponibles...
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Horarios disponibles:
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {franjas.map((franja) => (
                        <button
                          key={franja}
                          onClick={() => setSelectedHora(franja)}
                          className={`p-2 rounded-md border ${
                            selectedHora === franja
                              ? "bg-[#012970] dark:bg-[#ec7c6a] text-white border-transparent"
                              : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                          }`}
                        >
                          {franja}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedHora && (
                    <div className="mb-6">
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Notas adicionales:
                      </label>
                      <textarea
                        value={nota}
                        onChange={(e) => setNota(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        rows={3}
                        placeholder="Ej: Necesitamos proyector y 10 sillas adicionales"
                      />
                    </div>
                  )}

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleReservar}
                      disabled={!selectedHora || isLoading}
                      className={`px-4 py-2 bg-[#012970] dark:bg-[#ec7c6a] text-white rounded-md hover:opacity-90 ${
                        !selectedHora || isLoading
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {isLoading ? "Procesando..." : "Confirmar Reserva"}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default CardComida;
