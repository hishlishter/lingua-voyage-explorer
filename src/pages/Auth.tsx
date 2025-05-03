
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const { signIn, signUp, supabaseInitialized, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Show visual feedback when Supabase isn't initialized
  useEffect(() => {
    if (!supabaseInitialized) {
      toast.warning('Supabase не настроен', {
        description: 'Проверьте подключение к Supabase',
        duration: 6000,
      });
    }
  }, [supabaseInitialized]);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('Attempting to sign in with email:', email);
      await signIn(email, password);
    } catch (error) {
      console.error('Sign in error in component:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('Attempting to sign up with email:', email);
      const displayName = username || email.split('@')[0];
      await signUp(email, password, displayName);
    } catch (error) {
      console.error('Sign up error in component:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="w-full max-w-md p-4">
        {!supabaseInitialized && (
          <Card className="mb-4 border-yellow-400 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-2 text-yellow-600">
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Supabase не настроен</h3>
                  <p className="text-sm">
                    Приложение работает в режиме разработки без настроенного Supabase.
                    Пожалуйста, настройте подключение к Supabase.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="signin">Вход</TabsTrigger>
            <TabsTrigger value="signup">Регистрация</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Вход в аккаунт</CardTitle>
                <CardDescription>
                  Введите ваши данные ниже для входа
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signin-password">Пароль</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Загрузка...' : 'Войти'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Создать аккаунт</CardTitle>
                <CardDescription>
                  Зарегистрируйтесь для начала обучения
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="signup-username">Имя пользователя</Label>
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="Ваше имя"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading || !supabaseInitialized}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading || !supabaseInitialized}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signup-password">Пароль</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading || !supabaseInitialized}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading || !supabaseInitialized}>
                      {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
                    </Button>
                    {!supabaseInitialized && (
                      <p className="text-xs text-yellow-600 text-center">
                        Регистрация недоступна в режиме разработки
                      </p>
                    )}
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">
                  Регистрируясь, вы соглашаетесь с нашими условиями использования и политикой конфиденциальности.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
