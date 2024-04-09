import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { connect, useDispatch } from 'react-redux';
import { handleAddBlock, handleUnblock } from '../../actions/user';

const ITEM_HEIGHT = 48;

function LongMenu({ id , authedUser , users }) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
            paper: {
                style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '20ch',
                },
            }
        }}
      >
        {users[authedUser].blockList.includes(id) ? <MenuItem key={"unblock"} onClick={() => {
            dispatch(handleUnblock(id, authedUser));
            return setAnchorEl(null)
            }}>
            Unblock
          </MenuItem> : 
          <MenuItem key={"block"} onClick={() => {
            dispatch(handleAddBlock(id, authedUser));
            return setAnchorEl(null)
            }}>
            Block
          </MenuItem>}
      </Menu>
    </div>
  );
}

function mapStateToProps ({users , authedUser}) {
  return {
      users,
      authedUser: authedUser !== null ? authedUser[0] : null,
  }
};

export default connect(mapStateToProps)(LongMenu)