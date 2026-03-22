import { Box, Typography, Stack } from '@mui/material';
import { ContentContainer } from '../../common/layout';
import { FilterChip } from '../../common/ui';

export interface ProductsFiltersSectionProps {
  ageOptions: readonly string[];
  topicOptions: readonly string[];
  activeAge: string;
  activeTopic: string;
  onAgeChange: (age: any) => void;
  onTopicChange: (topic: any) => void;
}

export function ProductsFiltersSection({
  ageOptions,
  topicOptions,
  activeAge,
  activeTopic,
  onAgeChange,
  onTopicChange,
}: ProductsFiltersSectionProps) {
  return (
    <Box sx={{ py: { xs: 4, md: 5 }, backgroundColor: 'background.default' }}>
      <ContentContainer>
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            sx={{ alignItems: { xs: 'flex-start', md: 'center' }, flexWrap: 'wrap' }}
          >
            <Typography sx={{ color: 'grey.600', fontWeight: 600, fontSize: 14 }}>
              Độ tuổi:
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', rowGap: 1.5 }}>
              {ageOptions.map((item) => (
                <FilterChip
                  key={item}
                  label={item}
                  selected={item === activeAge}
                  onClick={() => onAgeChange(item)}
                />
              ))}
            </Stack>
          </Stack>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            sx={{ alignItems: { xs: 'flex-start', md: 'center' }, flexWrap: 'wrap' }}
          >
            <Typography sx={{ color: 'grey.600', fontWeight: 600, fontSize: 14 }}>
              Chủ đề:
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', rowGap: 1.5 }}>
              {topicOptions.map((item) => (
                <FilterChip
                  key={item}
                  label={item}
                  selected={item === activeTopic}
                  onClick={() => onTopicChange(item)}
                />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </ContentContainer>
    </Box>
  );
}
