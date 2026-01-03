import React from 'react';
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters';
import { TemplateCard } from '@/components/marketplace/TemplateCard';
import { Template } from '@/types';
import { Search } from 'lucide-react'; // Using icon for header potentially

// Force dynamic since searchParams change
export const dynamic = 'force-dynamic';

async function getTemplates(searchParams: any) {
    // Construct internal API URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const params = new URLSearchParams(searchParams);

    try {
        const res = await fetch(`${baseUrl}/api/templates?${params.toString()}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch templates: ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching templates:', error);
        return { templates: [], total: 0 };
    }
}

export default async function MarketplacePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams; // Next.js 15+ async params
    const { templates, total } = await getTemplates(resolvedParams);

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                            Template Marketplace
                        </h1>
                        <p className="text-neutral-400 max-w-2xl">
                            Discover professional video templates created by top creators.
                            Accelerate your workflow with pre-configured scenes, lighting, and camera settings.
                        </p>
                    </div>
                    {/* <Link href="/dashboard/templates/create" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Sell a Template
          </Link> */}
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex-shrink-0 border-r border-neutral-800/50 md:pr-6">
                        <MarketplaceFilters />
                    </aside>

                    {/* Main Grid */}
                    <main className="flex-1">
                        <div className="mb-4 text-sm text-neutral-500">
                            Showing {templates.length} of {total} results
                        </div>

                        {templates.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {templates.map((template: Template) => (
                                    <TemplateCard key={template.id} template={template} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-neutral-900/30 rounded-xl border border-dashed border-neutral-800">
                                <div className="bg-neutral-800 p-4 rounded-full mb-4">
                                    <Search className="w-8 h-8 text-neutral-500" />
                                </div>
                                <h3 className="text-lg font-medium text-neutral-300">No templates found</h3>
                                <p className="text-neutral-500 mt-2 text-center max-w-sm">
                                    Try adjusting your filters or search criteria.
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
