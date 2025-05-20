
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-music-700 to-music-500">
            MúsicaAulas
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          {authState.isAuthenticated ? (
            <>
              <Link to="/" className="text-gray-600 hover:text-music-600 transition-colors">
                Home
              </Link>
              {authState.user?.role === 'professor' && (
                <Link to="/admin" className="text-gray-600 hover:text-music-600 transition-colors">
                  Painel de Controle
                </Link>
              )}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-600">
                  {authState.user?.name} ({authState.user?.role === 'professor' ? 'Professor' : 'Aluno'})
                </span>
                <Button variant="outline" onClick={handleLogout}>
                  Sair
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-music-600 transition-colors">
                Entrar
              </Link>
              <Link to="/register">
                <Button>Cadastre-se</Button>
              </Link>
            </>
          )}
        </nav>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" className="text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
