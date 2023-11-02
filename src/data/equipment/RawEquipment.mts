export interface Equipment_status_increase {
	hp: number;
	mp: number;
	attack: number;
	defence: number;
	intelligence: number;
	agility: number;
	mobility: number;
}

export interface Equipment_passive_skill {
	id: string;
	level_learned?: any;
	skill_name: string;
	skill_description: string;
	skill_is_invisible: number;
	skill_is_pve_only: number;
	skill_icon: string;
	ally_skill_icon?: any;
	enemy_skill_icon?: any;
	type_of_skill: string;
}

export interface Passive_skill {
	id: string;
	level_learned?: any;
	skill_name: string;
	skill_description: string;
	skill_is_invisible: number;
	skill_is_pve_only: number;
	skill_icon: string;
	ally_skill_icon?: any;
	enemy_skill_icon?: any;
	type_of_skill: string;
}

export interface Slot_1 {
	roll_probability: number;
	passive_skill: Passive_skill;
}

export interface Passive_skill {
	id: string;
	level_learned?: any;
	skill_name: string;
	skill_description: string;
	skill_is_invisible: number;
	skill_is_pve_only: number;
	skill_icon: string;
	ally_skill_icon?: any;
	enemy_skill_icon?: any;
	type_of_skill: string;
}

export interface Slot_2 {
	roll_probability: number;
	passive_skill: Passive_skill;
}

export interface Passive_skill {
	id: string;
	level_learned?: any;
	skill_name: string;
	skill_description: string;
	skill_is_invisible: number;
	skill_is_pve_only: number;
	skill_icon: string;
	ally_skill_icon?: any;
	enemy_skill_icon?: any;
	type_of_skill: string;
}

export interface Slot_3 {
	roll_probability: number;
	passive_skill: Passive_skill;
}

export interface Equipment_alchemy_slot {
	slot_1: Slot_1[];
	slot_2: Slot_2[];
	slot_3: Slot_3[];
}

export interface RawEquipment {
	id: string;
	equipment_display_name: string;
	equipment_description: string;
	equipment_icon: string;
	equipment_rank_icon: string;
	equipment_rank: string;
	equipment_alchemy_cost: string;
	equipment_type_icon: string;
	equipment_type: string;
	equipment_category_icon: string;
	equipment_category: string;
	equipment_is_free_alchemy: boolean;
	equipment_equipable_roles: any[];
	equipment_status_increase: Equipment_status_increase;
	equipment_passive_skill: Equipment_passive_skill;
	equipment_reaction_skill?: any;
	equipment_alchemy_slots: Equipment_alchemy_slot;
}