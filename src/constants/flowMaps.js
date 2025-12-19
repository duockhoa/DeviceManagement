export const INCIDENT_FLOW = ['reported', 'investigating', 'in_progress', 'resolved', 'closed'];

export const WORKORDER_FLOW = ['pending', 'in_progress', 'awaiting_approval', 'completed', 'closed'];

export const WORKREQUEST_FLOW = ['pending', 'assigned', 'in_progress', 'closed'];

export const NEXT_ROLE_LABEL = {
    Incident: {
        reported: 'Trưởng bộ phận / QA',
        investigating: 'Trưởng bộ phận',
        in_progress: 'Kỹ thuật viên',
        resolved: 'QA / Trưởng bộ phận',
        closed: null
    },
    WorkOrder: {
        pending: 'Kỹ thuật viên',
        in_progress: 'Kỹ thuật viên',
        awaiting_approval: 'Trưởng bộ phận',
        completed: 'QA / Trưởng bộ phận',
        closed: null
    },
    WorkRequest: {
        pending: 'Trưởng bộ phận',
        assigned: 'Kỹ thuật viên',
        in_progress: 'Trưởng bộ phận / QA',
        closed: null
    }
};
