import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Tabs, Button, Modal, Space, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MaintenanceTable from './MaintenanceList/MaintenanceTable';
import MaintenanceForm from './MaintenanceForm/MaintenanceForm';
import MaintenanceDashboard from './MaintenanceDashboard/MaintenanceDashboard';
import { fetchMaintenances } from '../../redux/slice/maintenanceSlice';

const { TabPane } = Tabs;

const MaintenanceComponent = () => {
    const dispatch = useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        dispatch(fetchMaintenances());
    }, [dispatch]);

    const handleAdd = () => {
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="maintenance-component">
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <h1>Quản lý Bảo trì</h1>
                </Col>
                <Col>
                    <Space>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                        >
                            Thêm mới
                        </Button>
                    </Space>
                </Col>
            </Row>

            <Tabs defaultActiveKey="list" type="card">
                <TabPane tab="Thống kê" key="dashboard">
                    <MaintenanceDashboard />
                </TabPane>
                <TabPane tab="Danh sách" key="list">
                    <MaintenanceTable />
                </TabPane>
            </Tabs>

            <Modal
                title={`Thêm mới lịch bảo trì`}
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={720}
            >
                <MaintenanceForm onComplete={handleModalClose} />
            </Modal>
        </div>
    );
};

export default MaintenanceComponent;