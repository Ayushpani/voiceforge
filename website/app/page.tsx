import Hero from "@/components/Hero";
import VoiceCloning from "@/components/VoiceCloning";
import TextToSpeech from "@/components/TextToSpeech";
import PodcastPreview from "@/components/PodcastPreview";
import FeatureGrid from "@/components/FeatureGrid";
import QuickStart from "@/components/QuickStart";
import ComingSoon from "@/components/ComingSoon";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-teal-500/30">
      <Hero />
      <VoiceCloning />
      <TextToSpeech />
      <PodcastPreview />
      <FeatureGrid />
      <QuickStart />
      <ComingSoon />
      <Footer />
    </main>
  );
}
