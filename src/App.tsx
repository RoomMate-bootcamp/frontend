import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import Search from '@/pages/Search';
import Profile from '@/pages/Profile';
import Matches from '@/pages/Matches';
import LoginForm from '@/components/LoginForm';
import Ai from '@/pages/Ai';
import Sub from '@/pages/Sub';
import Onboarding from '@/components/Onboarding';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Search />,
  },
  {
    path: '/matches',
    element: <Matches />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/login',
    element: <LoginForm />,
  },
  {
    path: '/ai',
    element: <Ai />,
  },
  {
    path: '/sub',
    element: <Sub />,
  },
  {
    path: '/onboarding',
    element: <Onboarding />,
  },
]);

function App() {
  return (
    <CookiesProvider>
      <RouterProvider router={router} />
    </CookiesProvider>
  )
}

export default App;