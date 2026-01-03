import React from 'react';
import Typography from '@mui/material/Typography';

const DataUpdateInfo: React.FC = () => {
  const dataUpdateDate = process.env.NEXT_PUBLIC_DATA_UPDATE_DATE;

  const formatDateToBrazilian = (dateString: string): string => {
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  const displayText = dataUpdateDate
    ? `Dados atualizados em: ${formatDateToBrazilian(dataUpdateDate)}`
    : 'Data de atualização não disponível';

  return (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        display: 'block',
        textAlign: 'center',
        fontSize: { xs: '0.75rem', sm: '0.8125rem' },
        mt: 1,
      }}
    >
      {displayText}
    </Typography>
  );
};

export default DataUpdateInfo;
