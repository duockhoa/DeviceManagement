import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Statistic, Progress } from 'antd';
import { Calendar, Pie } from '@ant-design/plots';
import {
    getMaintenanceStats,
    selectMaintenanceStats
} from '../../../redux/slice/maintenanceSlice';

const MaintenanceDashboard = () => {
    const dispatch = useDispatch();
    const stats = useSelector(selectMaintenanceStats);
    const loading = useSelector(state => state.maintenance.loading);

    useEffect(() => {
        dispatch(getMaintenanceStats());
    }, [dispatch]);

    const pieConfig = {
        appendPadding: 10,
        data: stats ? [
            { type: 'Đã hoàn thành', value: stats.completed },
            { type: 'Đang chờ', value: stats.pending },
            { type: 'Quá hạn', value: stats.overdue }
        ] : [],
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'outer',
            content: '{name} {percentage}'
        },
        interactions: [{ type: 'element-active' }]
    };

    return (
        <div className="maintenance-dashboard">
            <Row gutter={[16, 16]}>
                {/* Thống kê cơ bản */}
                <Col xs={24} sm={12} md={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="Tổng số bảo trì"
                            value={stats?.total || 0}
                            suffix="lịch"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="Đang chờ xử lý"
                            value={stats?.pending || 0}
                            suffix="lịch"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="Hoàn thành"
                            value={stats?.completed || 0}
                            suffix="lịch"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="Quá hạn"
                            value={stats?.overdue || 0}
                            suffix="lịch"
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>

                {/* Tỷ lệ hoàn thành */}
                <Col xs={24} md={12}>
                    <Card title="Tỷ lệ hoàn thành" loading={loading}>
                        <Progress
                            type="circle"
                            percent={Math.round(stats?.completionRate || 0)}
                            status={stats?.completionRate >= 90 ? 'success' : 'active'}
                        />
                    </Card>
                </Col>

                {/* Biểu đồ phân bổ trạng thái */}
                <Col xs={24} md={12}>
                    <Card title="Phân bổ trạng thái" loading={loading}>
                        <Pie {...pieConfig} />
                    </Card>
                </Col>

                {/* Lịch bảo trì */}
                <Col xs={24}>
                    <Card title="Lịch bảo trì trong tháng" loading={loading}>
                        <Calendar />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default MaintenanceDashboard;