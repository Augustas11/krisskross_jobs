import Link from 'next/link';
import { Plus } from 'lucide-react';
import { CreatorDashboardClient } from '@/components/marketplace/CreatorDashboardClient';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Creator Dashboard
                    </h1>
                    <Link
                        href="/dashboard/templates/create"
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        New Template
                    </Link>
                </div>

                <CreatorDashboardClient />
            </div>
        </div>
    );
}
