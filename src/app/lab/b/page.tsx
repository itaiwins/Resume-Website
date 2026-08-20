'use client';
import dynamic from 'next/dynamic';
const Monolith = dynamic(() => import('@/lab/concepts/Monolith'), { ssr: false });
export default function Page() { return <Monolith />; }
