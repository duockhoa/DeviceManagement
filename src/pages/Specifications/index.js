import {
    Box,
    useMediaQuery,
    useTheme
} from '@mui/material';
import SubCategoriesList from '../../component/SubCategories/SubCategoriesList';
import SubSidebarSpecification from '../../component/LayoutComponent/SubSidebarSpecification';

function Specifications() {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    
    return (
        <Box sx={{ height: '100%', display: 'flex', position: 'relative' }}>
            {isLargeScreen && (
                <Box sx={{ width: '300px', minWidth: '300px' }}>
                    <SubSidebarSpecification />
                </Box>
            )}
            
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
