import axios from "axios";
import { useEffect, useState } from "react";
import CardReserva from "../components/cardReserva";
import Layout from "../components/shared/layout";

const Home = () => {
  const [foods, setFoods] = useState([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : "";

  const fetchFoods = async () => {
    try {
      const response = await axios.get("http://localhost:3000/reservas");
      setFoods(response.data);
    } catch (error) {
      console.error("Error fetching foods:", error);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [token]);

  return (
    <>
      <Layout title="Comidas" description="Gestión de comidas">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-title ">Reservas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {foods.map((food) => (
              <CardReserva key={food.id} reserva={food} />
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
