import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Select, DatePicker, Button, Space, message } from 'antd';
import { 
    createNewMaintenance,
    updateExistingMaintenance,
    clearSelectedItem
} from '../../../redux/slice/maintenanceSlice';
import locale from 'antd/es/date-picker/locale/vi_VN';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const MaintenanceForm = ({ onComplete }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const selectedItem = useSelector(state => state.maintenance.selectedItem);
    const loading = useSelector(state => state.maintenance.loading);

    useEffect(() => {
        if (selectedItem) {
            form.setFieldsValue({
                ...selectedItem,
                maintenanceDate: moment(selectedItem.maintenanceDate)
            });
        }
    }, [selectedItem, form]);

    const handleSubmit = async (values) => {
        try {
            const formData = {
                ...values,
                maintenanceDate: values.maintenanceDate.toISOString()
            };

            if (selectedItem) {
                await dispatch(updateExistingMaintenance({
                    id: selectedItem.id,
                    data: formData
                })).unwrap();
                message.success('Cập nhật lịch bảo trì thành công');
            } else {
                await dispatch(createNewMaintenance(formData)).unwrap();
                message.success('Tạo mới lịch bảo trì thành công');
            }

            form.resetFields();
            dispatch(clearSelectedItem());
            onComplete?.();
        } catch (error) {
            message.error('Có lỗi xảy ra: ' + error.message);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        dispatch(clearSelectedItem());
        onComplete?.();
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                status: 'pending',
                priority: 'medium',
                maintenanceType: 'periodic'
            }}
        >
            <Form.Item
                name="deviceName"
                label="Tên thiết bị"
                rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị' }]}
            >
                <Input placeholder="Nhập tên thiết bị" />
            </Form.Item>

            <Form.Item
                name="maintenanceType"
                label="Loại bảo trì"
                rules={[{ required: true, message: 'Vui lòng chọn loại bảo trì' }]}
            >
                <Select>
                    <Select.Option value="periodic">Định kỳ</Select.Option>
                    <Select.Option value="immediate">Đột xuất</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="maintenanceDate"
                label="Ngày bảo trì"
                rules={[{ required: true, message: 'Vui lòng chọn ngày bảo trì' }]}
            >
                <DatePicker 
                    locale={locale}
                    format="DD/MM/YYYY"
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item
                name="priority"
                label="Độ ưu tiên"
                rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên' }]}
            >
                <Select>
                    <Select.Option value="high">Cao</Select.Option>
                    <Select.Option value="medium">Trung bình</Select.Option>
                    <Select.Option value="low">Thấp</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
                <Select>
                    <Select.Option value="pending">Chờ xử lý</Select.Option>
                    <Select.Option value="in-progress">Đang thực hiện</Select.Option>
                    <Select.Option value="completed">Hoàn thành</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="description"
                label="Mô tả"
            >
                <Input.TextArea rows={4} placeholder="Nhập mô tả chi tiết về bảo trì" />
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {selectedItem ? 'Cập nhật' : 'Tạo mới'}
                    </Button>
                    <Button onClick={handleCancel}>
                        Hủy
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default MaintenanceForm;