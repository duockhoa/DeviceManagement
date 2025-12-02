import { useState, useEffect, useCallback } from 'react';
import customAxios from '../services/customize-axios';

// DEV_TEAM IDs - luôn có full quyền
const DEV_TEAM_IDS = [596, 947];

/**
 * Hook để kiểm tra permissions của user hiện tại
 * Sử dụng RBAC từ database thay vì hard-coded roleHelper
 */
export const usePermissions = () => {
    const [permissions, setPermissions] = useState([]);
    const [permissionKeys, setPermissionKeys] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy user ID từ cookie hoặc localStorage
    const getUserId = () => {
        const userId = document.cookie
            .split('; ')
            .find(row => row.startsWith('id='))
            ?.split('=')[1];
        return parseInt(userId);
    };

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                setLoading(true);
                const userId = getUserId();

                // DEV_TEAM có full quyền
                if (DEV_TEAM_IDS.includes(userId)) {
                    setPermissionKeys(new Set(['*'])); // Wildcard = all permissions
                    setLoading(false);
                    return;
                }

                const response = await customAxios.get('/rbac/me/permissions');
                
                if (response.data.success) {
                    setPermissions(response.data.data.permissions || []);
                    setPermissionKeys(new Set(response.data.data.permission_keys || []));
                }
            } catch (err) {
                console.error('Error fetching permissions:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPermissions();
    }, []);

    /**
     * Kiểm tra user có quyền cụ thể không
     * @param {string} permission - Permission key (vd: 'assets.view')
     * @returns {boolean}
     */
    const hasPermission = useCallback((permission) => {
        const userId = getUserId();
        
        // DEV_TEAM có tất cả quyền
        if (DEV_TEAM_IDS.includes(userId)) {
            return true;
        }

        return permissionKeys.has(permission);
    }, [permissionKeys]);

    /**
     * Kiểm tra user có ít nhất 1 trong các quyền
     * @param {string[]} permissionList - Danh sách permission keys
     * @returns {boolean}
     */
    const hasAnyPermission = useCallback((permissionList = []) => {
        const userId = getUserId();
        
        if (DEV_TEAM_IDS.includes(userId)) {
            return true;
        }

        return permissionList.some(perm => permissionKeys.has(perm));
    }, [permissionKeys]);

    /**
     * Kiểm tra user có tất cả các quyền
     * @param {string[]} permissionList - Danh sách permission keys
     * @returns {boolean}
     */
    const hasAllPermissions = useCallback((permissionList = []) => {
        const userId = getUserId();
        
        if (DEV_TEAM_IDS.includes(userId)) {
            return true;
        }

        return permissionList.every(perm => permissionKeys.has(perm));
    }, [permissionKeys]);

    /**
     * Reload permissions (sau khi gán role mới)
     */
    const reloadPermissions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await customAxios.get('/rbac/me/permissions');
            
            if (response.data.success) {
                setPermissions(response.data.data.permissions || []);
                setPermissionKeys(new Set(response.data.data.permission_keys || []));
            }
        } catch (err) {
            console.error('Error reloading permissions:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        permissions,
        permissionKeys: Array.from(permissionKeys),
        loading,
        error,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        reloadPermissions
    };
};

/**
 * Component wrapper để ẩn/hiện dựa trên permission
 * 
 * Usage:
 * <PermissionGuard permission="assets.create">
 *   <Button>Tạo thiết bị</Button>
 * </PermissionGuard>
 */
export const PermissionGuard = ({ permission, anyPermissions, allPermissions, fallback = null, children }) => {
    const { hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermissions();

    if (loading) {
        return fallback;
    }

    let hasAccess = false;

    if (permission) {
        hasAccess = hasPermission(permission);
    } else if (anyPermissions) {
        hasAccess = hasAnyPermission(anyPermissions);
    } else if (allPermissions) {
        hasAccess = hasAllPermissions(allPermissions);
    }

    return hasAccess ? children : fallback;
};

export default usePermissions;
