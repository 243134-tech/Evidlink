import { NotificationItem } from '../types';
import { initialNotifications } from '../data/mockData';

const STORAGE_KEY = 'evidlink_notifications';

class NotificationService {
  private getStore(): NotificationItem[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialNotifications));
      return initialNotifications;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialNotifications;
    }
  }

  private saveStore(items: NotificationItem[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  public getAll(): NotificationItem[] {
    return this.getStore();
  }

  public markAsRead(id: string): void {
    const store = this.getStore();
    const item = store.find(n => n.id === id);
    if (item) {
      item.isRead = true;
      this.saveStore(store);
    }
  }

  public markAllAsRead(): void {
    const store = this.getStore().map(n => ({ ...n, isRead: true }));
    this.saveStore(store);
  }

  public getUnreadCount(): number {
    return this.getStore().filter(n => !n.isRead).length;
  }

  public add(item: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>): NotificationItem {
    const store = this.getStore();
    const newItem: NotificationItem = {
      ...item,
      id: `NOTIF-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false
    };
    store.unshift(newItem);
    this.saveStore(store);
    return newItem;
  }
}

export const notificationService = new NotificationService();
