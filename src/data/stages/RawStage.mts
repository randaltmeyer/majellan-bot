export interface Monster {
	id: string;
	enemy_display_name: string;
	enemy_level: number;
	enemy_hp: number;
	enemy_mp: number;
	enemy_attack: number;
	enemy_defense: number;
	enemy_intelligence: number;
	enemy_agility: number;
	enemy_mobility: number;
	enemy_weight: number;
	enemy_is_unique_monster: number;
	enemy_is_strong_enemy: number;
	enemy_scout_probability: number;
	enemy_is_rare_scout: number;
	enemy_flavor_text?: any;
	enemy_family: string;
	enemy_family_icon: string;
	enemy_role: string;
	enemy_role_icon: string;
	enemy_unit_icon: string;
	enemy_transformed_unit_icon?: any;
	enemy_drops: any[];
}

export interface Stage_enemy {
	is_one_time_enemy: number;
	monster: Monster;
}

export interface Monster {
	id: string;
	enemy_display_name: string;
	enemy_level: number;
	enemy_hp: number;
	enemy_mp: number;
	enemy_attack: number;
	enemy_defense: number;
	enemy_intelligence: number;
	enemy_agility: number;
	enemy_mobility: number;
	enemy_weight: number;
	enemy_is_unique_monster: number;
	enemy_is_strong_enemy: number;
	enemy_scout_probability: number;
	enemy_is_rare_scout: number;
	enemy_flavor_text?: any;
	enemy_family: string;
	enemy_family_icon: string;
	enemy_role: string;
	enemy_role_icon: string;
	enemy_unit_icon: string;
	enemy_transformed_unit_icon?: any;
	enemy_drops: any[];
}

export interface Stage_reinforcement_enemy {
	is_one_time_enemy: number;
	monster: Monster;
}

export interface Stage_formatted_loot_group {}

export interface RawStage {
	id: string;
	stage_display_name: string;
	stage_area_name: string;
	stage_area_group_name: string;
	stage_sub_display_name?: any;
	stage_area_id: string;
	stage_list_order: number;
	stage_difficulty: number;
	stage_recommended_cp: number;
	stage_stamina_cost: number;
	stage_talent_point_gain: number;
	stage_is_boss_stage: boolean;
	stage_is_story_stage: boolean;
	stage_is_auto_only: boolean;
	stage_is_limited_total_weight: boolean;
	stage_limited_total_weight: number;
	stage_is_organization_limit_num: boolean;
	stage_organization_limit_num: number;
	stage_is_send_feed_when_first_cleared: boolean;
	stage_enable_score_challenge: boolean;
	stage_banner_path: string;
	stage_drops: Stage_drop[];
	stage_missions: any[];
	stage_enemies: Stage_enemy[];
	stage_random_enemies: any[];
	stage_reinforcement_enemies: Stage_reinforcement_enemy[];
	stage_formatted_loot_groups: Stage_formatted_loot_group;
}





export interface Loot {
	quantity: number;
	loot_type: string;
	display_name: string;
	icon: string;
	path: string;
}

export interface Loot_group {
	id: string;
	loot: Loot[];
}

export interface Stage_drop {
	loot_group: Loot_group;
	drop_percent: number;
	first_clear_only: boolean;
	clear_count?: any;
	group_number: number;
}