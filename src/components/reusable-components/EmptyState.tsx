"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import Button from "./Button";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
    className?: string;
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className = "",
}: EmptyStateProps) {
    return (
        <div
            className={`flex min-h-[400px] flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md ${className}`}
        >
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-50 rounded-full blur-2xl opacity-10" />
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 border border-slate-100 shadow-sm group transition-transform duration-300 hover:scale-105">
                    <Icon
                        className="h-10 w-10 text-slate-400 group-hover:text-blue-600 transition-colors duration-300"
                        strokeWidth={1.5}
                    />
                </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                {title}
            </h3>

            <p className="text-slate-600 max-w-[280px] sm:max-w-md mx-auto leading-relaxed mb-8">
                {description}
            </p>

            {action && (
                <div className="flex justify-center">
                    {action.href ? (
                        <Link href={action.href}>
                            <Button variant="outline" className="px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-50">
                                {action.label}
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            onClick={action.onClick}
                            variant="outline"
                            className="px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-50"
                        >
                            {action.label}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
