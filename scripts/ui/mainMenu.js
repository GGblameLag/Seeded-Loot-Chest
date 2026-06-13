import { ActionFormData } from "@minecraft/server-ui";
import { showCurrentPositionMenu } from "./currentPositionMenu.js";
import { showCoordinateMenu } from "./coordinateMenu.js";

export async function showMainMenu(player) {

    const form = new ActionFormData()
        .title("Loot Chest Generator")
        .body("Generate procedurally-generated loot chests using a random or specified seed.")
        .button("Spawn Chest at Current Position")
        .button("Spawn Chest at Specific Position")
        .button("Close");

    const result = await form.show(player);

    if (result.canceled) return;

    switch (result.selection) {
        case 0:
            await showCurrentPositionMenu(player);
            break;

        case 1:
            await showCoordinateMenu(player);
            break;

        default:
            return;
    }
}