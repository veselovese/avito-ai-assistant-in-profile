import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdById } from '../../entities/ad/api/api';
import { useUpdateAd } from '../../entities/ad/api/useUpdateAd';
import { FormParams } from '../../features/ad-edit/ui/form-params';
import { CircularProgress, Grid, Box, Typography, Divider, Snackbar } from '@mui/material';
import { useGenerateDescription, useSuggestPrice } from '../../entities/ad/api/useUpdateAd';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';

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

    const [errors, setErrors] = useState<{ title?: string, category?: string, price?: string }>({});
    const [touched, setTouched] = useState<{ title?: boolean, category?: boolean, price?: boolean }>({});

    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        type: 'success' | 'error';
        message: string;
    }>({
        open: false,
        type: 'success',
        message: '',
    });

    const validate = (field: string, value: any) => {
        let error = '';

        if (field === 'title') {
            if (!value || value.trim() === '') {
                error = 'Название должно быть заполнено';
            }
        }

        if (field === 'category') {
            if (!value || value.trim() === '') {
                error = 'Категория должна быть указана';
            }
        }

        if (field === 'price') {
            if (!value || value <= 0) {
                error = 'Стоимость должна быть заполнена';
            }
        }

        setErrors(prev => ({
            ...prev,
            [field]: error || undefined,
        }));
    };

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

    const descButtonText = form.description ? 'Улучшить описание' : genDesc.isError || genDesc.isSuccess ? 'Повторить запрос' : 'Придумать описание';
    const priceButtonText = genPrice.isError || genPrice.isSuccess ? 'Повторить запрос' : 'Узнать рыночную цену';
    const descAiButtonIcon = genDesc.isError || genDesc.isSuccess ? <RefreshOutlinedIcon /> : <LightbulbOutlinedIcon />;
    const priceAiButtonIcon = genPrice.isError || genPrice.isSuccess ? <RefreshOutlinedIcon /> : <LightbulbOutlinedIcon />;
    const isFormValid = !!form.title?.trim() && !!form.category?.trim() && typeof form.price === 'number' && form.price > 0;;

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

    const cleanParams = (params: Record<string, any>) => {
        return Object.fromEntries(
            Object.entries(params).filter(([_, value]) => {
                return value !== '' && value !== null && value !== undefined;
            })
        );
    };

    const handleSave = () => {
        const cleanedData = {
            ...form,
            params: cleanParams(form.params),
        };
        updateMutation.mutate(
            { id: id!, data: cleanedData },
            {
                onSuccess: () => {
                    localStorage.removeItem(storageKey);
                    setSnackbar({
                        open: true,
                        type: 'success',
                        message: 'Изменения сохранены',
                    });

                    setTimeout(() => {
                        navigate(`/ads/${id}`);
                    }, 1000);
                },
                onError: () => {
                    setSnackbar({
                        open: true,
                        type: 'error',
                        message: 'При попытке сохранить изменения произошла ошибка. Попробуйте ещё раз или зайдите позже.',
                    });
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
                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span> Категория
                </label>
                <TextField
                    id="ad-category"
                    select
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    fullWidth
                    variant="outlined"
                    onBlur={() => {
                        setTouched(prev => ({ ...prev, category: true }));
                        validate('category', form.category);
                    }}
                    error={touched.category && !!errors.category}
                    helperText={touched.category && errors.category}
                    required>
                    <MenuItem value="auto">Авто</MenuItem>
                    <MenuItem value="real_estate">Недвижимость</MenuItem>
                    <MenuItem value="electronics">Электроника</MenuItem>
                </TextField>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '50%' }}>
                <label htmlFor="ad-title" style={{ display: 'block' }}>
                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span> Название
                </label>
                <TextField
                    id='ad-title'
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    fullWidth
                    onBlur={() => {
                        setTouched(prev => ({ ...prev, title: true }));
                        validate('title', form.title);;
                    }}
                    error={touched.title && !!errors.title}
                    helperText={touched.title && errors.title}
                    required
                />

            </Box>
            <Divider />
            <Box sx={{ display: 'flex', gap: '24px', alignItems: 'end', }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '50%', width: '100%' }}>
                    <label htmlFor="ad-price" style={{ display: 'block' }}>
                        <span style={{ color: 'red', marginLeft: '2px' }}>*</span> Цена
                    </label>
                    <TextField
                        id="ad-price"
                        type="number"
                        value={form.price}
                        onChange={(e) => handleChange('price', e.target.value === '' ? '' : Number(e.target.value))}
                        fullWidth
                        onBlur={() => {
                            setTouched(prev => ({ ...prev, price: true }));
                            validate('price', form.price);;
                        }}
                        error={touched.price && !!errors.price}
                        helperText={touched.price && errors.price}
                        required
                        sx={{ width: '100%', }}
                    />
                </Box>
                <Button
                    startIcon={genPrice.isPending ? <HourglassBottomOutlinedIcon /> : priceAiButtonIcon}
                    variant='outlined'
                    color='warning'
                    onClick={handleAskPrice}
                    disabled={genPrice.isPending}
                    sx={{ maxWidth: 'fit-content', fontSize: '14px', fontWeight: 400, p: '5px 9.5px', lineHeight: '100%', minHeight: '32px', textTransform: 'none', borderRadius: '8px', boxShadow: 'none', }}
                >
                    {genPrice.isPending ? 'Выполняется запрос' : priceButtonText}
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
                    placeholder='Описание'
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
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: !form.description ? 'warning.main' : 'rgba(0, 0, 0, 0.23)',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: !form.description ? 'warning.main' : 'rgba(0, 0, 0, 0.87)',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: !form.description ? 'warning.main' : 'primary.main',
                        },

                    }}
                    color={!form.description ? 'warning' : 'primary'}
                />
                <Button
                    startIcon={genDesc.isPending ? <HourglassBottomOutlinedIcon /> : descAiButtonIcon}
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
                }}
                    disabled={!isFormValid || updateMutation.isPending}>
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
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                sx={{ pointerEvents: 'none' }}
                slotProps={{
                    paper: {
                        sx: {
                            pointerEvents: 'auto',
                            overflow: 'visible',
                            mb: 1.5,
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        },
                    },
                }}
                disableScrollLock
                disableAutoFocus
                disableEnforceFocus
                disableRestoreFocus
            >
                <Box sx={{ p: '8px', maxWidth: '332px' }}>
                    {priceAi.status === 'error' ? (
                        <>
                            <Alert severity="error" sx={{ mb: '8px' }}>
                                {priceAi.error || 'Произошла ошибка при запросе к AI'}
                            </Alert>
                            <Typography variant='subtitle2' sx={{ mb: '8px' }}>
                                Попробуйте повторить запрос или закройте уведомление
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', }}>
                                <Button onClick={closePricePopup} variant='outlined' color='error' sx={{ textTransform: 'none', p: '5px 12px', maxHeight: '32px', borderRadius: '8px' }}>
                                    Закрыть
                                </Button>
                            </Box>
                        </>
                    ) : priceAi.result ? (
                        <>
                            <Typography variant="body2" sx={{ mb: '8px' }}>
                                Ответ AI:
                            </Typography>
                            <Typography variant="subtitle2" sx={{ whiteSpace: 'pre-line', mb: '8px' }}>
                                {priceAi.result}
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
                                <Button
                                    onClick={() => {
                                        const numericPrice = parsePriceFromAI(priceAi.result!);
                                        if (numericPrice > 0) {
                                            setForm((prev: any) => ({ ...prev, price: numericPrice }));
                                        }
                                        closePricePopup();
                                    }}
                                    variant="contained"
                                    sx={{
                                        textTransform: 'none', p: '5px 12px', maxHeight: '32px', borderRadius: '8px', boxShadow: 'none',
                                        '&:hover': {
                                            boxShadow: 'none',
                                        }
                                    }}
                                >
                                    Применить
                                </Button>
                                <Button onClick={closePricePopup} variant='outlined' sx={{
                                    textTransform: 'none', p: '5px 12px', maxHeight: '32px', borderRadius: '8px', boxShadow: 'none',
                                }}>
                                    Закрыть
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
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                sx={{ pointerEvents: 'none' }}
                slotProps={{
                    paper: {
                        sx: {
                            pointerEvents: 'auto',
                            overflow: 'visible',
                            mb: '16px',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        },
                    },
                }} disableScrollLock
                disableAutoFocus
                disableEnforceFocus
                disableRestoreFocus
            >
                <Box sx={{ p: '8px', maxWidth: '332px' }}>
                    {descAi.status === 'error' ? (
                        <>
                            <Alert severity="error" sx={{ mb: '8px' }}>
                                {descAi.error || 'Произошла ошибка при запросе к AI'}
                            </Alert>
                            <Typography variant='subtitle2' sx={{ mb: '8px ' }}>
                                Попробуйте повторить запрос или закройте уведомление
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', }}>
                                <Button onClick={closeDescPopup} variant='outlined' color='error' sx={{ textTransform: 'none', p: '5px 12px', maxHeight: '32px', borderRadius: '8px' }}>
                                    Закрыть
                                </Button>
                            </Box>
                        </>
                    ) : descAi.result ? (
                        <>
                            <Typography variant="body2" sx={{ mb: '8px' }}>
                                Ответ AI:
                            </Typography>
                            <Typography variant="subtitle2" sx={{ whiteSpace: 'pre-line', mb: '8px' }}>
                                {descAi.result}
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
                                <Button
                                    onClick={() => {
                                        setForm((prev: any) => ({
                                            ...prev,
                                            description: descAi.result,
                                        }));
                                        closeDescPopup();
                                    }}
                                    variant="contained"
                                    sx={{
                                        textTransform: 'none', p: '5px 12px', maxHeight: '32px', borderRadius: '8px', boxShadow: 'none',
                                        '&:hover': {
                                            boxShadow: 'none',
                                        }
                                    }}
                                >
                                    Применить
                                </Button>
                                <Button onClick={closeDescPopup} variant='outlined' sx={{
                                    textTransform: 'none', p: '5px 12px', maxHeight: '32px', borderRadius: '8px', boxShadow: 'none',
                                }}>
                                    Закрыть
                                </Button>
                            </Box>
                        </>
                    ) : null}
                </Box>
            </Popover>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    severity={snackbar.type}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Grid >
    );
}