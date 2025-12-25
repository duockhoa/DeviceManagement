// Validation utilities mirroring backend state machine validations

export const validateTriage = (data) => {
    const errors = {};
    
    if (!data.severity) {
        errors.severity = 'Vui lòng chọn mức độ nghiêm trọng';
    }
    
    if (!data.notification_type) {
        errors.notification_type = 'Vui lòng chọn loại thông báo (SAP PM)';
    }
    
    if (!['critical', 'high', 'medium', 'low'].includes(data.severity)) {
        errors.severity = 'Mức độ nghiêm trọng không hợp lệ';
    }
    
    if (!['M1', 'M2', 'M3', 'M4'].includes(data.notification_type)) {
        errors.notification_type = 'Loại thông báo không hợp lệ';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateIsolate = (data) => {
    const errors = {};
    
    // Isolation notes are optional but recommended
    if (data.isolation_notes && data.isolation_notes.length > 1000) {
        errors.isolation_notes = 'Ghi chú không được vượt quá 1000 ký tự';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateAssign = (data) => {
    const errors = {};
    
    if (!data.assigned_to) {
        errors.assigned_to = 'Vui lòng chọn kỹ thuật viên';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateSubmitPostFix = (data) => {
    const errors = {};
    
    if (!data.repair_notes || data.repair_notes.trim().length === 0) {
        errors.repair_notes = 'Vui lòng nhập báo cáo sửa chữa';
    }
    
    if (data.repair_notes && data.repair_notes.length > 2000) {
        errors.repair_notes = 'Báo cáo không được vượt quá 2000 ký tự';
    }
    
    if (data.time_spent && (isNaN(data.time_spent) || data.time_spent < 0)) {
        errors.time_spent = 'Thời gian không hợp lệ';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validatePostFixCheck = (data, incident) => {
    const errors = {};
    
    if (!data.post_fix_result) {
        errors.post_fix_result = 'Vui lòng chọn kết quả kiểm tra';
    }
    
    if (!['pass', 'fail'].includes(data.post_fix_result)) {
        errors.post_fix_result = 'Kết quả kiểm tra không hợp lệ';
    }
    
    // If fail, notes are required
    if (data.post_fix_result === 'fail' && (!data.post_fix_notes || data.post_fix_notes.trim().length === 0)) {
        errors.post_fix_notes = 'Vui lòng nhập lý do không đạt';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateClose = (incident) => {
    const errors = {};
    
    // For M1 incidents, downtime is required
    if (incident.notification_type === 'M1' && !incident.downtime_minutes) {
        errors.downtime_minutes = 'Vui lòng nhập thời gian downtime cho sự cố M1';
    }
    
    if (incident.downtime_minutes && (isNaN(incident.downtime_minutes) || incident.downtime_minutes < 0)) {
        errors.downtime_minutes = 'Thời gian downtime không hợp lệ';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateCancel = (data) => {
    const errors = {};
    
    if (!data.cancel_reason || data.cancel_reason.trim().length === 0) {
        errors.cancel_reason = 'Vui lòng nhập lý do hủy';
    }
    
    if (data.cancel_reason && data.cancel_reason.length > 500) {
        errors.cancel_reason = 'Lý do không được vượt quá 500 ký tự';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Maintenance validations
export const validateSchedule = (data) => {
    const errors = {};
    
    if (!data.scheduled_date) {
        errors.scheduled_date = 'Vui lòng chọn thời gian dự kiến';
    }
    
    if (data.scheduled_date && new Date(data.scheduled_date) < new Date()) {
        errors.scheduled_date = 'Thời gian dự kiến phải trong tương lai';
    }
    
    if (!data.shift) {
        errors.shift = 'Vui lòng chọn ca làm việc';
    }
    
    if (!['morning', 'afternoon', 'night'].includes(data.shift)) {
        errors.shift = 'Ca làm việc không hợp lệ';
    }
    
    if (!data.technician_id) {
        errors.technician_id = 'Vui lòng chọn kỹ thuật viên';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateSubmitAcceptance = (data) => {
    const errors = {};
    
    if (!data.work_report || data.work_report.trim().length === 0) {
        errors.work_report = 'Vui lòng nhập báo cáo công việc';
    }
    
    if (data.work_report && data.work_report.length > 2000) {
        errors.work_report = 'Báo cáo không được vượt quá 2000 ký tự';
    }
    
    if (data.actual_duration && (isNaN(data.actual_duration) || data.actual_duration < 0)) {
        errors.actual_duration = 'Thời gian thực tế không hợp lệ';
    }
    
    if (data.actual_cost && (isNaN(data.actual_cost) || data.actual_cost < 0)) {
        errors.actual_cost = 'Chi phí không hợp lệ';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateAcceptance = (data, result) => {
    const errors = {};
    
    if (!result || !['accept', 'reject'].includes(result)) {
        errors.result = 'Vui lòng chọn kết quả nghiệm thu';
    }
    
    // If reject, reason is required
    if (result === 'reject' && (!data.rejection_reason || data.rejection_reason.trim().length === 0)) {
        errors.rejection_reason = 'Vui lòng nhập lý do từ chối nghiệm thu';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Helper to validate field length
export const validateFieldLength = (value, fieldName, maxLength) => {
    if (value && value.length > maxLength) {
        return `${fieldName} không được vượt quá ${maxLength} ký tự`;
    }
    return null;
};

// Helper to validate required field
export const validateRequired = (value, fieldName) => {
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
        return `${fieldName} là bắt buộc`;
    }
    return null;
};

// Helper to validate number range
export const validateNumberRange = (value, fieldName, min = 0, max = Infinity) => {
    if (value === null || value === undefined || value === '') {
        return null; // Optional field
    }
    
    const num = Number(value);
    if (isNaN(num)) {
        return `${fieldName} phải là số`;
    }
    
    if (num < min || num > max) {
        return `${fieldName} phải từ ${min} đến ${max}`;
    }
    
    return null;
};
