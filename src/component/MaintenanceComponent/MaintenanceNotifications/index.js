import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notification } from 'antd';
import { 
    getUpcomingMaintenance, 
    getDevicesNeedMaintenance 
} from '../../../redux/slice/maintenanceSlice';

const MaintenanceNotifications = () => {
    const dispatch = useDispatch();
    const upcomingMaintenance = useSelector(state => state.maintenance.upcomingMaintenance);
    const devicesNeedMaintenance = useSelector(state => state.maintenance.devicesNeedMaintenance);

    useEffect(() => {
        // Lấy dữ liệu khi component mount
        dispatch(getUpcomingMaintenance());
        dispatch(getDevicesNeedMaintenance());

        // Cập nhật dữ liệu mỗi giờ
        const interval = setInterval(() => {
            dispatch(getUpcomingMaintenance());
            dispatch(getDevicesNeedMaintenance());
        }, 3600000);

        return () => clearInterval(interval);
    }, [dispatch]);

    useEffect(() => {
        // Hiển thị thông báo cho bảo trì sắp tới
        upcomingMaintenance.forEach(maintenance => {
            const maintenanceDate = new Date(maintenance.maintenanceDate);
            const today = new Date();
            const diffDays = Math.ceil((maintenanceDate - today) / (1000 * 60 * 60 * 24));

            if (diffDays <= 7) {
                notification.warning({
                    message: 'Lịch bảo trì sắp tới',
                    description: `Thiết bị ${maintenance.deviceName} cần được bảo trì trong ${diffDays} ngày nữa`,
                    duration: 0,
                    key: `upcoming-${maintenance.id}`
                });
            }
        });
    }, [upcomingMaintenance]);

    useEffect(() => {
        // Hiển thị thông báo cho thiết bị cần bảo trì
        devicesNeedMaintenance.forEach(device => {
            notification.error({
                message: 'Thiết bị cần bảo trì',
                description: `${device.name} đã quá hạn bảo trì ${device.daysOverdue} ngày`,
                duration: 0,
                key: `need-maintenance-${device.id}`
            });
        });
    }, [devicesNeedMaintenance]);

    return null; // Component này không render UI
};

export default MaintenanceNotifications;