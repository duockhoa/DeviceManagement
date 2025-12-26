// SAP PM-lite Constants for CMMS System

export const NOTIFICATION_TYPES = {
    M1: {
        code: 'M1',
        label: 'Breakdown',
        labelVi: 'Hỏng hóc',
        description: 'Critical breakdown - requires immediate isolation',
        descriptionVi: 'Hỏng hóc nghiêm trọng - yêu cầu cô lập ngay',
        color: 'error',
        requiresIsolation: true
    },
    M2: {
        code: 'M2',
        label: 'Maintenance Request',
        labelVi: 'Yêu cầu bảo trì',
        description: 'Preventive or corrective maintenance request',
        descriptionVi: 'Yêu cầu bảo trì định kỳ hoặc khắc phục',
        color: 'warning',
        requiresIsolation: false
    },
    M3: {
        code: 'M3',
        label: 'Activity Report',
        labelVi: 'Báo cáo hoạt động',
        description: 'Activity monitoring and reporting',
        descriptionVi: 'Theo dõi và báo cáo hoạt động',
        color: 'info',
        requiresIsolation: false
    },
    M4: {
        code: 'M4',
        label: 'Service Request',
        labelVi: 'Yêu cầu dịch vụ',
        description: 'Support service request',
        descriptionVi: 'Yêu cầu dịch vụ hỗ trợ',
        color: 'default',
        requiresIsolation: false
    }
};

export const OPERATIONAL_STATUS = {
    AVLB: {
        code: 'AVLB',
        label: 'Available',
        labelVi: 'Sẵn sàng',
        description: 'Asset is operational and available',
        descriptionVi: 'Thiết bị hoạt động bình thường',
        color: 'success'
    },
    MNTC: {
        code: 'MNTC',
        label: 'Maintenance',
        labelVi: 'Bảo trì',
        description: 'Asset is under maintenance',
        descriptionVi: 'Thiết bị đang được bảo trì',
        color: 'warning'
    },
    DOWN: {
        code: 'DOWN',
        label: 'Down',
        labelVi: 'Ngừng hoạt động',
        description: 'Asset is down/broken',
        descriptionVi: 'Thiết bị ngừng hoạt động/hỏng',
        color: 'error'
    },
    DCOM: {
        code: 'DCOM',
        label: 'Decommissioned',
        labelVi: 'Đã ngừng sử dụng',
        description: 'Asset is decommissioned',
        descriptionVi: 'Thiết bị đã ngừng sử dụng',
        color: 'default'
    }
};

export const SYSTEM_STATUS = {
    CRTD: {
        code: 'CRTD',
        label: 'Created',
        labelVi: 'Đã tạo',
        description: 'Work order created',
        descriptionVi: 'Lệnh công việc đã tạo',
        canExecute: false
    },
    REL: {
        code: 'REL',
        label: 'Released',
        labelVi: 'Đã phát hành',
        description: 'Ready for execution',
        descriptionVi: 'Sẵn sàng thực hiện',
        canExecute: true
    },
    TECO: {
        code: 'TECO',
        label: 'Technically Complete',
        labelVi: 'Hoàn thành kỹ thuật',
        description: 'Work completed',
        descriptionVi: 'Công việc đã hoàn thành',
        canExecute: false
    }
};

export const SEVERITY_LEVELS = {
    critical: {
        value: 'critical',
        label: 'Critical',
        labelVi: 'Khẩn cấp',
        icon: '🔴',
        color: 'error',
        priority: 1
    },
    high: {
        value: 'high',
        label: 'High',
        labelVi: 'Cao',
        icon: '🟠',
        color: 'warning',
        priority: 2
    },
    medium: {
        value: 'medium',
        label: 'Medium',
        labelVi: 'Trung bình',
        icon: '🟡',
        color: 'info',
        priority: 3
    },
    low: {
        value: 'low',
        label: 'Low',
        labelVi: 'Thấp',
        icon: '🟢',
        color: 'success',
        priority: 4
    }
};

export const SHIFT_OPTIONS = [
    { value: 'morning', label: 'Ca sáng', time: '6:00 - 14:00' },
    { value: 'afternoon', label: 'Ca chiều', time: '14:00 - 22:00' },
    { value: 'night', label: 'Ca đêm', time: '22:00 - 6:00' }
];

// Helper functions
export const getNotificationTypeConfig = (type) => {
    return NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.M4;
};

export const getOperationalStatusConfig = (status) => {
    return OPERATIONAL_STATUS[status] || OPERATIONAL_STATUS.AVLB;
};

export const getSystemStatusConfig = (status) => {
    return SYSTEM_STATUS[status] || SYSTEM_STATUS.CRTD;
};

export const getSeverityConfig = (severity) => {
    return SEVERITY_LEVELS[severity] || SEVERITY_LEVELS.low;
};

export const canExecuteWork = (systemStatus) => {
    const config = getSystemStatusConfig(systemStatus);
    return config.canExecute;
};

export const requiresIsolation = (notificationType, severity) => {
    const typeConfig = getNotificationTypeConfig(notificationType);
    return typeConfig.requiresIsolation && severity === 'critical';
};

// Action button configurations
const ACTION_CONFIGS = {
    incident: {
        triage: { label: 'Phân loại', color: 'primary', variant: 'contained' },
        isolate: { label: 'Cô lập', color: 'warning', variant: 'contained' },
        assign: { label: 'Phân công', color: 'primary', variant: 'contained' },
        start: { label: 'Bắt đầu', color: 'success', variant: 'contained' },
        submit_post_fix: { label: 'Gửi kiểm tra', color: 'primary', variant: 'contained' },
        post_fix_check: { label: 'Kiểm tra', color: 'primary', variant: 'contained' },
        cancel: { label: 'Hủy', color: 'error', variant: 'outlined' },
        close: { label: 'Đóng', color: 'success', variant: 'contained' }
    },
    maintenance: {
        schedule: { label: 'Lập lịch', color: 'primary', variant: 'contained' },
        start: { label: 'Bắt đầu', color: 'success', variant: 'contained' },
        submit_acceptance: { label: 'Gửi nghiệm thu', color: 'primary', variant: 'contained' },
        accept: { label: 'Nghiệm thu', color: 'success', variant: 'contained' },
        reject: { label: 'Từ chối', color: 'error', variant: 'outlined' },
        complete: { label: 'Hoàn thành', color: 'success', variant: 'contained' },
        cancel: { label: 'Hủy', color: 'error', variant: 'outlined' },
        close: { label: 'Đóng', color: 'success', variant: 'contained' }
    }
};

export const getActionConfig = (entity, actionKey) => {
    return ACTION_CONFIGS[entity]?.[actionKey] || { label: actionKey, color: 'primary', variant: 'contained' };
};
