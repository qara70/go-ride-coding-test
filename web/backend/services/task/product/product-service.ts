import prisma, { tryCatch } from "../../../prisma/database/client";
import { TASK_TITLE_UPDATE_STATUS } from "../../../utils/constants/tasks";

interface CronTitleUpdate {
  shop: string;
  status: string;
  lastRun: Date;
}

export const getUpdateTitleTaskStatus = async (
  shop: string
): Promise<CronTitleUpdate> => {
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

  return data
    ? data
    : {
        shop: "",
        status: TASK_TITLE_UPDATE_STATUS.STOPPED,
        lastRun: new Date(),
      };
};
