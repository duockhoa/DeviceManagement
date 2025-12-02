# ⚠️ DEPRECATED - roleHelper.js

## File này đã NGỪNG SỬ DỤNG

**Ngày deprecated:** 2024-12-02  
**Lý do:** Chuyển sang RBAC database-driven permissions

---

## ❌ Không dùng nữa:

```javascript
import { canApproveMaintenance } from '../utils/roleHelper';

if (canApproveMaintenance(user)) {
  // ...
}
```

## ✅ Dùng thay thế:

```javascript
import usePermissions from '../hooks/usePermissions';

function MyComponent() {
  const { hasPermission } = usePermissions();

  if (hasPermission('maintenance.approve')) {
    // ...
  }
}
```

---

## Mapping từ roleHelper → RBAC permissions

| Old Function | New Permission Key |
|--------------|-------------------|
| `canViewMaintenanceResults(user)` | `hasPermission('maintenance.report')` |
| `canApproveMaintenance(user)` | `hasPermission('maintenance.approve')` |
| `canCreateMaintenance(user)` | `hasPermission('maintenance.create')` |
| `isManager(user)` | Kiểm tra role: `user.roles.includes('Manager')` |
| `isDevTeam(user)` | DEV_TEAM [596, 947] tự động bypass |

---

## Lý do migrate:

### **Vấn đề của roleHelper.js:**
1. ❌ Hard-coded trong code
2. ❌ Phải deploy lại khi thay đổi quyền
3. ❌ Không linh hoạt
4. ❌ Dựa vào position/department không nhất quán

### **Ưu điểm của RBAC:**
1. ✅ Quản lý qua UI (`/rbac`)
2. ✅ Không cần deploy khi thay đổi quyền
3. ✅ Linh hoạt, dễ mở rộng
4. ✅ Database-driven, nhất quán
5. ✅ Audit trail (biết ai gán quyền cho ai)

---

## Migration Guide

### **Backend:**

**Trước:**
```javascript
const { departmentGuard } = require('../middleware/departmentGuard');

router.post('/maintenance', 
  authMiddleware,
  departmentGuard(['xưởng cơ điện']),
  createMaintenance
);
```

**Sau:**
```javascript
const { permissionGuard } = require('../middleware/permissionGuard');

router.post('/maintenance', 
  authMiddleware,
  permissionGuard('maintenance.create'),
  createMaintenance
);
```

---

### **Frontend:**

**Trước:**
```javascript
import { canApproveMaintenance } from '../utils/roleHelper';

function MaintenanceList() {
  const user = useSelector((state) => state.user.userInfo);

  return (
    <>
      {canApproveMaintenance(user) && (
        <Button>Phê duyệt</Button>
      )}
    </>
  );
}
```

**Sau:**
```javascript
import usePermissions from '../hooks/usePermissions';

function MaintenanceList() {
  const { hasPermission } = usePermissions();

  return (
    <>
      {hasPermission('maintenance.approve') && (
        <Button>Phê duyệt</Button>
      )}
    </>
  );
}
```

---

## Files đã migrate:

- [x] `/component/AssetsComponent/AddDeviceBtn/index.js`
- [x] `/component/AssetsComponent/AssetList/index.js`
- [x] `/component/MaintenanceComponent/AddMaintenanceBtn/index.js`
- [x] `/component/MaintenanceComponent/MaintenanceList/index.js`
- [x] `/component/MaintenanceComponent/MaintenanceDetail/index.js`
- [x] `/component/LayoutComponent/Sidebar/index.js`

---

## TODO: Files cần migrate tiếp

- [ ] CalibrationComponent/*
- [ ] ConsumablesComponent/*
- [ ] HandoverComponent/* (nếu có)
- [ ] WorkRequestsComponent/* (nếu có)
- [ ] IncidentsComponent/* (nếu có)

---

## DEV_TEAM Note

**User IDs 596, 947 vẫn giữ full quyền** trong RBAC mới:
- Tự động bypass mọi `permissionGuard()`
- Backend: `/middleware/permissionGuard.js` line 14-18
- Frontend: `/hooks/usePermissions.js` line 14-15

---

**See:** 
- `/docs/RBAC_USAGE_GUIDE.md` - Hướng dẫn sử dụng RBAC
- `/docs/RBAC_INDEX.md` - Mục lục tài liệu RBAC
