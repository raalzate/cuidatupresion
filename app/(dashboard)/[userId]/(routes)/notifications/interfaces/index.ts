export interface NotificationPayload {
  title: string;
  type: string;
  startDate: Date;
  additionalNotes: string;
  repeatInterval: number;
}
