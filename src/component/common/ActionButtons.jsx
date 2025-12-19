import React from 'react';
import { Stack, Button } from '@mui/material';

const DEFAULT_ACTION_META = {
    start: { label: 'Bắt đầu', color: 'primary', variant: 'contained' },
    update: { label: 'Cập nhật', color: 'info', variant: 'contained' },
    complete: { label: 'Hoàn thành', color: 'success', variant: 'contained' },
    approve: { label: 'Duyệt', color: 'success', variant: 'contained' },
    reject: { label: 'Từ chối', color: 'warning', variant: 'outlined' },
    close: { label: 'Đóng', color: 'secondary', variant: 'outlined' }
};

const ActionButtons = ({ allowed_actions = [], handlers = {}, labels = {}, spacing = 1, size = 'medium' }) => {
    const allowed = Array.isArray(allowed_actions) ? allowed_actions : [];
    const uniqueAllowed = Array.from(new Set(allowed.filter(Boolean)));

    return (
        <Stack direction="row" spacing={spacing} flexWrap="wrap" useFlexGap>
            {uniqueAllowed.map((actionKey) => {
                const handler = handlers[actionKey];
                const meta = DEFAULT_ACTION_META[actionKey] || {};
                if (typeof handler !== 'function') return null;
                return (
                    <Button
                        key={actionKey}
                        onClick={handler}
                        color={meta.color || 'primary'}
                        variant={meta.variant || 'contained'}
                        size={size}
                        sx={{ textTransform: 'none' }}
                    >
                        {labels[actionKey] || meta.label || actionKey}
                    </Button>
                );
            })}
        </Stack>
    );
};

export default ActionButtons;
