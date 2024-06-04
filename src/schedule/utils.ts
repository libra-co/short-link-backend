import { getShortCodeIdAndShortCodeFromRedisKey } from "src/visit-date-record/utils"

export const generateMemberList = (memberList: string[]) => {
  const resultList: { shortCodeId: number, shortCode: string, dateVisitNumber: number }[] = []
  memberList.forEach((item, index) => {
    const isKey = index % 2 === 0
    if (isKey) {
      const { shortCode, shortCodeId } = getShortCodeIdAndShortCodeFromRedisKey(item)
      console.log('item,shortCode3', item, shortCode)
      resultList.push({
        shortCode,
        shortCodeId: parseInt(shortCodeId),
        dateVisitNumber: parseInt(memberList[index + 1])
      })
    }
  })
  return resultList
}
