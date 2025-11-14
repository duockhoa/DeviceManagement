# 🚀 DeviceManagement - Development Roadmap

## 📊 Project Overview

**Current Status:** 5.8/10 (Needs significant improvements)
- **Backend:** 5.4/10 (Security & Error Handling issues)
- **Frontend:** 4.2/10 (State Management & Error Handling issues)

**Total Estimated Effort:** ~36 hours
**Priority Tasks:** 20 critical improvements

---

## 🎯 Quick Wins (Start Here - 1-2 hours each)

### 1. 🔴 BACKEND - Fix CORS Security (30 min)
**File:** `deviceService/src/index.js`
**Impact:** Critical Security Fix

**Current (UNSAFE):**
```javascript
app.use(cors({ origin: '*', credentials: true }));
```

**Fix:**
```javascript
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Update .env:**
```bash
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3003,https://yourdomain.com
```

---

### 2. 🔴 FRONTEND - Add Error Boundary (1 hour)
**File:** `DeviceManagement/src/component/ErrorBoundary/ErrorBoundary.js`
**Impact:** Prevents app crashes

```javascript
import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <Container maxWidth="sm">
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh'
                    }}>
                        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                        <Typography variant="h4" gutterBottom>
                            Oops! Something went wrong
                        </Typography>
                        <Typography variant="body1" color="textSecondary" paragraph>
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </Typography>
                        <Button variant="contained" onClick={this.handleReset}>
                            Back to Home
                        </Button>
                    </Box>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
```

**Update `DeviceManagement/src/index.js`:**
```javascript
import ErrorBoundary from './component/ErrorBoundary/ErrorBoundary';

root.render(
    <ErrorBoundary>
        <Provider store={store}>
            {/* ... rest of app */}
        </ErrorBoundary>
);
```

---

### 3. 🟡 BACKEND - Create .env Template (1 hour)
**File:** `deviceService/.env.example`
**Impact:** Configuration clarity

```bash
# ===========================================
# DeviceManagement Backend Configuration
# ===========================================

# SERVER CONFIGURATION
PORT=3009
NODE_ENV=development

# DATABASE CONFIGURATION
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=device_management
DB_PORT=3306
DB_DIALECT=mysql

# JWT CONFIGURATION
SECRET_KEY=your-super-secret-key-min-32-chars
TOKEN_TIME_LIFE=100h
REFRESH_TIME_LIFE=100d
ALGORITHM=HS256

# CORS CONFIGURATION
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3003

# CLOUDINARY CONFIGURATION (Media Storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AUTH SERVICE CONFIGURATION
AUTH_SERVICE_URL=http://localhost:3010/api/v1

# LOGGING CONFIGURATION
LOG_LEVEL=info
LOG_FILE=logs/app.log

# RATE LIMITING
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🔴 HIGH PRIORITY TASKS (3-4 hours each)

### 4. 🔴 BACKEND - Add Input Validation (3 hours)
**Impact:** Prevents invalid data, SQL injection protection

**Step 1: Install Joi**
```bash
cd deviceService
npm install joi
```

**Step 2: Create validation schemas**
```javascript
// deviceService/src/validators/assetValidator.js
const Joi = require('joi');

const createAssetSchema = Joi.object({
    asset_code: Joi.string().required().min(3).max(50),
    name: Joi.string().required().min(3).max(255),
    sub_category_id: Joi.number().required().integer(),
    team_id: Joi.string().optional(),
    area_id: Joi.number().optional().integer(),
    image: Joi.string().optional(),
    status: Joi.string().valid('active', 'inactive').default('active')
});

const updateAssetSchema = Joi.object({
    asset_code: Joi.string().min(3).max(50),
    name: Joi.string().min(3).max(255),
    sub_category_id: Joi.number().integer(),
    team_id: Joi.string().optional(),
    area_id: Joi.number().optional(),
    image: Joi.string().optional(),
    status: Joi.string().valid('active', 'inactive')
}).min(1);

module.exports = {
    createAssetSchema,
    updateAssetSchema
};
```

**Step 3: Create validation middleware**
```javascript
// deviceService/src/middleware/validateMiddleware.js
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const messages = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }

        req.validatedBody = value;
        next();
    };
};

module.exports = validateRequest;
```

