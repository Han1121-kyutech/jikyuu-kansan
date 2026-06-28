export const calcHourlyWage = (income: number, hours: number) => income / hours;
export const calcHoursFor = (cost: number, hourlyWage: number) => cost / hourlyWage;
export const calcRate = (totalCost: number, income: number) => (totalCost / income) * 100;

export const getCopyText = (rate: number): string => {
  if (rate >= 50) return "半分以上が固定費に消えています💸";
  if (rate >= 30) return "3割以上が固定費に消えています😮";
  return "比較的良い状態です✨";
};

export const buildShareText = (
  hourlyWage: number,
  totalHours: number,
  workHours: number,
  rate: number
): string => {
  return `手取り診断やってみた\n時給${Math.round(hourlyWage).toLocaleString()}円で 固定費が${totalHours.toFixed(1)}時間分に相当してた\n月${workHours}時間働いて${rate.toFixed(1)}%が消えてる\n#手取り診断 #個人開発`;
};
