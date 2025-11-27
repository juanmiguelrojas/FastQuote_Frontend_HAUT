// src/Login.jsx
import { useState } from 'react';
import axios from 'axios';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Llamamos a tu endpoint de Login
      const response = await axios.post('http://localhost:8080/auth/login', {
        username: username,
        password: password
      });

      // 2. Si es exitoso, guardamos el token
      const tokenRecibido = response.data.token;
      setToken(tokenRecibido);
      localStorage.setItem('token', tokenRecibido); // Guardar en el navegador
      
    } catch (err) {
      setError('Credenciales incorrectas. Intenta de nuevo.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2>Acceso Administrativo</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario:</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Ingresar</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}

export default Login;