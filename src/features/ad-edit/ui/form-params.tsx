import { TextField } from '@mui/material';
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
      </>
    );
  }

  if (form.category === 'real_estate') {
    const p = form.params;

    return (
      <>
        <TextField
          label="Адрес"
          value={p.address || ''}
          onChange={(e) => handleParamChange('address', e.target.value)}
        />
      </>
    );
  }

  if (form.category === 'electronics') {
    const p = form.params;

    return (
      <>
        <TextField
          label="Бренд"
          value={p.brand || ''}
          onChange={(e) => handleParamChange('brand', e.target.value)}
        />
      </>
    );
  }

  return null;
};