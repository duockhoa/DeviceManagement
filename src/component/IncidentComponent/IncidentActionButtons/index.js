/**
 * Sample React Component - Incident Action Buttons
 * Hiển thị các action buttons dựa trên nextActions từ API
 */

import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select, message, Space } from 'antd';
import { 
    INCIDENT_ACTION_LABELS, 
    INCIDENT_STATUS_LABELS 
} from '../../../constants/flowMaps';

const { TextArea } = Input;
const { Option } = Select;

/**
 * Component hiển thị các action buttons cho incident
 * @param {Object} incident - Incident object from API (có nextActions)
 * @param {Function} onActionComplete - Callback sau khi action thành công
 */
const IncidentActionButtons = ({ incident, onActionComplete }) => {
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);
    const [form] = Form.useForm();

    // Không hiển thị nếu không có nextActions
    if (!incident?.nextActions || incident.nextActions.length === 0) {
        return null;
    }

    /**
     * Mở modal cho action cần input (assign, schedule, post-fix check, etc.)
     */
    const openActionModal = (action) => {
        setCurrentAction(action);
        setModalVisible(true);
        form.resetFields();
    };

    /**
     * Thực hiện action trực tiếp (không cần modal)
     */
    const executeDirectAction = async (action) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/incidents/${incident.id}/${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const result = await response.json();

            if (result.success) {
                message.success(`${INCIDENT_ACTION_LABELS[action]} thành công`);
                if (onActionComplete) onActionComplete(result.data);
            } else {
                message.error(result.message || 'Thao tác thất bại');
            }
        } catch (error) {
            message.error('Lỗi kết nối server');
            console.error('Action error:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Thực hiện action với data từ form
     */
    const executeActionWithData = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            const response = await fetch(`/api/incidents/${incident.id}/${currentAction}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(values)
            });

            const result = await response.json();

            if (result.success) {
                message.success(`${INCIDENT_ACTION_LABELS[currentAction]} thành công`);
                setModalVisible(false);
                if (onActionComplete) onActionComplete(result.data);
            } else {
                message.error(result.message || 'Thao tác thất bại');
            }
        } catch (error) {
            if (error.errorFields) {
                message.warning('Vui lòng điền đầy đủ thông tin');
            } else {
                message.error('Lỗi kết nối server');
                console.error('Action error:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Xác định action cần modal hay không
     */
    const needsModal = (action) => {
        return ['assign', 'post_fix_check', 'cancel', 'submit_post_fix'].includes(action);
    };

    /**
     * Render form fields cho từng action
     */
    const renderFormFields = () => {
        switch (currentAction) {
            case 'assign':
                return (
                    <Form.Item 
                        name="assigned_to" 
                        label="Kỹ thuật viên"
                        rules={[{ required: true, message: 'Vui lòng chọn kỹ thuật viên' }]}
                    >
                        <Select placeholder="Chọn kỹ thuật viên">
                            {/* Load technicians from API */}
                            <Option value={5}>Nguyễn Văn A</Option>
                            <Option value={6}>Trần Văn B</Option>
                        </Select>
                    </Form.Item>
                );

            case 'post_fix_check':
                return (
                    <>
                        <Form.Item 
                            name="post_fix_result" 
                            label="Kết quả kiểm tra"
                            rules={[{ required: true, message: 'Vui lòng chọn kết quả' }]}
                        >
                            <Select placeholder="Chọn kết quả">
                                <Option value="pass">✓ Đạt - Thiết bị hoạt động tốt</Option>
                                <Option value="fail">✗ Không đạt - Cần sửa lại</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="post_fix_notes" label="Ghi chú">
                            <TextArea rows={3} placeholder="Nhập ghi chú kiểm tra..." />
                        </Form.Item>
                    </>
                );

            case 'cancel':
                return (
                    <Form.Item 
                        name="cancel_reason" 
                        label="Lý do hủy"
                        rules={[{ required: true, message: 'Vui lòng nhập lý do hủy' }]}
                    >
                        <TextArea rows={3} placeholder="Nhập lý do hủy sự cố..." />
                    </Form.Item>
                );

            case 'submit_post_fix':
                return (
                    <>
                        <Form.Item 
                            name="actions_taken" 
                            label="Hành động đã thực hiện"
                            rules={[{ required: true, message: 'Vui lòng mô tả hành động' }]}
                        >
                            <TextArea rows={4} placeholder="Mô tả chi tiết hành động sửa chữa..." />
                        </Form.Item>
                        <Form.Item name="root_cause" label="Nguyên nhân">
                            <TextArea rows={2} placeholder="Nguyên nhân gốc rễ..." />
                        </Form.Item>
                        <Form.Item name="downtime_minutes" label="Thời gian dừng máy (phút)">
                            <Input type="number" placeholder="Nhập số phút" />
                        </Form.Item>
                    </>
                );

            default:
                return null;
        }
    };

    /**
     * Render action button với style theo action type
     */
    const renderActionButton = (action) => {
        const label = INCIDENT_ACTION_LABELS[action] || action;
        
        // Xác định màu button
        let type = 'default';
        let danger = false;

        if (action === 'close') type = 'primary';
        if (action === 'cancel') { type = 'default'; danger = true; }
        if (action === 'triage') type = 'primary';
        if (action === 'isolate') { type = 'default'; danger = true; }
        if (action === 'start') type = 'primary';

        const handleClick = () => {
            if (needsModal(action)) {
                openActionModal(action);
            } else {
                executeDirectAction(action);
            }
        };

        return (
            <Button
                key={action}
                type={type}
                danger={danger}
                loading={loading}
                onClick={handleClick}
                style={{ marginRight: 8, marginBottom: 8 }}
            >
                {label}
            </Button>
        );
    };

    return (
        <>
            <Space wrap>
                {incident.nextActions.map(renderActionButton)}
            </Space>

            {/* Modal cho actions cần input */}
            <Modal
                title={currentAction ? INCIDENT_ACTION_LABELS[currentAction] : ''}
                open={modalVisible}
                onOk={executeActionWithData}
                onCancel={() => setModalVisible(false)}
                confirmLoading={loading}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    {renderFormFields()}
                </Form>
            </Modal>
        </>
    );
};

export default IncidentActionButtons;
