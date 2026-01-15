// src/app/not-found.tsx
'use client';

import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 700, color: '#222222', mb: 2 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ color: '#666', mb: 4 }}>
        Page not found
      </Typography>
      <Button
        variant="contained"
        onClick={() => router.push('/specialists')}
        sx={{
          bgcolor: '#222222',
          '&:hover': { bgcolor: '#444444' },
          textTransform: 'none',
          px: 4,
        }}
      >
        Go to Home
      </Button>
    </Box>
  );
}