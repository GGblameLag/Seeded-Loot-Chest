import { SeededRandom } from "../util/seededRandom.js";
import { LOOT_TABLE } from "./lootTable.js";
import { selectRarity } from "./selectRarity.js";
import { generateItem } from "./generateItem.js";

export function generateLoot(seed, amount) {
    const rng = new SeededRandom(seed);
    const loot = [];

    for (let i = 0; i < amount; i++) {
        const rarity = selectRarity(rng);

        // Extract the plain rarity name from the colored string (e.g., "§eCommon§r" -> "Common")
        const rarityName = rarity.name
            .replace(/§[a-z0-9]/g, "")
            .replace(/§r/g, "")
            .trim();

        const candidates = LOOT_TABLE.filter(
            item => item.rarity === rarityName
        );

        if (candidates.length === 0) {
            console.warn(`[LootChest] No candidates found for rarity: ${rarityName}`);
            continue;
        }

        const itemData = candidates[
            rng.nextInt(
                0,
                candidates.length - 1
            )
        ];

        loot.push(
            generateItem(
                itemData,
                rng,
                seed
            )
        );
    }

    return loot;
}
