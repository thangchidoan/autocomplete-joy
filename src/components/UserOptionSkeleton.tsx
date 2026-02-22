import { Box, Skeleton } from '@mui/joy';

const SKELETON_COUNT = 3;

export function UserOptionSkeleton() {
  return (
    <>
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 1.5,
            py: 0.75,
          }}
        >
          <Skeleton variant="circular" width={32} height={32} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" sx={{ fontSize: '0.875rem' }} />
            <Skeleton variant="text" width="80%" sx={{ fontSize: '0.75rem' }} />
          </Box>
        </Box>
      ))}
    </>
  );
}
