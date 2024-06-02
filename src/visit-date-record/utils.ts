import dayjs from "dayjs";

export const updateRecordData = (recordData: string | number[], updateIndex, data: number) => {
  const recordArray: number[] = typeof recordData === 'string'
    ? JSON.parse(recordData)
    : recordData;
  console.log('updateIndex', updateIndex)
  recordArray[updateIndex] = recordArray[updateIndex] || 0 + data;
  console.log('recordArray', recordArray)
  const jsonArray = JSON.stringify(recordArray);
  console.log('jsonArray', jsonArray)
  return jsonArray;
};

export const getIsFirstDayOfMonth = (today: dayjs.Dayjs) => {
  const firstDayOfMonth = today.startOf('month');
  const isFirstDayOfMonth = today.isSame(firstDayOfMonth, 'day');
  return isFirstDayOfMonth;
};

export const getShortCodeIdAndShortCodeFromRedisKey = (key: string) => {
  const [shortCodeId, shortCode] = key.split('_');
  return { shortCodeId, shortCode };
}

export const generateShortCodeRecordRedisKey = (shortCodeId: number, shortCode: string) => {
  return `${shortCodeId}_${shortCode}`
}
