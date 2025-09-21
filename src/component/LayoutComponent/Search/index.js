import { TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { changeValue } from '../../../redux/slice/searchSlice';
import SearchIcon from '@mui/icons-material/Search';

function Search() {
    const dispatch = useDispatch();
    const value = useSelector((state) => state.search.value);
    const handleChange = (event) => {
        const newValue = event.target.value;
        dispatch(changeValue(newValue));
    };
    return (
        <TextField
            variant="outlined"
            size="small"
            placeholder="Tìm kiếm..."
            sx={{
                width: '350px',
                maxWidth: '40vw',
                marginRight: '16px',
                backgroundColor: '#f9f9f9',
                borderRadius: '900px',
                '& .MuiOutlinedInput-root': {
                    borderRadius: '900px',
                    borderColor: '#ddd',
                },
            }}
            value={value}
            onChange={handleChange}
            autoComplete="off"
            inputProps={{
                autoComplete: 'off',
                autoCorrect: 'off',
                autoCapitalize: 'off',
                spellCheck: 'false',
            }}
            InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#888', mr: 1, fontSize: 22 }} />,
                sx: {
                    fontSize: '1.4rem',
                    fontWeight: '400',
                },
            }}
        />
    );
}

export default Search;
