import { system, CommandPermissionLevel, CustomCommandStatus, Player, CustomCommandParamType } from "@minecraft/server";
import { spawnChest } from "../chest/spawnChest.js";
import { generateRandomSeed, parseSeed, MIN_SEED, MAX_SEED } from "../util/seedGenerator.js";
import { showMainMenu } from "../ui/mainMenu.js";

export function registerLootChestCommand() {
    system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
        
        // /lootchest - spawn at current location with random seed, 9 items
        customCommandRegistry.registerCommand({
            name: "lootchest",
            description: "Spawn a loot chest at your current location",
            permissionLevel: CommandPermissionLevel.Any
        }, (origin) => {
            if (!(origin.sourceEntity instanceof Player)) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "This command can only be run by a player."
                };
            }

            const player = origin.sourceEntity;
            const seed = generateRandomSeed();
            
            system.run(() => {
                spawnChest(player, player.location, seed, 9);
            });

            return {
                status: CustomCommandStatus.Success,
                message: `Loot chest spawned with seed ${seed} and 9 items.`
            };
        });

        // /lootchest here [seed] [amount]
        customCommandRegistry.registerCommand({
            name: "lootchest:here",
            description: "Spawn a loot chest at your current location with optional seed and amount",
            permissionLevel: CommandPermissionLevel.Any,
            parameters: [
                { name: "seed", type: CustomCommandParamType.String, optional: true },
                { name: "amount", type: CustomCommandParamType.Integer, optional: true }
            ]
        }, (origin, seedArg, amountArg) => {
            if (!(origin.sourceEntity instanceof Player)) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "This command can only be run by a player."
                };
            }

            const player = origin.sourceEntity;

            // Parse seed
            let seed;
            if (seedArg !== undefined && seedArg !== "") {
                seed = parseSeed(seedArg);
                if (seed === null) {
                    return {
                        status: CustomCommandStatus.Failure,
                        message: `§cInvalid seed. Please enter a number between ${MIN_SEED} and ${MAX_SEED}.`
                    };
                }
            } else {
                seed = generateRandomSeed();
            }

            // Parse amount
            let amount = 9;
            if (amountArg !== undefined) {
                if (amountArg < 3 || amountArg > 9) {
                    return {
                        status: CustomCommandStatus.Failure,
                        message: "§cInvalid amount. Please enter a number between 3 and 9."
                    };
                }
                amount = amountArg;
            }

            system.run(() => {
                spawnChest(player, player.location, seed, amount);
            });

            return {
                status: CustomCommandStatus.Success,
                message: `Loot chest spawned with seed ${seed} and ${amount} items.`
            };
        });

        // /lootchest at <x> <y> <z> [seed] [amount]
        customCommandRegistry.registerCommand({
            name: "lootchest:at",
            description: "Spawn a loot chest at specific coordinates with optional seed and amount",
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [
                { name: "x", type: CustomCommandParamType.Integer },
                { name: "y", type: CustomCommandParamType.Integer },
                { name: "z", type: CustomCommandParamType.Integer }
            ],
            parameters: [
                { name: "seed", type: CustomCommandParamType.String, optional: true },
                { name: "amount", type: CustomCommandParamType.Integer, optional: true }
            ]
        }, (origin, x, y, z, seedArg, amountArg) => {
            if (!(origin.sourceEntity instanceof Player)) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "This command can only be run by a player."
                };
            }

            const player = origin.sourceEntity;

            // Parse seed
            let seed;
            if (seedArg !== undefined && seedArg !== "") {
                seed = parseSeed(seedArg);
                if (seed === null) {
                    return {
                        status: CustomCommandStatus.Failure,
                        message: `§cInvalid seed. Please enter a number between ${MIN_SEED} and ${MAX_SEED}.`
                    };
                }
            } else {
                seed = generateRandomSeed();
            }

            // Parse amount
            let amount = 9;
            if (amountArg !== undefined) {
                if (amountArg < 3 || amountArg > 9) {
                    return {
                        status: CustomCommandStatus.Failure,
                        message: "§cInvalid amount. Please enter a number between 3 and 9."
                    };
                }
                amount = amountArg;
            }

            system.run(() => {
                spawnChest(player, { x, y, z }, seed, amount);
            });

            return {
                status: CustomCommandStatus.Success,
                message: `Loot chest spawned at ${x}, ${y}, ${z} with seed ${seed} and ${amount} items.`
            };
        });

        // /lootchest menu - open the UI menu
        customCommandRegistry.registerCommand({
            name: "lootchest:menu",
            description: "Open the loot chest menu",
            permissionLevel: CommandPermissionLevel.Any
        }, (origin) => {
            if (!(origin.sourceEntity instanceof Player)) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "This command can only be run by a player."
                };
            }

            const player = origin.sourceEntity;
            
            system.run(() => {
                try {
                    showMainMenu(player);
                } catch (error) {
                    console.error("[LootChest] Menu error:", error);
                    player.sendMessage("§cFailed to open Loot Chest menu.");
                }
            });

            return {
                status: CustomCommandStatus.Success
            };
        });

        console.warn("[LootChest] Custom commands registered successfully.");
    });
}
