import ErrorLayout from '../Layouts/ErrorLayout';
import Profile from '../pages/Profile';
import HeaderOnlyLayout from '../Layouts/HeaderOnlyLayout';
import Error from '../pages/Error';
import Home from '../pages/Home';
const publicRoutes = [
    {
        path: '/',
        component: Home,
    },
    { path: '/profile', component: Profile, layout: HeaderOnlyLayout },
    {
        path: '/advance-money',
        component: Home,
    },

    {
        path: '*',
        component: Error,
        layout: ErrorLayout,
    },
];

export { publicRoutes };
