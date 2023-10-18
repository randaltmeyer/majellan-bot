export interface Unit {
	id: string;
	display_name: string;
	unit_icon: string;
	small_family_icon?: string;

	family: string;
	family_icon?: string;
	role: string;
	role_icon?: string;
	unit_rank: string;
	unit_rank_icon?: string;
	weight: string;

	has_blossom: boolean;
	has_character_builder: boolean;

	/** custom */
	notes: string;
	/** custom */
	farmQuests: string[];
	/** custom */
	battleRoads: string[];
	/** custom */
	items: string[];
}