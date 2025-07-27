import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.username, formData.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-200 py-12 px-4">
      <div className="w-full max-w-md rounded-2xl shadow-xl bg-white/80 backdrop-blur-lg p-8 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <span className="flex items-center justify-center h-14 w-14 rounded-full bg-primary-100 mb-1 shadow-inner">
            <LogIn className="h-7 w-7 text-primary-600" />
          </span>
          <h2 className="text-2xl text-center font-bold tracking-tight text-gray-900">PixelForge Nexus</h2>
          <p className="text-center text-sm text-gray-600">Sign in to your account</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition-all duration-200 px-4 py-2 bg-white text-base placeholder-gray-400"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                aria-label="Username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-400 focus:border-primary-500 transition-all duration-200 px-4 py-2 pr-11 bg-white text-base placeholder-gray-400"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete={showPassword ? "off" : "current-password"}
                  aria-label="Password"
                />
                <button
                  type="button"
                  tabIndex={0}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-center space-x-2 bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded-md text-sm font-medium animate-shake"
            >
              <span className="text-lg font-bold">!</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white font-semibold py-2.5 transition-all disabled:cursor-not-allowed shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {loading ? (
              <span className="h-5 w-5 inline-block border-2 border-primary-100 border-t-primary-500 rounded-full animate-spin"></span>
            ) : (
              <span>Sign in</span>
            )}
          </button>

          <div className="text-center text-xs text-gray-500 mt-6 select-none">
            <p>Default admin credentials:</p>
            <div className="bg-gray-50 mt-2 p-2 rounded font-mono text-[13px] text-gray-800 shadow-inner border border-gray-200">
              Username: <span className="font-semibold">admin</span> &nbsp;|&nbsp; Password: <span className="font-semibold">admin123</span>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}

export default Login;
