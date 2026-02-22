import { Box, Typography, Avatar } from '@mui/joy';
import type { User } from '../types/user';

interface UserOptionProps {
  user: User;
}

export function UserOption({ user }: UserOptionProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <Avatar
        src={user.avatar}
        alt={user.name}
        size="sm"
        sx={{ bgcolor: 'neutral.outlinedColor' }}
      />
      <Box>
        <Typography level="body-sm" fontWeight="md">
          {user.name}
        </Typography>
        <Typography level="body-xs" textColor="text.tertiary">
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
}
