'use client';
import dynamic from 'next/dynamic';
const Helix = dynamic(() => import('@/lab/concepts/Helix'), { ssr: false });
export default function Page() { return <Helix />; }
