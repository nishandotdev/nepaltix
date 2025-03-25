
import { NotificationType } from "@/types";
import { addNotification as createNotification } from "./notifications";

/**
 * Add notification for a user (compatibility layer for dbService)
 */
export const addNotification = async (
  title: string,
  message: string,
  type: NotificationType,
  userId: string
): Promise<boolean> => {
  return createNotification(title, message, type, userId);
};
