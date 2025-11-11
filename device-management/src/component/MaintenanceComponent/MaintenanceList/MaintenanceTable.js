import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Space, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { 
    selectFilteredMaintenances,
    sortByDate,
    sortByPriority,
    toggleComplete,
    setSelectedItem,
    deleteExistingMaintenance
} from '../../../redux/slice/maintenanceSlice';

const MaintenanceTable = () => {
    const dispatch = useDispatch();
    const maintenances = useSelector(selectFilteredMaintenances);
    const [sortConfig, setSortConfig] = useState({ field: null, order: null });

    // Định nghĩa màu cho các trạng thái
    const statusColors = {
        pending: 'orange',
        'in-progress': 'blue',
        completed: 'green',
        overdue: 'red'
    };

    // Định nghĩa màu cho các độ ưu tiên
    const priorityColors = {
        high: 'red',
        medium: 'orange',
        low: 'green'
    };

    const handleSort = (field) => {
        let order = 'asc';
        if (sortConfig.field === field && sortConfig.order === 'asc') {
            order = 'desc';
        }
        setSortConfig({ field, order });

        if (field === 'maintenanceDate') {
            dispatch(sortByDate(order));
        } else if (field === 'priority') {
            dispatch(sortByPriority(order));
        }
    };

    const handleEdit = (record) => {
        dispatch(setSelectedItem(record));
    };

    const handleDelete = async (id) => {
        try {
            await dispatch(deleteExistingMaintenance(id)).unwrap();
        } catch (error) {
            console.error('Không thể xóa lịch bảo trì:', error);
        }
    };

    const handleToggleComplete = (id) => {
        dispatch(toggleComplete(id));
    };

    const columns = [
        {
            title: 'Thiết bị',
            dataIndex: 'deviceName',
            key: 'deviceName',
            sorter: true
        },
        {
            title: 'Loại bảo trì',
            dataIndex: 'maintenanceType',
            key: 'maintenanceType',
            filters: [
                { text: 'Định kỳ', value: 'periodic' },
                { text: 'Đột xuất', value: 'immediate' }
            ]
        },
        {
            title: 'Ngày bảo trì',
            dataIndex: 'maintenanceDate',
            key: 'maintenanceDate',
            sorter: true,
            render: (date) => new Date(date).toLocaleDateString('vi-VN')
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={statusColors[status]}>
                    {status === 'pending' ? 'Chờ xử lý' :
                     status === 'in-progress' ? 'Đang thực hiện' :
                     status === 'completed' ? 'Hoàn thành' : 'Quá hạn'}
                </Tag>
            )
        },
        {
            title: 'Độ ưu tiên',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority) => (
                <Tag color={priorityColors[priority]}>
                    {priority === 'high' ? 'Cao' :
                     priority === 'medium' ? 'Trung bình' : 'Thấp'}
                </Tag>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Chỉnh sửa">
                        <Button 
                            icon={<EditOutlined />} 
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button 
                            icon={<DeleteOutlined />} 
                            danger
                            onClick={() => handleDelete(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title={record.status === 'completed' ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}>
                        <Button 
                            icon={<CheckOutlined />}
                            type={record.status === 'completed' ? 'default' : 'primary'}
                            onClick={() => handleToggleComplete(record.id)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <Table
            columns={columns}
            dataSource={maintenances}
            rowKey="id"
            pagination={{
                total: maintenances.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Tổng số ${total} bản ghi`
            }}
            onChange={(pagination, filters, sorter) => {
                if (sorter.field) {
                    handleSort(sorter.field);
                }
            }}
        />
    );
};

export default MaintenanceTable;