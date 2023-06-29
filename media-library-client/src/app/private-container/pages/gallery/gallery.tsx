import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { userNameKey, userTokenKey } from 'src/app/constants';
import { setLocalStorageItem } from 'src/app/functions/local-storage';
import AppRoutes from 'src/app/routes/app-routes';

export default function Gallery() {
  const navigate = useNavigate();

  const onLogoutClick = () => {
    setLocalStorageItem(userTokenKey, '');
    setLocalStorageItem(userNameKey, '');
    navigate(AppRoutes.Login);
  };

  return (
    <Box>
      <Typography>Gallery</Typography>
      <Button onClick={onLogoutClick}>Logout</Button>
    </Box>
  );
}
