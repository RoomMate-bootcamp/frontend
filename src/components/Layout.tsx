import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Users, Settings, LogOut, Menu, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-xl">
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">DormBuddy</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </header>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 bg-white">
          <SheetHeader>
            <SheetTitle>Меню</SheetTitle>
          </SheetHeader>
          <div className="mt-8 flex flex-col gap-4">
            <Link to="/">
              <Button
                className="justify-start cursor-pointer"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                }}
              >
                <Search className="mr-2 h-5 w-5" />
                Поиск
              </Button>
            </Link>
            <Link to="/matches">
              <Button
                className="justify-start cursor-pointer"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                }}
              >
                <Users className="mr-2 h-5 w-5" />
                Совпадения
              </Button>
            </Link>
            <Link to="/profile">
              <Button
                className="justify-start cursor-pointer"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                }}
              >
                <Settings className="mr-2 h-5 w-5" />
                Профиль
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="justify-start mt-auto cursor-pointer"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Выйти
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-col w-64 border-r bg-white p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">DormBuddy</h1>
            <p className="text-gray-500 text-base">Найди идеального соседа</p>
          </div>
          <div className="flex flex-col gap-2">
            <Link to="/">
              <Button className="justify-start cursor-pointer">
                <Search className="mr-2 h-5 w-5" />
                Поиск
              </Button>
            </Link>
            <Link to="/matches">
              <Button className="justify-start cursor-pointer">
                <Users className="mr-2 h-5 w-5" />
                Совпадения
              </Button>
            </Link>
            <Link to="/profile">
              <Button className="justify-start cursor-pointer">
                <Settings className="mr-2 h-5 w-5" />
                Профиль
              </Button>
            </Link>
          </div>
          <Button
            variant="ghost"
            className="justify-start cursor-pointer mt-auto"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Выйти
          </Button>
        </div>
        <div className="flex-1 p-4">{children}</div>
      </div>
    </div>
  );
}
