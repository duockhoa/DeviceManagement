import React from 'react';
import { Box, Step, StepLabel, Stepper, Chip } from '@mui/material';
import { SYSTEM_STATUS } from '../../utils/sapPmLite';

/**
 * SystemStatusStepper component - displays system status as a stepper
 * Following SAP PM-lite system status progression model
 * 
 * @param {string} systemStatus - Current system status key
 */
export default function SystemStatusStepper({ systemStatus }) {
    const allStatuses = Object.keys(SYSTEM_STATUS);
    const currentIndex = allStatuses.indexOf(systemStatus);

    return (
        <Box sx={{ width: '100%', py: 2 }}>
            <Stepper activeStep={currentIndex} alternativeLabel>
                {allStatuses.map((statusKey, index) => {
                    const config = SYSTEM_STATUS[statusKey];
                    const isActive = index === currentIndex;
                    const isCompleted = index < currentIndex;

                    return (
                        <Step key={statusKey} completed={isCompleted}>
                            <StepLabel
                                StepIconProps={{
                                    sx: {
                                        color: isActive ? config.color : undefined,
                                        '&.Mui-completed': {
                                            color: config.color
                                        }
                                    }
                                }}
                            >
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center',
                                    gap: 0.5
                                }}>
                                    <span>{config.label}</span>
                                    {isActive && (
                                        <Chip 
                                            label="Hiện tại" 
                                            size="small" 
                                            sx={{ 
                                                bgcolor: config.color,
                                                color: 'white',
                                                height: 20,
                                                fontSize: '0.7rem'
                                            }} 
                                        />
                                    )}
                                </Box>
                            </StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </Box>
    );
}
