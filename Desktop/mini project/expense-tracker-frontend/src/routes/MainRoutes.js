import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout/index';

// Authentication check function (mock function, replace with actual auth check)

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const ShowIncome = Loadable(lazy(() => import('pages/components-overview/ShowIncome')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element:  <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'income',
      element: <ShowIncome />
    }
  ]
};

export default MainRoutes;