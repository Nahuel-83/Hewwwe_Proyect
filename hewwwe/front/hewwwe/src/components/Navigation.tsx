import { 
  Drawer, 
  List, 
  ListItemButton,
  ListItemIcon, 
  ListItemText,
  Typography,
  Box
} from '@mui/material';
import { 
  Store as StoreIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  ShoppingCart as CartIcon,
  Sync as ExchangeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

export default function Navigation() {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Productos', icon: <StoreIcon />, path: '/products' },
    { text: 'Categorías', icon: <CategoryIcon />, path: '/categories' },
    { text: 'Usuarios', icon: <PeopleIcon />, path: '/users' },
    { text: 'Carrito', icon: <CartIcon />, path: '/cart' },
    { text: 'Intercambios', icon: <ExchangeIcon />, path: '/exchanges' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Hewwwe</Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItemButton 
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
