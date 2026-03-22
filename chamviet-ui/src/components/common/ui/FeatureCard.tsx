import { Card, Box, Typography } from '@mui/material';
import type { FeatureProps } from '../../../types/ui';

export interface FeatureCardProps extends FeatureProps {
  iconBackgroundColor?: string;
}

export function FeatureCard({ title, description, icon, iconBackgroundColor = 'rgba(217, 164, 65, 0.2)' }: FeatureCardProps) {
  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'grey.100',
        borderRadius: '8px',
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        height: '100%',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 4px 12px 0px rgba(0,0,0,0.1)',
        },
      }}
    >
      {icon && (
        <Box
          sx={{
            backgroundColor: iconBackgroundColor,
            borderRadius: '12px',
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
          color: 'grey.900',
          fontWeight: 'bold',
          fontSize: '20px',
          marginBottom: 1,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          color: 'grey.700',
          fontSize: '14px',
          lineHeight: 1.4,
        }}
      >
        {description}
      </Typography>
    </Card>
  );
}
