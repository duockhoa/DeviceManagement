import React from 'react';
import { Result, Button } from 'antd';

class MaintenanceErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Gửi log lỗi lên server
        console.error('Maintenance Error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Result
                    status="error"
                    title="Đã xảy ra lỗi"
                    subTitle={this.state.error?.message || 'Có lỗi xảy ra khi tải module bảo trì'}
                    extra={[
                        <Button type="primary" key="reload" onClick={this.handleReset}>
                            Tải lại trang
                        </Button>,
                        <Button key="support" onClick={() => window.location.href = '/support'}>
                            Liên hệ hỗ trợ
                        </Button>
                    ]}
                />
            );
        }

        return this.props.children;
    }
}

export default MaintenanceErrorBoundary;