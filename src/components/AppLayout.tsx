
"use client";

import * as React from "react";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Lightbulb,
  Bug,
  Wrench,
  FileText,
  BrainCircuit,
  Rocket,
  Settings,
  UserCircle,
  LogOut,
  PanelLeft,
} from "lucide-react";

import { SmartCodeSuggestionsCard } from "@/components/feature-cards/SmartCodeSuggestionsCard";
import { BugDetectionCard } from "@/components/feature-cards/BugDetectionCard";
import { AutoFixCard } from "@/components/feature-cards/AutoFixCard";
import { TestCaseGenerationCard } from "@/components/feature-cards/TestCaseGenerationCard";
import { NaturalLanguageQueryCard } from "@/components/feature-cards/NaturalLanguageQueryCard";

type FeatureKey =
  | "smart-code-suggestions"
  | "bug-detection"
  | "auto-fix"
  | "test-case-generation"
  | "natural-language-query";

interface Feature {
  key: FeatureKey;
  label: string;
  icon: React.ElementType;
  component: React.ElementType;
  description: string;
}

const features: Feature[] = [
  {
    key: "smart-code-suggestions",
    label: "Smart Code Suggestions",
    icon: Lightbulb,
    component: SmartCodeSuggestionsCard,
    description: "Context-aware code completions for test automation.",
  },
  {
    key: "bug-detection",
    label: "Bug Detection",
    icon: Bug,
    component: BugDetectionCard,
    description: "Identify bugs with clear explanations.",
  },
  {
    key: "auto-fix",
    label: "Auto-Fix",
    icon: Wrench,
    component: AutoFixCard,
    description: "Suggest fixes for bugs or inefficient code.",
  },
  {
    key: "test-case-generation",
    label: "Test Case Generation",
    icon: FileText,
    component: TestCaseGenerationCard,
    description: "Automatically generate test cases from code.",
  },
  {
    key: "natural-language-query",
    label: "Natural Language Query",
    icon: BrainCircuit,
    component: NaturalLanguageQueryCard,
    description: "Ask coding questions in natural language.",
  },
];

export function AppLayout() {
  const [activeFeatureKey, setActiveFeatureKey] =
    React.useState<FeatureKey>("smart-code-suggestions");

  const ActiveFeatureComponent = features.find(
    (f) => f.key === activeFeatureKey
  )?.component ?? (() => <div>Select a feature</div>);
  
  const activeFeatureDescription = features.find(
    (f) => f.key === activeFeatureKey
  )?.description ?? "";

  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-r"
      >
        <SidebarHeader className="p-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
              <Rocket className="h-7 w-7" />
              <span className="font-headline group-data-[collapsible=icon]:hidden">TestPilot AI</span>
            </Link>
        </SidebarHeader>
        <Separator />
        <SidebarContent className="p-2">
          <ScrollArea className="h-[calc(100vh-160px)]">
            <SidebarMenu>
              {features.map((feature) => (
                <SidebarMenuItem key={feature.key}>
                  <SidebarMenuButton
                    onClick={() => setActiveFeatureKey(feature.key)}
                    isActive={activeFeatureKey === feature.key}
                    tooltip={{ children: feature.label, className: "font-body" }}
                    className="justify-start font-body"
                  >
                    <feature.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {feature.label}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
        <Separator />
         <SidebarHeader className="p-4 mt-auto">
            <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton className="justify-start font-body" tooltip={{ children: "Settings", className: "font-body" }}>
                        <Settings className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                     <SidebarMenuButton className="justify-start font-body" tooltip={{ children: "Profile", className: "font-body" }}>
                        <UserCircle className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">Profile</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton className="justify-start font-body text-destructive hover:text-destructive-foreground hover:bg-destructive" tooltip={{ children: "Logout", className: "font-body" }}>
                        <LogOut className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 shadow-sm">
          <SidebarTrigger className="md:hidden">
            <PanelLeft />
          </SidebarTrigger>
          <div>
            <h1 className="text-xl font-semibold font-headline">
              {features.find((f) => f.key === activeFeatureKey)?.label}
            </h1>
            <p className="text-sm text-muted-foreground font-body">{activeFeatureDescription}</p>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
            <ActiveFeatureComponent />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
