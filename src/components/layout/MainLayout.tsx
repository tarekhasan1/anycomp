// src/components/layout/MainLayout.tsx
'use client';

import { ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  Badge,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  BusinessCenter as BusinessIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Create as CreateIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  HelpOutline as HelpIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 280;

interface MainLayoutProps {
  children: ReactNode;
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  section: 'main' | 'bottom';
}

interface DrawerContentProps {
  menuItems: MenuItem[];
  isActive: (path: string) => boolean;
  router: ReturnType<typeof useRouter>;
  onItemClick?: () => void;
}

function DrawerContent({ menuItems, isActive, router, onItemClick }: DrawerContentProps) {
  return (
    <>
      {/* Profile Section */}
      <Box sx={{ p: 3, borderBottom: '1px solid #E2E8F0' }}>
        <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, mb: 2, display: 'block' }}>
          Profile
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#E0E7FF',
              color: '#3730A3',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            GL
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0F172A' }}>
              Gwen Lam
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
              ST Comp Holdings Sdn Bhd
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Menu Items */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Main Menu */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: '#94A3B8',
              fontWeight: 600,
              px: 3,
              pt: 3,
              pb: 1,
              display: 'block',
            }}
          >
            Dashboard
          </Typography>
          <List sx={{ px: 2 }}>
            {menuItems
              .filter((item) => item.section === 'main')
              .map((item) => (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => {
                      router.push(item.path);
                      onItemClick?.();
                    }}
                    sx={{
                      borderRadius: '8px',
                      bgcolor: isActive(item.path) ? '#1E40AF' : 'transparent',
                      color: isActive(item.path) ? 'white' : '#64748B',
                      '&:hover': {
                        bgcolor: isActive(item.path) ? '#1E3A8A' : '#F8FAFC',
                      },
                      py: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive(item.path) ? 'white' : '#64748B',
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '14px',
                        fontWeight: isActive(item.path) ? 600 : 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Box>

        {/* Bottom Menu */}
        <Box sx={{ borderTop: '1px solid #E2E8F0' }}>
          <List sx={{ px: 2, py: 2 }}>
            {menuItems
              .filter((item) => item.section === 'bottom')
              .map((item) => (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => {
                      router.push(item.path);
                      onItemClick?.();
                    }}
                    sx={{
                      borderRadius: '8px',
                      color: '#64748B',
                      '&:hover': {
                        bgcolor: '#F8FAFC',
                      },
                      py: 1.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: '#64748B',
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Box>
      </Box>
    </>
  );
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', section: 'main' },
    { text: 'Specialists', icon: <BusinessIcon />, path: '/specialists', section: 'main' },
    { text: 'Clients', icon: <PeopleIcon />, path: '/clients', section: 'main' },
    { text: 'Service Orders', icon: <ReceiptIcon />, path: '/orders', section: 'main' },
    { text: 'eSignature', icon: <CreateIcon />, path: '/esignature', section: 'main' },
    { text: 'Messages', icon: <EmailIcon />, path: '/messages', section: 'main' },
    { text: 'Invoices & Receipts', icon: <DescriptionIcon />, path: '/invoices', section: 'main' },
    { text: 'Help', icon: <HelpIcon />, path: '/help', section: 'bottom' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings', section: 'bottom' },
  ];

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileMenuClick = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {/* Desktop Drawer - Fixed position on desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid #E2E8F0',
            bgcolor: 'white',
            position: 'fixed',
            left: 0,
            top: 0,
            height: '100vh',
            overflow: 'auto',
            zIndex: 1200,
          },
        }}
      >
        <DrawerContent menuItems={menuItems} isActive={isActive} router={router} />
      </Drawer>

      {/* Mobile Sidebar - Temporary drawer for mobile devices */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid #E2E8F0',
            bgcolor: 'white',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #E2E8F0' }}>
          <IconButton onClick={handleDrawerToggle} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <DrawerContent menuItems={menuItems} isActive={isActive} router={router} onItemClick={handleMobileMenuClick} />
      </Drawer>

      {/* Main Content Area - Shifted right on desktop due to fixed sidebar */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          marginLeft: { xs: 0, md: `${DRAWER_WIDTH}px` },
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          boxSizing: 'border-box',
        }}
      >
        {/* Top Bar */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            bgcolor: 'white',
            borderBottom: '1px solid #E2E8F0',
            px: { xs: 2, sm: 3, md: 4 },
            py: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 1, md: 2 },
            zIndex: 100,
            width: '100%',
          }}
        >
          {/* Mobile Menu Button - Only visible on mobile */}
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              display: { xs: 'flex', md: 'none' },
              color: '#64748B',
            }}
            size="small"
          >
            <MenuIcon />
          </IconButton>

          {/* Spacer */}
          <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' } }} />

          {/* Right Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            <IconButton
              sx={{
                color: '#64748B',
                display: { xs: 'none', sm: 'flex' },
                p: { xs: 0.5, md: 1 },
              }}
            >
              <MailIcon fontSize="small" />
            </IconButton>
            <IconButton
              sx={{
                color: '#64748B',
                p: { xs: 0.5, md: 1 },
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
            <Avatar
              sx={{
                width: { xs: 32, md: 36 },
                height: { xs: 32, md: 36 },
                bgcolor: '#E0E7FF',
                color: '#3730A3',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              GL
            </Avatar>
          </Box>
        </Box>

        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            bgcolor: '#F8FAFC',
            width: '100%',
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}