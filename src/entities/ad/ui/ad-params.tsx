import { Alert, Box, Chip, List, ListItem, Stack, Typography } from '@mui/material';
import type { Ad, AutoAdParams, ElectronicsAdParams, RealEstateAdParams } from '../model/types';



export const AdParams = ({ ad }: { ad: Ad }) => {
  if (ad.category === 'auto') {
    const p = ad.params as AutoAdParams;

    const fieldsConfig = [
      { key: 'brand', label: 'Марка' },
      { key: 'model', label: 'Модель' },
      { key: 'yearOfManufacture', label: 'Год выпуска' },
      { key: 'transmission', label: 'Коробка', format: (v: string) => v === 'automatic' ? 'Автомат' : 'Механика' },
      { key: 'mileage', label: 'Пробег', suffix: ' км' },
      { key: 'enginePower', label: 'Мощность', suffix: ' л.с.' },
    ];

    const filledParams: { label: string; value: string | number; }[] = [];
    const emptyParams: string[] = [];

    fieldsConfig.forEach(field => {
      const value = p[field.key as keyof AutoAdParams];

      if (value !== undefined && value !== null && value !== '') {
        let displayValue = field.format ? field.format(value as string) : value;
        if (field.suffix) displayValue = `${value}${field.suffix}`;
        filledParams.push({ label: field.label, value: displayValue });
      } else {
        emptyParams.push(field.label);
      }
    });

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', maxWidth: '480px' }}>
        {ad.needsRevision && (
          <Alert severity="info" color="warning" sx={{ alignItems: 'start', p: '4px 12px 4px 16px', gap: '4px', }}>
            <Box sx={{ width: '100%', }}>
              <Typography variant="body1">
                Требуются доработки
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: '4px' }}>
                У объявления не заполнены поля:
              </Typography>
              <List sx={{ p: 0, listStyleType: 'disc', color: 'text.secondary' }}>
                {emptyParams.map((label) => (
                  <ListItem sx={{ p: '0 16px', display: 'list-item' }}>
                    <Typography variant="subtitle2">
                      {label}
                    </Typography>
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
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', maxWidth: 'fit-content', gap: '12px' }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', width: '100%', maxWidth: '148px', minWidth: '148px' }}>{item.label}</Typography>
                  <Typography variant="subtitle1" sx={{ lineHeight: '1.5' }}>{item.value}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Параметры не указаны
            </Typography>
          )}
        </Box>
      </Box >
    );
  }

  if (ad.category === 'real_estate') {
    const p = ad.params as RealEstateAdParams;

    const fieldsConfig = [
      {
        key: 'type',
        label: 'Тип жилья',
        format: (v: string) => v === 'flat' ? 'Квартира' : v === 'house' ? 'Дом' : 'Комната'
      },
      { key: 'address', label: 'Адрес' },
      { key: 'area', label: 'Площадь', suffix: ' м²' },
      { key: 'floor', label: 'Этаж' },
    ];

    const filledParams: { label: string; value: any; }[] = [];
    const emptyParams: string[] = [];

    fieldsConfig.forEach(field => {
      const value = p[field.key as keyof RealEstateAdParams];

      if (value !== undefined && value !== null && value !== '') {
        let displayValue = field.format ? field.format(value as string) : value;
        if (field.suffix) displayValue = `${value}${field.suffix}`;
        filledParams.push({ label: field.label, value: displayValue });
      } else {
        emptyParams.push(field.label);
      }
    });

    return (
      <Box>
        {ad.needsRevision && (
          <Alert severity="warning" sx={{ mb: 3, alignItems: 'center' }}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="body1" >
                Требуются доработки
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {emptyParams.map((label) => (
                  <Chip key={label} label={label} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>
          </Alert>
        )}

        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Характеристики
        </Typography>

        {filledParams.length > 0 ? (
          <Stack spacing={1}>
            {filledParams.map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px solid #eee' }}>
                <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                <Typography variant="body2" fontWeight={500}>{item.value}</Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Параметры не указаны
          </Typography>
        )}
      </Box>
    );
  }

  if (ad.category === 'electronics') {
    const p = ad.params as ElectronicsAdParams;

    const fieldsConfig = [
      { key: 'type', label: 'Тип устройства' },
      { key: 'brand', label: 'Бренд' },
      { key: 'model', label: 'Модель' },
      {
        key: 'condition',
        label: 'Состояние',
        format: (v: string) => v === 'new' ? 'Новое' : 'Б/У'
      },
      { key: 'color', label: 'Цвет' },
    ];

    const filledParams: { label: string; value: any; }[] = [];
    const emptyParams: string[] = [];

    fieldsConfig.forEach(field => {
      const value = p[field.key as keyof ElectronicsAdParams];

      if (value !== undefined && value !== null && value !== '') {
        let displayValue = field.format ? field.format(value as string) : value;
        filledParams.push({ label: field.label, value: displayValue });
      } else {
        emptyParams.push(field.label);
      }
    });

    return (
      <Box>
        {ad.needsRevision && (
          <Alert severity="warning" sx={{ mb: 3, alignItems: 'center' }}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="body1">
                Требуются доработки
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {emptyParams.map((label) => (
                  <Chip key={label} label={label} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>
          </Alert>
        )}

        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Характеристики
        </Typography>

        {filledParams.length > 0 ? (
          <Stack spacing={1}>
            {filledParams.map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px solid #eee' }}>
                <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                <Typography variant="body2" fontWeight={500}>{item.value}</Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Параметры не указаны
          </Typography>
        )}
      </Box>
    );
  }

  return null;
};