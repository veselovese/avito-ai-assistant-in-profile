import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdById } from '../../entities/ad/api/api';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

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

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['item', id],
        queryFn: () => getAdById(id!),
        enabled: !!id,
    });

    return (
        <Box component="section" sx={{ maxWidth: 'calc(100% - 64px)', m: '0 auto', py: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <Box>
                <Button startIcon={<ArrowBackIosIcon />} onClick={() => navigate('/ads')} sx={{
                    textTransform: 'none', mb: '12px', p: '8px 12px', lineHeight: '1.25', maxHeight: '38px', fontSize: '16px', fontWeight: 400, borderRadius: '8px', '& .MuiButton-startIcon > *:nth-of-type(1)': {
                        fontSize: '14px',
                    }
                }}>Назад</Button>
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
                                endIcon={<EditOutlinedIcon />}
                                variant="contained"
                                onClick={() => navigate(`/ads/${id}/edit`)}
                                sx={{
                                    p: '8px 12px', lineHeight: '1.25', maxHeight: '38px', fontSize: '16px', fontWeight: 400, textTransform: 'none', borderRadius: '8px', boxShadow: 'none',
                                    '&:hover': {
                                        boxShadow: 'none',
                                    }
                                }}
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

            {isLoading && <CircularProgress sx={{ m: '0 auto', display: 'flex', mt: '100px' }} />}
            {
                isError && <Box sx={{ m: '0 auto', display: 'flex', mt: '100px', alignItems: 'center', flexDirection: 'column', gap: '16px' }}>
                    <Typography >Упс, что-то пошло не так. Поробуйте обновить страницу сейчас или чуть позже</Typography>
                    <Button
                        variant="outlined"
                        onClick={() => refetch()}
                        disabled={isLoading}
                        sx={{ fontSize: '14px', fontWeight: 400, textTransform: 'none', borderRadius: '8px' }}
                    >
                        Обновить страницу
                    </Button>
                </Box>
            }
            {
                data && (
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
                )
            }
        </Box >
    );
}