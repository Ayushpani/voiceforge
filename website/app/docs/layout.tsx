import DocsSidebar from "@/components/DocsSidebar";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black">
            <DocsSidebar />
            <div className="md:ml-64 min-h-screen">
                <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                    {children}
                </div>
            </div>
        </div>
    );
}
