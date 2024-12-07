'use client';

import { Button } from '@/components/UI/button';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/UI/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/UI/dialog';
import { useRouter } from 'next/navigation';
import { PLAN_FEATURES } from '@/lib/subscription';
import { type FeatureKey } from '@/lib/subscription';
import type { UserPlan } from '@/lib/utils';

interface UpgradeModalProps {
  show: boolean;
  onClose: () => void;
  feature: FeatureKey;
  currentPlan: UserPlan;
  error?: string;
}

export function UpgradeModal({ show, onClose, feature, currentPlan, error }: UpgradeModalProps) {
  const router = useRouter();

  const getUpgradeMessage = () => {
    switch (feature) {
      case 'advancedEffects':
        return 'Upgrade to Premium plan to access advanced image effects and filters.';
      case 'basicEffects':
        return currentPlan === 'free' 
          ? 'Upgrade to Basic or Premium plan to use basic image effects.'
          : 'Upgrade to Premium plan for advanced effects.';
      case 'customFonts':
        return 'Upgrade to Basic or Premium plan to use custom fonts.';
      case 'multipleTextLayers':
        return currentPlan === 'free'
          ? 'Upgrade to Basic plan to add up to 3 text layers.'
          : 'Upgrade to Premium plan for unlimited text layers.';
      case 'maxImages':
        const limits = PLAN_FEATURES[currentPlan].maxImages;
        return `Upgrade to process more than ${limits} images per month.`;
      case 'priority':
        return 'Upgrade to Premium plan for priority processing.';
      case 'aiFeatures':
        return 'Upgrade to Premium plan to access AI-powered features.';
      default:
        return 'Upgrade your plan to access this feature.';
    }
  };

  const handleUpgrade = () => {
    router.push('/pricing');
    onClose();
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade Required</DialogTitle>
          <DialogDescription>{getUpgradeMessage()}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpgrade}>Upgrade Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}