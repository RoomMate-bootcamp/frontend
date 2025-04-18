// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

// export default function AuthForms() {
//   const [isLogin, setIsLogin] = useState(true);

//   const toggleForm = () => setIsLogin(!isLogin);

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <Card className="w-full max-w-md p-6">
//         <CardHeader>
//           <CardTitle className="text-center text-2xl font-bold">
//             {isLogin ? "Вход" : "Регистрация"}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form className="space-y-4">
//             {!isLogin && (
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                   Имя
//                 </label>
//                 <Input id="name" type="text" placeholder="Введите ваше имя" />
//               </div>
//             )}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <Input id="email" type="email" placeholder="Введите ваш email" />
//             </div>
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Пароль
//               </label>
//               <Input id="password" type="password" placeholder="Введите ваш пароль" />
//             </div>
//             {!isLogin && (
//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
//                   Подтвердите пароль
//                 </label>
//                 <Input id="confirmPassword" type="password" placeholder="Повторите ваш пароль" />
//               </div>
//             )}
//             <Button type="submit" className="w-full">
//               {isLogin ? "Войти" : "Зарегистрироваться"}
//             </Button>
//           </form>
//         </CardContent>
//         <CardFooter className="text-center">
//           <p className="text-sm text-gray-500">
//             {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
//             <button
//               type="button"
//               onClick={toggleForm}
//               className="text-blue-500 hover:underline"
//             >
//               {isLogin ? "Зарегистрироваться" : "Войти"}
//             </button>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

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

export default function AuthForms() {
  const [activeTab, setActiveTab] = useState("login");

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
            <Input placeholder="Логин" className="mb-4" />
            <Input type="password" placeholder="Пароль" className="mb-4" />
            <Button type="submit" className="w-full">
              Войти
            </Button>
          </form>
        ) : (
          <form className="mt-4">
            <Input placeholder="Логин" className="mb-4" />
            <Input type="password" placeholder="Пароль" className="mb-4" />
            <Input
              type="password"
              placeholder="Повторите пароль"
              className="mb-4"
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
