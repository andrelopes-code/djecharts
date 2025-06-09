import * as consts from "./constants";
import * as echarts from "echarts";

export class EchartsContainer {
    private element: HTMLElement;
    private id: string | null;
    private group: string | null;
    private url: string | null;
    private initialParams: string;

    constructor(htmlElement: HTMLElement) {
        this.element = htmlElement;
        this.id = this.element.getAttribute("data-id");
        this.group = this.element.getAttribute("data-group");
        this.url = this.element.getAttribute("data-url");
        this.initialParams = this.element.getAttribute("data-initial-params") || "";
    }

    static from(htmlElements: NodeListOf<HTMLElement>) {
        return Array.from(htmlElements).map((el) => new EchartsContainer(el));
    }

    getId() {
        if (!this.id) {
            console.error("`data-id` attribute not found in chart container", this.element);
        }
        return this.id!;
    }

    getGroup() {
        // Group is optional,
        // so no error if not found.
        return this.group;
    }

    getUrl() {
        if (!this.url) {
            console.error("`data-url` attribute not found in chart container", this.element);
        }
        return this.url!;
    }

    getInitialParams() {
        // Initial params are optional,
        // but we provide a default in constructor.
        return this.initialParams;
    }

    getElement() {
        return this.element;
    }

    getCardElement() {
        const cardElement = this.element.closest(consts.ECHART_CARD_SELECTOR);

        if (!cardElement) {
            throw new Error("Chart card element not found within container.");
        }

        return cardElement;
    }

    setHtmlContent(htmlString: string) {
        this.element.innerHTML = htmlString;
    }

    showError(message: string) {
        this.setHtmlContent(`<p>Error loading chart: ${message}</p>`);
    }

    disposeChart() {
        try {
            echarts.dispose(this.element);
        } catch (e) {
            console.warn("Error disposing chart (it might not have been initialized):", e, this.element);
        }
    }

    updateTitle(titleText: string) {
        const cardElement = this.getCardElement();

        if (cardElement) {
            const titleElement = cardElement.querySelector(consts.ECHART_TITLE_SELECTOR);

            if (titleElement) {
                titleElement.textContent = titleText;
            } else {
                console.warn("Chart title element not found within card.", {
                    titleSelector: consts.ECHART_TITLE_SELECTOR,
                    cardElement,
                });
            }
        } else {
            console.warn("Chart card element not found.", {
                cardSelector: consts.ECHART_CARD_SELECTOR,
                element: this.element,
            });
        }
    }

    showLoading() {
        const cardElement = this.getCardElement();
        const loadingElem = cardElement.querySelector<HTMLElement>(consts.LOADING_COMPONENT_SELECTOR);

        if (loadingElem) {
            loadingElem.style.display = "flex";
        } else {
            console.warn("Chart loading element not found within card.", {
                loadingSelector: consts.LOADING_COMPONENT_SELECTOR,
                cardElement: this.getCardElement(),
            });
        }
    }

    hideLoading() {
        const cardElement = this.getCardElement();
        const loadingElem = cardElement.querySelector<HTMLElement>(consts.LOADING_COMPONENT_SELECTOR);

        if (loadingElem) {
            loadingElem.style.display = "none";
        } else {
            console.warn("Chart loading element not found within card.", {
                loadingSelector: consts.LOADING_COMPONENT_SELECTOR,
                cardElement: this.getCardElement(),
            });
        }
    }
}
