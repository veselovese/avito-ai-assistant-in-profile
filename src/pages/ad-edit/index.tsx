import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdById } from '../../entities/ad/api/api';
import { useUpdateAd } from '../../entities/ad/api/useUpdateAd';
import { FormParams } from '../../features/ad-edit/ui/form-params';
import { CircularProgress } from '@mui/material';

import {
    TextField,
    Button,
    Select,
    MenuItem,
    Box,
    Typography,
} from '@mui/material';

import { useEffect, useState } from 'react';

export default function AdEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const storageKey = `ad-draft-${id}`;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['item', id],
        queryFn: () => getAdById(id!),
        enabled: !!id,
    });
    const updateMutation = useUpdateAd();

    const [form, setForm] = useState<any>(null);

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

    if (isLoading || !form) return <CircularProgress />;
    { isError && <Typography color="error">Ошибка загрузки</Typography> }

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