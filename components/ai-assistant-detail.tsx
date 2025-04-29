'use client';

import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAssistantConfiguration } from "@/components/ai-assistant-configuration";
import { AIAssistantKnowledge } from "@/components/ai-assistant-knowledge";
import { AIAssistantLogs } from "@/components/ai-assistant-logs";
import { AIAssistantPerformance } from "@/components/ai-assistant-performance";

export function AIAssistantDetail({ 
  assistant, 
  defaultTab = "configuration" 
}: { 
  assistant: any; 
  defaultTab?: string;
}) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{assistant.name}</h1>
        <p className="text-muted-foreground">{assistant.description}</p>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration">
          <AIAssistantConfiguration assistant={assistant} />
        </TabsContent>

        <TabsContent value="knowledge">
          <AIAssistantKnowledge assistantId={assistant.id} />
        </TabsContent>

        <TabsContent value="performance">
          <AIAssistantPerformance assistantId={assistant.id} />
        </TabsContent>

        <TabsContent value="logs">
          <AIAssistantLogs assistantId={assistant.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