**Step 4: Apply to routes**
```javascript
// deviceService/src/routes/assets.router.js
const validateRequest = require('../middleware/validateMiddleware');
const { createAssetSchema, updateAssetSchema } = require('../validators/assetValidator');

router.post('/', validateRequest(createAssetSchema), controller.createAsset);
router.put('/:id', validateRequest(updateAssetSchema), controller.updateAsset);
```

---

### 5. 🔴 BACKEND - Error Handler Middleware (2 hours)
**Impact:** Consistent error responses, proper logging

```javascript
// deviceService/src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    // Log error (never expose to client)
    console.error(`[${new Date().toISOString()}] Error:`, {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        userAgent: req.get('User-Agent'),
        ip: req.ip
    });

    // Default error
    let statusCode = err.statusCode || 500;
    let message = 'Internal Server Error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Failed';
    } else if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized';
    } else if (err.name === 'NotFoundError') {
        statusCode = 404;
        message = 'Resource Not Found';
    } else if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        message = 'Resource already exists';
    }

    // Send response (never send error.stack to client)
    res.status(statusCode).json({
        success: false,
        message: message,
        timestamp: new Date().toISOString(),
        path: req.path
    });
};

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler };
```

**Update `deviceService/src/index.js`:**
```javascript
const { errorHandler } = require('./middleware/errorHandler');

// ... routes ...

// Error handling middleware (must be last)
app.use(errorHandler);
```

---

### 6. 🔴 FRONTEND - Redux Error/Loading States (4 hours)
**Impact:** Proper UI feedback, error handling

**Step 1: Create utility function**
```javascript
// DeviceManagement/src/redux/utils/asyncThunkHandlers.js
export const createAsyncThunkHandlers = (builder, asyncThunk, itemKey = 'items') => {
    builder
        .addCase(asyncThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(asyncThunk.fulfilled, (state, action) => {
            state[itemKey] = action.payload;
            state.loading = false;
            state.success = true;
        })
        .addCase(asyncThunk.rejected, (state, action) => {
            state.error = action.error.message || 'Unknown error';
            state.loading = false;
            state.success = false;
        });
};
```

**Step 2: Update assetsSlice**
```javascript
// DeviceManagement/src/redux/slice/assetsSlice.js
import { createAsyncThunkHandlers } from '../utils/asyncThunkHandlers';

const initialState = {
    assets: [],
    loading: false,
    error: null,
    success: false
};

export const assetsSlice = createSlice({
    name: 'assets',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        createAsyncThunkHandlers(builder, fetchAssets, 'assets');
        createAsyncThunkHandlers(builder, fetchAssetById, 'currentAsset');
        createAsyncThunkHandlers(builder, createAsset, 'assets');
        createAsyncThunkHandlers(builder, updateExistingAsset, 'assets');
        createAsyncThunkHandlers(builder, deleteExistingAsset, 'assets');
        createAsyncThunkHandlers(builder, fetchAssetsBySubCategory, 'filteredAssets');
        createAsyncThunkHandlers(builder, fetchAssetsByCategory, 'filteredAssets');
        createAsyncThunkHandlers(builder, fetchAssetsByArea, 'filteredAssets');
        createAsyncThunkHandlers(builder, fetchAssetsByDepartment, 'filteredAssets');
        createAsyncThunkHandlers(builder, searchAssetsThunk, 'searchResults');
    }
});

export const { clearError, clearSuccess } = assetsSlice.actions;
```

**Step 3: Apply to ALL slices (plants, areas, departments, etc.)**

---

### 7. 🔴 FRONTEND - Global Error Alert (1.5 hours)
**Impact:** User feedback for errors

```javascript
// DeviceManagement/src/component/ErrorAlert/ErrorAlert.js
import React from 'react';
import { Alert, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { clearError } from '../../redux/slice/assetsSlice';

function ErrorAlert() {
    const dispatch = useDispatch();
    const error = useSelector((state) => state.assets.error);

    if (!error) return null;

    return (
        <Box sx={{ p: 2 }}>
            <Alert
                severity="error"
                onClose={() => dispatch(clearError())}
                sx={{ fontSize: '1rem' }}
            >
                {error}
            </Alert>
        </Box>
    );
}

export default ErrorAlert;
```

