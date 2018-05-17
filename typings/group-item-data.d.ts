
import { GroupItem } from './group-item';

export interface GroupItemData {
	[key: string]: GroupItemData | string | undefined | GroupItemData [];
	description?: string;
	link?: string;
	items?: GroupItemData [];
}
