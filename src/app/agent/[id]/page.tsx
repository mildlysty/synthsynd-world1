import { Suspense } from "react";
import { DynamicAgentView } from "@/components/DynamicAgentView";

// 1. The main export is a standard synchronous component
export default function DynamicAgentPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    // 2. We wrap the data-fetching part in Suspense
    <Suspense 
      fallback={
        <div className="min-h-screen bg-brand-dark flex items-center justify-center text-brand-cyan font-mono">
          [SYSTEM] Establishing Connection...
        </div>
      }
    >
      <AgentContent params={params} />
    </Suspense>
  );
}

// 3. This is an async Server Component that safely extracts the ID
async function AgentContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <DynamicAgentView agentId={resolvedParams.id} />;
}   