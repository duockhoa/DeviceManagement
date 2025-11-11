// Component hiển thị chi tiết lịch sử bảo trì
import { Box, Typography, Paper, Grid, Chip, Divider } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';

function MaintenanceHistory({ deviceId }) {
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Lịch sử bảo trì
            </Typography>
            <Timeline>
                <TimelineItem>
                    <TimelineSeparator>
                        <TimelineDot color="primary" />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Ngày bảo trì
                                    </Typography>
                                    <Typography>01/01/2025</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Người thực hiện
                                    </Typography>
                                    <Typography>Nguyễn Văn A</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Công việc thực hiện
                                    </Typography>
                                    <Typography>
                                        Kiểm tra và vệ sinh thiết bị
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Chip 
                                        label="Hoàn thành" 
                                        color="success" 
                                        size="small" 
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </TimelineContent>
                </TimelineItem>
            </Timeline>
        </Box>
    );
}