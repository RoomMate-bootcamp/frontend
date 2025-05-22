import Layout from "@/components/Layout";
import { Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sub() {
  return (
    <Layout>
      <div className="w-full text-center text-2xl my-7">
        Преимущества подписки:
      </div>
      <ul className="w-full flex flex-wrap justify-center gap-3">
        <li className="w-full flex justify-center gap-3 items-center">
          <Sparkles /> неограниченный доступ к CrocoAI
        </li>
        <li className="w-full flex justify-center gap-3 items-center">
          <Sparkles /> неограниченные свайпы
        </li>
        <li className="w-full flex justify-center gap-3 items-center">
          <Sparkles /> нет рекламы
        </li>
      </ul>
      <div className="w-full text-center my-7 text-2xl">
        ВСЕГО ЗА <span className="line-through">800</span> 450 РУБЛЕЙ!!!
      </div>
      <div className="w-full flex justify-center">
        <Button className='cursor-pointer'>
          <Crown />
          Оформить подписку
        </Button>
      </div>
    </Layout>
  );
}
