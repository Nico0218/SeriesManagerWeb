import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';
import IconLoader from '../icon-loader/icon-loader';
import IconButtonWrapperProps from './icon-button-wrapper-props';

export default function IconButtonWrapper({
  id,
  label,
  icon,
  onClick,
  size,
  ariaLabel,
  sx,
  badgeIcon,
}: IconButtonWrapperProps) {
  const defaultTheme: SxProps<Theme> = {
    color: (theme) => theme.palette.text.primary,
    borderRadius: 1,
    marginX: 1,
  };
  return (
    <IconButton
      id={id}
      aria-label={ariaLabel ?? label}
      size={size}
      onClick={onClick}
      sx={sx ? { ...defaultTheme, ...sx } : defaultTheme}
    >
      {badgeIcon ? (
        <Badge badgeContent={4} color="secondary">
          <IconLoader icon={icon} />
        </Badge>
      ) : (
        <IconLoader icon={icon} />
      )}
      {label && <Typography sx={{ marginLeft: 1 }}>{label}</Typography>}
    </IconButton>
  );
}
