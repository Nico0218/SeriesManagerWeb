import { Box, ListItemButton, ListItemText, Typography } from '@mui/material';
import { CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavItemProperties from './nav-item-properties';

export default function NavItem({
  title,
  href,
  small = false,
  noIcon = false,
  color,
  style,
  onClick,
  children,
}: NavItemProperties) {
  const location = useLocation();
  const active = location.pathname === href;

  const defaultStyle: CSSProperties = {
    textDecoration: 'none',
    display: 'flex',
    backgroundColor: 'transparent',
  };

  return (
    <Link
      to={href}
      style={style ? { ...defaultStyle, ...style } : defaultStyle}
    >
      <ListItemButton
        key={href}
        onClick={onClick}
        sx={{
          borderRadius: 2,
          paddingX: 1.5,
          paddingY: small ? 1 : 1.25,
          ...(active && {
            backgroundColor: (theme) =>
              theme.palette.common.custom.navActiveBackground,
          }),
          ':hover': {
            ...(active && {
              backgroundColor: (theme) =>
                theme.palette.common.custom.navActiveBackground,
            }),
          },
          '& .MuiTouchRipple-child': {
            backgroundColor: (theme) =>
              theme.palette.common.custom.navActiveBackground,
          },
        }}
      >
        {!noIcon && (
          <Box
            sx={{
              height: small ? 14 : 21,
              width: small ? 14 : 21,
              marginRight: 1,
              background: color ? color : 'rgba(176, 189, 255, 0.5)',
              borderRadius: '50%',
            }}
          />
        )}
        <ListItemText
          sx={{ margin: 0, display: 'flex' }}
          primary={
            <Typography
              variant="bodySmall"
              letterSpacing="0.01em"
              color={(theme) => theme.palette.common.white}
            >
              {title}
            </Typography>
          }
        />
        {children}
      </ListItemButton>
    </Link>
  );
}
