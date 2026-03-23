import { Card, CardContent, Typography, Chip, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Ad } from '../model/types';

export const AdCard = ({ ad }: { ad: Ad }) => {
  const navigate = useNavigate();

  return (
    <Grid size={2.4} onClick={() => navigate(`/ads/${ad.id}`)} sx={{ height: '100%'}}>
      <Card>
        <CardContent>
          <Typography>{ad.title}</Typography>
          <Typography>{ad.price}</Typography>
          <Typography>{ad.category}</Typography>

          {ad.needsRevision && (
            <Chip label="Требует доработки" color="warning" />
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};