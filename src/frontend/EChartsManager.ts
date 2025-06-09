import { getThemeOptions } from "./theme";
import { reviveObject } from "./utils";
import { EChartsType } from "echarts";
import * as echarts from "echarts";
import * as consts from "./constants";
import { EchartsContainer, EchartsContainer as EChartsContainer } from "./EChartsContainer";

export const EChartsManager = {
    // registry of chart
    // instances: { id: instance }.
    registry: new Map<string, EChartsType>(), // chartid -> chart instance
    // map of groups of chart ids
    // that should be connected
    // with echarts.connect().
    conectionGroups: new Map<string, Set<string>>(), // group -> ids

    register(chart_container: EChartsContainer, chart_instance: EChartsType) {
        const id = chart_container.getId();

        if (id) {
            this.registry.set(id, chart_instance);
        } else {
            console.error("unable to register chart: container id not found");
        }
    },

    unregister(chart_container: EChartsContainer) {
        const id = chart_container.getId();

        if (id) {
            this.registry.delete(id);
        } else {
            console.error("unable to unregister chart: container id not found");
        }
    },

    resizeCharts() {
        // loop through all registered charts calling chart.resize()
        // to redraw and update the chart size according to the container.
        this.getRegisteredChartInstances().forEach((chart) => chart.resize());
    },

    getRegisteredChartInstances() {
        return Array.from(this.registry.values());
    },

    getChartContainers() {
        return EchartsContainer.from(
            document.querySelectorAll<HTMLElement>(consts.ECHART_CONTAINER_SELECTOR)
        );
    },

    reloadChartInstancesTheme() {
        this.getRegisteredChartInstances().forEach((chart) => {
            chart.setOption(getThemeOptions());
        });
    },

    async connectChartInstances() {
        // loop through all groups of chart ids
        // and connect them with echarts.connect().
        Array.from(this.conectionGroups.values()).forEach((ids) => {
            const chartsToConnect: EChartsType[] = [];

            ids.forEach((id: string) => {
                const chart = this.registry.get(id);

                if (chart) {
                    chartsToConnect.push(chart);
                }
            });

            if (chartsToConnect.length > 1) {
                echarts.connect(chartsToConnect);
            }
        });
    },

    async loadChartContainers() {
        const loadPromises: Promise<void>[] = [];

        EChartsManager.getChartContainers().forEach((chart_container) => {
            loadPromises.push(
                EChartsManager.initOrUpdateChartInstance(chart_container).catch((err) =>
                    console.error("Error during bulk init/update for a chart:", err)
                )
            );
        });

        await Promise.all(loadPromises);
    },

    async initOrUpdateChartInstance(chart_container: EChartsContainer, params: string = "") {
        const chartContainerId = chart_container.getId();
        const chartContainerUrl = chart_container.getUrl();
        const chartContainerGroup = chart_container.getGroup();
        const chartContainerInitialParams = chart_container.getInitialParams();

        if (!chartContainerId || !chartContainerUrl) {
            throw new Error("Chart ID or URL not found");
        }

        if (chartContainerGroup) {
            if (!this.conectionGroups.has(chartContainerGroup)) {
                this.conectionGroups.set(chartContainerGroup, new Set());
            }

            // add chart id to the group map that will be used
            // later to connect the group chart instances.
            this.conectionGroups.get(chartContainerGroup)?.add(chartContainerId);
        }

        if (!chartContainerUrl) {
            throw new Error("Chart URL not found");
        }

        try {
            const queryString = params || chartContainerInitialParams;
            const fullUrl = `${chartContainerUrl}?${queryString}`;

            chart_container.showLoading();

            const response = await fetch(fullUrl);
            const chart_data = await response.json();

            chart_container.hideLoading();

            // if the server returns
            // an error,
            if (!response.ok) {
                if (chart_data.html) {
                    this.unregister(chart_container);
                    chart_container.disposeChart();
                    chart_container.setHtmlContent(chart_data.html || `<p>${chart_data.message}</p>`);
                    return;
                }

                throw new Error(chart_data.message || "Failed to fetch chart data");
            }

            if (chart_data.html) {
                chart_container.setHtmlContent(chart_data.html);
                return;
            }

            const chart_instance = echarts.init(chart_container.getElement(), consts.DEFAULT_THEME);
            const chartOption = reviveObject(chart_data.option);

            chart_instance.setOption(chartOption, { notMerge: true });
            chart_instance.setOption(getThemeOptions());

            chart_container.updateTitle(chart_data.title);
            this.register(chart_container, chart_instance);

            // resize the chart to fit
            // the container size.
            chart_instance.resize();
        } catch (error: any) {
            console.error("Error initializing or updating chart:", { error, chart_container });
        }
    },
};
