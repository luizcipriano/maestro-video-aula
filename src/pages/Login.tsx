
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { GoogleIcon } from '@/components/icons/GoogleIcon';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos em branco",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const success = await login({ email, password });
      
      if (success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
        navigate('/');
      } else {
        toast({
          title: "Falha no login",
          description: "Email ou senha incorretos.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro ao tentar fazer login.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      const success = await loginWithGoogle();
      
      if (success) {
        toast({
          title: "Login com Google realizado",
          description: "Bem-vindo à MúsicaAulas!",
        });
        navigate('/');
      } else {
        toast({
          title: "Falha no login com Google",
          description: "Ocorreu um erro ao tentar fazer login com Google.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login com Google",
        description: "Ocorreu um erro ao tentar fazer login com Google.",
        variant: "destructive"
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Demonstration credentials
  const loginAsProfessor = () => {
    setEmail('joao@example.com');
    setPassword('senha123');
  };

  const loginAsStudent = () => {
    setEmail('maria@example.com');
    setPassword('senha123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-music-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Entre para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
          >
            <GoogleIcon />
            {isGoogleLoading ? "Conectando..." : "Entrar com Google"}
          </Button>
          
          <div className="flex items-center gap-2">
            <Separator className="flex-grow" />
            <span className="text-xs text-muted-foreground">OU</span>
            <Separator className="flex-grow" />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link to="/forgot-password" className="text-sm text-music-600 hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            <p>Demonstração:</p>
            <div className="flex justify-center gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={loginAsProfessor}>
                Login como Professor
              </Button>
              <Button variant="outline" size="sm" onClick={loginAsStudent}>
                Login como Aluno
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm text-gray-500 mt-2">
            Não tem uma conta?{" "}
            <Link to="/register" className="text-music-600 hover:underline">
              Cadastre-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
