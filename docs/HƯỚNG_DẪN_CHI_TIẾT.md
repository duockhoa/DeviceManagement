deviceService# 🎯 HƯỚNG DẪN CHI TIẾT TỪ BƯỚC ĐẦU TIÊN

**Mục Tiêu:** Hoàn thiện Device Management từ 5.6/10 → 9.2/10 trong 8 tuần  
**Thời Gian:** ~56 ngày (full-time)  
**Bắt Đầu:** Hôm nay!

---

## 📅 TUẦN 1: SETUP BACKEND SERVER (Days 1-7)

### ⏱️ DAY 1: ENVIRONMENT SETUP (2-3 giờ)

#### Bước 1.1: Tạo Backend Folder
```bash
# Tại thư mục Desktop/DeviceManagement
cd c:\Users\Admin\Desktop\DeviceManagement

# Tạo backend folder
mkdir backend
cd backend

# Kiểm tra folder
ls -la
# Output:
# total 0
# drwxr-xr-x  backend
```

#### Bước 1.2: Initialize Node Project
```bash
# Init npm
npm init -y

# Kết quả: tạo file package.json
```

#### Bước 1.3: Install Core Dependencies
```bash
npm install \
  express@4.18.2 \
  cors@2.8.5 \
  dotenv@16.0.3 \
  mongoose@7.5.0 \
  axios@1.5.0 \
  bcryptjs@2.4.3 \
  jsonwebtoken@9.1.0
```

**Verify Install:**
```bash
npm list
# Bạn sẽ thấy tất cả packages
```

#### Bước 1.4: Create Folder Structure
```bash
# Tại folder backend/
mkdir -p src/models
mkdir -p src/routes
mkdir -p src/controllers
mkdir -p src/middleware
mkdir -p src/config
mkdir -p src/utils

# Kết quả:
# backend/
#   ├─ src/
#   │  ├─ models/
#   │  ├─ routes/
#   │  ├─ controllers/
#   │  ├─ middleware/
#   │  ├─ config/
#   │  └─ utils/
#   ├─ package.json
#   └─ .env
```

#### Bước 1.5: Create .env File
```bash
# Tạo file: backend/.env
# Nội dung:

PORT=3003
MONGODB_URI=mongodb://localhost:27017/device_management
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
```

**Lưu ý:** 
- Không commit .env to git
- Change JWT_SECRET in production
- MONGODB_URI dùng local MongoDB (cần install MongoDB community)

#### Bước 1.6: Update package.json
```json
{
  "name": "device-management-backend",
  "version": "1.0.0",
  "description": "Device Management API",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "mongoose": "^7.5.0",
    "axios": "^1.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

**Install nodemon (dev only):**
```bash
npm install --save-dev nodemon@3.0.1
```

---

### ⏱️ DAY 2: DATABASE MODELS (3-4 giờ)

#### Bước 2.1: Create Config Files

**File: backend/src/config/database.js**
```javascript
const mongoose = require('mongoose');

