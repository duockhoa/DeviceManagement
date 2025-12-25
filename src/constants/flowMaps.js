// Cập nhật theo state machine mới - action-based workflow

export const INCIDENT_FLOW = [
    'reported', 
    'triaged', 
    'out_of_service', 
    'assigned', 
    'in_progress', 
    'post_fix_check', 
    'resolved', 
    'closed'
];

export const WORKORDER_FLOW = [
    'draft',
    'pending', 
    'approved', 
    'scheduled', 
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

// Action labels - hiển thị tên action thay vì next state
export const INCIDENT_ACTION_LABELS = {
    triage: 'Phân loại',
    isolate: 'Cô lập thiết bị',
    assign: 'Phân công',
    start: 'Bắt đầu xử lý',
    submit_post_fix: 'Gửi kiểm tra',
    post_fix_pass: 'Kiểm tra đạt',
    post_fix_fail: 'Kiểm tra không đạt',
    close: 'Đóng sự cố',
    cancel: 'Hủy'
};

export const MAINTENANCE_ACTION_LABELS = {
    submit: 'Gửi phê duyệt',
    approve: 'Phê duyệt',
    schedule: 'Lập lịch',
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

// Status labels - hiển thị tên trạng thái
export const INCIDENT_STATUS_LABELS = {
    reported: 'Đã báo cáo',
    triaged: 'Đã phân loại',
    out_of_service: 'Ngừng hoạt động',
    assigned: 'Đã phân công',
    in_progress: 'Đang xử lý',
    post_fix_check: 'Đang kiểm tra',
    resolved: 'Đã xử lý',
    closed: 'Đã đóng',
    cancelled: 'Đã hủy'
};

export const MAINTENANCE_STATUS_LABELS = {
    draft: 'Nháp',
    pending: 'Chờ duyệt',
    approved: 'Đã duyệt',
    scheduled: 'Đã lập lịch',
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
