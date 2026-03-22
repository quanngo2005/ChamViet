import { Box, Button, Typography } from '@mui/material';

export interface QuantitySelectorProps {
  value: number;
  onChange: (next: number) => void;
}

export function QuantitySelector({ value, onChange }: QuantitySelectorProps) {
  return (
    <Box
      sx={{
        borderRadius: '8px',
        border: '1px solid rgba(168, 50, 50, 0.20)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        width: 107,
        px: 1,
      }}
    >
      <Button
        onClick={() => onChange(Math.max(1, value - 1))}
        sx={{
          minWidth: 28,
          height: 28,
          p: 0,
          borderRadius: '4px',
          color: 'primary.main',
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        -
      </Button>
      <Typography sx={{ fontWeight: 700, fontSize: 18, color: 'grey.900' }}>{value}</Typography>
      <Button
        onClick={() => onChange(value + 1)}
        sx={{
          minWidth: 28,
          height: 28,
          p: 0,
          borderRadius: '4px',
          color: 'primary.main',
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        +
      </Button>
    </Box>
  );
}
