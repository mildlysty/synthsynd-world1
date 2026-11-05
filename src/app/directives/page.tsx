"use client";
import { Header } from "@/components/Header";
import { GridBackground } from "@/components/GridBackground";
import { DirectiveBoard } from "@/components/DirectiveBoard";

export default function DirectivesPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-brand-dark pt-32 pb-20 px-6">
      <GridBackground />
      <Header />
      <div className="max-w-7xl mx-auto relative z-10">
        <DirectiveBoard />
      </div>
    </main>
  );
}