/**
 * Connect to MongoDB
 * @returns {Promise} Connection promise
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Error connecting MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

#### Bước 2.2: Create Mongoose Models

**File: backend/src/models/Device.js**
```javascript
const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
  {
    // Thông tin cơ bản
    code: {
      type: String,
      required: [true, 'Device code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Device name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },

    // Phân loại
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
    },

    // Vị trí
    areaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Area',
    },
    plantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant',
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },

    // Chi tiết thiết bị
    manufacturer: String,
    model: String,
    serialNumber: String,
    purchaseDate: Date,
    warrantyExpireDate: Date,
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance', 'broken'],
      default: 'active',
    },

    // Ảnh
    images: [String], // URLs

    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true, // auto createdAt, updatedAt
  }
);

// Indexes for performance
deviceSchema.index({ code: 1 });
deviceSchema.index({ categoryId: 1 });
deviceSchema.index({ status: 1 });

module.exports = mongoose.model('Device', deviceSchema);
```

**File: backend/src/models/Maintenance.js**
```javascript
const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    // Device reference
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true,
    },

    // Maintenance info
    title: {
      type: String,
      required: [true, 'Maintenance title is required'],
    },
    description: String,
    maintenanceType: {
      type: String,
      enum: ['preventive', 'corrective', 'emergency'],
      default: 'preventive',
    },

    // Schedule
    scheduledDate: {
      type: Date,
      required: true,
    },
    completedDate: Date,

    // Status & Priority
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },

    // Cost
    estimatedCost: {
      type: Number,
      default: 0,
    },
    actualCost: Number,

    // Assigned to
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Notes
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Index
maintenanceSchema.index({ deviceId: 1 });
maintenanceSchema.index({ status: 1 });
maintenanceSchema.index({ scheduledDate: 1 });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
```

**File: backend/src/models/Category.js**
```javascript
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    icon: String,
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', categorySchema);
```

**File: backend/src/models/User.js**
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // không return khi query
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'technician', 'viewer'],
      default: 'viewer',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

**File: backend/src/models/Area.js**
```javascript
const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    plantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Area', areaSchema);
```

**File: backend/src/models/Plant.js**
```javascript
const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    location: String,
    address: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Plant', plantSchema);
```

**File: backend/src/models/Department.js**
```javascript
const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Department', departmentSchema);
```

**File: backend/src/models/Consumable.js**
```javascript
const mongoose = require('mongoose');

const consumableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ConsumableCategory',
    },
    unit: String,
    quantity: {
      type: Number,
      default: 0,
    },
    minimumQuantity: {
      type: Number,
      default: 0,
    },
    unitPrice: Number,
    supplier: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Consumable', consumableSchema);
```

---

### ⏱️ DAY 3: API ROUTES - PART 1 (3-4 giờ)

#### Bước 3.1: Create Middleware

**File: backend/src/middleware/errorHandler.js**
```javascript
/**
 * Error handler middleware
 * @param {Error} err 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
const errorHandler = (err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message),
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value',
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
};

module.exports = errorHandler;
```

**File: backend/src/middleware/auth.js**
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verify JWT token
 */
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

module.exports = auth;
```

#### Bước 3.2: Create Controllers - Devices

**File: backend/src/controllers/deviceController.js**
```javascript
const Device = require('../models/Device');

/**
 * GET all devices
 * @route GET /api/v1/devices
 * @query page, limit, categoryId, status
 */
