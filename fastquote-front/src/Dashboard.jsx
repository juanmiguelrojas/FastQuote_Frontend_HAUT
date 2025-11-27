// src/Dashboard.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Registrar componentes de ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Dashboard({ token, logout }) {
  const [topShoes, setTopShoes] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Función para traer datos del backend
    const fetchData = async () => {
      const config = {
        headers: { Authorization: `Bearer ${token}` } // ¡Aquí va tu Token!
      };

      try {
        // Petición 1: Top Zapatos
        const resShoes = await axios.get('http://localhost:8080/api/analytics/top-shoes', config);
        setTopShoes(resShoes.data);

        // Petición 2: Categorías
        const resCats = await axios.get('http://localhost:8080/api/analytics/categories', config);
        setCategories(resCats.data);

      } catch (error) {
        console.error("Error cargando datos", error);
        if(error.response &&(error.response.status === 403 || error.response.status === 401)) {
            logout(); // Si el token vence, sacar al usuario
        }
      }
    };

    fetchData();
  }, [token, logout]);

  // Configuración de Datos para la Gráfica de Barras
  const barData = {
    labels: topShoes.map(item => item.label || 'Desconocido'),
    datasets: [
      {
        label: 'Cantidad de Cotizaciones',
        data: topShoes.map(item => item.count),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  // Configuración de Datos para la Gráfica de Pastel
  const pieData = {
    labels: categories.map(item => item.label),
    datasets: [
      {
        label: '# de Búsquedas',
        data: categories.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard">
      <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1>Dashboard de Cotizaciones</h1>
        <button onClick={logout} style={{backgroundColor: '#ff4444', color: 'white'}}>Cerrar Sesión</button>
      </header>
      
      <div style={{display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap'}}>
        
        {/* Gráfica 1 */}
        <div style={{flex: 1, minWidth: '300px', border: '1px solid #ddd', padding: '20px', borderRadius: '10px'}}>
          <h3>Top Zapatos Más Buscados</h3>
          {topShoes.length > 0 ? <Bar data={barData} /> : <p>Cargando datos...</p>}
        </div>

        {/* Gráfica 2 */}
        <div style={{flex: 1, minWidth: '300px', border: '1px solid #ddd', padding: '20px', borderRadius: '10px'}}>
          <h3>Distribución por Categorías</h3>
          <div style={{maxWidth: '300px', margin: '0 auto'}}>
             {categories.length > 0 ? <Pie data={pieData} /> : <p>Cargando datos...</p>}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;