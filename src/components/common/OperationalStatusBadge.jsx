import React from 'react';
import { Chip } from '@mui/material';
import { OPERATIONAL_STATUS } from '../../utils/sapPmLite';

/**
 * OperationalStatusBadge component - displays asset operational status
 * Following SAP PM-lite operational status model
 * 
 * @param {string} status - Operational status key (operable, limited, inoperable, etc.)
 * @param {string} size - 'small' | 'medium' (default: 'medium')
 */
export default function OperationalStatusBadge({ status, size = 'medium' }) {
    const config = OPERATIONAL_STATUS[status] || OPERATIONAL_STATUS.unknown;

    return (
        <Chip
            label={config.label}
            size={size}
            sx={{
                bgcolor: config.color,
                color: 'white',
                fontWeight: 500,
                '& .MuiChip-label': {
                    px: size === 'small' ? 1 : 1.5
                }
            }}
        />
    );
}
