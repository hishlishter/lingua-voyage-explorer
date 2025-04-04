
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';

const Auth = () => {
  const { supabaseInitialized, signInWithTestAccount } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="w-full max-w-md p-4">
        {!supabaseInitialized && (
          <Card className="mb-4 border-yellow-400">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-2 text-yellow-600">
                <AlertCircle className="h-5 w-5 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Supabase не настроен</h3>
                  <p className="text-sm">
                    Приложение работает в режиме разработки без настроенного Supabase.
                    Вы можете продолжить и использовать тестовую учетную запись, но некоторые функции могут быть недоступны.
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
            <LoginForm />
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm" onClick={signInWithTestAccount} className="w-full">
                Войти с тестовым аккаунтом
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="signup">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
