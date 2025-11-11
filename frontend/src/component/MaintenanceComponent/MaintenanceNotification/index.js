import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Badge,
    IconButton,
    Popover,
    Divider
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Build as BuildIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { fetchNotifications, markNotificationAsRead } from '../../../redux/slice/maintenanceNotificationSlice';

function MaintenanceNotification() {
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);

    // Lấy dữ liệu từ Redux store
    const { notifications, unreadCount, loading } = useSelector(
        state => state.maintenanceNotification
    );

    // Lấy danh sách thông báo khi component được mount
    useEffect(() => {
        dispatch(fetchNotifications());
        // Cập nhật thông báo mỗi 5 phút
        const interval = setInterval(() => {
            dispatch(fetchNotifications());
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [dispatch]);

    // Xử lý khi click vào icon thông báo
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Đóng popover thông báo
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Xử lý khi click vào một thông báo
    const handleNotificationClick = (notificationId) => {
        dispatch(markNotificationAsRead(notificationId));
    };

    // Lấy icon tương ứng với loại thông báo
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'maintenance':
                return <BuildIcon color="primary" />;
            case 'warning':
                return <WarningIcon color="warning" />;
            case 'completed':
                return <CheckCircleIcon color="success" />;
            default:
                return <NotificationsIcon />;
        }
    };

    // Format thời gian thông báo
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('vi-VN');
    };

    return (
        <>
            <IconButton
                color="inherit"
                onClick={handleClick}
                sx={{ ml: 2 }}
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: { width: 360, maxHeight: 500 }
                }}
            >
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Thông báo</Typography>
                    {unreadCount > 0 && (
                        <Typography variant="subtitle2" color="primary">
                            {unreadCount} chưa đọc
                        </Typography>
                    )}
                </Box>
                <Divider />
                <List sx={{ py: 0 }}>
                    {loading ? (
                        <ListItem>
                            <ListItemText primary="Đang tải..." />
                        </ListItem>
                    ) : notifications.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="Không có thông báo mới" />
                        </ListItem>
                    ) : (
                        notifications.map((notification) => (
                            <ListItem
                                key={notification.id}
                                button
                                onClick={() => handleNotificationClick(notification.id)}
                                sx={{
                                    backgroundColor: notification.isRead ? 'inherit' : 'action.hover',
                                    '&:hover': {
                                        backgroundColor: 'action.selected'
                                    }
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'background.paper' }}>
                                        {getNotificationIcon(notification.type)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={notification.title}
                                    secondary={
                                        <>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="textPrimary"
                                            >
                                                {notification.message}
                                            </Typography>
                                            <br />
                                            <Typography
                                                component="span"
                                                variant="caption"
                                                color="textSecondary"
                                            >
                                                {formatTime(notification.createdAt)}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))
                    )}
                </List>
            </Popover>
        </>
    );
}

export default MaintenanceNotification;