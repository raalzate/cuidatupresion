'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No se encontraron datos',
  subtitle = 'Parece que aún no hay nada que mostrar aquí.',
  ctaLabel,
  ctaHref,
}) => {
  const router = useRouter();

  return (
    <div className="h-[60vh] flex flex-col gap-2 justify-center items-center text-center">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      {ctaLabel && ctaHref && (
        <div className="w-48 mt-4">
          <Button onClick={() => router.push(ctaHref)}>{ctaLabel}</Button>
        </div>
      )}
    </div>
  );
};
