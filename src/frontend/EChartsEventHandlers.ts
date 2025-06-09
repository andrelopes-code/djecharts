import { EchartsContainer } from "./EChartsContainer";
import { EChartsManager } from "./EChartsManager";
import * as consts from "./constants";
import { debounce } from "./utils";

export class EChartsEventHandlers {
    static setupResizeHandler() {
        window.addEventListener(
            "resize",
            debounce(() => {
                EChartsManager.resizeCharts();
            }, consts.RESIZE_DEBOUCE_WAIT)
        );
    }

    static addEventListenerForFilterForms() {
        const filterForms = document.querySelectorAll<HTMLFormElement>(consts.ECHART_FILTER_FORM_SELECTOR);

        if (filterForms) {
            filterForms.forEach((filterForm) => {
                filterForm.addEventListener("submit", this.handleFormSubmit);
            });
        }
    }

    static async handleFormSubmit(event: SubmitEvent) {
        event.preventDefault();

        const form = event.target;

        if (!(form instanceof HTMLFormElement)) {
            console.error("Form submission event target is not an HTMLFormElement.", event.target);
            return;
        }

        const formId = form.dataset.id;

        if (!formId) {
            console.error("Form ID not found in form dataset.", form);
            return;
        }

        const formSelector = `form[data-id="${CSS.escape(formId)}"]`;
        const connectedForms = document.querySelectorAll(formSelector);
        const formData = new FormData(form);

        form.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((checkbox) => {
            if (!formData.has(checkbox.name)) {
                // if the checkbox is unchecked, add it
                // to the FormData object as an empty string.
                formData.append(checkbox.name, '');
            }
        });

        connectedForms.forEach((connectedForm) => {
            // skip the form that triggered the event.
            if (connectedForm === form) return;

            formData.forEach((value: any, key: string) => {
                const match = key.match(/-(\w+)$/);

                if (match) {
                    const keyWithoutPrefix = match[1];
                    const sameFieldSelector = `[name$="${CSS.escape(keyWithoutPrefix)}"]`;
                    const field = connectedForm.querySelector<HTMLInputElement>(sameFieldSelector);

                    if (field) {
                        if (field.type === "checkbox") {
                            field.checked = value === "" ? false : true;
                        } else {
                            field.value = value;
                        }
                    }
                }
            });
        });

        const containerSelector = `${consts.ECHART_CARD_SELECTOR}:has(form[data-id=${formId}])  ${consts.ECHART_CONTAINER_SELECTOR}`;
        const containers = EchartsContainer.from(document.querySelectorAll<HTMLElement>(containerSelector));
        const params = new URLSearchParams();

        formData.forEach((value: any, key: string) => {
            params.append(key, value);
        });

        for (const container of containers) {
            EChartsManager.initOrUpdateChartInstance(container, params.toString());
        }

        EChartsManager.connectChartInstances();
    }
}
