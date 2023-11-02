import { Shop } from "../../types.mjs";
import { debug } from "../../utils/logger.mjs";

function findShopGoods(unitName: string, shop: Shop) {
	if (unitName !== "Slime" && !shop.display_name.match(/^Awakening Material.*?Family$/)) {
		const crystalName = `${unitName} Crystal`;
		const goods = shop.shop_goods.find(goods => goods.goods_name === crystalName);
		if (goods) {
			// debug(`${unitName} + ${crystalName} > ${goods.shop_name} ${goods.goods_cost}`);
			return goods;
		}
	}
	return undefined;
}
/*
		"shop_goods": [
			{
				"shop_id": "-4392610842013836299",
				"shop_name": "DQ VIII Medal Swap Shop",
				"list_order": 0,
				"purchasable_count": 70,
				"quantity": 1,
				"goods_path": "6884966931682913118",
				"goods_cost": 1000,
				"goods_name": "Yangus Crystal",
				"goods_image": "static/dqt_images/assets/aiming/textures/gui/general/icon/monstericon/HeroIcon_0802_00_Yangasu.png",
				"goods_description": "A crystal for awakening Yangus.\nGrants 10 Awakening Points.",
				"goods_category": "item"
			},
*/

export function hasShopGoods(unitName: string, shops: Shop[]): boolean {
	return shops.find(shop => findShopGoods(unitName, shop)) !== undefined;
}


export function findAndFormatShopGoods(unitName: string, shops: Shop[]): string[] {
	const unitGoods = shops.map(shop => ({ shop, goods:findShopGoods(unitName, shop)! })).filter(shop => shop.goods);
	unitGoods.sort((a, b) => {
		if (a.goods.goods_cost !== b.goods.goods_cost) {
			return a.goods.goods_cost < b.goods.goods_cost ? -1 : 1;
		}
		return a.goods.shop_name < b.goods.shop_name ? -1 : 1;
	});
	
	const formattedShops = unitGoods.map(pair => {
		// if (!pair.shop.available_in_reminiscene) {
		// 	return `${pair.goods.shop_name} *(currently unavailable)*`;
		// }
		return pair.goods.shop_name;
	}).filter((s, i, a) => i === a.indexOf(s));
	if (formattedShops.length > 1) {
		debug({unitName,formattedShops});
	}
	return formattedShops;
}
