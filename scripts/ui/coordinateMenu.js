import { ModalFormData } from "@minecraft/server-ui";

import {
    generateRandomSeed,
    parseSeed,
    MIN_SEED,
    MAX_SEED
} from "../util/seedGenerator.js";

import { spawnChest } from "../chest/spawnChest.js";

export async function showCoordinateMenu(player) {

    const form = new ModalFormData()
        .title("Spawn Loot Chest")
        .textField("X Coordinate", "0")
        .textField("Y Coordinate", "64")
        .textField("Z Coordinate", "0")
        .toggle("Random Seed", true)
        .textField(`Specific Seed\n(${MIN_SEED} to ${MAX_SEED})`, "Enter seed...")
        .slider("Loot Amount", 3, 9, 1, 5);

    const response = await form.show(player);

    if (response.canceled) return;

    const x = Number(response.formValues[0]);
    const y = Number(response.formValues[1]);
    const z = Number(response.formValues[2]);

    const randomSeed = response.formValues[3];
    const seedInput = response.formValues[4];
    const lootAmount = response.formValues[5];

    if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) {
        player.sendMessage("§cInvalid coordinates.");
        return;
    }

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

    player.sendMessage(`§aCoordinates: ${x}, ${y}, ${z}`);
    player.sendMessage(`§gSeed: ${seed}`);
    player.sendMessage(`§aLoot Amount: ${lootAmount}`);

    spawnChest(
        player,
        { x, y, z },
        seed,
        lootAmount
    );
}