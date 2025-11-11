import {
    Box,
} from '@mui/material';
import SubCategoriesList from '../../component/SubCategories/SubCategoriesList';
import SubSidebarSpecification from '../../component/LayoutComponent/SubSidebarSpecification';

function Consumables() { 
    return (
        <Box sx={{ height: '100%', display: 'flex', position: 'relative' }}>
            <Box sx={{ width: '300px', minWidth: '300px' }}>
                <SubSidebarSpecification />
            </Box>
            
            {/* Main Content - 75% width */}
            <Box sx={{ 
                flex: 1, 
                backgroundColor: '#fff', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                p: 1
            }}>
                <SubCategoriesList />
            </Box>
            
            
        </Box>
    );
}

export default Consumables;
