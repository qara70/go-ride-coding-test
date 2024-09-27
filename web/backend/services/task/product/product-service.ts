import prisma, { tryCatch } from "../../../prisma/database/client";

interface CronTitleUpdate {
  shop: string;
  status: string;
  lastRun: Date;
}

export const getUpdateTitleTaskStatus = async (
  shop: string
): Promise<CronTitleUpdate | null> => {
  const { error, data } = await tryCatch(async () => {
    return await prisma.cronTitleUpdate.findFirst({
      where: {
        shop,
      },
    });
  });
  if (error) {
    throw error;
  }

  return data;
};
