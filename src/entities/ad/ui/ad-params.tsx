import { Typography } from '@mui/material';
import type { Ad } from '../model/types';

export const AdParams = ({ ad }: { ad: Ad }) => {
  if (ad.category === 'auto') {
    const p = ad.params;
    return (
      <>
        <Typography>Марка: {p.brand || '-'}</Typography>
        <Typography>Модель: {p.model || '-'}</Typography>
        <Typography>Год: {p.yearOfManufacture || '-'}</Typography>
        <Typography>Коробка: {p.transmission || '-'}</Typography>
        <Typography>Пробег: {p.mileage || '-'}</Typography>
        <Typography>Мощность: {p.enginePower || '-'}</Typography>
      </>
    );
  }

  if (ad.category === 'real_estate') {
    const p = ad.params;
    return (
      <>
        <Typography>Тип: {p.type || '-'}</Typography>
        <Typography>Адрес: {p.address || '-'}</Typography>
        <Typography>Площадь: {p.area || '-'}</Typography>
        <Typography>Этаж: {p.floor || '-'}</Typography>
      </>
    );
  }

  if (ad.category === 'electronics') {
    const p = ad.params;
    return (
      <>
        <Typography>Тип: {p.type || '-'}</Typography>
        <Typography>Бренд: {p.brand || '-'}</Typography>
        <Typography>Модель: {p.model || '-'}</Typography>
        <Typography>Состояние: {p.condition || '-'}</Typography>
        <Typography>Цвет: {p.color || '-'}</Typography>
      </>
    );
  }

  return null;
};