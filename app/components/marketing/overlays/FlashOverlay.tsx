"use client";

import { forwardRef } from "react";

const FlashOverlay = forwardRef<HTMLDivElement>(function FlashOverlay(_, ref) {
    return (
        <div
            ref={ref}
            className="intro-flash"
            style={{ opacity: 0 }}
            aria-hidden="true"
        />
    );
});

export default FlashOverlay;
