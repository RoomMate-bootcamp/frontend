import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Search from '@/pages/Search';
import Profile from '@/pages/Profile';
import Matches from '@/pages/Matches';
import LoginForm from '@/components/LoginForm';
import Ai from '@/pages/Ai';
import Sub from '@/pages/Sub';

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
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App;
