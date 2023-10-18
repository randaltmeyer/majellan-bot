export interface Area {
	id: string;
	area_display_name: string;
	area_sub_display_name: string;

	area_group: string;
	area_group_name: string;

	/** cat 4 is battle road */
	area_category: number;

	/** units usable in battle road */
	area_available_monsters: {
		monster_name: string;
		/** unit id */
		monster_path: string;
		monster_icon: string;
		is_required: 1 | 0;
	}[];
}
