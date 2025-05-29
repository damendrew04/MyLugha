// src/LoginPage.jsx
import { useState } from 'react';
import { authService } from './services/api';
import { LogIn, User } from 'lucide-react';

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.login(email, password);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <div className="inline-flex justify-center items-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <User className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Log In</h2>
          <p className="text-gray-600 mt-1">Sign in to your MyLugha account</p>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
          <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            } text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" /> Log In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;