export default function Footer() {
    return (
        <footer className="py-12 bg-black border-t border-zinc-900">
            <div className="container px-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    {/* Logo could go here */}
                    <span className="font-bold text-lg text-white">VoiceForge</span>
                </div>
                <p className="text-zinc-500 text-sm mb-6">
                    Open source voice cloning technology. Built with ❤️ by the community.
                </p>
                <div className="flex gap-6 justify-center text-sm text-zinc-400">
                    <a href="/docs" className="hover:text-white transition-colors">Documentation</a>
                    <a href="https://github.com/Ayushpani/voiceforge" className="hover:text-white transition-colors">GitHub</a>
                    <a href="#" className="hover:text-white transition-colors">License</a>
                </div>
                <div className="mt-8 text-xs text-zinc-700">
                    &copy; {new Date().getFullYear()} VoiceForge. MIT Licensed.
                </div>
            </div>
        </footer>
    );
}
