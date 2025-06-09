import { EChartsManager } from "./EChartsManager";
import { EChartsEventHandlers } from "./EChartsEventHandlers";

window.addEventListener("load", async () => {
    await EChartsManager.loadChartContainers();
    EChartsManager.connectChartInstances();

    EChartsEventHandlers.addEventListenerForFilterForms();
    EChartsEventHandlers.setupResizeHandler();
});

window.addEventListener("htmx:afterSwap", () => {
    EChartsManager.loadChartContainers();
});
