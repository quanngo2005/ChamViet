import type { ReactNode } from "react";

export interface StepProps {
    number: string | number;
    title: string;
    description: string;
    icon?: ReactNode;
    image?: string;
    accentColor?: string;
}

export interface FeatureProps {
    title: string;
    description: string;
    icon?: ReactNode;
}
