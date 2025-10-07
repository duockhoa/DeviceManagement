import ErrorLayout from '../Layouts/ErrorLayout';
import Profile from '../pages/Profile';
import HeaderOnlyLayout from '../Layouts/HeaderOnlyLayout';
import Error from '../pages/Error';
import Home from '../pages/Home';
import DashBoard from '../pages/DashBoard';
import Devices from '../pages/Devices';
import Categories from '../pages/Categories';
const publicRoutes = [
    {
        path: '/',
        component: DashBoard,
    },
    { path: '/profile', component: Profile, layout: HeaderOnlyLayout },
    {
        path: 'devices',
        component: Devices,
    },
    {
        path: '/categories',
        component: Categories,
    },
    {
        path: '*',
        component: Error,
        layout: ErrorLayout,
    },
];

export { publicRoutes };
