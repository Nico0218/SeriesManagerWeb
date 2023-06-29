import { CircularProgress, Typography } from '@mui/material';

export default function LoadingComponent() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
        <Typography>Loading...</Typography>
      </div>
    </div>
  );
}
