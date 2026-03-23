import { useQuery } from '@tanstack/react-query';
import { getAds } from '../../entities/ad/api/api';
import {
    Typography,
    TextField,
    Checkbox,
    FormControlLabel,
    Select,
    MenuItem,
    Button,
    Pagination,
    Box,
    CircularProgress
} from '@mui/material';
import { AdCard } from '../../entities/ad/ui/ad-card';
import { useFilters } from '../../features/filters/models/useFilters';

export default function AdsListPage() {

    const filters = useFilters();

    const {
        search,
        setSearch,
        needsRevision,
        setNeedsRevision,
        sortColumn,
        sortDirection,
        setSort,
        reset,
        categories,
        setCategories,
    } = useFilters();

    const categoryOptions = [
        { label: 'Авто', value: 'auto' },
        { label: 'Электроника', value: 'electronics' },
        { label: 'Недвижимость', value: 'real_estate' },
    ];

    const { data, isLoading, isError } = useQuery({
        queryKey: [
            'items',
            filters.search,
            filters.categories,
            filters.needsRevision,
            filters.sortColumn,
            filters.sortDirection,
            filters.page,
            filters.pageSize,
        ],
        queryFn: () => getAds({
            q: filters.search || undefined,
            limit: filters.pageSize,
            skip: (filters.page - 1) * filters.pageSize,
            needsRevision: filters.needsRevision || undefined,
            categories: filters.categories.length
                ? filters.categories.join(',')
                : undefined,
            sortColumn: filters.sortColumn,
            sortDirection: filters.sortDirection,
        }),
    });

    return (
        <div>
            <Typography>Мои объявления ({data?.total})</Typography>
            <TextField
                label="Найти объявления...."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={needsRevision}
                        onChange={(e) => setNeedsRevision(e.target.checked)}
                    />
                }
                label="Только требующие доработок"
            />
            <Select
                value={`${sortColumn}_${sortDirection}`}
                onChange={(e) => {
                    const value = e.target.value as string;
                    const [column, direction] = value.split('_');
                    setSort(
                        column as any,
                        direction as any
                    );
                }}
            >
                <MenuItem value="createdAt_desc">По новизне (сначала новые)</MenuItem>
                <MenuItem value="createdAt_asc">По новизне (сначала старые)</MenuItem>
                <MenuItem value="title_asc">По названию (А → Я)</MenuItem>
                <MenuItem value="title_desc">По названию (Я → А)</MenuItem>
            </Select>
            <Box sx={{ my: 2 }}>
                {categoryOptions.map((cat) => (
                    <FormControlLabel
                        key={cat.value}
                        control={
                            <Checkbox
                                checked={categories.includes(cat.value)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setCategories([...categories, cat.value]);
                                    } else {
                                        setCategories(categories.filter((c) => c !== cat.value));
                                    }
                                }}
                            />
                        }
                        label={cat.label}
                    />
                ))}
            </Box>
            <Button onClick={reset}>Сбросить фильтры</Button>
            <div style={{ position: 'relative' }}>
                {isLoading && <CircularProgress />}

                {isError && <div>Ошибка загрузки</div>}

                {!isLoading && !isError && data?.items.map((ad) => (
                    <AdCard key={ad.id} ad={ad} />
                ))}
            </div>
            <Pagination
                count={Math.ceil((data?.total || 0) / filters.pageSize)}
                page={filters.page}
                onChange={(_, page) => filters.setPage(page)}
            />
        </div>
    );
}