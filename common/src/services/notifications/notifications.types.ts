export interface Notification {
  title: string;
  content: React.ReactNode;
  color?: string;
  icon?: string;
}

export interface NotificationArgs {
  title: string;
  content: React.ReactNode;
}
