import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdById } from '../../entities/ad/api/api';
import { useUpdateAd } from '../../entities/ad/api/useUpdateAd';
import { FormParams } from '../../features/ad-edit/ui/form-params';
import { CircularProgress, Grid, Box, Typography, Divider } from '@mui/material';
import { useGenerateDescription, useSuggestPrice } from '../../entities/ad/api/useUpdateAd';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';

import {
    TextField,
    Button,
    MenuItem,
    Popover,
    Alert,
} from '@mui/material';

import { useEffect, useState } from 'react';

const parsePriceFromAI = (text: string): number => {
    const numbers = text
        .replace(/\u00A0/g, ' ')
        .match(/\d[\d\s]*/g);

    if (!numbers || numbers.length === 0) return 0;

    const parsed = numbers.map(n =>
        parseInt(n.replace(/\s/g, ''), 10)
    ).filter(Boolean);

    if (parsed.length === 0) return 0;

    parsed.sort((a, b) => a - b);
    return parsed[Math.floor(parsed.length / 2)];
};

export default function AdEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const genDesc = useGenerateDescription();
    const genPrice = useSuggestPrice();

    const [form, setForm] = useState<any>(null);

    type AiPopoverState = {
        anchorEl: HTMLElement | null;
        status: 'idle' | 'loading' | 'success' | 'error';
        result: string | null;
        error: string | null;
    };

    const [priceAi, setPriceAi] = useState<AiPopoverState>({
        anchorEl: null,
        status: 'idle',
        result: null,
        error: null,
    });

    const [descAi, setDescAi] = useState<AiPopoverState>({
        anchorEl: null,
        status: 'idle',
        result: null,
        error: null,
    });

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

    if (isError || !form) return <Box sx={{ m: '0 auto', display: 'flex', mt: '100px', alignItems: 'center', flexDirection: 'column', gap: '16px' }}>
        <Typography >Упс, что-то пошло не так. Поробуйте обновить страницу сейчас или чуть позже</Typography>
        <Button
            variant="outlined"
            onClick={() => refetch()}
            disabled={isLoading}
            sx={{ fontSize: '14px', fontWeight: 400, textTransform: 'none', borderRadius: '8px' }}
        >
            Обновить страницу
        </Button>
    </Box>;

    const descButtonText = form.description ? 'Улучшить описание' : 'Придумать описание';

    const handleAskPrice = (e: React.MouseEvent<HTMLElement>) => {
        setPriceAi({
            anchorEl: e.currentTarget,
            status: 'loading',
            result: null,
            error: null,
        });

        genPrice.mutate(form, {
            onSuccess: (text) => {
                console.log(text)
                setPriceAi((prev) => ({
                    ...prev,
                    status: 'success',
                    result: String(text),
                }));
            },
            onError: () => {
                setPriceAi((prev) => ({
                    ...prev,
                    status: 'error',
                    error: 'Произошла ошибка при запросе к AI',
                }));
            },
        });
    };

    const handleAskDesc = (e: React.MouseEvent<HTMLElement>) => {
        setDescAi({
            anchorEl: e.currentTarget,
            status: 'loading',
            result: null,
            error: null,
        });

        genDesc.mutate(form, {
            onSuccess: (text) => {
                setDescAi((prev) => ({
                    ...prev,
                    status: 'success',
                    result: text,
                }));
            },
            onError: () => {
                setDescAi((prev) => ({
                    ...prev,
                    status: 'error',
                    error: 'Произошла ошибка при запросе к AI',
                }));
            },
        });
    };

    const closePricePopup = () => {
        setPriceAi({
            anchorEl: null,
            status: 'idle',
            result: null,
            error: null,
        });
    };

    const closeDescPopup = () => {
        setDescAi({
            anchorEl: null,
            status: 'idle',
            result: null,
            error: null,
        });
    };

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
                    startIcon={<LightbulbOutlinedIcon />}
                    variant='outlined'
                    color='warning'
                    onClick={handleAskPrice}
                    disabled={genPrice.isPending}
                    sx={{ maxWidth: 'fit-content', fontSize: '14px', fontWeight: 400, p: '5px 9.5px', lineHeight: '100%', minHeight: '32px', textTransform: 'none', borderRadius: '8px', boxShadow: 'none', }}
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
                <label htmlFor="ad-desc" style={{ display: 'block' }}>
                    Описание
                </label>
                <TextField
                    id="ad-desc"
                    value={form.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    fullWidth
                    multiline
                    sx={{
                        maxWidth: 'auto',
                        '& .MuiOutlinedInput-input': {
                            minHeight: '44px',
                            maxHeight: '84px',
                            py: '8px',
                            overflow: 'scroll'

                        },
                        '& .MuiOutlinedInput-root': {
                            minHeight: '60px',
                            maxHeight: 'none',
                        }

                    }}
                />
                <Button
                    startIcon={<LightbulbOutlinedIcon />}
                    variant="outlined"
                    color='warning'
                    onClick={handleAskDesc}
                    disabled={genDesc.isPending}
                    sx={{ alignSelf: 'flex-start', fontSize: '14px', fontWeight: 400, textTransform: 'none', borderRadius: '8px', boxShadow: 'none', p: '5px 9.5px', lineHeight: '100%', minHeight: '32px' }}
                >
                    {genDesc.isPending ? 'Выполняется запрос' : descButtonText}
                </Button>
            </Box>
            < Box sx={{ display: 'flex', gap: '10px', mt: '16px' }
            }>
                <Button variant="contained" onClick={handleSave} sx={{
                    p: '8px 12px', lineHeight: '1.5', fontSize: '16px', fontWeight: 400, textTransform: 'none', borderRadius: '8px', boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    }
                }}>
                    Сохранить
                </Button>
                <Button onClick={() => navigate(`/ads/${id}`)} sx={{ p: '8px 12px', lineHeight: '1.5', fontSize: '16px', fontWeight: 400, textTransform: 'none', borderRadius: '8px', boxShadow: 'none', color: 'text.secondary', bgcolor: '#D9D9D9' }}>
                    Отменить
                </Button>
            </Box >

            <Popover
                open={priceAi.status === 'success' || priceAi.status === 'error'}
                anchorEl={priceAi.anchorEl}
                onClose={() => { }}
                disableEscapeKeyDown
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                sx={{ p: 2 }}
                disableScrollLock
                disableAutoFocus
                disableEnforceFocus
                disableRestoreFocus
            >
                <Box sx={{ p: 2, maxWidth: 400 }}>
                    {priceAi.status === 'error' ? (
                        <>
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {priceAi.error || 'Произошла ошибка при запросе к AI'}
                            </Alert>
                            <Typography sx={{ mb: 2 }}>
                                Попробуйте повторить запрос или закройте уведомление
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button onClick={handleAskPrice} size="small">
                                    Повторить запрос
                                </Button>
                                <Button onClick={closePricePopup} size="small">
                                    Закрыть
                                </Button>
                            </Box>
                        </>
                    ) : priceAi.result ? (
                        <>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                                {priceAi.result}
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button onClick={closePricePopup} size="small">
                                    Закрыть
                                </Button>
                                <Button
                                    onClick={() => {
                                        const numericPrice = parsePriceFromAI(priceAi.result!);
                                        if (numericPrice > 0) {
                                            setForm((prev: any) => ({ ...prev, price: numericPrice }));
                                        }
                                    }}
                                    variant="contained"
                                    size="small"
                                >
                                    Применить
                                </Button>
                            </Box>
                        </>
                    ) : null}
                </Box>
            </Popover>

            <Popover
                open={descAi.status === 'success' || descAi.status === 'error'}
                anchorEl={descAi.anchorEl}
                onClose={() => { }}
                disableEscapeKeyDown
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                disableScrollLock
                disableAutoFocus
                disableEnforceFocus
                disableRestoreFocus
            >
                <Box sx={{ p: 2, maxWidth: 500 }}>
                    {descAi.status === 'error' ? (
                        <>
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {descAi.error || 'Произошла ошибка при запросе к AI'}
                            </Alert>
                            <Typography sx={{ mb: 2 }}>
                                Попробуйте повторить запрос или закройте уведомление
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button onClick={handleAskDesc} size="small">
                                    Повторить запрос
                                </Button>
                                <Button onClick={closeDescPopup} size="small">
                                    Закрыть
                                </Button>
                            </Box>
                        </>
                    ) : descAi.result ? (
                        <>
                            <Typography
                                variant="body2"
                                sx={{ whiteSpace: 'pre-line', mb: 2, maxHeight: 300, overflowY: 'auto' }}
                            >
                                {descAi.result}
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button onClick={closeDescPopup} size="small">
                                    Закрыть
                                </Button>
                                <Button
                                    onClick={() => {
                                        setForm((prev: any) => ({
                                            ...prev,
                                            description: descAi.result,
                                        }));
                                    }}
                                    variant="contained"
                                    size="small"
                                >
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