
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import '@/styles/gradients.css';

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
        description: 'Необходимо настроить переменные окружения для Supabase',
        duration: 8000,
      });
    }
  }, [supabaseInitialized]);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }
    
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
    if (!email || !password) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Пароль должен быть не менее 6 символов');
      return;
    }
    
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 animate-gradient-x">
      <div className="w-full max-w-md p-4 relative">
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-36 h-36 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {!supabaseInitialized && (
          <Card className="mb-4 border-yellow-400 bg-yellow-50 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-2 text-yellow-600">
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Supabase не настроен</h3>
                  <p className="text-sm">
                    Приложение работает в режиме разработки без настроенного Supabase.
                    Пожалуйста, настройте переменные окружения VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="relative backdrop-blur-sm bg-white/30 p-6 rounded-2xl shadow-xl border border-white/20">
          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500 font-display">
              Mar<span className="text-6xl">GO</span>
            </h1>
            <div className="h-1 w-20 mx-auto mt-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
          </div>
          
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/40 rounded-xl p-1">
              <TabsTrigger value="signin" className="data-[state=active]:bg-white rounded-lg">Вход</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-white rounded-lg">Регистрация</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <Card className="border-0 shadow-lg bg-white/70">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-display text-purple-800">Вход в аккаунт</CardTitle>
                  <CardDescription className="text-gray-600">
                    Введите ваши данные для входа
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-gray-700 font-medium">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="bg-white/80 border-gray-200 focus:border-purple-400 focus:ring-purple-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-gray-700 font-medium">Пароль</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="bg-white/80 border-gray-200 focus:border-purple-400 focus:ring-purple-300"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5" 
                      disabled={isLoading || !supabaseInitialized}
                    >
                      {isLoading ? 'Загрузка...' : 'Войти'}
                    </Button>
                    
                    {!supabaseInitialized && (
                      <div className="flex items-center mt-4 p-3 bg-blue-50 rounded-lg text-blue-600 text-sm">
                        <Info className="h-4 w-4 mr-2 flex-shrink-0" />
                        <p>
                          Для настройки Supabase, создайте файл .env с переменными VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY
                        </p>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card className="border-0 shadow-lg bg-white/70">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-display text-purple-800">Создать аккаунт</CardTitle>
                  <CardDescription className="text-gray-600">
                    Зарегистрируйтесь для начала обучения
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="signup-username" className="text-gray-700 font-medium">Имя пользователя</Label>
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="Ваше имя"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading || !supabaseInitialized}
                        className="bg-white/80 border-gray-200 focus:border-purple-400 focus:ring-purple-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-gray-700 font-medium">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading || !supabaseInitialized}
                        className="bg-white/80 border-gray-200 focus:border-purple-400 focus:ring-purple-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-gray-700 font-medium">Пароль</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading || !supabaseInitialized}
                        className="bg-white/80 border-gray-200 focus:border-purple-400 focus:ring-purple-300"
                      />
                      <p className="text-xs text-gray-500 mt-1">Минимум 6 символов</p>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5" 
                      disabled={isLoading || !supabaseInitialized}
                    >
                      {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
                    </Button>
                    {!supabaseInitialized && (
                      <div className="flex items-center mt-4 p-3 bg-blue-50 rounded-lg text-blue-600 text-sm">
                        <Info className="h-4 w-4 mr-2 flex-shrink-0" />
                        <p>
                          Регистрация недоступна в режиме разработки без настроенного Supabase. Добавьте переменные окружения в файл .env
                        </p>
                      </div>
                    )}
                  </form>
                </CardContent>
                <CardFooter className="pt-0 pb-4">
                  <p className="text-sm text-gray-500 text-center w-full">
                    Регистрируясь, вы соглашаетесь с нашими условиями использования и политикой конфиденциальности.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
