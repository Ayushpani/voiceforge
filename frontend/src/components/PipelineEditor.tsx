'use client';

import { useEffect } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { usePipelineStore } from '@/stores/pipeline';
import {
    VoiceInputNode,
    VoiceDnaNode,
    ScriptNode,
    StyleNode,
    OutputNode,
} from '@/components/nodes';

const nodeTypes = {
    voiceInput: VoiceInputNode,
    voiceDna: VoiceDnaNode,
    script: ScriptNode,
    style: StyleNode,
    output: OutputNode,
};

export default function PipelineEditor() {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        loadVoiceModels,
    } = usePipelineStore();

    useEffect(() => {
        loadVoiceModels().catch(() => {
            console.log('Backend not available - voice library will be empty');
        });
    }, [loadVoiceModels]);

    return (
        <div className="w-full h-full bg-zinc-100 dark:bg-zinc-950 transition-colors duration-300">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                defaultEdgeOptions={{
                    animated: true,
                    style: { stroke: '#71717a', strokeWidth: 2 },
                }}
                proOptions={{ hideAttribution: true }}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={24}
                    size={1.5}
                    className="!bg-zinc-100 dark:!bg-zinc-950 transition-colors duration-300"
                    color="#d4d4d8"
                />
                <Controls
                    showInteractive={false}
                    className="!bg-transparent !border-none !shadow-none"
                />
                <MiniMap
                    nodeColor={() => '#71717a'}
                    maskColor="rgba(255, 255, 255, 0.7)"
                    className="!rounded-lg"
                    pannable
                    zoomable
                />
            </ReactFlow>
        </div>
    );
}
