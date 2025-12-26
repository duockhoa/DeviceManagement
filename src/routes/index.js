import ErrorLayout from '../Layouts/ErrorLayout';
import Profile from '../pages/Profile';
import HeaderOnlyLayout from '../Layouts/HeaderOnlyLayout';
import Error from '../pages/Error';
import Home from '../pages/Home';
import DashBoard from '../pages/DashBoard';
import Devices from '../pages/Devices';
import Categories from '../pages/Categories';
import ChecklistStandards from '../pages/ChecklistStandards';
import AssetSpecifications from '../pages/AssetSpecifications';
import Consumables from '../pages/Consumables';
import Maintenance from '../pages/Maintenance';
import MaintenanceDetail from '../component/MaintenanceComponent/MaintenanceDetail';
import MaintenanceWork from '../pages/MaintenanceWork';
import MaintenanceWorkDetail from '../pages/MaintenanceWorkDetail';
import MaintenanceResult from '../pages/MaintenanceResult';
import MaintenanceRecord from '../pages/MaintenanceRecord';
import MaintenancePlan from '../pages/MaintenancePlan';
// import WorkRequests from '../pages/WorkRequests'; // DEPRECATED: Merged into Incidents with 4 categories
import Calibration from '../pages/Calibration';
import Specifications from '../pages/Specifications';
import AssetDetail from '../component/AssetsComponent/AssetDetail';
import IncidentsPage from '../pages/Incidents';
import IncidentDetail from '../pages/IncidentDetail';
import IncidentReport from '../pages/IncidentReport';
import IncidentReports from '../pages/IncidentReports';
import Handovers from '../pages/Handovers';
import HandoversFollowUp from '../pages/HandoversFollowUp';
import AccessControlPage from '../pages/AccessControl';
import RBACManagement from '../pages/RBACManagement';
import OeeMtbfDashboard from '../pages/Reports/OeeMtbfDashboard';
import OeeImportPage from '../pages/Reports/OeeImport';
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
        path: '/asset-specifications',
        component: AssetSpecifications,
    },
    {
        path: '/consumables',
        component: Consumables,
    },
    {
        path: '/checklist-standards',
        component: ChecklistStandards,
    },
    {
        path: '/maintenance',
        component: Maintenance,
    },
    {
        path: '/maintenance-plan',
        component: MaintenancePlan,
    },
    // DEPRECATED: Work Requests merged into Incidents with 4 categories (EQUIPMENT, FACILITY, SYSTEM, OPERATION)
    // {
    //     path: '/work-requests',
    //     component: WorkRequests,
    // },
    // {
    //     path: '/work-requests/ops',
    //     component: WorkRequests,
    // },
    {
        path: '/maintenance/:id',
        component: MaintenanceDetail,
    },
    {
        path: '/maintenance-work',
        component: MaintenanceWork,
    },
    {
        path: '/maintenance-work/:id',
        component: MaintenanceWorkDetail,
    },
    {
        path: '/maintenance-result',
        component: MaintenanceResult,
    },
    {
        path: '/maintenance-record',
        component: MaintenanceRecord,
    },
    {
        path: '/incidents',
        component: IncidentsPage,
    },
    {
        path: '/incidents/reports',
        component: IncidentReports,
    },
    {
        path: '/incidents/:id',
        component: IncidentDetail,
    },
    {
        path: '/handovers',
        component: Handovers,
    },
    {
        path: '/handovers/follow-up',
        component: HandoversFollowUp,
    },
    {
        path: '/access-control',
        component: AccessControlPage,
    },
    {
        path: '/rbac',
        component: RBACManagement,
    },
    {
        path: '/calibration',
        component: Calibration,
    },
    {
        path: '/reports/oee-mtbf',
        component: OeeMtbfDashboard,
    },
    {
        path: '/reports/oee-import',
        component: OeeImportPage,
    },
    {
        path: '*',
        component: Error,
        layout: ErrorLayout,
    },
];

export { publicRoutes };
