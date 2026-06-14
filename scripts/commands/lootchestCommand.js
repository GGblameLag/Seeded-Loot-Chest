import { system, CommandPermissionLevel, CustomCommandStatus, Player } from "@minecraft/server";
import { spawnChest } from "../chest/spawnChest.js";
import { generateRandomSeed } from "../util/seedGenerator.js";
import { showMainMenu } from "../ui/mainMenu.js";

export function registerLootChestCommand() {
    system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
        
        // /lootchest:spawn - spawn at current location with random seed, 9 items
        customCommandRegistry.registerCommand({
            name: "lootchest:spawn",
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

        // /lootchest:menu - open the UI menu
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
