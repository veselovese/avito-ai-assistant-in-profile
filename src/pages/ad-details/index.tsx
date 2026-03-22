import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdById } from '../../entities/ad/api/api';
import { Button, Typography } from '@mui/material';

export default function AdDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useQuery({
        queryKey: [id],
        queryFn: () => getAdById(id!),
    });

    if (isLoading) return <div>Загрузка...</div>;
    if (isError || !data) return <div>Нет данных</div>;

    return (
        <div>
            <Typography>{data.title}</Typography>
            <Typography>{data.price} ₽</Typography>

            <Typography>{data.description || 'Нет описания'}</Typography>

            <Button onClick={() => navigate(`/ads/${id}/edit`)}>Редактировать</Button>
        </div>
    );
}