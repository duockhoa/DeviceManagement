import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAssets } from '../../redux/slice/assetsSlice';
import { fetchDepartments } from '../../redux/slice/departmentSlice';
import { fetchAssetCategories } from '../../redux/slice/assetCategoriesSlice';
import { fetchAssetSubCategories } from '../../redux/slice/assetSubCategoriesSlice';
import { fetchPlants } from '../../redux/slice/plantSlice';
import { fetchAreas } from '../../redux/slice/areaSlice';
import { fetchUsers } from '../../redux/slice/usersSlice';

const AppInitializer = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Gọi các API cần thiết khi app khởi động
        const initializeApp = async () => {
            try {
                // Gọi song song để tăng hiệu suất
                await Promise.all([
                    dispatch(fetchAssets()),
                    dispatch(fetchDepartments()),
                    dispatch(fetchAssetCategories()),
                    dispatch(fetchAssetSubCategories()),
                    dispatch(fetchPlants()),
                    dispatch(fetchAreas()),
                    dispatch(fetchUsers()),
                ]);
                console.log('App initialized successfully');
            } catch (error) {
                console.error('Error initializing app:', error);
            }
        };

        initializeApp();
    }, [dispatch]);

    return children;
};

export default AppInitializer;