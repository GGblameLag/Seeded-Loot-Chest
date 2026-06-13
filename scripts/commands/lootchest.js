import { world, system } from "@minecraft/server";
import { showMainMenu } from "../ui/mainMenu.js";

function isAdmin(player) {
    return player.hasTag("admin");
}

function handleScriptEvent(event) {
console.warn(`[LootChest] Script Event Received: ${event.id}`);

if (event.id !== "lootchest:open") return;

console.warn("[LootChest] Correct event ID received.");

console.warn(`[LootChest] sourceEntity: ${event.sourceEntity ? event.sourceEntity.typeId : "undefined"}`);

const player = event.sourceEntity;

if (!player) {
    console.warn("[LootChest] No source entity.");
    return;
}

console.warn(`[LootChest] Triggered by ${player.name}`);

if (!isAdmin(player)) {
    player.sendMessage("§cYou do not have permission to use this command.");
    return;
}

try {
    showMainMenu(player);
    console.warn("[LootChest] Menu opened.");
} catch (error) {
    console.error("[LootChest] Menu error:", error);
    player.sendMessage("§cFailed to open Loot Chest menu.");
}

}

// Diagnostics
console.warn(`[LootChest] world.afterEvents = ${!!world.afterEvents}`);
console.warn(`[LootChest] system.afterEvents = ${!!system.afterEvents}`);
console.warn(
    `[LootChest] system.afterEvents.scriptEventReceive = ${!!system.afterEvents?.scriptEventReceive}`
);

// Script Event registration
if (system.afterEvents?.scriptEventReceive) {
    system.afterEvents.scriptEventReceive.subscribe(handleScriptEvent);
    console.warn("[LootChest] ScriptEvent command registered.");
} else {
    console.warn("[LootChest] ScriptEvent API not available.");
}