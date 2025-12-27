// Simplified Incident Workflow - Optimized for efficiency

export const INCIDENT_FLOW = [
    'reported',      // Báo cáo (auto notify bộ phận)
    'in_progress',   // Đang xử lý (bộ phận đã tiếp nhận)
    'resolved',      // Đã giải quyết
    'closed'         // Đã đóng
];

export const WORKORDER_FLOW = [
    'draft',
    'approved', 
    'in_progress', 
    'awaiting_acceptance', 
    'accepted', 
    'closed'
];

export const WORKREQUEST_FLOW = [
    'draft',
    'pending', 
    'assigned', 
    'in_progress', 
    'awaiting_confirm',
    'closed'
];

// Action labels - Simplified workflow
export const INCIDENT_ACTION_LABELS = {
    acknowledge: 'Tiếp nhận xử lý',
    resolve: 'Đã giải quyết',
    close: 'Đóng sự cố',
    cancel: 'Hủy'
};

export const MAINTENANCE_ACTION_LABELS = {
    approve: 'Phê duyệt',
    start: 'Bắt đầu',
    submit_acceptance: 'Gửi nghiệm thu',
    accept: 'Nghiệm thu đạt',
    reject_acceptance: 'Nghiệm thu không đạt',
    close: 'Đóng lệnh',
    cancel: 'Hủy'
};

export const WORKREQUEST_ACTION_LABELS = {
    submit: 'Gửi yêu cầu',
    assign: 'Phân công',
    start: 'Bắt đầu',
    submit_confirm: 'Gửi xác nhận',
    close: 'Đóng',
    cancel: 'Hủy'
};

// Status labels - Simplified statuses
export const INCIDENT_STATUS_LABELS = {
    reported: 'Đã báo cáo',
    in_progress: 'Đang xử lý',
    resolved: 'Đã giải quyết',
    closed: 'Đã đóng',
    cancelled: 'Đã hủy'
};

export const MAINTENANCE_STATUS_LABELS = {
    draft: 'Nháp',
    approved: 'Đã duyệt',
    in_progress: 'Đang thực hiện',
    awaiting_acceptance: 'Chờ nghiệm thu',
    accepted: 'Đã nghiệm thu',
    closed: 'Đã đóng',
    cancelled: 'Đã hủy'
};

export const WORKREQUEST_STATUS_LABELS = {
    draft: 'Nháp',
    pending: 'Chờ xử lý',
    assigned: 'Đã phân công',
    in_progress: 'Đang xử lý',
    awaiting_confirm: 'Chờ xác nhận',
    closed: 'Đã đóng',
    cancelled: 'Đã hủy'
};

// Calibration status labels
export const CALIBRATION_STATUS_LABELS = {
    draft: 'Nháp',
    scheduled: 'Đã lập lịch',
    in_progress: 'Đang thực hiện',
    awaiting_qa_review: 'Chờ QA duyệt',
    accepted: 'Đã chấp nhận',
    rejected: 'Bị từ chối',
    out_of_tolerance: 'Ngoài dung sai',
    corrective_action: 'Hành động khắc phục',
    closed: 'Đã đóng',
    cancelled: 'Đã hủy'
};

// Incident category labels
export const INCIDENT_CATEGORY_LABELS = {
    EQUIPMENT: 'Sửa chữa Thiết bị',
    FACILITY: 'Nhà xưởng',
    SYSTEM: 'Hệ thống',
    OPERATION: 'Vận hành'
};

export const FACILITY_TYPE_LABELS = {
    building_structure: 'Kết cấu tòa nhà',
    roof: 'Mái nhà',
    wall: 'Tường',
    floor: 'Sàn',
    door_window: 'Cửa/Cửa sổ',
    lighting: 'Chiếu sáng',
    restroom: 'Toilet/Vệ sinh',
    office: 'Văn phòng',
    warehouse: 'Kho',
    workshop: 'Xưởng sản xuất',
    parking: 'Bãi đỗ xe',
    landscape: 'Cảnh quan',
    other: 'Khác'
};

export const SYSTEM_TYPE_LABELS = {
    electrical: 'Điện',
    water: 'Nước',
    compressed_air: 'Khí nén',
    hvac: 'Điều hòa/Thông gió',
    fire_protection: 'PCCC',
    it_network: 'Mạng IT',
    cctv_security: 'Camera/An ninh',
    telephone: 'Điện thoại',
    waste_treatment: 'Xử lý chất thải',
    steam: 'Hơi nước',
    gas: 'Khí gas',
    other: 'Khác'
};

export const OPERATION_TYPE_LABELS = {
    support_request: 'Yêu cầu hỗ trợ',
    inspection: 'Kiểm tra',
    cleaning: 'Vệ sinh',
    setup: 'Thiết lập/Cài đặt',
    training: 'Đào tạo',
    consultation: 'Tư vấn',
    documentation: 'Lập tài liệu',
    other: 'Khác'
};

export const NOTIFICATION_TYPE_LABELS = {
    M1: 'M1 - Hỏng hóc (Breakdown)',
    M2: 'M2 - Trục trặc (Malfunction)',
    M3: 'M3 - Yêu cầu (Request)',
    M4: 'M4 - Hoạt động (Activity)'
};

export const NEXT_ROLE_LABEL = {
    Incident: {
        reported: 'Manager / QA',
        triaged: 'Manager (phân công hoặc cô lập)',
        out_of_service: 'Manager',
        assigned: 'Kỹ thuật viên',
        in_progress: 'Kỹ thuật viên',
        post_fix_check: 'QA / Manager',
        resolved: 'QA / Manager',
        closed: null
    },
    WorkOrder: {
        draft: 'Planner / Manager',
        pending: 'Manager / QA',
        approved: 'Planner / Manager',
        scheduled: 'Kỹ thuật viên',
        in_progress: 'Kỹ thuật viên',
        awaiting_acceptance: 'QA / Engineering',
        accepted: 'Manager',
        closed: null
    },
    WorkRequest: {
        draft: 'Người yêu cầu',
        pending: 'Manager',
        assigned: 'Kỹ thuật viên',
        in_progress: 'Kỹ thuật viên / Manager',
        awaiting_confirm: 'Manager / QA',
        closed: null
    }
};
