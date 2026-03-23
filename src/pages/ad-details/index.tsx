import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdById } from '../../entities/ad/api/api';

import {
    Typography,
    Button,
    Box,
    Paper,
    Chip,
    CircularProgress,
} from '@mui/material';

import { AdParams } from '../../entities/ad/ui/ad-params';

export default function AdDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['item', id],
        queryFn: () => getAdById(id!),
        enabled: !!id,
    });

    return (
        <Box p={3}>
            <Button onClick={() => navigate('/ads')}>← Назад</Button>

            {isLoading && <CircularProgress />}
            {isError && <Typography color="error">Ошибка загрузки</Typography>}

            {data && (
                <Paper sx={{ p: 3, mt: 2 }}>
                    <Typography variant="h4">{data.title}</Typography>

                    <Typography variant="h5" sx={{ mt: 1 }}>
                        {data.price} ₽
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                        Категория: {data.category}
                    </Typography>

                    {data.needsRevision && (
                        <Chip
                            label="Требует доработки"
                            color="warning"
                            sx={{ mt: 2 }}
                        />
                    )}

                    <Typography sx={{ mt: 3 }}>
                        {data.description || 'Описание отсутствует'}
                    </Typography>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6">Характеристики</Typography>
                        <AdParams ad={data} />
                    </Box>

                    <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            onClick={() => navigate(`/ads/${id}/edit`)}
                        >
                            Редактировать
                        </Button>
                    </Box>
                </Paper>
            )}
        </Box>
    );
}