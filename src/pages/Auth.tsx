
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

const registerSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  confirmPassword: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp, signInWithTestAccount } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const navigate = useNavigate();
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Попытка входа с данными:", values.email);
      await signIn(values.email, values.password);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onRegisterSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Попытка регистрации с данными:", values.email);
      await signUp(values.email, values.password);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestAccountLogin = async () => {
    setIsTestLoading(true);
    try {
      await signInWithTestAccount();
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleSkipLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <h1 className="text-4xl font-display font-bold">Margo</h1>
              <span className="absolute -top-4 -left-6 text-xl">🌸</span>
              <span className="absolute -top-4 -right-6 text-xl">🌸</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? 'Вход в систему' : 'Регистрация'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin 
              ? 'Введите свои данные для входа' 
              : 'Создайте аккаунт для доступа к платформе'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4 p-3 bg-amber-50 rounded-md border border-amber-200 text-amber-700">
            <p className="text-sm font-medium">
              Для быстрого входа используйте кнопку "Войти с тестовым аккаунтом" или следующие данные:
            </p>
            <p className="text-sm mt-1">Email: <span className="font-mono">test@example.com</span></p>
            <p className="text-sm">Пароль: <span className="font-mono">password123</span></p>
          </div>

          {isLogin ? (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input 
                            placeholder="you@example.com" 
                            {...field} 
                            autoComplete="email"
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input 
                            type="password" 
                            placeholder="******" 
                            {...field} 
                            autoComplete="current-password"
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Вход..." : "Войти"}
                </Button>
                
                <div className="mt-4 relative text-center">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300"></span>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-card text-sm text-gray-500">или</span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={handleTestAccountLogin}
                  disabled={isTestLoading}
                >
                  {isTestLoading ? "Вход..." : "Войти с тестовым аккаунтом"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="w-full mt-4"
                  onClick={handleSkipLogin}
                >
                  Войти без регистрации
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input 
                            placeholder="you@example.com" 
                            autoComplete="email" 
                            {...field} 
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input 
                            type="password" 
                            placeholder="******" 
                            autoComplete="new-password" 
                            {...field}
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Подтвердите пароль</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                          <Input 
                            type="password" 
                            placeholder="******" 
                            autoComplete="new-password" 
                            {...field}
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
                </Button>
                
                <div className="mt-4 relative text-center">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300"></span>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-card text-sm text-gray-500">или</span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={handleTestAccountLogin}
                  disabled={isTestLoading}
                >
                  {isTestLoading ? "Вход..." : "Войти с тестовым аккаунтом"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="w-full mt-4"
                  onClick={handleSkipLogin}
                >
                  Войти без регистрации
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button 
            variant="link" 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin 
              ? 'Нет аккаунта? Зарегистрироваться' 
              : 'Уже есть аккаунт? Войти'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
