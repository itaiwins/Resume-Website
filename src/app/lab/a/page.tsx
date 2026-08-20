'use client';
import dynamic from 'next/dynamic';
const DraftingTable = dynamic(() => import('@/lab/concepts/DraftingTable'), { ssr: false });
export default function Page() {
  return <DraftingTable />;
}
