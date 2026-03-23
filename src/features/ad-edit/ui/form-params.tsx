import { TextField, Select, MenuItem, Box } from '@mui/material';
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

    if (form.category === 'auto') {
        const p = form.params;

        return (
            <>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="Марка"
                        value={p.brand || ''}
                        onChange={(e) => handleParamChange('brand', e.target.value)}
                    />

                    <TextField
                        label="Модель"
                        value={p.model || ''}
                        onChange={(e) => handleParamChange('model', e.target.value)}
                    />

                    <TextField
                        label="Год выпуска"
                        type="number"
                        value={p.yearOfManufacture || ''}
                        onChange={(e) => handleParamChange('yearOfManufacture', e.target.value)}
                    />

                    <Select
                        label="Коробка передач"
                        value={p.transmission || ''}
                        onChange={(e) => handleParamChange('transmission', e.target.value)}
                    >
                        <MenuItem value="automatic">Автоматическая</MenuItem>
                        <MenuItem value="manual">Механическая</MenuItem>
                    </Select>

                    <TextField
                        label="Пробег"
                        type="number"
                        value={p.mileage || ''}
                        onChange={(e) => handleParamChange('mileage', e.target.value)}
                    />

                    <TextField
                        label="Мощность двигателя"
                        type="number"
                        value={p.enginePower || ''}
                        onChange={(e) => handleParamChange('enginePower', e.target.value)}
                    />
                </Box>
            </>
        );
    }

    if (form.category === 'real_estate') {
        const p = form.params;

        return (
            <>
                <Box sx={{ mt: 2 }}>

                    <Select
                        label="Тип недвижимости"
                        value={p.type || ''}
                        onChange={(e) => handleParamChange('type', e.target.value)}
                    >
                        <MenuItem value="flat">Квартира</MenuItem>
                        <MenuItem value="house">Дом</MenuItem>
                        <MenuItem value="room">Комната</MenuItem>
                    </Select>

                    <TextField
                        label="Адрес"
                        value={p.address || ''}
                        onChange={(e) => handleParamChange('address', e.target.value)}
                    />

                    <TextField
                        label="Площадь"
                        type="number"
                        value={p.area || ''}
                        onChange={(e) => handleParamChange('area', e.target.value)}
                    />

                    <TextField
                        label="Этаж"
                        type="number"
                        value={p.floor || ''}
                        onChange={(e) => handleParamChange('floor', e.target.value)}
                    />
                </Box>
            </>
        );
    }

    if (form.category === 'electronics') {
        const p = form.params;

        return (
            <>
                <Box sx={{ mt: 2 }}>
                    <Select
                        label="Тип устройства"
                        value={p.type || ''}
                        onChange={(e) => handleParamChange('type', e.target.value)}
                    >
                        <MenuItem value="phone">Телефон</MenuItem>
                        <MenuItem value="laptop">Ноутбук</MenuItem>
                        <MenuItem value="misc">Другое</MenuItem>
                    </Select>

                    <TextField
                        label="Бренд"
                        value={p.brand || ''}
                        onChange={(e) => handleParamChange('brand', e.target.value)}
                    />

                    <TextField
                        label="Модель"
                        value={p.model || ''}
                        onChange={(e) => handleParamChange('model', e.target.value)}
                    />

                    <Select
                        label="Состояние"
                        value={p.condition || ''}
                        onChange={(e) => handleParamChange('condition', e.target.value)}
                    >
                        <MenuItem value="new">Новый</MenuItem>
                        <MenuItem value="used">Б/У</MenuItem>
                    </Select>

                    <TextField
                        label="Цвет"
                        value={p.color || ''}
                        onChange={(e) => handleParamChange('color', e.target.value)}
                    />
                </Box>
            </>
        );
    }

    return null;
};