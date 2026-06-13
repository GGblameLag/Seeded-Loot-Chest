import { ModalFormData } from "@minecraft/server-ui";

import {
    generateRandomSeed,
    parseSeed,
    MIN_SEED,
    MAX_SEED
} from "../util/seedGenerator.js";

import { spawnChest } from "../chest/spawnChest.js";

export async function showCurrentPositionMenu(player) {

    const form = new ModalFormData()
        .title("Spawn Loot Chest")
        .toggle("Random Seed", { default: true })
        .textField(`Specific Seed\n(${MIN_SEED} to ${MAX_SEED})`, "Enter seed...")
        .slider("Loot Amount", 3, 9, 1);

    const response = await form.show(player);

    if (response.canceled) return;

    const randomSeed = response.formValues[0];
    const seedInput = response.formValues[1];
    const lootAmount = response.formValues[2];

    let seed;

    if (randomSeed) {
        seed = generateRandomSeed();
    } else {
        seed = parseSeed(seedInput);

        if (seed === null) {
            player.sendMessage("§cInvalid seed.");
            return;
        }
    }

    player.sendMessage(`§aSeed Selected: ${seed}`);
    player.sendMessage(`§aLoot Amount: ${lootAmount}`);

    spawnChest(
        player,
        player.location,
        seed,
        lootAmount
    );
}