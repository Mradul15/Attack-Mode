declare module "@mojs/core" {
    interface BurstOptions {
        parent?: HTMLElement;
        left?: number;
        top?: number;
        radius?: Record<number, number> | number;
        count?: number;
        children?: Record<string, unknown>;
    }

    interface ShapeOptions {
        parent?: HTMLElement;
        left?: number;
        top?: number;
        shape?: string;
        stroke?: string;
        strokeWidth?: Record<number, number> | number;
        fill?: string;
        radius?: Record<number, number> | number;
        opacity?: Record<number, number> | number;
        duration?: number;
        easing?: string;
    }

    class Burst {
        constructor(opts: BurstOptions);
        play(): void;
    }

    class Shape {
        constructor(opts: ShapeOptions);
        play(): void;
    }

    export default { Burst, Shape };
    export { Burst, Shape };
}

declare module "kute.js" {
    interface KuteInstance {
        start(): KuteInstance;
    }

    function fromTo(
        element: Element | string,
        fromProps: Record<string, unknown>,
        toProps: Record<string, unknown>,
        options?: Record<string, unknown>
    ): KuteInstance;

    function to(
        element: Element | string,
        toProps: Record<string, unknown>,
        options?: Record<string, unknown>
    ): KuteInstance;

    export default { fromTo, to };
    export { fromTo, to };
}

declare module "velocity-animate" {
    function Velocity(
        elements: Element | Element[] | NodeListOf<Element>,
        properties: Record<string, unknown>,
        options?: Record<string, unknown>
    ): void;

    export default Velocity;
}

declare module "lottie-web" {
    interface AnimationItem {
        destroy(): void;
        play(): void;
        pause(): void;
        stop(): void;
    }

    interface AnimationConfigWithData {
        container: HTMLElement;
        renderer: "svg" | "canvas" | "html";
        loop: boolean;
        autoplay: boolean;
        animationData: object;
    }

    function loadAnimation(config: AnimationConfigWithData): AnimationItem;

    export default { loadAnimation };
    export { loadAnimation };
}
