import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { loginUser } from '@/lib/requests';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';

export default function AuthForms() {
  const [activeTab, setActiveTab] = useState("login");
  const [, setCookie] = useCookies(["TOKEN"]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const [user, setUser] = useState({
    "name": "",
    "age": 0,
    "gender": "",
    "occupation": "",
    "avatar": "",
    "bio": "",
    "interests": [],
    "cleanliness_level": 1,
    "sleep_habits": "",
    "rent_budget": 0,
    "location": "",
    "smoking_preference": "",
    "pet_preference": ""
  });

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "login" ? (
          <form className="mt-4">
            <Input placeholder="Логин" className="mb-4" onChange={(evt) => setUsername(evt.target.value)} />
            <Input type="password" placeholder="Пароль" className="mb-4" onChange={(evt) => setPassword(evt.target.value)} />
            <Button type="submit" className="w-full" onClick={() => {
              if (username && password) {
                try {
                  loginUser(username, password)
                  .then((token) => {
                    setCookie('TOKEN', token.access_token);
                    navigate('/');
                  })
                } catch (error) {
                  console.log(error);
                }
              }
            }}>
              Войти
            </Button>
          </form>
        ) : (
          <form className="mt-4">
            <Input placeholder="Логин" className="mb-4" onChange={(evt) => setLogin(evt.target.value)} />
            <Input type="password" placeholder="Пароль" className="mb-4" onChange={(evt) => setPassword(evt.target.value)} />
            <Input
              type="password"
              placeholder="Повторите пароль"
              className="mb-4"
              onChange={(evt) => setRepeatPassword(evt.target.value)}
            />
            <Input placeholder="Информация о себе" className="mb-4" />
            <Input placeholder="Возраст" className="mb-4" />
            <Input placeholder="Пол" className="mb-4" />
            <Input placeholder="Примерный бюджет" className="mb-4" />
            <Input placeholder="Режим сна" className="mb-4" />
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Уровень чистоты (1-5)" className='w-full' />
              </SelectTrigger>
              <SelectContent className='bg-white w-full'>
                {[1, 2, 3, 4, 5].map((level) => (
                  <SelectItem key={level} value={String(level)} className='w-full'>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Где хочешь жить?" className='w-full' />
              </SelectTrigger>
              <SelectContent className='bg-white w-full'>
                  <SelectItem key={0} value={"dorm"} className='w-full'>
                    Общежитие
                  </SelectItem>
                  <SelectItem key={1} value={"flat"} className='w-full'>
                    Квартира
                  </SelectItem>
                  <SelectItem key={2} value={"nomean"} className='w-full'>
                    Не важно
                  </SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Интересы" className="my-4" />
            <Input placeholder="Вредные привычки" className="mb-4" />
            <Button type="submit" className="w-full">
              Зарегистрироваться
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
