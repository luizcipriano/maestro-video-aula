
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-music-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Página não encontrada</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Desculpe, a página que você está procurando não existe ou foi removida.
          </p>
          <Button asChild>
            <Link to="/">Voltar para Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
