import React, { Suspense } from 'react';
import { Spin } from 'antd';
import ErrorBoundary from './MaintenanceErrorBoundary';
import { MaintenanceTableSkeleton, MaintenanceDashboardSkeleton } from './MaintenanceSkeleton';

// Lazy load các components lớn
const MaintenanceDashboard = React.lazy(() => 
    import('./MaintenanceDashboard/MaintenanceDashboard')
);
const MaintenanceReport = React.lazy(() => 
    import('./MaintenanceReport')
);
const MaintenanceForm = React.lazy(() => 
    import('./MaintenanceForm/MaintenanceForm')
);

// Component chính với code splitting
const MaintenanceComponent = () => {
    return (
        <ErrorBoundary>
            <Suspense fallback={<MaintenanceTableSkeleton />}>
                {/* Tabs và các thành phần chính */}
                <Tabs defaultActiveKey="list">
                    <TabPane tab="Thống kê" key="dashboard">
                        <Suspense fallback={<MaintenanceDashboardSkeleton />}>
                            <MaintenanceDashboard />
                        </Suspense>
                    </TabPane>
                    <TabPane tab="Danh sách" key="list">
                        <MaintenanceList />
                    </TabPane>
                    <TabPane tab="Báo cáo" key="report">
                        <Suspense fallback={<Spin />}>
                            <MaintenanceReport />
                        </Suspense>
                    </TabPane>
                </Tabs>

                {/* Modal form với lazy loading */}
                <Suspense fallback={<Spin />}>
                    <MaintenanceForm />
                </Suspense>
            </Suspense>
        </ErrorBoundary>
    );
};

// Tối ưu re-render với memo
const MaintenanceList = React.memo(({ data, onEdit, onDelete }) => {
    // ... implementation
});

export default MaintenanceComponent;