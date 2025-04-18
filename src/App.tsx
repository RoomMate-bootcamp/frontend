import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import RoommateMatcherApp from './roommate-matcher-app';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/roommate',
    element: <RoommateMatcherApp />
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App;
