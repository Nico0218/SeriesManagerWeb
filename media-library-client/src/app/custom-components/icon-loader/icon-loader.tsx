import AccessTimeFilledOutlinedIcon from '@mui/icons-material/AccessTimeFilledOutlined';
import AccountTree from '@mui/icons-material/AccountTree';
import Add from '@mui/icons-material/Add';
import Api from '@mui/icons-material/Api';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Close from '@mui/icons-material/Close';
import CropFreeIcon from '@mui/icons-material/CropFree';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Delete from '@mui/icons-material/Delete';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import EventRepeat from '@mui/icons-material/EventRepeat';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Fullscreen from '@mui/icons-material/Fullscreen';
import FullscreenExit from '@mui/icons-material/FullscreenExit';
import Groups from '@mui/icons-material/Groups';
import Home from '@mui/icons-material/Home';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import List from '@mui/icons-material/List';
import Menu from '@mui/icons-material/Menu';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import Notifications from '@mui/icons-material/Notifications';
import OpenInNew from '@mui/icons-material/OpenInNew';
import OpenWith from '@mui/icons-material/OpenWith';
import Person from '@mui/icons-material/Person';
import QuestionMark from '@mui/icons-material/QuestionMark';
import SearchIcon from '@mui/icons-material/Search';
import SettingsApplications from '@mui/icons-material/SettingsApplications';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import RuleOutlinedIcon from '@mui/icons-material/RuleOutlined';
import AbcOutlinedIcon from '@mui/icons-material/AbcOutlined';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import PinOutlinedIcon from '@mui/icons-material/PinOutlined';
import Refresh from '@mui/icons-material/Refresh';
import Save from '@mui/icons-material/Save';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import IconLoaderProperties from './icon-loader-properties';
import IconSelector from './icon-selector';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import InfoIcon from '@mui/icons-material/Info';
import MergeIcon from '@mui/icons-material/Merge';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

//Add icons as needed. DO NOT import * from '@mui/icons-material' since it will include 6.5Mb of icons in the bundle
//Icon list can be found here https://mui.com/material-ui/material-icons/
export default function IconLoader({ id, icon, sx }: IconLoaderProperties) {
	const iconSelector = (icon: IconSelector) => {
		switch (icon) {
			case IconSelector.Home:
				return <Home id={id} key={id} sx={sx} />;
			case IconSelector.Assignment:
				return <AssignmentIcon id={id} key={id} sx={sx} />;
			case IconSelector.BarChart:
				return <BarChartIcon id={id} key={id} sx={sx} />;
			case IconSelector.Dashboard:
				return <DashboardIcon id={id} key={id} sx={sx} />;
			case IconSelector.OpenWith:
				return <OpenWith id={id} key={id} sx={sx} />;
			case IconSelector.OpenInNew:
				return <OpenInNew id={id} key={id} sx={sx} />;
			case IconSelector.AccountTree:
				return <AccountTree id={id} key={id} sx={sx} />;
			case IconSelector.Person:
				return <Person id={id} key={id} sx={sx} />;
			case IconSelector.Groups:
				return <Groups id={id} key={id} sx={sx} />;
			case IconSelector.EventRepeat:
				return <EventRepeat id={id} key={id} sx={sx} />;
			case IconSelector.SettingsApplications:
				return <SettingsApplications id={id} key={id} sx={sx} />;
			case IconSelector.Api:
				return <Api id={id} key={id} sx={sx} />;
			case IconSelector.CropFree:
				return <CropFreeIcon id={id} key={id} sx={sx} />;
			case IconSelector.ChevronRight:
				return <ChevronRightIcon id={id} key={id} sx={sx} />;
			case IconSelector.Delete:
				return <Delete id={id} key={id} sx={sx} />;
			case IconSelector.Add:
				return <Add id={id} key={id} sx={sx} />;
			case IconSelector.Close:
				return <Close id={id} key={id} sx={sx} />;
			case IconSelector.Menu:
				return <Menu id={id} key={id} sx={sx} />;
			case IconSelector.Notifications:
				return <Notifications id={id} key={id} sx={sx} />;
			case IconSelector.ChevronLeft:
				return <ChevronLeftIcon id={id} key={id} sx={sx} />;
			case IconSelector.KeyboardDoubleArrowLeft:
				return <KeyboardDoubleArrowLeftIcon id={id} key={id} sx={sx} />;
			case IconSelector.KeyboardDoubleArrowRight:
				return <KeyboardDoubleArrowRightIcon id={id} key={id} sx={sx} />;
			case IconSelector.KeyboardArrowDown:
				return <KeyboardArrowDownIcon id={id} key={id} sx={sx} />;
			case IconSelector.ErrorOutlined:
				return <ErrorOutlinedIcon id={id} key={id} sx={sx} />;
			case IconSelector.ErrorOutlineOutlined:
				return <ErrorOutlineOutlinedIcon id={id} key={id} sx={sx} />;
			case IconSelector.CheckCircle:
				return <CheckCircleIcon id={id} key={id} sx={sx} />;
			case IconSelector.Search:
				return <SearchIcon id={id} key={id} sx={sx} />;
			case IconSelector.AccessTimeFilledOutlined:
				return <AccessTimeFilledOutlinedIcon id={id} key={id} sx={sx} />;
			case IconSelector.ExpandMore:
				return <ExpandMore id={id} key={id} sx={sx} />;
			case IconSelector.FormatListBulletedOutlined:
				return <FormatListBulletedOutlinedIcon id={id} key={id} sx={sx} />;
			case IconSelector.RuleOutlinedIcon:
				return <RuleOutlinedIcon id={id} key={id} sx={sx} />;
			case IconSelector.AbcOutlinedIcon:
				return <AbcOutlinedIcon id={id} key={id} sx={sx} />;
			case IconSelector.DataObjectOutlinedIcon:
				return <DataObjectOutlinedIcon id={id} key={id} sx={sx} />;
			case IconSelector.PinOutlinedIcon:
				return <PinOutlinedIcon id={id} key={id} sx={sx} />;
			case IconSelector.List:
				return <List id={id} key={id} sx={sx} />;
			case IconSelector.Fullscreen:
				return <Fullscreen id={id} key={id} sx={sx} />;
			case IconSelector.FullscreenExit:
				return <FullscreenExit id={id} key={id} sx={sx} />;
			case IconSelector.ArrowDropDownIcon:
				return <ArrowDropDownIcon id={id} key={id} sx={sx} />;
			case IconSelector.ArrowRightIcon:
				return <ArrowRightIcon id={id} key={id} sx={sx} />;
			case IconSelector.Refresh:
				return <Refresh id={id} key={id} sx={sx} />;
			case IconSelector.Save:
				return <Save id={id} key={id} sx={sx} />;
			case IconSelector.AddToPhotos:
				return <AddToPhotosIcon id={id} key={id} sx={sx} />;
			case IconSelector.Sync:
				return <SyncIcon id={id} key={id} sx={sx} />;
			case IconSelector.CheckCircleOutline:
				return <CheckCircleOutlineIcon id={id} key={id} sx={sx} />;
			case IconSelector.InfoIcon:
				return <InfoIcon id={id} key={id} sx={sx} />;
			case IconSelector.MergeIcon:
				return <MergeIcon id={id} key={id} sx={sx} />;
			case IconSelector.ContentCopyIcon:
				return <ContentCopyIcon id={id} key={id} sx={sx} />;
			default:
				return <QuestionMark id={id} key={id} sx={sx} />;
		}
	};

	return iconSelector(icon);
}
