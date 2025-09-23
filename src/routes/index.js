import ErrorLayout from '../Layouts/ErrorLayout';
import Profile from '../pages/Profile';
import HeaderOnlyLayout from '../Layouts/HeaderOnlyLayout';
import Error from '../pages/Error';
import Home from '../pages/Home';
import DashBoard from '../pages/DashBoard';
import DeviceCategory from '../pages/DeviceCategory';
const publicRoutes = [
    {
        path: '/',
        component: DashBoard,
    },
    { path: '/profile', component: Profile, layout: HeaderOnlyLayout },
    {
        path: 'device-category',
        component: DeviceCategory,
    },

    {
        path: '*',
        component: Error,
        layout: ErrorLayout,
    },
];

export { publicRoutes };
