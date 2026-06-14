import { world } from "@minecraft/server";
import { spawnChest } from "../loot/generateLoot.js";
import { generateRandomSeed, parseSeed, MIN_SEED, MAX_SEED } from "../util/seedGenerator.js";

export function registerLootChestCommand() {
    world.beforeEvents.chatSend.subscribe((event) => {
        const message = event.message.trim();
        
        if (!message.startsWith("/lootchest")) {
            return;
        }

        const player = event.sender;
        const parts = message.split(/\s+/);
        const command = parts[0];
        const subcommand = parts[1];

        // /lootchest
        if (!subcommand) {
            const seed = generateRandomSeed();
            spawnChest(player, player.location, seed, 9);
            player.sendMessage(`§aLoot chest spawned at your location with seed ${seed} and 9 items.`);
            event.cancel = true;
            return;
        }

        // /lootchest here [seed] [amount]
        if (subcommand === "here") {
            const seedArg = parts[2];
            const amountArg = parts[3];

            let seed;
            if (seedArg !== undefined) {
                seed = parseSeed(seedArg);
                if (seed === null) {
                    player.sendMessage(`§cInvalid seed. Please enter a number between ${MIN_SEED} and ${MAX_SEED}.`);
                    event.cancel = true;
                    return;
                }
            } else {
                seed = generateRandomSeed();
            }

            let amount = 9;
            if (amountArg !== undefined) {
                amount = Number(amountArg);
                if (Number.isNaN(amount) || amount < 1 || amount > 64) {
                    player.sendMessage("§cInvalid amount. Please enter a number between 1 and 64.");
                    event.cancel = true;
                    return;
                }
            }

            spawnChest(player, player.location, seed, amount);
            player.sendMessage(`§aLoot chest spawned at your location with seed ${seed} and ${amount} items.`);
            event.cancel = true;
            return;
        }

        // /lootchest at <x> <y> <z> [seed] [amount]
        if (subcommand === "at") {
            const xArg = parts[2];
            const yArg = parts[3];
            const zArg = parts[4];
            const seedArg = parts[5];
            const amountArg = parts[6];

            if (xArg === undefined || yArg === undefined || zArg === undefined) {
                player.sendMessage("§cUsage: /lootchest at <x> <y> <z> [seed] [amount]");
                event.cancel = true;
                return;
            }

            const x = Number(xArg);
            const y = Number(yArg);
            const z = Number(zArg);

            if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) {
                player.sendMessage("§cInvalid coordinates. Please enter valid numbers.");
                event.cancel = true;
                return;
            }

            let seed;
            if (seedArg !== undefined) {
                seed = parseSeed(seedArg);
                if (seed === null) {
                    player.sendMessage(`§cInvalid seed. Please enter a number between ${MIN_SEED} and ${MAX_SEED}.`);
                    event.cancel = true;
                    return;
                }
            } else {
                seed = generateRandomSeed();
            }

            let amount = 9;
            if (amountArg !== undefined) {
                amount = Number(amountArg);
                if (Number.isNaN(amount) || amount < 1 || amount > 64) {
                    player.sendMessage("§cInvalid amount. Please enter a number between 1 and 64.");
                    event.cancel = true;
                    return;
                }
            }

            spawnChest(player, { x, y, z }, seed, amount);
            player.sendMessage(`§aLoot chest spawned at ${x}, ${y}, ${z} with seed ${seed} and ${amount} items.`);
            event.cancel = true;
            return;
        }

        // /lootchest menu
        if (subcommand === "menu") {
            const { showMainMenu } = await import("../ui/mainMenu.js");
            showMainMenu(player);
            event.cancel = true;
            return;
        }

        // Unknown subcommand
        player.sendMessage("§cUnknown subcommand. Usage: /lootchest [here|at|menu] [arguments]");
        event.cancel = true;
    });
}
