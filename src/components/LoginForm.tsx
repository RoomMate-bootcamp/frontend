import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser, registerUser } from '@/lib/requests';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

// Импортируем логотип DormBuddy
import dormBuddyLogo from "../assets/dormbuddy-logo.svg";

export default function AuthForms() {
  const [activeTab, setActiveTab] = useState("login");
  const [, setCookie] = useCookies(["TOKEN"]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Register form state
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser(username, password);
      if (response.access_token) {
        setCookie('TOKEN', response.access_token, { path: '/' });
        navigate('/');
      } else {
        setError("Неверные учетные данные");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Ошибка при входе. Пожалуйста, проверьте учетные данные.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername || !regPassword || !email) {
      setError("Пожалуйста, заполните обязательные поля");
      return;
    }

    if (regPassword !== repeatPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (regPassword.length < 8) {
      setError("Пароль должен содержать не менее 8 символов");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await registerUser(regUsername, email, regPassword);

      // If registration successful, login automatically
      if (response && response.id) {
        const loginResponse = await loginUser(regUsername, regPassword);
        if (loginResponse.access_token) {
          setCookie('TOKEN', loginResponse.access_token, { path: '/' });
          navigate('/onboarding'); // Redirect to onboarding to complete profile
        } else {
          setError("Регистрация успешна, но не удалось войти автоматически");
          setActiveTab("login");
        }
      } else {
        setError("Ошибка при регистрации");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.message.includes("Username already registered")) {
        setError("Пользователь с таким именем уже существует");
      } else if (error.message.includes("Email already registered")) {
        setError("Email уже используется");
      } else {
        setError("Ошибка при регистрации. Пожалуйста, попробуйте позже.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <img src={dormBuddyLogo} alt="DormBuddy" className="w-16 h-16" />
          </div>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
            DormBuddy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Логин</Label>
                    <Input
                      id="username"
                      placeholder="Введите логин"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Введите пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {error && <p className="text-destructive text-sm">{error}</p>}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Вход...
                      </>
                    ) : "Войти"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Логин <span className="text-destructive">*</span></Label>
                    <Input
                      id="register-username"
                      placeholder="Логин"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@mail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Пароль <span className="text-destructive">*</span></Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Минимум 8 символов"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="repeat-password">Повторите пароль <span className="text-destructive">*</span></Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      placeholder="Повторите пароль"
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="text-sm text-muted-foreground mt-2">
                    <p>* - обязательные поля</p>
                    <p>Остальные данные вы заполните после регистрации</p>
                  </div>

                  {error && <p className="text-destructive text-sm">{error}</p>}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Регистрация...
                      </>
                    ) : "Зарегистрироваться"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}