import { createBrowserRouter } from 'react-router-dom';
import AdsListPage from '../pages/ads-list'
import AdDetailsPage from '../pages/ad-details'
import AdEditPage from '../pages/ad-edit'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdsListPage />,
  },
  {
    path: '/ads',
    element: <AdsListPage />,
  },
  {
    path: '/ads/:id',
    element: <AdDetailsPage />,
  },
  {
    path: '/ads/:id/edit',
    element: <AdEditPage />,
  },
]);