import { Box, Typography, Paper, Grid, Chip, Divider } from '@mui/material';

function MaintenanceHistory({ deviceId }) {
  const maintenanceHistory = [
    {
      id: 1,
      date: '01/01/2025',
      performer: 'Nguyễn Văn A',
      task: 'Kiểm tra và vệ sinh thiết bị',
      status: 'Hoàn thành',
      statusColor: 'success'
    },
    {
      id: 2,
      date: '15/12/2024',
      performer: 'Trần Thị B',
      task: 'Thay thế linh kiện',
      status: 'Hoàn thành',
      statusColor: 'success'
    },
    {
      id: 3,
      date: '01/12/2024',
      performer: 'Lê Văn C',
      task: 'Bảo dưỡng định kỳ',
      status: 'Hoàn thành',
      statusColor: 'success'
    }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Lịch sử bảo trì
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Thiết bị ID: {deviceId}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {maintenanceHistory.map((history, index) => (
          <Box key={history.id}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {history.task}
                    </Typography>
                    <Chip
                      label={history.status}
                      color={history.statusColor}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Ngày bảo trì
                  </Typography>
                  <Typography variant="body2">{history.date}</Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Người thực hiện
                  </Typography>
                  <Typography variant="body2">{history.performer}</Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Trạng thái
                  </Typography>
                  <Typography variant="body2">{history.status}</Typography>
                </Grid>
              </Grid>
            </Paper>
            {index < maintenanceHistory.length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default MaintenanceHistory;
