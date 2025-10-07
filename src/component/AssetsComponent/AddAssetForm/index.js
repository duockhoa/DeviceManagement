import Box from '@mui/material/Box';
function AddAssetForm({ handleClose }) {
    return (
        <Box p={2}>
            <h2>Add Asset</h2>
            <form>
                <input type="text" placeholder="Asset Name" />
                <button type="submit">Add</button>
                <button type="button" onClick={handleClose}>Cancel</button>
            </form>
        </Box>
    );
}

export default AddAssetForm;