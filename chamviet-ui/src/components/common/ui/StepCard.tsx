import { Box, Card, Stack, Typography } from '@mui/material';
import type { StepProps } from '../../../types/ui';

export function StepCard({ number, title, description, image, accentColor = 'primary.main' }: StepProps) {
  return (
    <Stack spacing={2} alignItems="center">
      <Box
        sx={{
          width: 80,
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px',
          border: '4px solid',
          borderColor: accentColor,
          backgroundColor: 'background.paper',
          fontWeight: 'bold',
          fontSize: '24px',
          color: accentColor,
          boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
          zIndex: 1,
          position: 'relative',
        }}
      >
        {number}
      </Box>

      {image && (
        <Card
          sx={{
            width: '100%',
            aspectRatio: '1',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: 'grey.100',
            overflow: 'hidden',
            boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.1)',
          }}
        >
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Card>
      )}

      <Stack spacing={1} alignItems="center">
        <Typography
          sx={{
            color: 'grey.900',
            fontWeight: 'bold',
            fontSize: '20px',
            textAlign: 'center',
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: 'grey.700',
            fontSize: '14px',
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          {description}
        </Typography>
      </Stack>
    </Stack>
  );
}
