import { EChartsOption } from "echarts";

export function getThemeOptions(): EChartsOption {
    const rootStyle = getComputedStyle(document.documentElement);

    const backgroundColor = rootStyle.getPropertyValue("--echarts-background").trim();
    const textColor = rootStyle.getPropertyValue("--echarts-text-color").trim();
    const textBorderColor = rootStyle.getPropertyValue("--echarts-text-border-color").trim();
    const legendInactiveColor = rootStyle.getPropertyValue("--echarts-legend-inactive-color").trim();
    const inactiveColor = rootStyle.getPropertyValue("--echarts-inactive-color").trim();
    const borderColor = rootStyle.getPropertyValue("--echarts-border-color").trim();
    const tooltipLineColor = rootStyle.getPropertyValue("--echarts-tooltip-line-color").trim();
    const tooltipBorderColor = rootStyle.getPropertyValue("--echarts-tooltip-border-color").trim();
    const tooltipShadowColor = rootStyle.getPropertyValue("--echarts-tooltip-shadow-color").trim();
    const tooltipBackgroundColor = rootStyle.getPropertyValue("--echarts-tooltip-background-color").trim();

    const tooltipLabelBackgroundColor = rootStyle
        .getPropertyValue("--echarts-tooltip-label-background-color")
        .trim();

    const textBorderWidth = 3;

    return {
        backgroundColor: backgroundColor,
        series: {
            label: {
                color: textColor,
                textBorderColor: textBorderColor,
                textBorderWidth: textBorderWidth,
            },
        },
        legend: {
            textStyle: { color: textColor },
            inactiveColor: legendInactiveColor,
            inactiveBorderColor: legendInactiveColor,
        },
        textStyle: { color: textColor },
        toolbox: {
            iconStyle: {
                borderColor: borderColor,
            },
        },
        yAxis: {
            axisLine: {
                lineStyle: { color: borderColor },
            },
            axisTick: {
                lineStyle: { color: borderColor },
            },
            splitLine: {
                lineStyle: { color: inactiveColor },
            },
        },
        xAxis: {
            axisLine: {
                lineStyle: { color: borderColor },
            },
            axisTick: {
                lineStyle: { color: borderColor },
            },
            splitLine: {
                lineStyle: { color: inactiveColor },
            },
        },
        axisPointer: {
            lineStyle: { color: tooltipLineColor },
            shadowStyle: { color: tooltipShadowColor },
            label: { backgroundColor: tooltipLabelBackgroundColor },
        },
        tooltip: {
            axisPointer: {
                lineStyle: { color: tooltipLineColor },
                crossStyle: { color: tooltipLineColor },
                shadowStyle: { color: tooltipShadowColor },
                label: { backgroundColor: tooltipLabelBackgroundColor },
            },
            backgroundColor: tooltipBackgroundColor,
            borderColor: tooltipBorderColor,
            textStyle: { color: textColor },
        },
    };
}
