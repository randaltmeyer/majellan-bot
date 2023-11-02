import { Stage } from "../../types.mjs";
import { RawStage } from "./RawStage.mjs";

export function convertStage(raw: RawStage): Stage {
	const {
		id,
		stage_display_name,
		stage_area_name,
		stage_area_group_name,
		stage_sub_display_name,
		stage_area_id,
		stage_recommended_cp,
		stage_stamina_cost,
		stage_talent_point_gain,
		stage_banner_path,
		stage_drops
	} = raw;
	const drops = stage_drops.map(drop => {
		const loot = drop.loot_group.loot.map(loot => ({ name:loot.display_name, quantity:loot.quantity }));
		return loot.map(({ name, quantity }) => {
			const dropPercent = drop.drop_percent;
			return { name, dropPercent, quantity };
		});
	}).flat();
	return {
		id,
		stage_display_name,
		stage_area_name,
		stage_area_group_name,
		stage_sub_display_name,
		stage_area_id,
		stage_recommended_cp,
		stage_stamina_cost,
		stage_talent_point_gain,
		stage_banner_path,
		drops
	};
}