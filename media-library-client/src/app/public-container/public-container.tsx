import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userNameKey, userTokenKey } from '../constants';
import { setLocalStorageItem } from '../functions/local-storage';
import AppRoutes from '../routes/app-routes';

export default function PublicContainer() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onLoginClick = () => {
    setLocalStorageItem(userNameKey, userName);
    setLocalStorageItem(userTokenKey, '');
    navigate(AppRoutes.Gallery);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h2">Login</Typography>
      <Box sx={{ maxWidth: '400px' }}>
        <TextField
          label={'UserName'}
          value={userName}
          onChange={(event) => {
            setUserName(event.target.value);
          }}
        />
        <TextField
          label={'Password'}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
      </Box>

      <Button variant="outlined" onClick={onLoginClick}>
        Login
      </Button>
    </Box>
  );
}
