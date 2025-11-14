import ErrorLayout from '../Layouts/ErrorLayout';
import Profile from '../pages/Profile';
import HeaderOnlyLayout from '../Layouts/HeaderOnlyLayout';
import Error from '../pages/Error';
import Home from '../pages/Home';
import DashBoard from '../pages/DashBoard';
import Devices from '../pages/Devices';
import Categories from '../pages/Categories';
import Consumables from '../pages/Consumables';
import Maintenance from '../pages/Maintenance';
import Calibration from '../pages/Calibration';
import Specifications from '../pages/Specifications';
import AssetDetail from '../component/AssetsComponent/AssetDetail';
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
        path: 'devices/:id',
        component: AssetDetail,
    },

    {
        path: '/specifications',
        component: Specifications,
    },
    {
        path: '/consumables',
        component: Consumables,
    },
    {
        path: '/maintenance',
        component: Maintenance,
    },
    {
        path: '/calibration',
        component: Calibration,
    },
    {
        path: '*',
        component: Error,
        layout: ErrorLayout,
    },
];

export { publicRoutes };
