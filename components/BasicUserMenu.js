import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/router'
import { logoutUser } from '../lib/utils';

export default function BasicUserMenu({ user, dispatch }) {
    const router = useRouter()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const loginMenuCloseHandler = (e, redirect) => {
        setAnchorEl(null)
        if (redirect) router.push(redirect)

    }
    const logoutHandler = () => {
        setAnchorEl(null)
        logoutUser()(dispatch)
        router.push('/')


    }

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {user.username}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={(e) => loginMenuCloseHandler(e, '/profile')}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>Commandes</MenuItem>
                {
                    user.isAdmin && <MenuItem onClick={handleClose}>Administration</MenuItem>
                }
                <MenuItem onClick={logoutHandler}>Déconnexion</MenuItem>
            </Menu>
        </div>
    );
}
