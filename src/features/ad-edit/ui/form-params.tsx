import { TextField, MenuItem, Box } from '@mui/material';
import type { Ad } from '../../../entities/ad/model/types';

export const FormParams = ({
    form,
    setForm,
}: {
    form: Ad;
    setForm: any;
}) => {
    const handleParamChange = (field: string, value: any) => {
        setForm((prev: any) => ({
            ...prev,
            params: {
                ...prev.params,
                [field]: value,
            },
        }));
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 400,
        fontSize: '14px',
        color: 'text.primary',
    };

    if (form.category === 'auto') {
        const p = form.params;

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="param-brand" style={labelStyle}>
                    Марка
                </label>
                <TextField
                    id="param-brand"
                    value={p.brand || ''}
                    onChange={(e) => handleParamChange('brand', e.target.value)}
                    sx={{ mb: '12px' }}
                />

                <label htmlFor="param-model" style={labelStyle}>
                    Модель
                </label>
                <TextField
                    id="param-model"
                    value={p.model || ''}
                    onChange={(e) => handleParamChange('model', e.target.value)}
                    sx={{ mb: '12px' }}
                />

                <label htmlFor="param-year" style={labelStyle}>
                    Год выпуска
                </label>
                <TextField
                    id="param-year"
                    type="number"
                    value={p.yearOfManufacture || ''}
                    onChange={(e) => handleParamChange('yearOfManufacture', e.target.value)}
                    sx={{ mb: '12px' }}
                />

                <label htmlFor="param-transmission" style={labelStyle}>
                    Коробка передач
                </label>
                <TextField
                    id="param-transmission"
                    select
                    value={p.transmission || ''}
                    onChange={(e) => handleParamChange('transmission', e.target.value)}
                    sx={{ mb: '12px' }}
                >
                    <MenuItem value="automatic">Автоматическая</MenuItem>
                    <MenuItem value="manual">Механическая</MenuItem>
                </TextField>

                <label htmlFor="param-mileage" style={labelStyle}>
                    Пробег
                </label>
                <TextField
                    id="param-mileage"
                    type="number"
                    value={p.mileage || ''}
                    onChange={(e) => handleParamChange('mileage', e.target.value)}
                    sx={{ mb: '12px' }}
                />

                <label htmlFor="param-power" style={labelStyle}>
                    Мощность двигателя
                </label>
                <TextField
                    id="param-power"
                    type="number"
                    value={p.enginePower || ''}
                    onChange={(e) => handleParamChange('enginePower', e.target.value)}
                />
            </Box>
        );
    }

    if (form.category === 'real_estate') {
        const p = form.params;

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="re-type" style={labelStyle}>
                    Тип недвижимости
                </label>
                <TextField
                    id="re-type"
                    select
                    value={p.type || ''}
                    onChange={(e) => handleParamChange('type', e.target.value)}
                    sx={{ mb: '12px' }}
                >
                    <MenuItem value="flat">Квартира</MenuItem>
                    <MenuItem value="house">Дом</MenuItem>
                    <MenuItem value="room">Комната</MenuItem>
                </TextField>

                <label htmlFor="re-address" style={labelStyle}>
                    Адрес
                </label>
                <TextField
                    id="re-address"
                    value={p.address || ''}
                    onChange={(e) => handleParamChange('address', e.target.value)}
                    sx={{ mb: '12px' }}
                />

                <label htmlFor="re-area" style={labelStyle}>
                    Площадь
                </label>
                <TextField
                    id="re-area"
                    type="number"
                    value={p.area || ''}
                    onChange={(e) => handleParamChange('area', e.target.value)}
                    sx={{ mb: '12px' }}
                />

                <label htmlFor="re-floor" style={labelStyle}>
                    Этаж
                </label>
                <TextField
                    id="re-floor"
                    type="number"
                    value={p.floor || ''}
                    onChange={(e) => handleParamChange('floor', e.target.value)}
                />
            </Box>
        );
    }

    if (form.category === 'electronics') {
        const p = form.params;

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="el-type" style={labelStyle}>
                    Тип устройства
                </label>
                <TextField
                    id="el-type"
                    select
                    value={p.type || ''}
                    onChange={(e) => handleParamChange('type', e.target.value)}
                    sx={{ mb: '12px' }}
                >
                    <MenuItem value="phone">Телефон</MenuItem>
                    <MenuItem value="laptop">Ноутбук</MenuItem>
                    <MenuItem value="misc">Другое</MenuItem>
                </TextField>

                <label htmlFor="el-brand" style={labelStyle}>
                    Бренд
                </label>
                <TextField
                    id="el-brand"
                    value={p.brand || ''}
                    onChange={(e) => handleParamChange('brand', e.target.value)}
                    sx={{ mb: '12px' }}
                />

                <label htmlFor="el-model" style={labelStyle}>
                    Модель
                </label>
                <TextField
                    id="el-model"
                    value={p.model || ''}
                    onChange={(e) => handleParamChange('model', e.target.value)}
                    sx={{ mb: '12px' }}
                />

                <label htmlFor="el-condition" style={labelStyle}>
                    Состояние
                </label>
                <TextField
                    id="el-condition"
                    select
                    value={p.condition || ''}
                    onChange={(e) => handleParamChange('condition', e.target.value)}
                    sx={{ mb: '12px' }}
                >
                    <MenuItem value="new">Новый</MenuItem>
                    <MenuItem value="used">Б/У</MenuItem>
                </TextField>

                <label htmlFor="el-color" style={labelStyle}>
                    Цвет
                </label>
                <TextField
                    id="el-color"
                    value={p.color || ''}
                    onChange={(e) => handleParamChange('color', e.target.value)}
                />
            </Box>
        );
    }

    return null;
};