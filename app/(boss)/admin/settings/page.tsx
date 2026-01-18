'use client';

import { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/app/components/ui/button';
import Input from '@/app/components/ui/input';
import { GAME_CONFIG } from '@/lib/constants/game-config';

export default function SettingsPage() {
  interface Config {
    gemRewards: {
      easy: number;
      medium: number;
      hard: number;
    };
    gemCosts: {
      hint1: number;
      hint2: number;
      hint3: number;
      skip: number;
    };
    initialGems: number;
  }

  const [config, setConfig] = useState<Config>({
    gemRewards: {
      easy: GAME_CONFIG.GEM_REWARDS.easy,
      medium: GAME_CONFIG.GEM_REWARDS.medium,
      hard: GAME_CONFIG.GEM_REWARDS.hard,
    },
    gemCosts: {
      hint1: GAME_CONFIG.GEM_COSTS.hint1,
      hint2: GAME_CONFIG.GEM_COSTS.hint2,
      hint3: GAME_CONFIG.GEM_COSTS.hint3,
      skip: GAME_CONFIG.GEM_COSTS.skip,
    },
    initialGems: GAME_CONFIG.INITIAL_GEMS,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Save to database via API
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] bg-clip-text text-transparent">
          Game Settings
        </h1>
        <p className="text-gray-400">
          Configure game economy and progression settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Gem Rewards */}
        <div className="bg-[#161616] rounded-lg p-6 border border-[#FFFFFF1A]">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Gem Rewards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Easy Riddle</label>
              <Input
                type="number"
                value={config.gemRewards.easy}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfig((prev) => ({
                    ...prev,
                    gemRewards: {
                      ...prev.gemRewards,
                      easy: (parseInt(e.target.value) || 0) as number,
                    },
                  }))
                }
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Medium Riddle</label>
              <Input
                type="number"
                value={config.gemRewards.medium}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfig((prev) => ({
                    ...prev,
                    gemRewards: {
                      ...prev.gemRewards,
                      medium: (parseInt(e.target.value) || 0) as number,
                    },
                  }))
                }
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Hard Riddle</label>
              <Input
                type="number"
                value={config.gemRewards.hard}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfig((prev) => ({
                    ...prev,
                    gemRewards: {
                      ...prev.gemRewards,
                      hard: (parseInt(e.target.value) || 0) as number,
                    },
                  }))
                }
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* Gem Costs */}
        <div className="bg-[#161616] rounded-lg p-6 border border-[#FFFFFF1A]">
          <h2 className="text-xl font-bold mb-4">Gem Costs</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Hint 1</label>
              <Input
                type="number"
                value={config.gemCosts.hint1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfig((prev) => ({
                    ...prev,
                    gemCosts: {
                      ...prev.gemCosts,
                      hint1: (parseInt(e.target.value) || 0) as number,
                    },
                  }))
                }
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Hint 2</label>
              <Input
                type="number"
                value={config.gemCosts.hint2}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfig((prev) => ({
                    ...prev,
                    gemCosts: {
                      ...prev.gemCosts,
                      hint2: (parseInt(e.target.value) || 0) as number,
                    },
                  }))
                }
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Hint 3</label>
              <Input
                type="number"
                value={config.gemCosts.hint3}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfig((prev) => ({
                    ...prev,
                    gemCosts: {
                      ...prev.gemCosts,
                      hint3: (parseInt(e.target.value) || 0) as number,
                    },
                  }))
                }
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Skip</label>
              <Input
                type="number"
                value={config.gemCosts.skip}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfig((prev) => ({
                    ...prev,
                    gemCosts: {
                      ...prev.gemCosts,
                      skip: (parseInt(e.target.value) || 0) as number,
                    },
                  }))
                }
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* Initial Gems */}
        <div className="bg-[#161616] rounded-lg p-6 border border-[#FFFFFF1A]">
          <h2 className="text-xl font-bold mb-4">Starting Values</h2>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Initial Gems</label>
            <Input
              type="number"
              value={config.initialGems}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfig((prev) => ({
                  ...prev,
                  initialGems: (parseInt(e.target.value) || 0) as number,
                }))
              }
              className="w-full max-w-xs bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] text-black hover:opacity-90 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}
