
// type GroupItemsData = GroupItemData [];

import { GroupItem } from './group-item';

export interface GroupItemData {
	description?: string;
	link?: string;
	items?: GroupItemData;
	 push (item: GroupItem): number;
}