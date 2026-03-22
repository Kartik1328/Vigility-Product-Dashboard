import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const trackEvent = async ({ userId, feature_name }) => {
  const click = await prisma.featureClick.create({
    data: {
      userId,
      featureName: feature_name,
      timestamp: new Date(),
    },
  });

  return { id: click.id };
};
