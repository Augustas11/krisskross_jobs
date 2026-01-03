'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = [
    'All',
    'Vietnamese Fashion',
    'Korean Streetwear',
    'Beauty',
    'Accessories',
    'Cinematic',
    'Minimalist'
];

export function MarketplaceFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategory = searchParams.get('category') || 'All';
    const currentSort = searchParams.get('sort') || 'newest';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'All') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // Reset page on filter change
        params.set('page', '1');
        router.push(`/marketplace?${params.toString()}`);
    };

    return (
        <div className="space-y-8 w-full md:w-64 flex-shrink-0">
            {/* Search (Optional, implemented simply) */}

            {/* Categories */}
            <div>
                <h3 className="text-white font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="category"
                                value={cat}
                                checked={currentCategory === cat || (cat === 'All' && !searchParams.get('category'))}
                                onChange={(e) => updateFilters('category', e.target.value)}
                                className="accent-blue-500 w-4 h-4 cursor-pointer"
                            />
                            <span className={`text-sm ${currentCategory === cat || (cat === 'All' && !searchParams.get('category')) ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-300'}`}>
                                {cat}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="text-white font-semibold mb-3">Price Range</h3>
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => updateFilters('minPrice', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-sm text-white focus:border-blue-500 outline-none"
                    />
                    <span className="text-neutral-500">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => updateFilters('maxPrice', e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-sm text-white focus:border-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Sort */}
            <div>
                <h3 className="text-white font-semibold mb-3">Sort By</h3>
                <select
                    value={currentSort}
                    onChange={(e) => updateFilters('sort', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none appearance-none"
                >
                    <option value="newest">Newest First</option>
                    <option value="popularity">Popularity</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                </select>
            </div>
        </div>
    );
}
