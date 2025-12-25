import React from 'react';
import { Box, Button, Chip } from '@mui/material';
import { getActionConfig } from '../../utils/sapPmLite';

/**
 * ActionToolbar component - renders action buttons based on nextActions array
 * Follows SAP PM-lite nextActions pattern for UI-driven workflows
 * 
 * @param {string} entity - 'incident' or 'maintenance'
 * @param {object} record - Current record with nextActions array
 * @param {function} onActionClick - Handler (actionKey) => void
 */
export default function ActionToolbar({ entity, record, onActionClick }) {
    const nextActions = record?.nextActions || [];

    if (!nextActions || nextActions.length === 0) {
        return (
            <Chip label="Không có thao tác khả dụng" variant="outlined" size="small" />
        );
    }

    return (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {nextActions.map((action) => {
                const config = getActionConfig(entity, action.key);
                const Icon = config?.icon;
                
                return (
                    <Button
                        key={action.key}
                        variant={config?.variant || 'contained'}
                        color={config?.color || 'primary'}
                        size="medium"
                        startIcon={Icon ? <Icon /> : null}
                        onClick={() => onActionClick(action.key)}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            ...(config?.color === 'error' && {
                                bgcolor: 'error.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'error.dark' }
                            })
                        }}
                    >
                        {action.label || config?.label || action.key}
                    </Button>
                );
            })}
        </Box>
    );
}
