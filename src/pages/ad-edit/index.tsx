import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdById } from '../../entities/ad/api/api';
import { useUpdateAd } from '../../entities/ad/api/useUpdateAd';
import { FormParams } from '../../features/ad-edit/ui/form-params';
import { CircularProgress, Grid, Box, Typography, Divider } from '@mui/material';
import { useGenerateDescription, useSuggestPrice } from '../../entities/ad/api/useUpdateAd';

import {
    TextField,
    Button,
    MenuItem,
    Popover,
    Alert,
} from '@mui/material';

import { useEffect, useState } from 'react';

const parsePriceFromAI = (text: string): number => {
    const match = text.match(/(\d[\d\s]*)/);
    if (match) {
        return parseInt(match[0].replace(/\s/g, ''), 10);
    }
    return 0;
};

export default function AdEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const genDesc = useGenerateDescription();
    const genPrice = useSuggestPrice();

    const [form, setForm] = useState<any>(null);

    const [priceAnchorEl, setPriceAnchorEl] = useState<HTMLElement | null>(null);
    const [priceResult, setPriceResult] = useState<string | null>(null);
    const [priceError, setPriceError] = useState<string | null>(null);

    const [descAnchorEl, setDescAnchorEl] = useState<HTMLElement | null>(null);
    const [descResult, setDescResult] = useState<string | null>(null);
    const [descError, setDescError] = useState<string | null>(null);

    const storageKey = `ad-draft-${id}`;

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['item', id],
        queryFn: () => getAdById(id!),
        enabled: !!id,
    });

    const updateMutation = useUpdateAd();

    useEffect(() => {
        if (!data) return;

        const saved = localStorage.getItem(storageKey);

        if (saved) {
            setForm(JSON.parse(saved));
        } else {
            setForm(data);
        }
    }, [data, storageKey]);

    useEffect(() => {
        if (!form) return;

        localStorage.setItem(storageKey, JSON.stringify(form));
    }, [form, storageKey]);

    if (isLoading) return <CircularProgress sx={{ m: '0 auto', display: 'flex', mt: '100px' }} />;

    if (isError) return <Box sx={{ m: '0 auto', display: 'flex', mt: '100px', alignItems: 'center', flexDirection: 'column', gap: '16px' }}>
        <Typography >Упс, что-то пошло не так. Поробуйте обновить страницу сейчас или чуть позже</Typography>
        <Button
            variant="outlined"
            onClick={() => refetch()}
            disabled={isLoading}
            sx={{ fontSize: '14px', fontWeight: 400, textTransform: 'none' }}
        >
            Обновить страницу
        </Button>
    </Box>;

    if (!form) return <CircularProgress />;

    const descButtonText = form.description ? 'Улучшить описание' : 'Придумать описание';

    const handleAskPrice = (e: React.MouseEvent<HTMLElement>) => {
        setPriceAnchorEl(e.currentTarget);
        setPriceError(null);
        setPriceResult(null);

        genPrice.mutate(form, {
            onSuccess: (data) => {
                setPriceResult(String(data));
            },
            onError: () => {
                setPriceError('Произошла ошибка при запросе к AI');
            }
        });
    };

    const handleAskDesc = (e: React.MouseEvent<HTMLElement>) => {
        setDescAnchorEl(e.currentTarget);
        setDescError(null);
        setDescResult(null);

        genDesc.mutate(form, {
            onSuccess: (data) => {
                setDescResult(data);
            },
            onError: () => {
                setDescError('Произошла ошибка при запросе к AI');
            }
        });
    };

    const applyPrice = () => {
        if (priceResult) {
            const numericPrice = parsePriceFromAI(priceResult);
            if (numericPrice > 0) {
                setForm({ ...form, price: numericPrice });
            }
        }
        setPriceAnchorEl(null);
    };

    const applyDesc = () => {
        if (descResult) {
            setForm({ ...form, description: descResult });
        }
        setDescAnchorEl(null);
    };

    const closePricePopup = () => setPriceAnchorEl(null);
    const closeDescPopup = () => setDescAnchorEl(null);

    const handleChange = (field: string, value: any) => {
        setForm((prev: any) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = () => {
        updateMutation.mutate(
            { id: id!, data: form },
            {
                onSuccess: () => {
                    localStorage.removeItem(storageKey);
                    navigate(`/ads/${id}`);
                },
            }
        );
    };

    return (
        <Grid component="form" sx={{ maxWidth: 'calc(100% - 64px)', m: '0 auto', py: '32px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <Typography variant="h1" sx={{ fontSize: '32px' }}>
                Редактирование объявления
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '50%' }}>
                <label htmlFor="ad-category" style={{ display: 'block' }}>
                    Категория
                </label>
                <TextField
                    id="ad-category"
                    select
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    fullWidth
                    variant="outlined"
                    required>
                    <MenuItem value="auto">Авто</MenuItem>
                    <MenuItem value="real_estate">Недвижимость</MenuItem>
                    <MenuItem value="electronics">Электроника</MenuItem>
                </TextField>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '50%' }}>
                <label htmlFor="ad-title" style={{ display: 'block' }}>
                    Название
                </label>
                <TextField
                    id='ad-title'
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    fullWidth
                    required
                />

            </Box>
            <Divider />
            <Box sx={{ display: 'flex', gap: '24px', alignItems: 'end', }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '50%', width: '100%' }}>
                    <label htmlFor="ad-price" style={{ display: 'block' }}>
                        Цена
                    </label>
                    <TextField
                        id="ad-price"
                        type="number"
                        value={form.price}
                        onChange={(e) => handleChange('price', Number(e.target.value))}
                        fullWidth
                        required
                        sx={{ width: '100%', }}
                    />
                </Box>
                <Button
                    variant='outlined'
                    color='warning'
                    onClick={handleAskPrice}
                    disabled={genPrice.isPending}
                    startIcon={genPrice.isPending ? <CircularProgress size={16} /> : null}
                    fullWidth
                    sx={{ maxWidth: 'fit-content', fontSize: '14px', fontWeight: 400, p: '5px 9.5px', lineHeight: '100%', minHeight: '32px' }}
                >
                    {genPrice.isPending ? 'Выполняется запрос' : 'Узнать рыночную цену'}
                </Button>
            </Box>
            <Divider />
            <Grid sx={{ maxWidth: '50%' }}>
                <Typography variant='body1' sx={{ mb: '8px' }}>Характеристики</Typography>
                <FormParams form={form} setForm={setForm} />
            </Grid>
            <Divider />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField
                    label="Описание"
                    value={form.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    fullWidth
                    multiline
                    sx={{ maxWidth: 'auto' }}
                />
                <Button
                    variant="outlined"
                    color='warning'
                    onClick={handleAskDesc}
                    disabled={genDesc.isPending}
                    startIcon={genDesc.isPending ? <CircularProgress size={16} /> : null}
                    sx={{ alignSelf: 'flex-start' }}
                >
                    {genDesc.isPending ? 'Генерация...' : descButtonText}
                </Button>
            </Box>
            < Box sx={{ display: 'flex', gap: '10px', mt: '16px' }
            }>
                <Button variant="contained" onClick={handleSave}>
                    Сохранить
                </Button>
                <Button onClick={() => navigate(`/ads/${id}`)}>
                    Отменить
                </Button>
            </Box >

            < Popover
                open={Boolean(priceAnchorEl)}
                anchorEl={priceAnchorEl}
                onClose={closePricePopup}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                sx={{ p: 2 }}
            >
                <Box sx={{ p: 2, maxWidth: 400 }}>
                    {genPrice.isPending ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CircularProgress size={20} />
                            <Typography>Выполняется запрос...</Typography>
                        </Box>
                    ) : priceError ? (
                        <>
                            <Alert severity="error" sx={{ mb: 2 }}>{priceError}</Alert>
                            <Button onClick={handleAskPrice} size="small">Повторить запрос</Button>
                        </>
                    ) : priceResult ? (
                        <>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                                {priceResult}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button onClick={closePricePopup} size="small">Закрыть</Button>
                                <Button
                                    onClick={applyPrice}
                                    variant="contained"
                                    size="small"
                                    disabled={parsePriceFromAI(priceResult) === 0}
                                >
                                    Применить
                                </Button>
                            </Box>
                        </>
                    ) : null}
                </Box>
            </Popover >

            <Popover
                open={Boolean(descAnchorEl)}
                anchorEl={descAnchorEl}
                onClose={closeDescPopup}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Box sx={{ p: 2, maxWidth: 500 }}>
                    {genDesc.isPending ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CircularProgress size={20} />
                            <Typography>AI думает...</Typography>
                        </Box>
                    ) : descError ? (
                        <>
                            <Alert severity="error" sx={{ mb: 2 }}>{descError}</Alert>
                            <Button onClick={handleAskDesc} size="small">Повторить запрос</Button>
                        </>
                    ) : descResult ? (
                        <>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 2, maxHeight: 300, overflowY: 'auto' }}>
                                {descResult}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button onClick={closeDescPopup} size="small">Закрыть</Button>
                                <Button onClick={applyDesc} variant="contained" size="small">
                                    Применить
                                </Button>
                            </Box>
                        </>
                    ) : null}
                </Box>
            </Popover>
        </Grid >
    );
}