**Update DefaultLayout:**
```javascript
// DeviceManagement/src/Layouts/Defaultlayout/DefaultLayout.js
import ErrorAlert from '../../component/ErrorAlert/ErrorAlert';

function DefaultLayout({ children }) {
    return (
        <>
            <Header />
            <ErrorAlert />
            <Sidebar />
            <main>{children}</main>
        </>
    );
}
```

---

### 8. 🔴 FRONTEND - Refactor AssetList Component (3 hours)
**Impact:** Proper loading/error states in UI

**Current (BAD):**
```javascript
function AssetList() {
    const assets = useSelector((state) => state.assets.assets);
    const loading = useSelector((state) => state.assets.loading);
    const error = useSelector((state) => state.assets.error);

    return (
        <Box>
            <Loading />  {/* Always shows */}
            <DataGrid rows={assets} />  {/* Renders anyway */}
        </Box>
    );
}
```

**Fixed:**
```javascript
// DeviceManagement/src/component/AssetsComponent/AssetList/index.js
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAssets } from "../../../redux/slice/assetsSlice";
import { Box, Typography, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Loading from '../../Loading';

function AssetList() {
    const dispatch = useDispatch();
    const { assets, loading, error } = useSelector((state) => state.assets);

    useEffect(() => {
        dispatch(fetchAssets());
    }, [dispatch]);

    // Loading state
    if (loading) {
        return <Loading />;
    }

    // Error state
    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error}
            </Alert>
        );
    }

    // Empty state
    if (!assets || assets.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                    Không có dữ liệu thiết bị
                </Typography>
            </Box>
        );
    }

    // Data state - render grid
    return (
        <DataGrid
            rows={assets}
            columns={columns}
            pageSize={10}
            loading={loading}
        />
    );
}

export default AssetList;
```

---

## 🟡 MEDIUM PRIORITY TASKS (1-2 hours each)

### 9. 🟡 BACKEND - Setup Jest Testing (3 hours)
**Impact:** Code reliability, prevent regressions

**Install packages:**
```bash
cd deviceService
npm install --save-dev jest supertest
npx jest --init
```

**Create test file:**
```javascript
// deviceService/src/__tests__/assets.controllers.test.js
const request = require('supertest');
const express = require('express');

describe('Assets Controller', () => {
    let app;
    let mockAssets = [];

    beforeAll(() => {
        app = express();
        app.use(express.json());
        // Setup routes
    });

    describe('GET /api/v1/assets', () => {
        it('should return all assets', async () => {
            const response = await request(app)
                .get('/api/v1/assets')
                .expect(200);

            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it('should handle errors gracefully', async () => {
            const response = await request(app)
                .get('/api/v1/assets')
                .expect((res) => {
                    expect(res.body.success).toBeDefined();
                });
        });
    });

    describe('POST /api/v1/assets', () => {
        it('should create asset with valid data', async () => {
            const newAsset = {
                asset_code: 'TEST001',
                name: 'Test Asset',
                sub_category_id: 1
            };

            const response = await request(app)
                .post('/api/v1/assets')
                .send(newAsset)
                .expect((res) => {
                    expect(res.body.success).toBe(true);
                });
        });

        it('should reject invalid data', async () => {
            const invalidAsset = {
                // missing required fields
            };

            await request(app)
                .post('/api/v1/assets')
                .send(invalidAsset)
                .expect(400);
        });
    });
});
```

**Update package.json:**
```json
{
    "scripts": {
        "test": "jest --coverage",
        "test:watch": "jest --watch"
    }
}
```

---

### 10. 🟡 BACKEND - Add Rate Limiting (1.5 hours)
**Impact:** Prevent abuse, DoS protection

**Install:**
```bash
cd deviceService
npm install express-rate-limit
```

**Create middleware:**
```javascript
// deviceService/src/middleware/rateLimitMiddleware.js
const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter limiter for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 auth attempts per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    authLimiter
};
```

**Apply to routes:**
```javascript
// deviceService/src/routes/index.js
const { apiLimiter, authLimiter } = require('../middleware/rateLimitMiddleware');

// Apply to all routes
router.use(apiLimiter);

// Apply stricter limit to auth routes
router.use('/auth', authLimiter);
```

---

