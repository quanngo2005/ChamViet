import { Button } from '@mui/material';

export interface FilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function FilterChip({ label, selected, onClick }: FilterChipProps) {
  return (
    <Button
      onClick={onClick}
      disableElevation
      sx={{
        borderRadius: '8px',
        px: 2.5,
        py: 1,
        minHeight: 36,
        textTransform: 'none',
        fontSize: 14,
        fontWeight: 500,
        backgroundColor: selected ? 'primary.main' : 'rgba(168, 50, 50, 0.05)',
        color: selected ? 'common.white' : 'grey.800',
        '&:hover': {
          backgroundColor: selected ? 'primary.dark' : 'rgba(168, 50, 50, 0.08)',
        },
      }}
    >
      {label}
    </Button>
  );
}
