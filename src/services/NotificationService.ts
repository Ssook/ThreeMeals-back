import { Service } from 'typedi';
import { Notification } from '../entities/Notification';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Account } from '../entities/Account';
import { NotiType } from '../entities/Enums';

@Service()
export class NotificationService {
    constructor(@InjectRepository() private readonly notificationRepository: NotificationRepository) {}

    async getNotificationsByUser(account: Account): Promise<Notification[]> {
        const notifications = await this.notificationRepository.getNotifications(account);
        this.readAllNotifications(account);
        return notifications;
    }

    async createNotification(args: {
        relatedPostId: string;
        accountId: string;
        otherAccountId: string;
        notiType: NotiType;
    }): Promise<void> {
        const newNoti = new Notification();
        newNoti.accountId = args.accountId;
        newNoti.otherAccountId = args.otherAccountId;
        newNoti.relatedPostId = args.relatedPostId;
        newNoti.notificationType = args.notiType;

        await this.notificationRepository.saveNotification(newNoti);
    }

    async readAllNotifications(account: Account): Promise<void> {
        await this.notificationRepository.updateReadAll(account.id);
    }
}