### 11. 🟡 FRONTEND - Add PropTypes (2 hours)
**Impact:** Runtime type checking, catch bugs early

**Install:**
```bash
cd DeviceManagement
npm install prop-types
```

**Apply to components:**
```javascript
// DeviceManagement/src/component/LayoutComponent/Header/index.js
import PropTypes from 'prop-types';

function Header({ onMenuClick }) {
    // component code
}

Header.propTypes = {
    onMenuClick: PropTypes.func
};

Header.defaultProps = {
    onMenuClick: () => {}
};

export default Header;
```

**Apply to ALL components:** Header, Avatar, Notification, AssetList, AssetDetail, etc.

---

### 12. 🟡 FRONTEND - Setup Jest Testing (3 hours)
**Impact:** Component reliability, prevent regressions

**Install:**
```bash
cd DeviceManagement
npm install --save-dev @testing-library/react @testing-library/jest-dom jest @babel/preset-react
```

**Create test file:**
```javascript
// DeviceManagement/src/__tests__/assetsSlice.test.js
import assetsReducer, { fetchAssets, clearError } from '../redux/slice/assetsSlice';

describe('assetsSlice', () => {
    const initialState = {
        assets: [],
        loading: false,
        error: null,
        success: false
    };

    it('should handle clearError', () => {
        const previousState = {
            ...initialState,
            error: 'Some error'
        };
        expect(assetsReducer(previousState, clearError()))
            .toEqual(initialState);
    });

    it('should handle fetchAssets.pending', () => {
        const action = { type: fetchAssets.pending.type };
        const state = assetsReducer(initialState, action);
        expect(state.loading).toBe(true);
        expect(state.error).toBe(null);
    });

    it('should handle fetchAssets.fulfilled', () => {
        const payload = [{ id: 1, name: 'Asset 1' }];
        const action = { type: fetchAssets.fulfilled.type, payload };
        const state = assetsReducer(initialState, action);
        expect(state.assets).toEqual(payload);
        expect(state.loading).toBe(false);
    });
});
```

**Update package.json:**
```json
{
    "scripts": {
        "test": "react-scripts test",
        "test:coverage": "react-scripts test --coverage"
    }
}
```

---

## 📅 IMPLEMENTATION ROADMAP

### **Week 1: Security & Stability (16 hours)**
```
Day 1: #1 CORS + #5 .env Template (2 hours)
Day 2: #2 Input Validation (3 hours)
Day 3: #3 Error Handler + #6 Rate Limiting (3 hours)
Day 4: #9 Redux States (4 hours)
Day 5: #10 Error Boundary + #11 Error Alert (2 hours)
```

### **Week 2: Quality & Testing (20 hours)**
```
Day 1: #4 Backend Jest + #15 Frontend Jest (6 hours)
Day 2: #13 AssetList Refactor (3 hours)
Day 3: #14 PropTypes (2 hours)
Day 4: #12 Redux Naming + #17 Axios Error (2 hours)
Day 5: #7 Logging + #8 DB Handling (2 hours)
       #16 Env Validation + #18 Redux Utils (3 hours)
```

### **Week 3: Documentation (1-2 hours)**
```
#19 API Docs + #20 Architecture Docs (3.5 hours)
```

---

## ✅ SUCCESS CRITERIA

After completing all tasks:

| Metric | Before | After |
|--------|--------|-------|
| Code Quality | 5.8/10 | 8.5/10 |
| Security | 4/10 | 9/10 |
| Error Handling | 3/10 | 9/10 |
| Testing Coverage | 0% | 40%+ |
| Production Ready | ❌ | ✅ |

---

## 📋 CHECKLIST SUMMARY

### **BACKEND (8 tasks)**
- [ ] 🔴 Fix CORS Security
- [ ] 🔴 Add Input Validation
- [ ] 🔴 Error Handler Middleware
- [ ] 🔴 Setup Jest Testing
- [ ] 🟡 Create .env Template
- [ ] 🟡 Add Rate Limiting
- [ ] 🟡 Add Request Logging
- [ ] 🟡 Database Error Handling

