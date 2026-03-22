import { Card, CardContent, Typography, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Ad } from '../model/types';

export const AdCard = ({ ad }: { ad: Ad }) => {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/ads/${ad.id}`)}>
      <CardContent>
        <Typography>{ad.title}</Typography>
        <Typography>{ad.price}</Typography>
        <Typography>{ad.category}</Typography>

        {ad.needsRevision && (
          <Chip label="Требует доработки" color="warning" />
        )}
      </CardContent>
    </Card>
  );
};