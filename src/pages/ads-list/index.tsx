import { useQuery } from '@tanstack/react-query';
import { getAds } from '../../entities/ad/api/api';
import {
    Typography,
    TextField,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Button,
    Pagination,
    Box,
    CircularProgress,
    Divider,
    List,
    ListSubheader,
    Collapse,
    ListItemButton,
    ListItemText,
    ListItem,
    Switch,
    styled,
    type SwitchProps,
    Grid
} from '@mui/material';
import {
    ExpandLess,
    ExpandMore,
} from '@mui/icons-material';
import { AdCard } from '../../entities/ad/ui/ad-card';
import { useFilters } from '../../features/filters/models/useFilters';
import { useState } from 'react';

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#65C466',
                opacity: 1,
                border: 0,
                ...theme.applyStyles('dark', {
                    backgroundColor: '#2ECA45',
                }),
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color: theme.palette.grey[100],
            ...theme.applyStyles('dark', {
                color: theme.palette.grey[600],
            }),
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7,
            ...theme.applyStyles('dark', {
                opacity: 0.3,
            }),
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: '#E9E9EA',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
        ...theme.applyStyles('dark', {
            backgroundColor: '#39393D',
        }),
    },
}));

export default function AdsListPage() {
    const [open, setOpen] = useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

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

    const { data, isLoading, isError, refetch } = useQuery({
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
        <Box component="section" sx={{ maxWidth: 'calc(100% - 64px)', m: '0 auto', py: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Box sx={{}}>
                <Typography variant='h1'>Мои объявления</Typography>
                <Typography variant='h2'>{data?.total ? data.total + ' объявления' : 'Обновляем..'} </Typography>
            </Box>
            <Box sx={{ bgcolor: 'background.paper', display: 'flex', gap: '24px', borderRadius: '8px', p: '12px' }}>
                <TextField
                    placeholder="Найти объявления...."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ width: '100%' }}
                />
                <TextField
                    select
                    value={`${sortColumn}_${sortDirection}`}
                    onChange={(e) => {
                        const value = e.target.value as string;
                        const [column, direction] = value.split('_');
                        setSort(
                            column as any,
                            direction as any
                        );
                    }}
                    sx={{ minWidth: '250px', fontSize: '14px' }}
                >
                    <MenuItem value="createdAt_desc">По новизне (сначала новые)</MenuItem>
                    <MenuItem value="createdAt_asc">По новизне (сначала старые)</MenuItem>
                    <MenuItem value="title_asc">По названию (А → Я)</MenuItem>
                    <MenuItem value="title_desc">По названию (Я → А)</MenuItem>
                </TextField>
            </Box>
            <Box sx={{ display: 'flex', gap: '24px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: 256, minWidth: 256 }}>
                    <List
                        sx={{ display: 'flex', flexDirection: 'column', width: '100%', bgcolor: 'background.paper', borderRadius: '8px', p: '16px', }}
                        component="nav"
                        subheader={
                            <ListSubheader component="p" sx={{ p: 0, m: 0, lineHeight: '100%', color: 'text.primary', fontSize: '16px' }}>
                                Фильтры
                            </ListSubheader>
                        }
                    >
                        <ListItemButton onClick={handleClick} sx={{ my: '5px', px: 0, py: '5px' }}>
                            <ListItemText primary="Категория" sx={{
                                '& .MuiTypography-root': {
                                    fontWeight: 400,
                                    fontSize: '14px'
                                }
                            }} />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        {categoryOptions.map((cat) => (
                            <Collapse in={open} timeout="auto" unmountOnExit>
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
                                    sx={{
                                        m: 0,
                                        my: '8px',
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '14px',
                                            fontWeight: 400,
                                            padding: 0,
                                            ml: '8px'
                                        },
                                        '& .MuiCheckbox-root': {
                                            padding: 0,
                                        },
                                    }}
                                />
                            </Collapse>
                        ))}
                        <Divider variant="middle" flexItem />
                        <ListItem sx={{ p: 0, mt: '10px' }}>
                            <FormControlLabel
                                labelPlacement="start"
                                label="Только требующие доработок"
                                control={
                                    <IOSSwitch checked={needsRevision}
                                        onChange={(e) => setNeedsRevision(e.target.checked)} />
                                }
                                sx={{ p: 0, m: 0, }}
                            />
                        </ListItem>
                    </List>
                    <Button onClick={reset} sx={{ bgcolor: 'background.paper', fontSize: '14px', fontWeight: 400, textTransform: 'none', color: 'text.secondary' }}>Сбросить фильтры</Button>
                </Box>
                <Box sx={{ width: '100%' }}>
                    {isLoading && <CircularProgress sx={{ m: '0 auto', display: 'flex', mt: '100px' }} />}
                    {isError && <Box sx={{ m: '0 auto', display: 'flex', mt: '100px', alignItems: 'center', flexDirection: 'column', gap: '16px' }}>
                        <Typography >Упс, что-то пошло не так. Поробуйте обновить страницу сейчас или чуть позже</Typography>
                        <Button
                            variant="outlined"
                            onClick={() => refetch()}
                            disabled={isLoading}
                            sx={{ fontSize: '14px', fontWeight: 400, textTransform: 'none' }}
                        >
                            Обновить страницу
                        </Button>
                    </Box>}
                    <Grid container spacing={2}>
                        {!isLoading && !isError && data?.items.map((ad) => (
                            <AdCard key={ad.id} ad={ad} />
                        ))}
                    </Grid>
                    {!isLoading && !isError &&
                        <Pagination
                            count={Math.ceil((data?.total || 0) / filters.pageSize)}
                            page={filters.page}
                            onChange={(_, page) => filters.setPage(page)}
                            variant="outlined" shape="rounded"
                            sx={{ mt: '10px' }}
                        />
                    }
                </Box>
            </Box>
        </Box>
    );
}