### **FRONTEND (12 tasks)**
- [ ] 🔴 Redux Error/Loading States
- [ ] 🔴 Add Error Boundary
- [ ] 🔴 Global Error Alert
- [ ] 🔴 Refactor AssetList
- [ ] 🟡 Fix Redux Naming
- [ ] 🟡 Add PropTypes
- [ ] 🟡 Setup Jest Testing
- [ ] 🟡 Validate Environment
- [ ] 🟡 Improve Axios Error
- [ ] 🟡 Redux Utility Functions
- [ ] 🟡 API Documentation
- [ ] 🟡 Architecture Guide

---

## 🚀 NEXT STEPS

1. **Start with Quick Wins** (#1, #5, #10)
2. **Fix Security Issues** (#1, #2, #3)
3. **Improve Error Handling** (#9, #10, #11, #13)
4. **Add Testing** (#4, #15)
5. **Polish & Document** (#19, #20)

**Total Time:** ~36 hours
**Priority:** Security > Error Handling > Testing > Documentation

---

## 🔍 MISSING MODULES ANALYSIS & IMPLEMENTATION STATUS

### **Initial Assessment (10 Missing Critical Modules)**

Based on codebase analysis, the following modules were identified as missing but critical for a complete Device Management system:

1. **✅ Maintenance Module** - COMPLETED
2. **❌ Calibration Module** - PENDING
3. **❌ Consumables Management** - PENDING
4. **❌ Specifications Management** - PENDING
5. **❌ Notifications System** - PENDING
6. **❌ Reports & Analytics** - PENDING
7. **❌ User Permissions & Roles** - PENDING
8. **❌ Audit Logging** - PENDING
9. **❌ File Attachments** - PENDING
10. **❌ Dashboard Analytics** - PENDING

### **✅ Maintenance Module - IMPLEMENTATION COMPLETED**

**Status:** ✅ **FULLY IMPLEMENTED** (Frontend + Backend + Database)

**Components Created:**
- **Frontend:**
  - `src/redux/slice/maintenanceSlice.js` - Redux state management
  - `src/services/maintenanceService.js` - API service layer
  - `src/component/MaintenanceComponent/MaintenanceList/index.js` - Data grid display
  - `src/component/MaintenanceComponent/SubSidebarMaintenance/index.js` - Navigation sidebar
  - `src/component/MaintenanceComponent/AddMaintenanceButton/index.js` - Add button component
  - `src/component/MaintenanceComponent/AddMaintenanceForm/index.js` - Form dialog
  - `src/pages/Maintenance/index.js` - Main page component

- **Backend:**
  - `src/controllers/maintenance.controllers.js` - CRUD API endpoints
  - `src/routes/maintenance.router.js` - Route definitions
  - `src/models/maintenance.model.js` - Sequelize model with validations
  - Database associations in `src/models/index.js`

**Features Implemented:**
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Advanced filtering (by asset, status, technician)
- ✅ Material-UI DataGrid with custom columns
- ✅ Status chips and priority indicators
- ✅ Form validation and error handling
- ✅ Redux Toolkit integration
- ✅ Sequelize associations with Assets and Users
- ✅ JWT authentication middleware
- ✅ Consistent error responses

**Database Schema:**
```sql
CREATE TABLE maintenance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id INT NOT NULL,
    technician_id INT,
    maintenance_type ENUM('preventive', 'corrective', 'predictive') NOT NULL,
    priority ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    scheduled_date DATETIME NOT NULL,
    completed_date DATETIME,
    description TEXT,
    notes TEXT,
    cost DECIMAL(10,2),
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (technician_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

**API Endpoints:**
- `GET /api/maintenance` - List all maintenance records
- `GET /api/maintenance/:id` - Get maintenance by ID
- `GET /api/maintenance/asset/:assetId` - Get maintenance by asset
- `GET /api/maintenance/status/:status` - Get maintenance by status
- `GET /api/maintenance/technician/:technicianId` - Get maintenance by technician
- `POST /api/maintenance` - Create new maintenance record
- `PUT /api/maintenance/:id` - Update maintenance record
- `DELETE /api/maintenance/:id` - Delete maintenance record

**Next Steps:**
1. **Calibration Module** - Implement following identical patterns
2. **Consumables Management** - Track spare parts and supplies
3. **Specifications Management** - Equipment specifications and standards
4. **Notifications System** - Alert users about maintenance due dates

---

*Generated on: November 12, 2025*
*Last Updated: November 12, 2025*