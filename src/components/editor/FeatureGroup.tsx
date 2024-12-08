import { Lock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/UI/button';
import { Card } from '@/components/UI/card';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { FeatureType } from '@/lib/plans';

interface FeatureGroupProps {
  title?: string;
  feature: FeatureType;
  children: React.ReactNode;
}

export function FeatureGroup({ title, feature, children }: FeatureGroupProps) {
  const { hasAccess, getPlanForFeature } = useFeatureAccess();
  const isFeatureAvailable = hasAccess(feature);
  const requiredPlan = !isFeatureAvailable ? getPlanForFeature(feature) : null;

  return (
    <Card className="relative p-4">
      {title && <h3 className="mb-2 font-semibold">{title}</h3>}
      <div className={!isFeatureAvailable ? "opacity-50 pointer-events-none" : ""}>
        {children}
      </div>
      {!isFeatureAvailable && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center p-4">
            <Lock className="mx-auto h-8 w-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Available in {requiredPlan} plan
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
