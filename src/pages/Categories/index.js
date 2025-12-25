import { Box } from '@mui/material';
import SubCategoriesList from '../../component/SubCategories/SubCategoriesList';
import AddSubCategoryButton from '../../component/SubCategories/AddSubCategoryBtn';

function Categories() {
    return (
        <Box sx={{ height: '100%', display: 'flex', position: 'relative' }}>
            {/* Main Content */}
            <Box sx={{ 
                flex: 1, 
                p: 2,
                backgroundColor: '#f6f8fb', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column'
            }}>
                <SubCategoriesList />
            </Box>

            {/* Fixed Add Button */}
            <Box sx={{
                position: 'fixed',
                bottom: 40,
                right: 40,
                zIndex: 1000
            }}>
                <AddSubCategoryButton />
            </Box>
        </Box>
    );
}
export default Categories;
