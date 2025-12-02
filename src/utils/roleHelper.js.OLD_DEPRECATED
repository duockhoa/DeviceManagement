// Helper functions để kiểm tra quyền user

// Các chức vụ quản lý (có quyền XEM)
const MANAGER_POSITIONS = ['TGĐ', 'P.TGĐ', 'GĐ', 'P.GĐ', 'TP', 'CG', 'QĐ'];

// Các chức vụ nhân viên
const STAFF_POSITIONS = ['NV', 'CN', 'PT', 'TT', 'TTS', 'Developer'];

// Phòng ban/xưởng cơ điện
const MECHANICAL_ELECTRICAL_DEPT = 'xưởng cơ điện';

// Team DEV - Full quyền
const DEV_TEAM_IDS = [596, 947]; // Phạm Văn Bình (0596), Lê Hoàng Cương (0947)

/**
 * Kiểm tra user có phải là team dev không (full quyền)
 * @param {Object} user - User object từ Redux store
 * @returns {boolean}
 */
export const isDevTeam = (user) => {
    if (!user || !user.id) return false;
    return DEV_TEAM_IDS.includes(user.id);
};

/**
 * Kiểm tra user có phải là quản lý không (có quyền XEM)
 * @param {Object} user - User object từ Redux store
 * @returns {boolean}
 */
export const isManager = (user) => {
    if (!user || !user.position) return false;
    return MANAGER_POSITIONS.includes(user.position) || isDevTeam(user);
};

/**
 * Kiểm tra user có phải là nhân viên không
 * @param {Object} user - User object từ Redux store
 * @returns {boolean}
 */
export const isStaff = (user) => {
    if (!user || !user.position) return false;
    return STAFF_POSITIONS.includes(user.position);
};

/**
 * Kiểm tra user có phải là QĐ cơ điện không
 * @param {Object} user - User object từ Redux store
 * @returns {boolean}
 */
export const isMechanicalElectricalManager = (user) => {
    if (!user || !user.position || !user.department) return false;
    return user.position === 'QĐ' && user.department === MECHANICAL_ELECTRICAL_DEPT;
};

/**
 * Kiểm tra user có phải là PGDSX (Phó Giám Đốc Sản Xuất) không
 * Giả định: P.GĐ của phòng Kỹ Thuật hoặc có chứa "Sản xuất"
 * @param {Object} user - User object từ Redux store
 * @returns {boolean}
 */
export const isProductionDeputyDirector = (user) => {
    if (!user || !user.position || !user.department) return false;
    // P.GĐ của phòng Kỹ Thuật hoặc phòng có chứa "sản xuất", "SX"
    return user.position === 'P.GĐ' && 
           (user.department.includes('Kỹ Thuật') || 
            user.department.includes('sản xuất') || 
            user.department.includes('SX'));
};

/**
 * Lấy tên role của user
 * @param {Object} user - User object từ Redux store
 * @returns {string} - 'manager' | 'staff' | 'unknown'
 */
export const getUserRole = (user) => {
    if (isManager(user)) return 'manager';
    if (isStaff(user)) return 'staff';
    return 'unknown';
};

/**
 * Kiểm tra user có quyền xem menu "Kết quả bảo trì" không
 * Tất cả quản lý đều có quyền XEM
 * @param {Object} user - User object từ Redux store
 * @returns {boolean}
 */
export const canViewMaintenanceResults = (user) => {
    return isManager(user);
};

/**
 * Kiểm tra user có quyền PHÊ DUYỆT bảo trì không
 * CHỈ QĐ cơ điện VÀ PGDSX VÀ TEAM DEV có quyền phê duyệt
 * @param {Object} user - User object từ Redux store
 * @returns {boolean}
 */
export const canApproveMaintenance = (user) => {
    return isMechanicalElectricalManager(user) || isProductionDeputyDirector(user) || isDevTeam(user);
};

/**
 * Kiểm tra user có quyền TẠO lịch bảo trì không
 * Bao gồm: QĐ cơ điện, PGDSX, QĐ phân xưởng, Team DEV
 * @param {Object} user - User object từ Redux store
 * @returns {boolean}
 */
export const canCreateMaintenance = (user) => {
    if (!user) return false;
    
    // Dev team có full quyền
    if (isDevTeam(user)) return true;
    
    // QĐ cơ điện
    if (isMechanicalElectricalManager(user)) return true;
    
    // PGDSX
    if (isProductionDeputyDirector(user)) return true;
    
    // QĐ phân xưởng (tất cả QĐ đều có quyền tạo)
    if (user.position === 'QĐ') return true;
    
    return false;
};

/**
 * Kiểm tra user có phải là nhân viên phân xưởng cơ điện không
 * @param {Object} user - User object từ Redux store
 * @returns {boolean}
 */
export const isMechanicalElectricalStaff = (user) => {
    if (!user || !user.department) return false;
    return user.department === MECHANICAL_ELECTRICAL_DEPT;
};
