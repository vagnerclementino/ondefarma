import React from 'react';

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

  return <p className="text-xs text-muted-foreground m-0">{displayText}</p>;
};

export default DataUpdateInfo;
