import { ReactNode, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import {
  Users,
  Settings,
  LogOut,
  Menu,
  Search,
  BrainCircuit,
  Crown,
  Bell,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { Badge } from "./ui/badge";
import { getNotifications } from "@/lib/requests";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getUserProfile } from "@/lib/requests";

// Импортируем логотип DormBuddy
import dormBuddyLogo from "../assets/dormbuddy-logo.svg";

export default function Layout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cookies, , removeCookie] = useCookies(["TOKEN"]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!cookies.TOKEN) {
      navigate('/login');
      return;
    }

    // Load user profile
    getUserProfile(cookies.TOKEN)
      .then(data => {
        setUserProfile(data);
      })
      .catch(err => {
        console.error("Failed to load profile:", err);
      });

    // Load notifications count
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(cookies.TOKEN);
        setUnreadCount(data.unread_count);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
    // Poll for notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [cookies.TOKEN, navigate]);

  const handleLogout = () => {
    removeCookie('TOKEN');
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <h1 className="text-2xl font-bold flex gap-2 items-center">
          <img src={dormBuddyLogo} alt="DormBuddy" className="w-10 h-10" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
            DormBuddy
          </span>
        </h1>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-6 w-6 flex items-center justify-center rounded-full p-0">
              {unreadCount}
            </Badge>
          )}
          {userProfile && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback>{userProfile?.name?.slice(0, 2) || 'U'}</AvatarFallback>
            </Avatar>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 bg-white z-10">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <img src={dormBuddyLogo} alt="DormBuddy" className="w-10 h-10" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
                DormBuddy
              </span>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-8 flex flex-col gap-3">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <Button
                variant={isActive('/') ? "default" : "ghost"}
                className="w-full justify-start cursor-pointer"
              >
                <Search className="mr-2 h-5 w-5" />
                Поиск
              </Button>
            </Link>
            <Link to="/matches" onClick={() => setIsMobileMenuOpen(false)}>
              <Button
                variant={isActive('/matches') ? "default" : "ghost"}
                className="w-full justify-start cursor-pointer"
              >
                <Users className="mr-2 h-5 w-5" />
                Совпадения
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 flex items-center justify-center rounded-full p-0">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
              <Button
                variant={isActive('/profile') ? "default" : "ghost"}
                className="w-full justify-start cursor-pointer"
              >
                <Settings className="mr-2 h-5 w-5" />
                Профиль
              </Button>
            </Link>
            <Link to="/ai" onClick={() => setIsMobileMenuOpen(false)}>
              <Button
                variant={isActive('/ai') ? "default" : "ghost"}
                className="w-full justify-start cursor-pointer"
              >
                <BrainCircuit className="mr-2 h-5 w-5" />
                CrocoAI
              </Button>
            </Link>
            <Link to="/sub" onClick={() => setIsMobileMenuOpen(false)}>
              <Button
                variant={isActive('/sub') ? "default" : "ghost"}
                className="w-full justify-start cursor-pointer"
              >
                <Crown className="mr-2 h-5 w-5" />
                Подписка
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start mt-auto cursor-pointer text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Выйти
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 z-10">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-col w-64 border-r bg-white p-4 h-screen sticky top-0">
          <div className="mb-8">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <img src={dormBuddyLogo} alt="DormBuddy" className="w-12 h-12" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
                DormBuddy
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Как найти соседа?</p>
          </div>

          {userProfile && (
            <div className="mb-6 flex items-center gap-3 p-2 rounded-lg bg-gray-50">
              <Avatar className="h-10 w-10 avatar-ring">
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                <AvatarFallback>{userProfile?.name?.slice(0, 2) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{userProfile.name || 'Пользователь'}</p>
                <p className="text-xs text-gray-500">{userProfile.email}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Link to="/">
              <Button
                variant={isActive('/') ? "default" : "ghost"}
                className="w-full justify-start cursor-pointer"
              >
                <Search className="mr-2 h-5 w-5" />
                Поиск
              </Button>
            </Link>
            <Link to="/matches">
              <Button
                variant={isActive('/matches') ? "default" : "ghost"}
                className="w-full justify-start cursor-pointer relative"
              >
                <Users className="mr-2 h-5 w-5" />
                Совпадения
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 flex items-center justify-center rounded-full p-0">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link to="/profile">
              <Button
                variant={isActive('/profile') ? "default" : "ghost"}
                className="w-full justify-start cursor-pointer"
              >
                <Settings className="mr-2 h-5 w-5" />
                Профиль
              </Button>
            </Link>
            <Link to="/ai">
              <Button
                variant={isActive('/ai') ? "default" : "ghost"}
                className="w-full justify-start cursor-pointer"
              >
                <BrainCircuit className="mr-2 h-5 w-5" />
                CrocoAI
              </Button>
            </Link>
            <Link to="/sub">
              <Button
                variant={isActive('/sub') ? "default" : "ghost"}
                className="w-full justify-start cursor-pointer"
              >
                <Crown className="mr-2 h-5 w-5" />
                Подписка
              </Button>
            </Link>
          </div>
          <Button
            variant="ghost"
            className="justify-start cursor-pointer mt-auto text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Выйти
          </Button>
        </div>
        <div className="flex-1 p-4 md:p-6 animate-in">{children}</div>
      </div>
    </div>
  );
}