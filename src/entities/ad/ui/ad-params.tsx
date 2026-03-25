import { Alert, Box, List, ListItem, Typography } from '@mui/material';
import type { Ad } from '../model/types';

type FieldConfig = {
  key: string;
  label: string;
  suffix?: string;
  format?: (v: string) => string;
};

const CATEGORIES_CONFIG: Record<string, FieldConfig[]> = {
  auto: [
    { key: 'brand', label: 'Марка' },
    { key: 'model', label: 'Модель' },
    { key: 'yearOfManufacture', label: 'Год выпуска' },
    { key: 'transmission', label: 'Коробка', format: (v) => v === 'automatic' ? 'Автомат' : 'Механика' },
    { key: 'mileage', label: 'Пробег', suffix: ' км' },
    { key: 'enginePower', label: 'Мощность', suffix: ' л.с.' },
  ],
  real_estate: [
    {
      key: 'type',
      label: 'Тип жилья',
      format: (v) => v === 'flat' ? 'Квартира' : v === 'house' ? 'Дом' : 'Комната'
    },
    { key: 'address', label: 'Адрес' },
    { key: 'area', label: 'Площадь', suffix: ' м²' },
    { key: 'floor', label: 'Этаж' },
  ],
  electronics: [
    { key: 'type', label: 'Тип устройства' },
    { key: 'brand', label: 'Бренд' },
    { key: 'model', label: 'Модель' },
    { key: 'condition', label: 'Состояние', format: (v) => v === 'new' ? 'Новое' : 'Б/У' },
    { key: 'color', label: 'Цвет' },
  ],
};

const processParams = (category: string, ad: Ad) => {
  const config = CATEGORIES_CONFIG[category] || [];
  const params = ad.params;
  const filledParams: { label: string; value: string | number }[] = [];
  const emptyParams: string[] = [];

  config.forEach((field) => {
    const value = params[field.key as keyof typeof params];

    if (value !== undefined && value !== null && value !== '') {
      let displayValue = field.format ? field.format(value as string) : value;
      if (field.suffix) displayValue = `${value}${field.suffix}`;
      filledParams.push({ label: field.label, value: displayValue });
    } else {
      emptyParams.push(field.label);
    }
  });

  if (!ad.description || ad.description.trim() === '') {
    emptyParams.push('Описание');
  }

  return { filledParams, emptyParams };
};

export const AdParams = ({ ad }: { ad: Ad }) => {
  const { filledParams, emptyParams } = processParams(ad.category, ad);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', maxWidth: '480px' }}>

      {ad.needsRevision && (
        <Alert severity="info" color="warning" sx={{ alignItems: 'start', p: '4px 12px 4px 16px', gap: '4px' }}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="body1">Требуются доработки</Typography>
            <Typography variant="subtitle2" sx={{ mt: '4px' }}>
              У объявления не заполнены поля:
            </Typography>
            <List sx={{ p: 0, pl: 2, listStyleType: 'disc', color: 'text.primary' }}>
              {emptyParams.map((label) => (
                <ListItem key={label} sx={{ p: '0 4px', display: 'list-item', }}>
                  <Typography variant="subtitle2">{label}</Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        </Alert>
      )}

      <Box>
        <Typography variant="body1" sx={{ fontSize: '24px' }}>
          Характеристики
        </Typography>

        {filledParams.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px', mt: '16px' }}>
            {filledParams.map((item, idx) => (
              <Box
                key={idx}
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', maxWidth: 'fit-content', gap: '12px' }}
              >
                <Typography variant="body1" sx={{ color: 'text.secondary', width: '100%', maxWidth: '148px', minWidth: '148px' }}>
                  {item.label}
                </Typography>
                <Typography variant="subtitle1" sx={{ lineHeight: '1.5' }}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: '16px' }}>
            Параметры не указаны
          </Typography>
        )}
      </Box>
    </Box>
  );
};