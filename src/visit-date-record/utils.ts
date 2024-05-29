import dayjs from "dayjs";

// update data
export const updateDateRecordData = (recordData: string | number[], updateIndex, data: number) => {
  const recordArray: number[] = typeof recordData === 'string'
    ? JSON.parse(recordData)
    : recordData;
  recordArray[updateIndex] = data;
  const jsonArray = JSON.stringify(recordArray);
  return jsonArray;
};

export const getIsLastDayOfMonth = () => {
  const today = dayjs();
  const lastDayOfMonth = today.endOf('month');
  const isLastDayOfMonth = today.isSame(lastDayOfMonth, 'day');
  return isLastDayOfMonth;
};
