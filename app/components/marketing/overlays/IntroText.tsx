"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

export interface IntroTextRefs {
    title: HTMLHeadingElement | null;
    tagline: HTMLParagraphElement | null;
}

const IntroText = forwardRef<IntroTextRefs>(function IntroText(_, ref) {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const taglineRef = useRef<HTMLParagraphElement>(null);

    useImperativeHandle(ref, () => ({
        get title() { return titleRef.current; },
        get tagline() { return taglineRef.current; },
    }), []);

    return (
        <div className="intro-text" aria-live="polite">
            <h1
                ref={titleRef}
                className="intro-text__title"
                style={{ opacity: 0, transform: "scale(0.4)" }}
            >
                ATTACK MODE
            </h1>
            <p
                ref={taglineRef}
                className="intro-text__tagline"
                style={{ opacity: 0, transform: "translateY(12px)" }}
            >
                Turn incident response into execution
            </p>
        </div>
    );
});

export default IntroText;
