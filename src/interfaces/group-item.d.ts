
import { GroupItemData } from './group-item-data';

type GroupItem2 = { [key: string]: GroupItemData } | GroupItemData;

export interface GroupItem {
	[key: string]: GroupItemData	
}