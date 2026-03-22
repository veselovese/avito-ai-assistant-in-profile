import { useQuery } from '@tanstack/react-query';
import { getAds } from '../../entities/ad/api/api';
import { Typography } from '@mui/material';
import { AdCard } from '../..//entities/ad/ui/ad-card';

export default function AdsListPage() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['items'],
        queryFn: () => getAds({}),
    });

    if (isLoading) return <div>Загрузка...</div>;
    if (isError) return <div>Ошибка</div>;

    return (
        <div>
            <Typography>Мои объявления ({data?.total})</Typography>
            <div>
                {data?.items.map((ad) => (
                    <div key={ad.id}>
                        <AdCard ad={ad} />
                    </div>
                ))}
            </div>
        </div>
    );
}