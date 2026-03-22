import { Stack, Typography, Box } from '@mui/material';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: 'left' | 'center' | 'right';
  titleColor?: string;
}

export function SectionHeader({ 
  title, 
  subtitle, 
  badge, 
  align = 'center',
  titleColor = 'grey.900'
}: SectionHeaderProps) {
  return (
    <Stack spacing={1.5} sx={{ textAlign: align, maxWidth: 760, mx: align === 'center' ? 'auto' : 0 }}>
      {badge && (
        <Stack direction="row" justifyContent={align === 'center' ? 'center' : 'flex-start'}>
          <Box
            sx={{
              display: 'inline-flex',
              px: 1.5,
              py: 0.75,
              borderRadius: '999px',
              backgroundColor: 'rgba(168, 50, 50, 0.08)',
              color: 'primary.main',
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
            }}
          >
            {badge}
          </Box>
        </Stack>
      )}
      <Typography
        variant="h3"
        sx={{
          color: titleColor,
          fontWeight: 900,
          fontSize: { xs: 26, md: 36 },
          lineHeight: { xs: '32px', md: '42px' },
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography sx={{ color: 'grey.600', fontSize: { xs: 15, md: 16 }, lineHeight: 1.7 }}>
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
}
