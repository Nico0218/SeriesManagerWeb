import { Button, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { KeyboardEvent, SyntheticEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeSelector from '../../../custom-components/theme-selector/theme-selector';
import { userInfoKey } from '../../../constants';
import { setLocalStorageItem } from '../../../functions/local-storage';
import { RouteFolderLocation, RouteLogin } from '../../../routes/app-routes';

export function DropdownMenu() {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const anchorRef = useRef<HTMLButtonElement>(null);

	const handleToggle = () => {
		setOpen(prevOpen => !prevOpen);
	};

	const handleClose = (event: Event | SyntheticEvent) => {
		if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
			return;
		}

		setOpen(false);
	};

	const handleListKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Tab') {
			event.preventDefault();
			setOpen(false);
		} else if (event.key === 'Escape') {
			setOpen(false);
		}
	};

	const onSettingsClick = (event: Event | SyntheticEvent) => {
		navigate(RouteFolderLocation());
		handleClose(event);
	};

	const onLogoutClick = (event: Event | SyntheticEvent) => {
		setLocalStorageItem(userInfoKey, undefined);
		navigate(RouteLogin());
	};

	return (
		<div>
			<Button
				ref={anchorRef}
				id="composition-button"
				aria-controls={open ? 'composition-menu' : undefined}
				aria-expanded={open ? 'true' : undefined}
				aria-haspopup="true"
				onClick={handleToggle}
			>
				Menu
			</Button>
			<Popper
				open={open}
				anchorEl={anchorRef.current}
				role={undefined}
				placement="bottom-start"
				transition
				disablePortal
			>
				{({ TransitionProps, placement }) => (
					<Grow
						{...TransitionProps}
						style={{
							transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
						}}
					>
						<Paper>
							<ClickAwayListener onClickAway={handleClose}>
								<MenuList
									autoFocusItem={open}
									id="composition-menu"
									aria-labelledby="composition-button"
									onKeyDown={handleListKeyDown}
								>
									<ThemeSelector sx={{ m: 2 }} />
									<MenuItem onClick={onSettingsClick}>Settings</MenuItem>
									<MenuItem onClick={onLogoutClick}>Logout</MenuItem>
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>
		</div>
	);
}
