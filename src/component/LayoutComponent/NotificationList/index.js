import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    IconButton,
    Divider,
    Button,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CircleIcon from '@mui/icons-material/Circle';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification
} from '../../../redux/slice/notificationSlice';

function NotificationList({ onClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const notifications = useSelector((state) => state.notifications.notifications);
    const loading = useSelector((state) => state.notifications.loading);
    const userId = useSelector((state) => state.user.userInfo.id);

    useEffect(() => {
        if (userId) {
            dispatch(fetchNotifications({ userId, params: { limit: 20 } }));
        }
    }, [userId, dispatch]);

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
        const senderName = notification.sender?.name || 'Hệ thống';

        return (
            <Avatar
                src={senderAvatar}
                alt={senderName}
                sx={{
                    width: 40,
                    height: 40,
                    border: isRead ? '2px solid transparent' : '2px solid',
                    borderColor: isRead ? 'transparent' : 'primary.main',
                    opacity: isRead ? 0.7 : 1
                }}
            >
                {!senderAvatar && <NotificationsIcon sx={{ color: isRead ? 'grey.600' : 'primary.main' }} />}
            </Avatar>
        );
    };

    const handleNotificationClick = async (notification) => {
        // Đánh dấu đã đọc
        if (!notification.is_read) {
            await dispatch(markAsRead(notification.id));
        }

        // Navigate đến trang chi tiết
        const { reference_type, reference_id } = notification;
        onClose();

        switch (reference_type) {
            case 'maintenance':
                navigate(`/maintenance/${reference_id}`);
                break;
            case 'calibration':
                navigate(`/calibration/${reference_id}`);
                break;
            case 'work_request':
                navigate(`/work-requests/${reference_id}`);
                break;
            case 'incident':
                navigate(`/incidents/${reference_id}`);
                break;
            case 'asset':
                navigate(`/devices/${reference_id}`);
                break;
            default:
                break;
        }
    };

    const handleMarkAllAsRead = async () => {
        if (userId) {
            await dispatch(markAllAsRead(userId));
        }
    };

    const handleDeleteNotification = async (e, notificationId) => {
        e.stopPropagation();
        await dispatch(removeNotification(notificationId));
    };

    if (loading) {
        return (
            <Box sx={{ width: 400, p: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: 400, maxHeight: 600, overflow: 'hidden', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
            {/* Header */}
            <Box sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: 1,
                borderColor: 'divider'
            }}>
                <Typography variant="h6" sx={{ fontSize: '1.6rem', fontWeight: 600, color: 'primary.main' }}>
                    Thông báo
                </Typography>
                <Box>
                    <IconButton size="small" onClick={handleMarkAllAsRead} title="Đánh dấu tất cả đã đọc">
                        <DoneAllIcon />
                    </IconButton>
                    <IconButton size="small" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Notification List */}
            <List sx={{ 
                flex: 1, 
                overflow: 'auto',
                p: 0,
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555',
                }
            }}>
                {notifications.length === 0 ? (
                    <ListItem>
                        <ListItemText
                            primary={
                                <Typography sx={{ fontSize: '1.4rem', color: 'text.secondary', textAlign: 'center', py: 4 }}>
                                    Không có thông báo nào
                                </Typography>
                            }
                        />
                    </ListItem>
                ) : (
                    notifications.map((notification) => (
                        <Box key={notification.id}>
                            <ListItem
                                alignItems="flex-start"
                                sx={{
                                    cursor: 'pointer',
                                    bgcolor: notification.is_read ? 'transparent' : 'action.hover',
                                    '&:hover': {
                                        bgcolor: 'action.selected'
                                    },
                                    opacity: notification.is_read ? 0.8 : 1,
                                    borderLeft: notification.is_read ? 'none' : '4px solid',
                                    borderLeftColor: 'primary.main'
                                }}
                                onClick={() => handleNotificationClick(notification)}
                                secondaryAction={
                                    <IconButton 
                                        edge="end" 
                                        size="small"
                                        onClick={(e) => handleDeleteNotification(e, notification.id)}
                                    >
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                }
                            >
                                <ListItemAvatar>
                                    {getNotificationIcon(notification)}
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontSize: '1.4rem',
                                                    fontWeight: notification.is_read ? 400 : 600,
                                                    color: notification.is_read ? 'text.secondary' : 'text.primary',
                                                    flex: 1
                                                }}
                                            >
                                                {notification.title}
                                            </Typography>
                                            {!notification.is_read && (
                                                <CircleIcon sx={{ fontSize: '8px', color: 'primary.main' }} />
                                            )}
                                        </Box>
                                    }
                                    secondary={
                                        <>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontSize: '1.3rem',
                                                    color: 'text.secondary',
                                                    mt: 0.5,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {notification.message}
                                            </Typography>
                                            <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                    fontSize: '1.2rem',
                                                    color: 'text.secondary', 
                                                    mt: 0.5, 
                                                    display: 'block' 
                                                }}
                                            >
                                                <strong>{notification.sender?.name || 'Hệ thống'}</strong> • {formatNotificationTime(notification.created_at)}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </Box>
                    ))
                )}
            </List>

            {/* Footer */}
            {notifications.length > 0 && (
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => { navigate('/notifications'); onClose(); }}
                        sx={{
                            fontSize: '1.4rem',
                            textTransform: 'none',
                            borderRadius: 2
                        }}
                    >
                        Xem tất cả thông báo
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default NotificationList;
