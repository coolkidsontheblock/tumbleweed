import { Link } from 'react-router-dom';
import { sidebarData } from '../utils/sidebarData';
import {
  Drawer,
  List,
  ListItemText,
  ListItem
} from '@mui/material';

export const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShring: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#db7b3bc6',
          color: 'white',
        },
        '& .MuiListItem-root': {
          paddingTop: 2,
          paddingBottom: 2,
        },
      }}
    >
      <List
        sx={{
          paddingY: 2,
        }}
      >
      {sidebarData.map((item) => (
          <ListItem
            key={item.id}
            component={Link}
            to={item.path}
            className={item.className}
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              paddingY: 1.5,
            }}
          >
            <ListItemText
              primary={item.title}
              sx={{
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
};