exports.getAllDevices = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, categoryId, status } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    if (status) filter.status = status;

    const devices = await Device.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('categoryId')
      .populate('areaId')
      .sort('-createdAt');

    const total = await Device.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: devices,
      pagination: {
        current: page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET device by ID
 * @route GET /api/v1/devices/:id
 */
exports.getDeviceById = async (req, res, next) => {
  try {
    const device = await Device.findById(req.params.id)
      .populate('categoryId')
      .populate('areaId');

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found',
      });
    }

    res.status(200).json({
      success: true,
      data: device,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CREATE device
 * @route POST /api/v1/devices
 */
exports.createDevice = async (req, res, next) => {
  try {
    const device = await Device.create(req.body);

    res.status(201).json({
      success: true,
      data: device,
      message: 'Device created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE device
 * @route PUT /api/v1/devices/:id
 */
exports.updateDevice = async (req, res, next) => {
  try {
    const device = await Device.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found',
      });
    }

    res.status(200).json({
      success: true,
      data: device,
      message: 'Device updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE device
 * @route DELETE /api/v1/devices/:id
 */
exports.deleteDevice = async (req, res, next) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Device deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
```

#### Bước 3.3: Create Routes

**File: backend/src/routes/deviceRoutes.js**
```javascript
const express = require('express');
const {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
} = require('../controllers/deviceController');
const auth = require('../middleware/auth');

const router = express.Router();

// Routes
router.get('/', getAllDevices);
router.get('/:id', getDeviceById);
router.post('/', auth, createDevice);
router.put('/:id', auth, updateDevice);
router.delete('/:id', auth, deleteDevice);

module.exports = router;
```

---

### ⏱️ DAY 4: API ROUTES - PART 2 (3-4 giờ)

#### Bước 4.1: Create Controllers - Maintenance

**File: backend/src/controllers/maintenanceController.js**
```javascript
const Maintenance = require('../models/Maintenance');

/**
 * GET all maintenances
 */
exports.getAllMaintenances = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, deviceId } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;
    if (deviceId) filter.deviceId = deviceId;

    const maintenances = await Maintenance.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('deviceId')
      .populate('assignedTo')
      .sort('-scheduledDate');

    const total = await Maintenance.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: maintenances,
      pagination: {
        current: page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * CREATE maintenance
 */
exports.createMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.create(req.body);

    res.status(201).json({
      success: true,
      data: maintenance,
      message: 'Maintenance created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE maintenance
 */
exports.updateMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance not found',
      });
    }

    res.status(200).json({
      success: true,
      data: maintenance,
      message: 'Maintenance updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE maintenance
 */
exports.deleteMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Maintenance deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
```

#### Bước 4.2: Create Routes - Maintenance

**File: backend/src/routes/maintenanceRoutes.js**
```javascript
const express = require('express');
const {
  getAllMaintenances,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} = require('../controllers/maintenanceController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllMaintenances);
router.post('/', auth, createMaintenance);
router.put('/:id', auth, updateMaintenance);
router.delete('/:id', auth, deleteMaintenance);

module.exports = router;
```

#### Bước 4.3: Create Routes - Others (Categories, Areas, Plants)

**File: backend/src/routes/categoryRoutes.js**
```javascript
const express = require('express');
const Category = require('../models/Category');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
```

---

### ⏱️ DAY 5: MAIN SERVER FILE (2-3 giờ)

#### Bước 5.1: Create Server.js

**File: backend/src/server.js**
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Models
const Device = require('./models/Device');
const Maintenance = require('./models/Maintenance');
const Category = require('./models/Category');
const Area = require('./models/Area');
const Plant = require('./models/Plant');

// Routes
const deviceRoutes = require('./routes/deviceRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDB();

// API Routes
app.use('/api/v1/devices', deviceRoutes);
app.use('/api/v1/maintenances', maintenanceRoutes);
app.use('/api/v1/categories', categoryRoutes);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: '✅ Backend server is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║ 🚀 Backend Server Running                 ║
║ Port: ${PORT}                            ║
║ Environment: ${process.env.NODE_ENV}                  ║
║ Database: MongoDB                         ║
║ Health Check: /api/v1/health             ║
╚═══════════════════════════════════════════╝
  `);
});
```

#### Bước 5.2: Test Server

```bash
# Tại folder backend/

# 1. Start server
npm run dev
# Output:
# ╔═══════════════════════════════════════════╗
# ║ 🚀 Backend Server Running                 ║
# ║ Port: 3003                                ║
# ║ Environment: development                  ║
# ║ Database: MongoDB                         ║
# ║ Health Check: /api/v1/health             ║
# ╚═══════════════════════════════════════════╝

# 2. Open browser: http://localhost:3003/api/v1/health
# Result: { "success": true, "message": "✅ Backend server is running" }

# 3. Test with Postman/Curl:
# GET http://localhost:3003/api/v1/devices
# Result: { "success": true, "data": [], "pagination": {...} }
```

---

### ⏱️ DAY 6-7: SEED DATA + FINAL TESTING (3-4 giờ)

#### Bước 6.1: Create Seed Script

**File: backend/src/seed.js**
```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Plant = require('./models/Plant');
const Area = require('./models/Area');
const Device = require('./models/Device');
const Maintenance = require('./models/Maintenance');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Plant.deleteMany({});
    await Area.deleteMany({});
    await Device.deleteMany({});
    await Maintenance.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Categories
    const categories = await Category.insertMany([
      { name: 'Máy Nén Khí', description: 'Air Compression Equipment' },
      { name: 'Nồi Hơi', description: 'Boiler Equipment' },
      { name: 'Pump', description: 'Pump Equipment' },
      { name: 'Motor', description: 'Electric Motors' },
    ]);
    console.log('✅ Created Categories');

    // Create Plants
    const plants = await Plant.insertMany([
      { name: 'Nhà Máy TP HCM', code: 'PLANT_HCMC' },
      { name: 'Nhà Máy Hà Nội', code: 'PLANT_HN' },
    ]);
    console.log('✅ Created Plants');

    // Create Areas
    const areas = await Area.insertMany([
      { name: 'Khu A', code: 'AREA_A', plantId: plants[0]._id },
      { name: 'Khu B', code: 'AREA_B', plantId: plants[0]._id },
      { name: 'Khu C', code: 'AREA_C', plantId: plants[1]._id },
    ]);
    console.log('✅ Created Areas');

    // Create Devices
    const devices = await Device.insertMany([
      {
        code: 'DEV001',
        name: 'Máy Nén Khí #1',
        categoryId: categories[0]._id,
        areaId: areas[0]._id,
        plantId: plants[0]._id,
        manufacturer: 'Atlas Copco',
        model: 'GA 37',
        status: 'active',
      },
      {
        code: 'DEV002',
        name: 'Nồi Hơi #2',
        categoryId: categories[1]._id,
        areaId: areas[1]._id,
        plantId: plants[0]._id,
        manufacturer: 'Fulton',
        model: 'FB-250',
        status: 'active',
      },
      {
        code: 'DEV003',
        name: 'Pump Khối A',
        categoryId: categories[2]._id,
        areaId: areas[0]._id,
        plantId: plants[0]._id,
        manufacturer: 'Grundfos',
        model: 'CR64',
        status: 'active',
      },
    ]);
    console.log('✅ Created Devices');

    // Create Maintenances
    const maintenances = await Maintenance.insertMany([
      {
        deviceId: devices[0]._id,
        title: 'Bảo trì định kỳ Máy Nén',
        maintenanceType: 'preventive',
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'pending',
        priority: 'high',
        estimatedCost: 500000,
      },
      {
        deviceId: devices[1]._id,
        title: 'Kiểm tra Nồi Hơi',
        maintenanceType: 'preventive',
        scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'pending',
        priority: 'medium',
        estimatedCost: 300000,
      },
    ]);
    console.log('✅ Created Maintenances');

    console.log(`
╔════════════════════════════════════╗
║ ✅ Database Seeding Complete       ║
║                                    ║
║ Categories: ${categories.length}                 ║
║ Plants: ${plants.length}                    ║
║ Areas: ${areas.length}                    ║
║ Devices: ${devices.length}                   ║
║ Maintenances: ${maintenances.length}              ║
╚════════════════════════════════════╝
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
```

#### Bước 6.2: Run Seed

```bash
# Tại backend folder
node src/seed.js

# Output:
# ✅ Database Seeding Complete
# Categories: 4
# Plants: 2
# Areas: 3
# Devices: 3
# Maintenances: 2
```

#### Bước 6.3: Final Testing

```bash
# 1. Ensure backend is running
npm run dev

# 2. Test in Postman/Browser:
# GET http://localhost:3003/api/v1/devices
# GET http://localhost:3003/api/v1/maintenances
# GET http://localhost:3003/api/v1/categories

# 3. Check response format
# {
#   "success": true,
#   "data": [...],
#   "pagination": {...}
# }
```

---

## 📅 TUẦN 2: CONNECT FRONTEND TO BACKEND (Days 8-14)

### ⏱️ DAY 8: UPDATE API CONFIG (2 giờ)

#### Bước 8.1: Update customize-axios.js

**File: src/services/customize-axios.js**
```javascript
import axios from 'axios';

// ✅ Update API URL to match backend
const API_BASE_URL = 'http://localhost:3003/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

#### Bước 8.2: Update Services

**File: src/services/maintenanceService.js**
```javascript
import axiosInstance from './customize-axios';

/**
 * Fetch all maintenances
 * @param {Object} params - Query parameters
 * @returns {Promise} Maintenances list
 */
export const getMaintenances = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/maintenances', { params });
    return response.data;
  } catch (error) {
    console.error('❌ Fetch maintenances error:', error);
    throw error;
  }
};

/**
 * Get maintenance by ID
 */
export const getMaintenanceById = async (id) => {
  try {
    const response = await axiosInstance.get(`/maintenances/${id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Fetch maintenance error:', error);
    throw error;
  }
};

/**
 * Create maintenance
 */
export const createMaintenance = async (data) => {
  try {
    const response = await axiosInstance.post('/maintenances', data);
    return response.data;
  } catch (error) {
    console.error('❌ Create maintenance error:', error);
    throw error;
  }
};

/**
 * Update maintenance
 */
export const updateMaintenance = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/maintenances/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('❌ Update maintenance error:', error);
    throw error;
  }
};

/**
 * Delete maintenance
 */
export const deleteMaintenance = async (id) => {
  try {
    const response = await axiosInstance.delete(`/maintenances/${id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Delete maintenance error:', error);
    throw error;
  }
};

/**
 * Batch update maintenance status
 */
export const batchUpdateMaintenanceStatus = async (ids, status) => {
  try {
    // Assuming backend has this endpoint
    const response = await axiosInstance.put('/maintenances/batch/status', {
      ids,
      status,
    });
    return response.data;
  } catch (error) {
    console.error('❌ Batch update error:', error);
    throw error;
  }
};

export default {
  getMaintenances,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  batchUpdateMaintenanceStatus,
};
```

**File: src/services/assetsService.js**
```javascript
import axiosInstance from './customize-axios';

/**
 * Fetch all devices/assets
 */
export const getAssets = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/devices', { params });
    return response.data;
  } catch (error) {
    console.error('❌ Fetch assets error:', error);
    throw error;
  }
};

/**
 * Get asset by ID
 */
export const getAssetById = async (id) => {
  try {
    const response = await axiosInstance.get(`/devices/${id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Fetch asset error:', error);
    throw error;
  }
};

/**
 * Create asset
 */
export const createAsset = async (data) => {
  try {
    const response = await axiosInstance.post('/devices', data);
    return response.data;
  } catch (error) {
    console.error('❌ Create asset error:', error);
    throw error;
  }
};

/**
 * Update asset
 */
export const updateAsset = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/devices/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('❌ Update asset error:', error);
    throw error;
  }
};

/**
 * Delete asset
 */
export const deleteAsset = async (id) => {
  try {
    const response = await axiosInstance.delete(`/devices/${id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Delete asset error:', error);
    throw error;
  }
};

export default {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
};
```

---

### ⏱️ DAY 9-10: TEST FRONTEND CONNECTION (4 giờ)

#### Bước 9.1: Test Redux Integration

1. Start Backend
```bash
cd backend
npm run dev
# ✅ Server running on http://localhost:3003
```

2. Start Frontend
```bash
cd DeviceManagement (root folder)
npm start
# ✅ App running on http://localhost:3000
```

3. Check Network
```
Open DevTools (F12) → Network tab
Navigate to Maintenance page
You should see:
- ✅ GET /api/v1/maintenances → 200
- ✅ Data loaded
- ✅ No 404 errors
```

#### Bước 9.2: Debug Redux

```javascript
// Open Browser Console (F12)
// Type:
store.getState()

// You should see:
{
  maintenance: {
    items: [...],
    loading: false,
    error: null
  }
}
```

---

### ⏱️ DAY 11-14: COMPLETE FIRST 2 MODULES (4 giờ/day)

#### Bước 11.1: Complete Maintenance Module (4 ngày)

**Checklist:**
- [ ] ✅ Maintenance List - fetch real data
- [ ] ✅ Maintenance Form - create/edit real data
- [ ] ✅ Maintenance Delete - delete real data
- [ ] ✅ Batch operations - bulk update status
- [ ] ✅ Status filter - working
- [ ] [ ] Maintenance History - implement
- [ ] [ ] Reports - implement
- [ ] ✅ Excel export - working

**Test:**
```
✅ Create new maintenance → appears in list
✅ Edit maintenance → changes saved
✅ Delete maintenance → removed from list
✅ Batch select → bulk update working
✅ Export to Excel → file downloads
```

#### Bước 11.2: Start Devices Module (4 ngày)

**Checklist:**
- [ ] ✅ Devices List - fetch real data
- [ ] [ ] Devices Form - create/edit forms
- [ ] [ ] Upload images - image upload feature
- [ ] [ ] Search devices - search functionality
- [ ] [ ] Filter by category - category filter
- [ ] [ ] Batch operations - bulk operations
- [ ] [ ] Device detail - detail page

---

## 📊 SUCCESS CHECKLIST - WEEK 1

| Task | Status | Evidence |
|------|--------|----------|
| Backend folder created | ✅ | `backend/` exists |
| Dependencies installed | ✅ | `npm list` works |
| Database models | ✅ | 6 models created |
| API routes | ✅ | 20+ endpoints |
| Server running | ✅ | `npm run dev` works |
| Seed data | ✅ | 10+ records created |
| Frontend connected | ✅ | `/api/v1/health` responds |
| Maintenance module | ✅ | Real data displayed |
| 0 errors | ✅ | Console clean |

---

## 🎯 NEXT STEPS (WEEK 2+)

**Week 2:** Complete Devices Module + Start Dashboard  
**Week 3:** Dashboard + Reports  
**Week 4-8:** Complete remaining modules following same pattern

---

## 📞 TROUBLESHOOTING

### ❌ "Cannot GET /api/v1/devices"
```
Reason: Backend not running
Solution: 
1. cd backend
2. npm run dev
3. Check Port 3003
```

### ❌ "MongoDB connection refused"
```
Reason: MongoDB not running
Solution:
1. Install MongoDB Community
2. Start MongoDB service
3. Check mongod process
```

### ❌ "CORS error"
```
Reason: Frontend port ≠ Backend port
Solution:
- Frontend: http://localhost:3000
- Backend: http://localhost:3003
- Both configured in customize-axios.js
```

---

**Bắt đầu Day 1 ngay bây giờ!** 🚀
