const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface AudioUploadResponse {
    id: string;
    filename: string;
    duration_seconds: number;
    sample_rate: number;
    is_valid: boolean;
    message: string;
}

export interface VoiceModel {
    id: string;
    name: string;
    created_at: string;
    duration_seconds: number;
    tags: string[];
    preview_url: string;
}

export interface GenerationResponse {
    audio_url: string;
    duration_seconds: number;
    voice_model_id?: string;
}

class ApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE;
    }

    private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    }

    async uploadAudio(file: File): Promise<AudioUploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await this.fetchWithTimeout(`${this.baseUrl}/api/audio/upload`, {
            method: 'POST',
            body: formData,
        }, 60000); // 60s timeout for upload

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
            throw new Error(error.detail || 'Upload failed');
        }

        return response.json();
    }

    async cloneVoice(audioId: string, name: string, tags: string[] = []): Promise<VoiceModel> {
        const response = await this.fetchWithTimeout(`${this.baseUrl}/api/voice/clone`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio_id: audioId, name, tags }),
        }, 120000); // 2min timeout for cloning

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Cloning failed' }));
            throw new Error(error.detail || 'Cloning failed');
        }

        return response.json();
    }

    async listVoiceModels(): Promise<VoiceModel[]> {
        const response = await this.fetchWithTimeout(`${this.baseUrl}/api/voice/models`);
        if (!response.ok) {
            throw new Error('Failed to fetch voice models');
        }
        const data = await response.json();
        return data.models;
    }

    async deleteVoiceModel(modelId: string): Promise<void> {
        const response = await this.fetchWithTimeout(`${this.baseUrl}/api/voice/models/${modelId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete voice model');
    }

    async generateSpeech(params: {
        voice_model_id?: string;
        audio_id?: string;
        text: string;
        speed?: number;
        pitch?: number;
        save_voice?: boolean;
        voice_name?: string;
    }): Promise<GenerationResponse> {
        const response = await this.fetchWithTimeout(`${this.baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        }, 300000); // 5min timeout for generation

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Generation failed' }));
            throw new Error(error.detail || 'Generation failed');
        }

        return response.json();
    }

    async generateSpeechStream(
        params: {
            voice_model_id?: string;
            audio_id?: string;
            text: string;
            speed?: number;
            pitch?: number;
        },
        onProgress: (data: { stage: string; progress: number; message: string; audio_url?: string }) => void
    ): Promise<void> {
        const response = await fetch(`${this.baseUrl}/api/generate/stream`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });

        if (!response.ok) throw new Error('Stream failed');

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) return;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = decoder.decode(value);
            const lines = text.split('\n').filter(line => line.startsWith('data: '));

            for (const line of lines) {
                try {
                    const data = JSON.parse(line.slice(6));
                    onProgress(data);
                } catch {
                    // Skip invalid JSON
                }
            }
        }
    }

    getAudioUrl(audioId: string): string {
        return `${this.baseUrl}/api/audio/${audioId}`;
    }

    getGeneratedAudioUrl(outputId: string): string {
        return `${this.baseUrl}/api/generate/${outputId}`;
    }

    getPreviewUrl(modelId: string): string {
        return `${this.baseUrl}/api/voice/models/${modelId}/preview`;
    }
    async generatePodcast(script: string, speakerMap: Record<string, string>): Promise<{ id: string, url: string, duration: number, segments: any[] }> {
        const response = await this.fetchWithTimeout(`${this.baseUrl}/api/podcast/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ script, speaker_map: speakerMap }),
        }, 600000); // 10m timeout for podcast

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Podcast generation failed' }));
            throw new Error(error.detail || 'Podcast generation failed');
        }

        return response.json();
    }
}

export const api = new ApiClient();
