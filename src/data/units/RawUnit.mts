export interface Rank_up_item {
	item_name: string;
	item_icon: string;
	quantity: number;
}

export interface Stats_increase {
	hp: number;
	mp: number;
	attack: number;
	defense: number;
	intelligence: number;
	agility: number;
}

export interface Rank_up_table {
	rank_number: number;
	rank_level_cap: number;
	rank_gold_cost: number;
	rank_up_items: Rank_up_item[];
	stats_increase: Stats_increase;
}

export interface Element_resistance {
	[index: number]: resistance;
}

export interface resistance {
	name: string;
	icon: string;
	rate: string;
	rate_icon: string;
}

export interface Abnormity_resistance {
	[index: number]: resistance;
}

export interface Stats_by_level {
	level: number;
	hp: number;
	mp: number;
	attack: number;
	defense: number;
	intelligence: number;
	agility: number;
}

export interface Skill_enhancement {
	enhancement_level: number;
	enhancement_max_accumulation: number;
	enhancement_required_mp_reduction: number;
	enhancement_damage_increase_multiplier: number;
	enhancement_damage_increase_static_addition: number;
	enhancement_healing_increase_multiplier: number;
	enhancement_healing_increase_static_addition: number;
	enhancement_mp_damage_increase_multiplier: number;
	enhancement_mp_damage_increase_static_addition: number;
	enhancement_mp_healing_increase_multiplier: number;
	enhancement_mp_healing_increase_static_addition: number;
	enhancement_accuracy_increase: number;
	enhancement_abnormity_accuracy_increase: number;
	enhancement_status_change_accuracy_increase: number;
	enhancement_abnormity_duration_increase: number;
	enhancement_status_change_duration_increase: number;
}

export interface Active_skill {
	id: string;
	level_learned: number;
	skill_name: string;
	skill_description: string;
	skill_button_icon: string;
	skill_rank: string;
	skill_rank_icon: string;
	skill_range_icon: string;
	skill_reach: string;
	skill_element: string;
	skill_element_icon: string;
	skill_ignore_reflect: number;
	skill_ignore_death_endurance: number;
	skill_surehit: number;
	skill_ignore_spell_invalid: number;
	skill_threshold_of_intelligence: number;
	skill_threshold_of_attack: number;
	skill_mp_cost: number;
	skill_is_swap_skill: number;
	skill_multiplier: string;
	skill_is_special: number;
	skill_times_available: string;
	skill_turns_needed: string;
	skill_num_attacks: string;
	skill_is_random_target: string;
	skill_base_damage: string;
	skill_min_damage: string;
	skill_max_damage: string;
	skill_action_type: string;
	skill_type: string;
	skill_target_type: string;
	skill_damage_calculation_type: string;
	skill_ignores_damage_reduction: number;
	skill_status_effect_parameter_name: string;
	skill_wave_immune: number;
	skill_enhancements: Skill_enhancement[];
	type_of_skill: string;
}

export interface Passive_skill {
	id: string;
	level_learned: number;
	skill_name: string;
	skill_description: string;
	skill_is_invisible: number;
	skill_is_pve_only: number;
	skill_icon?: any;
	ally_skill_icon?: any;
	enemy_skill_icon?: any;
	type_of_skill: string;
}

export interface Awakening_passive_skill {
	id: string;
	level_learned: string;
	skill_name: string;
	skill_description: string;
	skill_is_invisible: number;
	skill_is_pve_only: number;
	skill_icon?: any;
	ally_skill_icon?: any;
	enemy_skill_icon?: any;
	type_of_skill: string;
	awakening_level: string;
}

export interface RawUnit {
	id: string;
	display_name: string;
	flavor_text?: any;
	weight: string;
	move: number;
	unit_rank: string;
	unit_rank_icon: string;
	allow_nicknaming: boolean;
	almanac_visible: boolean;
	almanac_number: number;
	max_cp: number;
	is_quest_reward: boolean;
	is_gacha_unit: boolean;
	rank_up_table: Rank_up_table[];
	element_resistances: Element_resistance;
	abnormity_resistances: Abnormity_resistance;
	stats_by_level: Stats_by_level[];
	family: string;
	family_icon: string;
	small_family_icon: string;
	role: string;
	role_icon: string;
	unit_icon: string;
	transformed_unit_icon?: any;
	active_skills: Active_skill[];
	passive_skills: Passive_skill[];
	awakening_passive_skills: Awakening_passive_skill[];
	reaction_passive_skills: any[];
	awakening_reaction_passive_skills: any[];
	has_battleroad: boolean;
	has_blossom: boolean;
	has_character_builder: boolean;
	blossoms: any[];
	character_builder_blossoms: any[];
}