import React from 'react';
import { Paper, Typography, Button, Stack, Box, Chip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/**
 * ActionStepCard - Card hiển thị bước tiếp theo với hướng dẫn rõ ràng
 */
const ActionStepCard = ({ 
    title, 
    description, 
    icon, 
    steps = [], 
    actions = [], 
    assignee = null,
    estimatedTime = null,
    variant = 'primary' // 'primary' | 'warning' | 'success'
}) => {
    console.log('[DEBUG ActionStepCard]', 'title:', title, 'actions:', actions, 'actions.length:', actions.length);
    
    const bgColor = {
        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        warning: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        info: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }[variant];

    return (
        <Paper 
            elevation={3}
            sx={{ 
                p: 3, 
                mb: 3,
                background: bgColor,
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)'
                }
            }}
        >
            <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box 
                        sx={{ 
                            fontSize: '2.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        {icon}
                    </Box>
                    <Box flex={1}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            {title}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {description}
                        </Typography>
                    </Box>
                </Stack>

                {/* Steps checklist */}
                {steps.length > 0 && (
                    <Box 
                        sx={{ 
                            background: 'rgba(255,255,255,0.15)',
                            borderRadius: 2,
                            p: 2
                        }}
                    >
                        <Stack spacing={1}>
                            {steps.map((step, index) => (
                                <Stack 
                                    key={index} 
                                    direction="row" 
                                    spacing={1.5} 
                                    alignItems="center"
                                >
                                    <CheckCircleOutlineIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                                    <Typography variant="body2" sx={{ opacity: 0.95 }}>
                                        {step}
                                    </Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Box>
                )}

                {/* Assignee & Time info */}
                {(assignee || estimatedTime) && (
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {assignee && (
                            <Chip 
                                label={`👤 ${assignee}`}
                                size="small"
                                sx={{ 
                                    background: 'rgba(255,255,255,0.2)',
                                    color: '#fff',
                                    fontWeight: 600
                                }}
                            />
                        )}
                        {estimatedTime && (
                            <Chip 
                                label={`⏱️ ${estimatedTime}`}
                                size="small"
                                sx={{ 
                                    background: 'rgba(255,255,255,0.2)',
                                    color: '#fff',
                                    fontWeight: 600
                                }}
                            />
                        )}
                    </Stack>
                )}

                {/* Action buttons */}
                {actions.length > 0 && (
                    <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 2 }}>
                        {actions.map((action, index) => {
                            console.log('[DEBUG ActionStepCard Button]', 'index:', index, 'label:', action.label, 'disabled:', action.disabled);
                            return (
                            <Button
                                key={index}
                                variant={index === 0 ? 'contained' : 'outlined'}
                                size="large"
                                onClick={action.onClick}
                                disabled={action.disabled}
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    background: index === 0 ? '#fff !important' : 'transparent',
                                    color: index === 0 ? '#000 !important' : '#fff',
                                    borderColor: '#fff',
                                    fontWeight: 700,
                                    px: 3,
                                    py: 1.5,
                                    textTransform: 'none',
                                    minWidth: '200px',
                                    border: '2px solid #fff !important',
                                    '&:hover': {
                                        background: index === 0 ? 'rgba(255,255,255,0.9) !important' : 'rgba(255,255,255,0.1)',
                                        borderColor: '#fff',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {action.label}
                            </Button>
                            );
                        })}
                    </Stack>
                )}
            </Stack>
        </Paper>
    );
};

export default ActionStepCard;
