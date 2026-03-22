import { PrismaClient } from "@prisma/client";
import {
  buildWhereClause,
  groupClicksByDate,
} from "../utils/analytics.utils.js";

const prisma = new PrismaClient();

export const getAnalytics = async ({
  startDate,
  endDate,
  age,
  gender,
  feature,
}) => {
  const where = buildWhereClause({ startDate, endDate, age, gender });

  const barRaw = await prisma.featureClick.groupBy({
    by: ["featureName"],
    where,
    _count: { featureName: true },
    orderBy: { _count: { featureName: "desc" } },
  });

  const barChart = barRaw.map((item) => ({
    feature_name: item.featureName,
    total_clicks: item._count.featureName,
  }));

  let lineChart = [];
  if (feature) {
    const clicks = await prisma.featureClick.findMany({
      where: { ...where, featureName: feature },
      select: { timestamp: true },
      orderBy: { timestamp: "asc" },
    });
    lineChart = groupClicksByDate(clicks);
  }

  return { barChart, lineChart };
};
