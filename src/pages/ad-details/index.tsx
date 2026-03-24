import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdById } from '../../entities/ad/api/api';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import {
    Typography,
    Button,
    Box,
    CircularProgress,
    Divider,
    Skeleton,
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
        <Box component="section" sx={{ maxWidth: 'calc(100% - 64px)', m: '0 auto', py: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <Box>
                <Button onClick={() => navigate('/ads')}>← Назад</Button>
                {data && (
                    <Box sx={{}}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h1" sx={{ fontSize: '32px' }}>{data.title}</Typography>

                            <Typography variant="body1" sx={{ fontSize: '32px', fontWeight: 500 }}>
                                {data.price} ₽
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '12px' }}>
                            <Button
                                variant="contained"
                                onClick={() => navigate(`/ads/${id}/edit`)}
                            >
                                Редактировать
                            </Button>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
                                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                                    Опубликовано:{' '}
                                    {data.createdAt
                                        ? format(new Date(data.createdAt), 'd MMMM HH:mm', { locale: ru })
                                        : 'Не указано'}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                                    Отредактировано:{' '}
                                    {data.updatedAt
                                        ? format(new Date(data.updatedAt), 'd MMMM HH:mm', { locale: ru })
                                        : 'Не указано'}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>
            <Divider flexItem />

            {isLoading && <CircularProgress />}
            {isError && <Typography color="error">Ошибка загрузки</Typography>}

            {data && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <Box sx={{ display: 'flex', gap: '32px' }}>
                        <Skeleton variant="rectangular" width='480px' height='360px' animation="wave" />
                        <AdParams ad={data} />
                    </Box>
                    <Box sx={{ maxWidth: '480px' }}>
                        <Typography variant='body1' sx={{ fontSize: '24px' }}>Описание</Typography>
                        <Typography variant='subtitle1' sx={{ mt: '16px' }}>
                            {data.description || 'Описание отсутствует'}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
}