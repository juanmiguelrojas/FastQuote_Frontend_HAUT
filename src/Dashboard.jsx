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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Dashboard({ token, logout }) {
  const [topShoes, setTopShoes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const [resShoes, resCats] = await Promise.all([
          axios.get('http://localhost:8080/api/analytics/top-shoes', config),
          axios.get('http://localhost:8080/api/analytics/categories', config)
        ]);
        
        setTopShoes(resShoes.data);
        setCategories(resCats.data);
      } catch (error) {
        console.error("Error:", error);
        if(error.response && (error.response.status === 403 || error.response.status === 401)) {
            logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, logout]);

  // --- CONFIGURACIÓN DE GRÁFICAS ---
  const barData = {
    labels: topShoes.map(item => item.label || 'Sin Nombre'),
    datasets: [{
      label: 'Cotizaciones',
      data: topShoes.map(item => item.count),
      backgroundColor: '#4f46e5',
      borderRadius: 6,
    }],
  };
  
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } }
  };

  const pieData = {
    labels: categories.map(item => item.label),
    datasets: [{
      data: categories.map(item => item.count),
      backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'],
      borderWidth: 0,
    }],
  };

  const pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
  };

  return (
    <div className="dashboard-wrapper">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="brand">
          <h1>📊 FastQuote <span style={{fontSize: '0.8rem', color: '#666'}}>Admin Panel</span></h1>
        </div>
        <div className="user-info">
          <button onClick={logout} className="btn-logout">Cerrar Sesión</button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="dashboard-container">
        
        {loading ? (
          <div className="loading-spinner">
            <p>Cargando datos del servidor...</p>
          </div>
        ) : (
          <div className="stats-grid">
            
            {/* TARJETA 1: BARRAS */}
            <div className="card">
              <h3>🏆 Top Referencias Más Cotizadas</h3>
              <div className="chart-wrapper">
                {topShoes.length > 0 ? (
                  <Bar data={barData} options={barOptions} />
                ) : (
                  <p>No hay datos disponibles.</p>
                )}
              </div>
            </div>

            {/* TARJETA 2: PASTEL */}
            <div className="card">
              <h3>🧩 Preferencia por Referencia</h3>
              <div className="chart-wrapper">
                 {categories.length > 0 ? (
                   <div style={{width: '80%', height: '300px'}}>
                     <Pie data={pieData} options={pieOptions} />
                   </div>
                 ) : (
                   <p>No hay datos disponibles.</p>
                 )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;