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
                    placeholder='Марка'
                    value={p.brand || ''}
                    onChange={(e) => handleParamChange('brand', e.target.value)}
                    sx={{
                        mb: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.brand ? 'warning.main' : 'rgba(0, 0, 0, 0.23)',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.brand ? 'warning.main' : 'rgba(0, 0, 0, 0.87)',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.brand ? 'warning.main' : 'primary.main',
                        },
                    }}
                    color={!p.brand ? 'warning' : 'primary'}
                />

                <label htmlFor="param-model" style={labelStyle}>
                    Модель
                </label>
                <TextField
                    id="param-model"
                    placeholder='Модель'
                    value={p.model || ''}
                    onChange={(e) => handleParamChange('model', e.target.value)}
                    sx={{
                        mb: '12px', '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.model ? 'warning.main' : 'rgba(0, 0, 0, 0.23)',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.model ? 'warning.main' : 'rgba(0, 0, 0, 0.87)',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.model ? 'warning.main' : 'primary.main',
                        },
                    }}
                    color={!p.model ? 'warning' : 'primary'}
                />

                <label htmlFor="param-year" style={labelStyle}>
                    Год выпуска
                </label>
                <TextField
                    id="param-year"
                    type="number"
                    placeholder='Год выпуска'
                    value={p.yearOfManufacture || ''}
                    onChange={(e) => handleParamChange('yearOfManufacture', e.target.value)}
                    sx={{
                        mb: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.yearOfManufacture ? 'warning.main' : 'rgba(0, 0, 0, 0.23)',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.yearOfManufacture ? 'warning.main' : 'rgba(0, 0, 0, 0.87)',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.yearOfManufacture ? 'warning.main' : 'primary.main',
                        },
                    }}
                    color={!p.yearOfManufacture ? 'warning' : 'primary'}

                />

                <label htmlFor="param-transmission" style={labelStyle}>
                    Коробка передач
                </label>
                <TextField
                    id="param-transmission"
                    select
                    placeholder='Коробка передач'
                    value={p.transmission || ''}
                    onChange={(e) => handleParamChange('transmission', e.target.value)}
                    sx={{
                        mb: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.transmission ? 'warning.main' : 'rgba(0, 0, 0, 0.23)',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.transmission ? 'warning.main' : 'rgba(0, 0, 0, 0.87)',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.transmission ? 'warning.main' : 'primary.main',
                        },

                    }}
                    color={!p.transmission ? 'warning' : 'primary'}
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
                    placeholder='Пробег'
                    value={p.mileage || ''}
                    onChange={(e) => handleParamChange('mileage', e.target.value)}
                    sx={{
                        mb: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.mileage ? 'warning.main' : 'rgba(0, 0, 0, 0.23)',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.mileage ? 'warning.main' : 'rgba(0, 0, 0, 0.87)',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.mileage ? 'warning.main' : 'primary.main',
                        },
                    }}
                    color={!p.mileage ? 'warning' : 'primary'}
                />

                <label htmlFor="param-power" style={labelStyle}>
                    Мощность двигателя
                </label>
                <TextField
                    id="param-power"
                    placeholder='Мощность двигателя'
                    type="number"
                    value={p.enginePower || ''}
                    onChange={(e) => handleParamChange('enginePower', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.enginePower ? 'warning.main' : 'rgba(0, 0, 0, 0.23)',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.enginePower ? 'warning.main' : 'rgba(0, 0, 0, 0.87)',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.enginePower ? 'warning.main' : 'primary.main',
                        },
                    }}
                    color={!p.enginePower ? 'warning' : 'primary'}
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
                    placeholder='Тип недвижимости'
                    select
                    value={p.type || ''}
                    onChange={(e) => handleParamChange('type', e.target.value)}
                    sx={{
                        mb: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.type ? 'warning.main' : 'rgba(0, 0, 0, 0.23)',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.type ? 'warning.main' : 'rgba(0, 0, 0, 0.87)',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.type ? 'warning.main' : 'primary.main',
                        },
                    }}
                    color={!p.type ? 'warning' : 'primary'}
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
                    placeholder='Адрес'
                    value={p.address || ''}
                    onChange={(e) => handleParamChange('address', e.target.value)}
                    sx={{
                        mb: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.address ? 'warning.main' : 'rgba(0, 0, 0, 0.23)',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.address ? 'warning.main' : 'rgba(0, 0, 0, 0.87)',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.address ? 'warning.main' : 'primary.main',
                        },
                    }}
                    color={!p.address ? 'warning' : 'primary'}
                />

                <label htmlFor="re-area" style={labelStyle}>
                    Площадь
                </label>
                <TextField
                    id="re-area"
                    placeholder='Площадь'
                    type="number"
                    value={p.area || ''}
                    onChange={(e) => handleParamChange('area', e.target.value)}
                    sx={{
                        mb: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.area ? 'warning.main' : 'rgba(0, 0, 0, 0.23)',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.area ? 'warning.main' : 'rgba(0, 0, 0, 0.87)',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.area ? 'warning.main' : 'primary.main',
                        },
                    }}
                    color={!p.area ? 'warning' : 'primary'}
                />

                <label htmlFor="re-floor" style={labelStyle}>
                    Этаж
                </label>
                <TextField
                    id="re-floor"
                    type="number"
                    placeholder='Этаж'
                    value={p.floor || ''}
                    onChange={(e) => handleParamChange('floor', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.floor ? 'warning.main' : 'rgba(0, 0, 0, 0.23)',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.floor ? 'warning.main' : 'rgba(0, 0, 0, 0.87)',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.floor ? 'warning.main' : 'primary.main',
                        },
                    }}
                    color={!p.floor ? 'warning' : 'primary'}
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
                    placeholder='Тип устройства'
                    value={p.type || ''}
                    onChange={(e) => handleParamChange('type', e.target.value)}
                    sx={{
                        mb: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.type ? 'warning.main' : 'rgba(0, 0, 0, 0.23)',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.type ? 'warning.main' : 'rgba(0, 0, 0, 0.87)',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.type ? 'warning.main' : 'primary.main',
                        },
                    }}
                    color={!p.type ? 'warning' : 'primary'}
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
                    placeholder='Бренд'
                    value={p.brand || ''}
                    onChange={(e) => handleParamChange('brand', e.target.value)}
                    sx={{
                        mb: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.brand ? 'warning.main' : 'rgba(0, 0, 0, 0.23)',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.brand ? 'warning.main' : 'rgba(0, 0, 0, 0.87)',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.brand ? 'warning.main' : 'primary.main',
                        },
                    }}
                    color={!p.brand ? 'warning' : 'primary'}
                />

                <label htmlFor="el-model" style={labelStyle}>
                    Модель
                </label>
                <TextField
                    id="el-model"
                    placeholder='Модель'
                    value={p.model || ''}
                    onChange={(e) => handleParamChange('model', e.target.value)}
                    sx={{
                        mb: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.model ? 'warning.main' : 'rgba(0, 0, 0, 0.23)',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.model ? 'warning.main' : 'rgba(0, 0, 0, 0.87)',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.model ? 'warning.main' : 'primary.main',
                        },
                    }}
                    color={!p.model ? 'warning' : 'primary'}
                />

                <label htmlFor="el-condition" style={labelStyle}>
                    Состояние
                </label>
                <TextField
                    id="el-condition"
                    select
                    placeholder='Состояние'
                    value={p.condition || ''}
                    onChange={(e) => handleParamChange('condition', e.target.value)}
                    sx={{
                        mb: '12px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.condition ? 'warning.main' : 'rgba(0, 0, 0, 0.23)',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.condition ? 'warning.main' : 'rgba(0, 0, 0, 0.87)',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.condition ? 'warning.main' : 'primary.main',
                        },
                    }}
                    color={!p.condition ? 'warning' : 'primary'}
                >
                    <MenuItem value="new">Новый</MenuItem>
                    <MenuItem value="used">Б/У</MenuItem>
                </TextField>

                <label htmlFor="el-color" style={labelStyle}>
                    Цвет
                </label>
                <TextField
                    id="el-color"
                    placeholder='Цвет'
                    value={p.color || ''}
                    onChange={(e) => handleParamChange('color', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.color ? 'warning.main' : 'rgba(0, 0, 0, 0.23)',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.color ? 'warning.main' : 'rgba(0, 0, 0, 0.87)',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: !p.color ? 'warning.main' : 'primary.main',
                        },
                    }}
                    color={!p.color ? 'warning' : 'primary'}
                />
            </Box>
        );
    }

    return null;
};