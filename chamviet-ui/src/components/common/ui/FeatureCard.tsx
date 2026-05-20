import { Card, Box, Typography } from '@mui/material';
import type { FeatureProps } from '../../../types/ui';

export interface FeatureCardProps extends FeatureProps {
  iconBackgroundColor?: string;
}

export function FeatureCard({
  title,
  description,
  icon,
  iconBackgroundColor = 'rgba(212, 175, 55, 0.18)',
}: FeatureCardProps) {
  return (
    <Card
      sx={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: 'var(--shadow-sm)',
        transition: `transform var(--duration-shorter) var(--ease-out),
                     box-shadow var(--duration-shorter) var(--ease-out)`,
        height: '100%',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 'var(--shadow-lg)',
        },
      }}
    >
      {icon && (
        <Box
          sx={{
            backgroundColor: iconBackgroundColor,
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            marginBottom: 2,
            fontSize: '32px',
          }}
        >
          {icon}
        </Box>
      )}
      <Typography
        sx={{
          color: 'var(--text-h)',
          fontWeight: 'bold',
          fontSize: '20px',
          marginBottom: 1,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          color: 'var(--text-sub)',
          fontSize: '14px',
          lineHeight: 1.5,
        }}
      >
        {description}
      </Typography>
    </Card>
  );
}

