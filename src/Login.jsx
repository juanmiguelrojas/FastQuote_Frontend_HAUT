import { useState } from 'react';
import axios from 'axios';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        username,
        password
      });

      const tokenRecibido = response.data.token;
      setToken(tokenRecibido);
      localStorage.setItem('token', tokenRecibido);
      
    } catch (err) {
      setError('Usuario o contraseña incorrectos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>👟 FastQuote Admin</h2>
        <p style={{marginBottom: '20px', color: '#6b7280'}}>Inicia sesión para ver las métricas</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario</label>
            <input 
              type="text" 
              placeholder="Ej: admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Verificando...' : 'Ingresar al Dashboard'}
          </button>
        </form>

        {error && <div className="error-msg">{error}</div>}
      </div>
    </div>
  );
}

export default Login;