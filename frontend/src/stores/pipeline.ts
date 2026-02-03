import { create } from 'zustand';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from '@xyflow/react';
import { api, VoiceModel, GenerationResponse } from '@/lib/api';

export interface NodeData {
    label: string;
    [key: string]: unknown;
}

interface PipelineState {
    // React Flow state
    nodes: Node<NodeData>[];
    edges: Edge[];

    // Processing state
    isProcessing: boolean;
    processingNodeId: string | null;
    progress: number;
    progressMessage: string;

    // Results
    generatedAudioUrl: string | null;
    audioDuration: number | null;

    // Voice library
    voiceModels: VoiceModel[];

    // Audio state
    uploadedAudioId: string | null;
    uploadedAudioValid: boolean;
    uploadedAudioMessage: string;

    // Voice cloning state
    voiceModelId: string | null;
    voiceModelName: string;

    // Text state
    scriptText: string;

    // Style state
    speed: number;
    pitch: number;

    // Actions
    onNodesChange: (changes: NodeChange<Node<NodeData>>[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;
    addNode: (node: Node<NodeData>) => void;

    setUploadedAudio: (id: string, valid: boolean, message: string) => void;
    setVoiceModel: (id: string | null, name: string) => void;
    setScriptText: (text: string) => void;
    setSpeed: (speed: number) => void;
    setPitch: (pitch: number) => void;

    setProcessing: (isProcessing: boolean, nodeId?: string | null) => void;
    setProgress: (progress: number, message: string) => void;
    setGeneratedAudio: (url: string | null, duration: number | null) => void;

    loadVoiceModels: () => Promise<void>;
    cloneVoice: (name: string) => Promise<void>;
    generateSpeech: () => Promise<void>;

    reset: () => void;
}

const initialNodes: Node<NodeData>[] = [
    {
        id: 'voice-input',
        type: 'voiceInput',
        position: { x: 50, y: 100 },
        data: { label: 'Voice Sample' },
    },
    {
        id: 'voice-dna',
        type: 'voiceDna',
        position: { x: 350, y: 100 },
        data: { label: 'Voice DNA' },
    },
    {
        id: 'script',
        type: 'script',
        position: { x: 50, y: 350 },
        data: { label: 'Script' },
    },
    {
        id: 'style',
        type: 'style',
        position: { x: 350, y: 350 },
        data: { label: 'Style' },
    },
    {
        id: 'output',
        type: 'output',
        position: { x: 650, y: 225 },
        data: { label: 'Output' },
    },
];

const initialEdges: Edge[] = [
    { id: 'e1', source: 'voice-input', target: 'voice-dna', animated: true },
    { id: 'e2', source: 'voice-dna', target: 'output', animated: true },
    { id: 'e3', source: 'script', target: 'output', animated: true },
    { id: 'e4', source: 'style', target: 'output', animated: true },
];

export const usePipelineStore = create<PipelineState>((set, get) => ({
    nodes: initialNodes,
    edges: initialEdges,

    isProcessing: false,
    processingNodeId: null,
    progress: 0,
    progressMessage: '',

    generatedAudioUrl: null,
    audioDuration: null,

    voiceModels: [],

    uploadedAudioId: null,
    uploadedAudioValid: false,
    uploadedAudioMessage: '',

    voiceModelId: null,
    voiceModelName: '',

    scriptText: '',

    speed: 1.0,
    pitch: 0,

    onNodesChange: (changes) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) });
    },

    onEdgesChange: (changes) => {
        set({ edges: applyEdgeChanges(changes, get().edges) });
    },

    onConnect: (connection) => {
        set({ edges: addEdge({ ...connection, animated: true }, get().edges) });
    },

    addNode: (node) => {
        set({ nodes: [...get().nodes, node] });
    },

    setUploadedAudio: (id, valid, message) => {
        set({ uploadedAudioId: id, uploadedAudioValid: valid, uploadedAudioMessage: message });
    },

    setVoiceModel: (id, name) => {
        set({ voiceModelId: id, voiceModelName: name });
    },

    setScriptText: (text) => {
        set({ scriptText: text });
    },

    setSpeed: (speed) => {
        set({ speed });
    },

    setPitch: (pitch) => {
        set({ pitch });
    },

    setProcessing: (isProcessing, nodeId = null) => {
        set({ isProcessing, processingNodeId: nodeId });
    },

    setProgress: (progress, message) => {
        set({ progress, progressMessage: message });
    },

    setGeneratedAudio: (url, duration) => {
        set({ generatedAudioUrl: url, audioDuration: duration });
    },

    loadVoiceModels: async () => {
        try {
            const models = await api.listVoiceModels();
            set({ voiceModels: models });
        } catch (error) {
            console.error('Failed to load voice models:', error);
        }
    },

    cloneVoice: async (name) => {
        const state = get();
        if (!state.uploadedAudioId || !state.uploadedAudioValid) {
            throw new Error('No valid audio uploaded');
        }

        set({ isProcessing: true, processingNodeId: 'voice-dna', progress: 0, progressMessage: 'Extracting voice DNA...' });

        try {
            const model = await api.cloneVoice(state.uploadedAudioId, name);
            set({
                voiceModelId: model.id,
                voiceModelName: model.name,
                progress: 100,
                progressMessage: 'Voice cloned successfully'
            });
            await get().loadVoiceModels();
        } finally {
            set({ isProcessing: false, processingNodeId: null });
        }
    },

    generateSpeech: async () => {
        const state = get();

        if (!state.voiceModelId && !state.uploadedAudioId) {
            throw new Error('No voice model selected');
        }

        if (!state.scriptText.trim()) {
            throw new Error('No script text provided');
        }

        set({
            isProcessing: true,
            processingNodeId: 'output',
            progress: 0,
            progressMessage: 'Starting generation...',
            generatedAudioUrl: null,
            audioDuration: null
        });

        try {
            await api.generateSpeechStream(
                {
                    voice_model_id: state.voiceModelId || undefined,
                    audio_id: state.voiceModelId ? undefined : state.uploadedAudioId || undefined,
                    text: state.scriptText,
                    speed: state.speed,
                    pitch: state.pitch,
                },
                (data) => {
                    set({ progress: data.progress, progressMessage: data.message });
                    if (data.audio_url) {
                        const fullUrl = api.getGeneratedAudioUrl(data.audio_url.split('/').pop() || '');
                        set({ generatedAudioUrl: fullUrl });
                    }
                }
            );
        } finally {
            set({ isProcessing: false, processingNodeId: null });
        }
    },

    reset: () => {
        set({
            uploadedAudioId: null,
            uploadedAudioValid: false,
            uploadedAudioMessage: '',
            voiceModelId: null,
            voiceModelName: '',
            scriptText: '',
            speed: 1.0,
            pitch: 0,
            generatedAudioUrl: null,
            audioDuration: null,
            progress: 0,
            progressMessage: '',
        });
    },
}));
