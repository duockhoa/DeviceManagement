import { Box, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import CircleIcon from '@mui/icons-material/Circle';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useSelector } from 'react-redux';

function NotificationList({ onClose }) {
    const notifications = [];
    const loading = false;
    // Get user ID at top level of component - not inside function
    const userId = useSelector((state) => state.user.userInfo.id);

    const formatNotificationTime = (date) => {
        try {
            return format(new Date(date), 'HH:mm - dd/MM/yyyy', { locale: vi });
        } catch (error) {
            return 'Thời gian không hợp lệ';
        }
    };

    const getNotificationIcon = (notification) => {
        const isRead = notification.is_read;
        const senderAvatar = notification.sender?.avatar;
        const senderName = notification.sender?.name || 'N/A';

        return (
            <Avatar
                src={senderAvatar}
                alt={senderName}
                sx={{
                    width: 40,
                    height: 40,
                    border: isRead ? '2px solid transparent' : '2px solid',
                    borderColor: isRead ? 'transparent' : 'primary.main',
                    opacity: isRead ? 0.7 : 1,
                }}
            >
                {/* Fallback to NotificationsIcon if no avatar */}
                {!senderAvatar && <NotificationsIcon sx={{ color: isRead ? 'grey.600' : 'primary.main' }} />}
                {/* Fallback to first letter of name if avatar fails to load */}
                {senderAvatar && !senderAvatar.includes('http') && senderName.charAt(0).toUpperCase()}
            </Avatar>
        );
    };

    if (loading) {
        return (
            <Box sx={{ width: '100%', bgcolor: 'background.paper', p: 2 }}>
                <Typography>Đang tải thông báo...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {/* Header */}
            <Box
                sx={{
                    p: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: '1.6rem',
                        fontWeight: 600,
                        color: 'primary.main',
                    }}
                >
                    Thông báo
                </Typography>
            </Box>

            {/* Notifications List */}
            <List sx={{ maxHeight: 600, overflow: 'auto', p: 0 }}>
                {notifications.length === 0 ? (
                    <ListItem>
                        <ListItemText
                            primary={
                                <Typography
                                    sx={{
                                        fontSize: '1.4rem',
                                        color: 'text.secondary',
                                        textAlign: 'center',
                                        py: 4,
                                    }}
                                >
                                    Không có thông báo nào
                                </Typography>
                            }
                        />
                    </ListItem>
                ) : (
                    notifications.map((notification) => (
                        <ListItem
                            key={notification.id}
                            alignItems="flex-start"
                            sx={{
                                bgcolor: notification.is_read ? 'inherit' : 'action.hover',
                                '&:hover': { bgcolor: 'action.selected' },
                                cursor: 'pointer',
                                borderLeft: notification.is_read ? 'none' : '4px solid',
                                borderLeftColor: 'primary.main',
                                position: 'relative',
                            }}
                        >
                            <ListItemAvatar>{getNotificationIcon(notification)}</ListItemAvatar>

                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography
                                            component="span"
                                            sx={{
                                                fontSize: '1.4rem',
                                                fontWeight: notification.is_read ? 400 : 600,
                                                color: notification.is_read ? 'text.secondary' : 'text.primary',
                                                flex: 1,
                                            }}
                                        >
                                            {notification.message}
                                        </Typography>
                                        {!notification.is_read && (
                                            <CircleIcon
                                                sx={{
                                                    fontSize: '8px',
                                                    color: 'primary.main',
                                                }}
                                            />
                                        )}
                                    </Box>
                                }
                                secondary={
                                    <Typography
                                        component="span"
                                        sx={{
                                            fontSize: '1.2rem',
                                            color: 'text.secondary',
                                            mt: 0.5,
                                            display: 'block',
                                        }}
                                    >
                                        <strong>{notification.sender?.name || 'Hệ thống'}</strong> •{' '}
                                        {formatNotificationTime(notification.created_at)}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))
                )}
            </List>

            {/* Mark All as Read Button */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CheckIcon />}
                    sx={{
                        fontSize: '1.4rem',
                        textTransform: 'none',
                        borderRadius: 2,
                    }}
                >
                    Đánh dấu tất cả đã đọc
                </Button>
            </Box>
        </Box>
    );
}

export default NotificationList;
