import { Button, IconButton, Stack } from '@mui/material';
import { PageSection, ContentContainer } from '../layout';

export interface PaginationProps {
  page: number;
  totalPages?: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages = 3, onChange }: PaginationProps) {
  const PageButton = ({ value }: { value: number }) => {
    const selected = value === page;
    return (
      <Button
        onClick={() => onChange(value)}
        sx={{
          minWidth: 40,
          height: 40,
          borderRadius: '8px',
          textTransform: 'none',
          fontSize: 16,
          fontWeight: selected ? 700 : 400,
          backgroundColor: selected ? 'primary.main' : 'transparent',
          color: selected ? 'common.white' : 'grey.600',
          border: selected ? '1px solid transparent' : '1px solid rgba(168, 50, 50, 0.20)',
          '&:hover': {
            backgroundColor: selected ? 'primary.dark' : 'rgba(168, 50, 50, 0.04)',
          },
        }}
      >
        {value}
      </Button>
    );
  };

  const ArrowButton = ({ direction }: { direction: 'prev' | 'next' }) => (
    <IconButton
      aria-label={direction === 'prev' ? 'Trang trước' : 'Trang sau'}
      onClick={() => onChange(Math.max(1, Math.min(totalPages, page + (direction === 'prev' ? -1 : 1))))}
      sx={{
        width: 40,
        height: 40,
        borderRadius: '8px',
        border: '1px solid rgba(168, 50, 50, 0.20)',
        color: 'grey.600',
      }}
    >
      {direction === 'prev' ? '‹' : '›'}
    </IconButton>
  );

  return (
    <PageSection>
      <ContentContainer>
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <ArrowButton direction="prev" />
          {[...Array(totalPages)].map((_, i) => (
            <PageButton key={i + 1} value={i + 1} />
          ))}
          <ArrowButton direction="next" />
        </Stack>
      </ContentContainer>
    </PageSection>
  );
}
