export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function reviveObject(obj: Object) {
    const traverse = (current: any) => {
        if (current && typeof current === "object") {
            Object.keys(current).forEach((k) => {
                current[k] = traverse(current[k]);
            });
        }
        return chartOptionJsonParser(current);
    };

    return traverse(obj);
}

export function chartOptionJsonParser(value: any) {
    if (value?.["__js__"]) {
        try {
            return new Function("return (" + value.__js__ + ")")();
        } catch (error) {
            console.error("Error evaluating JavaScript function:", error);
        }
    }

    return value;
}
