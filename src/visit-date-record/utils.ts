import dayjs from "dayjs";

export const updateRecordData = (recordData: string | number[], updateIndex, data: number) => {
  const recordArray: number[] = typeof recordData === 'string'
    ? JSON.parse(recordData)
    : recordData;
  recordArray[updateIndex] += data;
  const jsonArray = JSON.stringify(recordArray);
  return jsonArray;
};

export const getIsFirstDayOfMonth = (today: dayjs.Dayjs) => {
  const firstDayOfMonth = today.startOf('month');
  const isFirstDayOfMonth = today.isSame(firstDayOfMonth, 'day');
  return isFirstDayOfMonth;
};
