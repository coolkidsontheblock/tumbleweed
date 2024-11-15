import { Link } from 'react-router-dom';
import { sidebarData } from '../utils/sidebarData';
import {
  Drawer,
  List,
  ListItemText,
  ListItem,
  Box
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../styles/Theme';

export const Sidebar = () => {
  return (
    <ThemeProvider theme={theme}>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          flexShring: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#fce197',
            color: 'white',
          },
          '& .MuiListItem-root': {
            paddingTop: 2,
            paddingBottom: 2,
          },
        }}
      >
         <Link to="/" style={{ textDecoration: 'none' }}>
          <Box
            component="img"
            src="/Transparent Logo.svg"
            
            alt="Project Logo"
            sx={{
              width: '100%',
              height: 'auto',
              padding: 2,
              boxSizing: 'border-box',
            }}
          />
        </Link>
        <List
          sx={{
            paddingY: 1,
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
                marginTop: '20px',
                marginLeft: '20%',
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
    </ThemeProvider>
  )
};
