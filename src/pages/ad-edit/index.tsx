import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdById } from '../../entities/ad/api/api';
import { useUpdateAd } from '../../entities/ad/api/useUpdateAd';
import { FormParams } from '../../features/ad-edit/ui/form-params';
import { CircularProgress } from '@mui/material';
import { useGenerateDescription, useSuggestPrice } from '../../entities/ad/api/useUpdateAd';

import {
    TextField,
    Button,
    Select,
    MenuItem,
    Box,
    Typography,
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

    const { data, isLoading, isError } = useQuery({
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

    if (isLoading) return <CircularProgress />;

    if (isError) return <Typography color="error">Ошибка загрузки объявления</Typography>;

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
        <Box p={3}>
            <Typography>Редактирование</Typography>

            <Select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
            >
                <MenuItem value="auto">Авто</MenuItem>
                <MenuItem value="real_estate">Недвижимость</MenuItem>
                <MenuItem value="electronics">Электроника</MenuItem>
            </Select>

            <TextField
                label="Название"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
            />

            <TextField
                label="Цена"
                type="number"
                value={form.price}
                onChange={(e) => handleChange('price', Number(e.target.value))}
                fullWidth
                sx={{ mt: 2 }}
            />

            <Button
                variant="outlined"
                onClick={handleAskPrice}
                disabled={genPrice.isPending}
                startIcon={genPrice.isPending ? <CircularProgress size={16} /> : null}
            >
                {genPrice.isPending ? 'Считаем цену...' : 'Узнать рыночную цену'}
            </Button>
            <Popover
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
            </Popover>

            <FormParams form={form} setForm={setForm} />

            <TextField
                label="Описание"
                value={form.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                fullWidth
                multiline
                rows={4}
                sx={{ mt: 2 }}
            />
            <Button
                variant="outlined"
                onClick={handleAskDesc}
                disabled={genDesc.isPending}
                startIcon={genDesc.isPending ? <CircularProgress size={16} /> : null}
            >
                {genDesc.isPending ? 'Генерация...' : descButtonText}
            </Button>
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

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button onClick={handleSave}>
                    Сохранить
                </Button>

                <Button onClick={() => navigate(`/ads/${id}`)}>
                    Отменить
                </Button>
            </Box>
        </Box>
    );
}