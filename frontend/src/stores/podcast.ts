import { create } from 'zustand';
import { api } from '@/lib/api';

export type SpeakerRole = 'Speaker 1' | 'Speaker 2';

export interface CastMember {
    role: SpeakerRole;
    modelId: string | null;
    modelName: string | null;
}

interface PodcastState {
    cast: Record<SpeakerRole, CastMember>;
    script: string;
    isGenerating: boolean;
    audioUrl: string | null;
    parsedSegments: Array<{ speaker: string; text: string }>;

    // Actions
    setCast: (role: SpeakerRole, modelId: string, modelName: string) => void;
    setScript: (script: string) => void;
    generatePodcast: () => Promise<void>;
    reset: () => void;
}

export const usePodcastStore = create<PodcastState>((set, get) => ({
    cast: {
        'Speaker 1': { role: 'Speaker 1', modelId: null, modelName: null },
        'Speaker 2': { role: 'Speaker 2', modelId: null, modelName: null },
    },
    script: "Speaker 1: Hello! Welcome to our AI podcast.\nSpeaker 2: Thanks for having me. This is going to be fun.\nSpeaker 1: Let's see what we can create.",
    isGenerating: false,
    audioUrl: null,
    parsedSegments: [],

    setCast: (role, modelId, modelName) => {
        set((state) => ({
            cast: {
                ...state.cast,
                [role]: { ...state.cast[role], modelId, modelName }
            }
        }));
    },

    setScript: (script) => set({ script }),

    generatePodcast: async () => {
        const { cast, script } = get();

        // Validation
        if (!cast['Speaker 1'].modelId || !cast['Speaker 2'].modelId) {
            throw new Error("Please assign voices to both speakers");
        }

        set({ isGenerating: true, audioUrl: null });

        try {
            const speakerMap = {
                "Speaker 1": cast['Speaker 1'].modelId,
                "Speaker 2": cast['Speaker 2'].modelId
            };

            const result = await api.generatePodcast(script, speakerMap);
            // Prefix the relative URL with the API base URL
            const fullAudioUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}${result.url}`;
            set({
                audioUrl: fullAudioUrl,
                parsedSegments: result.segments, // For visualization
                isGenerating: false
            });
        } catch (error) {
            set({ isGenerating: false });
            throw error;
        }
    },

    reset: () => set({ audioUrl: null, isGenerating: false })
}));
