import { useEffect, useState } from "react";
import { RiEdit2Line, RiDeleteBin6Line, RiAddLine } from "react-icons/ri";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import Layout from "../components/shared/layout";
import withAuth from "../components/withAuth";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("ENABLED");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : "";

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/categories/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setStatus(category.status);
    } else {
      setEditingCategory(null);
      setName("");
      setStatus("ENABLED");
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingCategory) {
        await axios.patch(
          `http://localhost:3000/api/categories/${editingCategory.id}`,
          { name, status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:3000/api/categories/",
          { name, status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setIsOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <>
      <Layout title="Categorías" description="Gestión de categorías">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-title">Categorías</h2>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-[#012970] dark:bg-[#ec7c6a] text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90"
            >
              <RiAddLine /> Crear
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b dark:border-gray-600"
                  >
                    <td className="px-4 py-2 text-[#012970] dark:text-white">
                      {category.name}
                    </td>
                    <td className="px-4 py-2 text-[#012970] dark:text-white">
                      {category.status === "ENABLED" ? "Activo" : "Inactivo"}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        className="btn-edit"
                        onClick={() => openModal(category)}
                      >
                        <RiEdit2Line className="text-base sm:text-lg md:text-xl" />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(category.id)}
                      >
                        <RiDeleteBin6Line className="text-base sm:text-lg md:text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>

      {/* MODAL */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
      >
        <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold text-title">
            {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
          </Dialog.Title>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Estado:
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="ENABLED">Activo</option>
              <option value="DISABLED">Inactivo</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:opacity-90"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#012970] dark:bg-[#ec7c6a] text-white rounded-md hover:opacity-90"
            >
              {editingCategory ? "Actualizar" : "Crear"}
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default withAuth(Categories);
