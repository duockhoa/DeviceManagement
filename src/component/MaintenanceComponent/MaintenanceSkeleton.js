import React from 'react';
import { Skeleton, Card, Row, Col } from 'antd';

export const MaintenanceTableSkeleton = () => (
    <div className="maintenance-table-skeleton">
        <Skeleton.Input style={{ width: '200px', marginBottom: '16px' }} active />
        <Skeleton active>
            <div style={{ height: '400px' }} />
        </Skeleton>
    </div>
);

export const MaintenanceFormSkeleton = () => (
    <div className="maintenance-form-skeleton">
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Skeleton.Input style={{ width: '100%' }} active />
            </Col>
            <Col span={12}>
                <Skeleton.Input style={{ width: '100%' }} active />
            </Col>
            <Col span={12}>
                <Skeleton.Input style={{ width: '100%' }} active />
            </Col>
            <Col span={24}>
                <Skeleton.Input style={{ width: '100%', height: '100px' }} active />
            </Col>
        </Row>
    </div>
);

export const MaintenanceDashboardSkeleton = () => (
    <div className="maintenance-dashboard-skeleton">
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
                <Card>
                    <Skeleton.Input style={{ width: '100%' }} active />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Card>
                    <Skeleton.Input style={{ width: '100%' }} active />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Card>
                    <Skeleton.Input style={{ width: '100%' }} active />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Card>
                    <Skeleton.Input style={{ width: '100%' }} active />
                </Card>
            </Col>
            <Col span={24}>
                <Card>
                    <Skeleton.Input style={{ width: '100%', height: '300px' }} active />
                </Card>
            </Col>
        </Row>
    </div>
);

export const MaintenanceDetailSkeleton = () => (
    <Card>
        <Skeleton avatar active>
            <div style={{ height: '200px' }} />
        </Skeleton>
    </Card>
);