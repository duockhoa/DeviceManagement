import axios from "./customize-axios";

// Lấy tất cả departments
export const getAllDepartments = async () => {
  try {
    const response = await axios.get(`/departments`);
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all departments:", error);
    throw error;
  }
};

// Lấy department theo name (sử dụng name làm primary key)
export const getDepartmentByName = async (name) => {
  try {
    const response = await axios.get(`/departments/${name}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching department by name:", error);
    throw error;
  }
};

// Lấy tất cả users thuộc department
export const getUsersByDepartment = async (departmentName) => {
  try {
    const response = await axios.get(`/departments/${departmentName}/users`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching users by department:", error);
    throw error;
  }
};

// Lấy tất cả assets thuộc department
export const getAssetsByDepartment = async (departmentName) => {
  try {
    const response = await axios.get(`/departments/${departmentName}/assets`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching assets by department:", error);
    throw error;
  }
};

// === ADDITIONAL HELPER FUNCTIONS ===

// Lấy thống kê department (số lượng users và assets)
export const getDepartmentStatistics = async (departmentName) => {
  try {
    const [usersData, assetsData] = await Promise.all([
      getUsersByDepartment(departmentName),
      getAssetsByDepartment(departmentName)
    ]);

    return {
      department: usersData.department || assetsData.department,
      usersCount: usersData.count || 0,
      assetsCount: assetsData.count || 0,
      users: usersData.users || [],
      assets: assetsData.assets || []
    };
  } catch (error) {
    console.error("Error fetching department statistics:", error);
    throw error;
  }
};

// Lấy danh sách departments với số lượng users và assets
export const getDepartmentsWithCounts = async () => {
  try {
    const departments = await getAllDepartments();
    
    const departmentsWithCounts = await Promise.all(
      departments.map(async (dept) => {
        try {
          const [usersData, assetsData] = await Promise.all([
            getUsersByDepartment(dept.name),
            getAssetsByDepartment(dept.name)
          ]);
          
          return {
            ...dept,
            usersCount: usersData.count || 0,
            assetsCount: assetsData.count || 0
          };
        } catch (error) {
          console.error(`Error fetching counts for department ${dept.name}:`, error);
          return {
            ...dept,
            usersCount: 0,
            assetsCount: 0
          };
        }
      })
    );

    return departmentsWithCounts;
  } catch (error) {
    console.error("Error fetching departments with counts:", error);
    throw error;
  }
};

