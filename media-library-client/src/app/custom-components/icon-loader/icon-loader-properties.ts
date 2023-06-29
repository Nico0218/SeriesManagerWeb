import { SxProps, Theme } from '@mui/material';
import IconSelector from './icon-selector';

export default interface IconLoaderProperties {
  icon: IconSelector;
  sx?: SxProps<Theme> | undefined;
  id?: string;
}
