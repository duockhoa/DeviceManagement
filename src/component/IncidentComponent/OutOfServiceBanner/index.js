/**
 * Sample React Component - Out Of Service Banner
 * Hiển thị banner cảnh báo khi thiết bị bị cô lập
 */

import React from 'react';
import { Alert } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

/**
 * Banner cảnh báo thiết bị đang bị cô lập (out_of_service)
 * @param {Object} incident - Incident object with is_isolated flag
 */
const OutOfServiceBanner = ({ incident }) => {
    if (!incident?.is_isolated || incident.status === 'closed' || incident.status === 'cancelled') {
        return null;
    }

    return (
        <Alert
            message="⚠️ THIẾT BỊ ĐANG BỊ CÔ LẬP"
            description={
                <div>
                    <p>
                        <strong>Thiết bị đang trong trạng thái cô lập do sự cố nghiêm trọng.</strong>
                    </p>
                    <p>
                        • Không được vận hành thiết bị cho đến khi sự cố được giải quyết<br />
                        • Thời gian cô lập: {incident.isolated_at 
                            ? new Date(incident.isolated_at).toLocaleString('vi-VN') 
                            : 'N/A'}<br />
                        {incident.isolation_notes && (
                            <>• Ghi chú: {incident.isolation_notes}</>
                        )}
                    </p>
                </div>
            }
            type="error"
            icon={<WarningOutlined />}
            showIcon
            style={{ 
                marginBottom: 16, 
                borderLeft: '4px solid #ff4d4f',
                backgroundColor: '#fff2f0'
            }}
        />
    );
};

export default OutOfServiceBanner;
