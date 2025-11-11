import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, Grid, MenuItem, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import InputDate from '../../InputComponent/InputDate';
import { createNewMaintenance, updateExistingMaintenance } from '../../../redux/slice/maintenanceSlice';

// Schema validation sử dụng yup
const schema = yup.object().shape({
    deviceId: yup.string().required('Vui lòng chọn thiết bị'),
    deviceName: yup.string().required('Vui lòng nhập tên thiết bị'),
    maintenanceDate: yup.date().required('Vui lòng chọn ngày bảo trì')
        .min(new Date(), 'Ngày bảo trì không thể là ngày trong quá khứ'),
    status: yup.string().required('Vui lòng chọn trạng thái'),
    assignedTo: yup.string().required('Vui lòng nhập người thực hiện'),
    description: yup.string()
        .required('Vui lòng nhập mô tả')
        .min(10, 'Mô tả phải có ít nhất 10 ký tự'),
    maintenanceType: yup.string().required('Vui lòng chọn loại bảo trì'),
    priority: yup.string().required('Vui lòng chọn mức độ ưu tiên'),
    estimatedTime: yup.number()
        .typeError('Vui lòng nhập thời gian dự kiến')
        .min(0, 'Thời gian không thể âm')
        .required('Vui lòng nhập thời gian dự kiến'),
});

function MaintenanceForm() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [searchDevice, setSearchDevice] = useState('');
    
    // Lấy thông tin thiết bị đang được chọn để sửa từ Redux store
    const selectedItem = useSelector(state => state.maintenance.selectedItem);
    // Lấy danh sách thiết bị từ Redux store
    const devices = useSelector(state => state.assets.items);

    // Khởi tạo react-hook-form
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            deviceName: '',
            maintenanceDate: null,
            status: 'pending',
            assignedTo: '',
            description: '',
            notes: ''
        }
    });

    // Cập nhật form khi có thiết bị được chọn để sửa
    useEffect(() => {
        if (selectedItem) {
            reset({
                deviceName: selectedItem.deviceName,
                maintenanceDate: selectedItem.maintenanceDate,
                status: selectedItem.status,
                assignedTo: selectedItem.assignedTo,
                description: selectedItem.description,
                notes: selectedItem.notes
            });
        }
    }, [selectedItem, reset]);

    // Xử lý khi submit form
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (selectedItem) {
                // Nếu có selectedItem thì gọi action cập nhật
                await dispatch(updateExistingMaintenance({ 
                    id: selectedItem.id, 
                    data 
                })).unwrap();
            } else {
                // Nếu không có selectedItem thì gọi action tạo mới
                await dispatch(createNewMaintenance(data)).unwrap();
                reset(); // Reset form sau khi tạo mới thành công
            }
        } catch (error) {
            console.error('Lỗi khi lưu thông tin bảo trì:', error);
        } finally {
            setLoading(false);
        }
    };

    // Danh sách trạng thái
    const statusOptions = [
        { value: 'pending', label: 'Chờ xử lý' },
        { value: 'in-progress', label: 'Đang thực hiện' },
        { value: 'completed', label: 'Hoàn thành' }
    ];

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                {selectedItem ? 'Cập nhật thông tin bảo trì' : 'Thêm mới lịch bảo trì'}
            </Typography>

            <Grid container spacing={2}>
                {/* Tên thiết bị */}
                <Grid item xs={12} md={6}>
                    <Controller
                        name="deviceName"
                        control={control}
                        rules={{ required: 'Vui lòng nhập tên thiết bị' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Tên thiết bị"
                                error={Boolean(errors.deviceName)}
                                helperText={errors.deviceName?.message}
                            />
                        )}
                    />
                </Grid>

                {/* Ngày bảo trì */}
                <Grid item xs={12} md={6}>
                    <Controller
                        name="maintenanceDate"
                        control={control}
                        rules={{ required: 'Vui lòng chọn ngày bảo trì' }}
                        render={({ field }) => (
                            <InputDate
                                {...field}
                                label="Ngày bảo trì"
                                error={Boolean(errors.maintenanceDate)}
                                helperText={errors.maintenanceDate?.message}
                            />
                        )}
                    />
                </Grid>

                {/* Trạng thái */}
                <Grid item xs={12} md={6}>
                    <Controller
                        name="status"
                        control={control}
                        rules={{ required: 'Vui lòng chọn trạng thái' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                fullWidth
                                label="Trạng thái"
                                error={Boolean(errors.status)}
                                helperText={errors.status?.message}
                            >
                                {statusOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Grid>

                {/* Người thực hiện */}
                <Grid item xs={12} md={6}>
                    <Controller
                        name="assignedTo"
                        control={control}
                        rules={{ required: 'Vui lòng nhập người thực hiện' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Người thực hiện"
                                error={Boolean(errors.assignedTo)}
                                helperText={errors.assignedTo?.message}
                            />
                        )}
                    />
                </Grid>

                {/* Mô tả */}
                <Grid item xs={12}>
                    <Controller
                        name="description"
                        control={control}
                        rules={{ required: 'Vui lòng nhập mô tả' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={3}
                                label="Mô tả công việc"
                                error={Boolean(errors.description)}
                                helperText={errors.description?.message}
                            />
                        )}
                    />
                </Grid>

                {/* Ghi chú */}
                <Grid item xs={12}>
                    <Controller
                        name="notes"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={2}
                                label="Ghi chú"
                            />
                        )}
                    />
                </Grid>
            </Grid>

            {/* Nút submit */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                    variant="outlined" 
                    onClick={() => reset()}
                >
                    Làm mới
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? 'Đang lưu...' : (selectedItem ? 'Cập nhật' : 'Thêm mới')}
                </Button>
            </Box>
        </Box>
    );
}export default MaintenanceForm;