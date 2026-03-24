import { Card, CardContent, Typography, Grid, Skeleton, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Ad } from '../model/types';

export const AdCard = ({ ad }: { ad: Ad }) => {
  const navigate = useNavigate();

  const CATEGORY_LABELS: Record<string, string> = {
    auto: 'Авто',
    real_estate: 'Недвижимость',
    electronics: 'Электроника',
  };

  return (
    <Grid size={12 / 5} onClick={() => navigate(`/ads/${ad.id}`)} sx={{ flexGrow: 1, cursor: 'pointer' }}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 0 }}>
        <Skeleton variant="rectangular" width='100%' height='150px' animation="wave" sx={{ minHeight: '150px' }} />
        <CardContent sx={{ p: '22px 16px 16px', '&:last-child': { pb: '16px', }, position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1 }}>
          <Typography variant='subtitle2' sx={{ position: 'absolute', px: '12px', top: 0, transform: 'translateY(-50%)', border: '1px solid #D9D9D9', bgcolor: 'background.paper', borderRadius: '6px' }}>{CATEGORY_LABELS[ad.category] || ad.category}</Typography>
          <Typography variant='subtitle1'>{ad.title}</Typography>
          <Typography variant='body1' sx={{ color: 'text.secondary', mt: '4px', mb: 'auto' }}>{ad.price} ₽</Typography>
          {ad.needsRevision && (
            <Alert severity="info" color="warning" sx={{ alignItems: 'center', p: '2px 8px', gap: '8px', mt: '4px', borderRadius: '8px', width: 'fit-content', }} slotProps={{ icon: { sx: { mr: '0' } } }}>
              <Typography variant='subtitle2' sx={{ m: 0, }}>Требует доработок</Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};