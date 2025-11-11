import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Table, 
    Button, 
    Space, 
    Modal, 
    Form, 
    Select, 
    DatePicker,
    message 
} from 'antd';
import { 
    updateMaintenanceStatus,
    deleteExistingMaintenance 
} from '../../../redux/slice/maintenanceSlice';

const BatchOperations = () => {
    const dispatch = useDispatch();
    const [selectedRows, setSelectedRows] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [operationType, setOperationType] = useState(null);
    const [form] = Form.useForm();

    const handleBatchOperation = async (values) => {
        try {
            const operations = {
                'update-status': async () => {
                    const { status } = values;
                    await Promise.all(
                        selectedRows.map(row => 
                            dispatch(updateMaintenanceStatus({
                                id: row.id,
                                status
                            })).unwrap()
                        )
                    );
                    message.success(`Đã cập nhật ${selectedRows.length} bản ghi`);
                },
                
                'batch-delete': async () => {
                    await Promise.all(
                        selectedRows.map(row =>
                            dispatch(deleteExistingMaintenance(row.id)).unwrap()
                        )
                    );
                    message.success(`Đã xóa ${selectedRows.length} bản ghi`);
                },

                'reschedule': async () => {
                    const { maintenanceDate } = values;
                    await Promise.all(
                        selectedRows.map(row =>
                            dispatch(updateExistingMaintenance({
                                id: row.id,
                                data: { maintenanceDate: maintenanceDate.toISOString() }
                            })).unwrap()
                        )
                    );
                    message.success(`Đã lên lịch lại cho ${selectedRows.length} bản ghi`);
                }
            };

            await operations[operationType]();
            setIsModalVisible(false);
            setSelectedRows([]);
            form.resetFields();

        } catch (error) {
            message.error('Có lỗi xảy ra: ' + error.message);
        }
    };

    const renderModalContent = () => {
        switch (operationType) {
            case 'update-status':
                return (
                    <Form.Item
                        name="status"
                        label="Trạng thái mới"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                    >
                        <Select>
                            <Select.Option value="pending">Chờ xử lý</Select.Option>
                            <Select.Option value="in-progress">Đang thực hiện</Select.Option>
                            <Select.Option value="completed">Hoàn thành</Select.Option>
                        </Select>
                    </Form.Item>
                );

            case 'reschedule':
                return (
                    <Form.Item
                        name="maintenanceDate"
                        label="Ngày bảo trì mới"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                    >
                        <DatePicker />
                    </Form.Item>
                );

            case 'batch-delete':
                return (
                    <p>Bạn có chắc chắn muốn xóa {selectedRows.length} bản ghi đã chọn?</p>
                );

            default:
                return null;
        }
    };

    return (
        <>
            <Space>
                <Button
                    type="primary"
                    disabled={selectedRows.length === 0}
                    onClick={() => {
                        setOperationType('update-status');
                        setIsModalVisible(true);
                    }}
                >
                    Cập nhật trạng thái hàng loạt
                </Button>

                <Button
                    disabled={selectedRows.length === 0}
                    onClick={() => {
                        setOperationType('reschedule');
                        setIsModalVisible(true);
                    }}
                >
                    Lên lịch lại hàng loạt
                </Button>

                <Button
                    danger
                    disabled={selectedRows.length === 0}
                    onClick={() => {
                        setOperationType('batch-delete');
                        setIsModalVisible(true);
                    }}
                >
                    Xóa hàng loạt
                </Button>
            </Space>

            <Modal
                title="Thao tác hàng loạt"
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleBatchOperation}
                >
                    {renderModalContent()}
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Xác nhận
                            </Button>
                            <Button onClick={() => setIsModalVisible(false)}>
                                Hủy
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default BatchOperations;