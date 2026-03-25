import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdById } from '../../../entities/ad/api/api';
import { CircularProgress, Box, Typography, Divider } from '@mui/material';

import {
    TextField,
    Button,
    MenuItem,
} from '@mui/material';

import { useEffect, useState } from 'react';

export const AdEditForm = () => {
    const { id } = useParams();

    const [errors, setErrors] = useState<{ title?: string, category?: string, price?: string }>({});
    const [touched, setTouched] = useState<{ title?: boolean, category?: boolean, price?: boolean }>({});

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

    const storageKey = `ad-draft-${id}`;

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['item', id],
        queryFn: () => getAdById(id!),
        enabled: !!id,
    });

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

    const handleChange = (field: string, value: any) => {
        setForm((prev: any) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <>
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
            </Box>
        </>
    )
}