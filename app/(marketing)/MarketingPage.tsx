"use client";

import { useState, useCallback } from "react";
import IntroExperience from "@/app/components/marketing/IntroExperience";
import LandingExperience from "@/app/components/marketing/LandingExperience";

export default function MarketingPage() {
    const [introComplete, setIntroComplete] = useState(false);

    const handleIntroComplete = useCallback(() => {
        setIntroComplete(true);
    }, []);

    return (
        <>
            {!introComplete && <IntroExperience onComplete={handleIntroComplete} />}
            {introComplete && <LandingExperience active={introComplete} />}
        </>
    );
}
