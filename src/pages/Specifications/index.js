import { Box } from '@mui/material';
import SubCategoriesList from '../../component/SubCategories/SubCategoriesList';

function Specifications() {
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
        </Box>
    );
}

export default Specifications;
