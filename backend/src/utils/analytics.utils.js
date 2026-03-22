export const groupClicksByDate = (clicks) => {
  const grouped = {};

  clicks.forEach(({ timestamp }) => {
    const dateKey = new Date(timestamp).toISOString().split("T")[0];
    grouped[dateKey] = (grouped[dateKey] || 0) + 1;
  });

  return Object.entries(grouped)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const buildWhereClause = ({ startDate, endDate, age, gender }) => {
  const where = {};

  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) where.timestamp.gte = new Date(startDate);
    if (endDate) where.timestamp.lte = new Date(endDate);
  }

  if (age || gender) {
    where.user = {};
    if (gender) where.user.gender = gender;
    if (age) {
      if (age === "<18") where.user.age = { lt: 18 };
      else if (age === "18-40") where.user.age = { gte: 18, lte: 40 };
      else if (age === ">40") where.user.age = { gt: 40 };
    }
  }

  return where;
};
