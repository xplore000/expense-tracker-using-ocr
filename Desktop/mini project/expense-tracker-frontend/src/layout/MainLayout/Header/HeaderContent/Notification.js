import { useRef, useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import axios from 'axios'
import {
  Badge,
  Box,
  ClickAwayListener,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  Typography,
  useMediaQuery
} from '@mui/material';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import { BellOutlined, CloseOutlined } from '@ant-design/icons';

const Notification = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState([]); 
  const [iconNum,setIconNum]=useState(true) // State to store the fetched logs

  useEffect(() => {
    // Fetch logs from the backend when the component mounts
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const userId=localStorage.getItem('userId')
      const response = await axios.get(`http://localhost:3002/api/v1/get-log?${userId}`);
      
      const data = await response.data.logs;
      console.log(data)
      // Assuming the response data is an array of logs
      setLogs(data.slice(0, 4)); // Store only the latest 4 logs
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    setIconNum(false)
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };


  const iconBackColorOpen = 'grey.300';
  const iconBackColor = 'grey.100';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        disableRipple
        color="secondary"
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge
          badgeContent={iconNum ? logs.length : null}
          color="primary"
        >
          <BellOutlined />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? -5 : 0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: '100%',
                minWidth: 285,
                maxWidth: 420,
                [theme.breakpoints.down('md')]: {
                  maxWidth: 285
                }
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notification"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    <IconButton size="small" onClick={handleToggle}>
                      <CloseOutlined />
                    </IconButton>
                  }
                >
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      '& .MuiListItemButton-root': {
                        py: 0.5,
                        '& .MuiAvatar-root': {
                          width: 36,
                          height: 36,
                          fontSize: '1rem'
                        },
                        '& .MuiListItemSecondaryAction-root': {
                          mt: '6px',
                          ml: 1,
                          top: 'auto',
                          right: 'auto',
                          alignSelf: 'flex-start',
                          transform: 'none'
                        }
                      }
                    }}
                  >
                    {logs.map((log, index) => (
                      <div key={index}>
                        <ListItemButton>
                          <ListItemText
                            primary={
                              <Typography variant="h6">
                                {log.message}
                              </Typography>
                            }
                          />
                        </ListItemButton>
                        {index !== logs.length - 1 && <Divider />}
                      </div>
                    ))}
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Notification;
