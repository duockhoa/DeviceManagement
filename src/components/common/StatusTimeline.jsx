import React, { useMemo } from 'react';
import { Box, Stepper, Step, StepLabel, Tooltip, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const StepIcon = ({ active, completed }) => {
    if (completed) return <CheckCircleIcon color="success" fontSize="small" />;
    if (active) return <RadioButtonCheckedIcon color="primary" fontSize="small" />;
    return <RadioButtonUncheckedIcon color="disabled" fontSize="small" />;
};

const StatusTimeline = ({ statuses = [], current, timestamps = {}, assignee = {} }) => {
    const activeIndex = Math.max(statuses.indexOf(current), 0);

    const steps = useMemo(
        () => statuses.map((status, index) => ({
            key: status,
            label: status,
            active: index === activeIndex,
            completed: index < activeIndex,
            tooltip: [
                timestamps[status] ? `Thời gian: ${timestamps[status]}` : null,
                assignee[status] ? `Người xử lý: ${assignee[status]}` : null
            ].filter(Boolean).join(' • ')
        })),
        [statuses, activeIndex, timestamps, assignee]
    );

    return (
        <Box sx={{ px: 1, py: 1.5 }}>
            <Stepper alternativeLabel activeStep={activeIndex} sx={{ width: '100%' }}>
                {steps.map((step) => (
                    <Step key={step.key} completed={step.completed} active={step.active}>
                        <Tooltip title={step.tooltip || ''} disableHoverListener={!step.tooltip} arrow>
                            <StepLabel StepIconComponent={() => <StepIcon active={step.active} completed={step.completed} />}>
                                <Typography variant="caption" color={step.active ? 'text.primary' : 'text.secondary'} sx={{ fontWeight: step.active ? 700 : 500 }}>
                                    {step.label}
                                </Typography>
                            </StepLabel>
                        </Tooltip>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
};

export default StatusTimeline;
