import React from 'react';
import { HeartHandshake, PhoneCall, ShieldCheck } from 'lucide-react';
import { SafetyTier } from '../lib/types';
import { CRISIS_RESOURCES } from '../lib/constants';

interface SafetyBannerProps {
  safetyTier: SafetyTier;
  pivotExplanation?: string;
  emergencyResources?: string[];
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({
  safetyTier,
  pivotExplanation,
  emergencyResources,
}) => {
  if (safetyTier === 'standard') return null;

  if (safetyTier === 'crisis') {
    return (
      <div className="w-full bg-[#2A141A] border-2 border-[#FF5555] rounded-2xl p-5 md:p-6 shadow-[4px_4px_0px_#FF5555] mb-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#FF5555] rounded-xl text-[#121118]">
            <HeartHandshake className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-black text-[#FF8585] flex items-center gap-2">
              Support & Safety Resources
            </h3>
            <p className="mt-1 text-sm text-[#FFBDBD] leading-relaxed">
              This message touches on a crisis, self-harm, or potential danger. Satire and comedy have been suppressed. If you or someone you care about needs support, please connect with compassionate professionals:
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {CRISIS_RESOURCES.map((res) => (
                <div
                  key={res.name}
                  className="p-3 bg-[#1E1217] border-2 border-[#FF5555] rounded-xl shadow-[2px_2px_0px_#000000]"
                >
                  <div className="flex items-center gap-2 text-[#FF8585] font-black text-sm">
                    <PhoneCall className="w-4 h-4" />
                    <span>{res.name}</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {res.contact}
                  </div>
                  <div className="text-xs text-[#A1A1AA] mt-0.5">{res.desc}</div>
                </div>
              ))}
            </div>

            {emergencyResources && emergencyResources.length > 0 && (
              <div className="mt-3 p-3 bg-[#1E1217] rounded-xl border border-[#FF5555] text-xs text-[#FF8585]">
                <strong>Additional Contacts:</strong> {emergencyResources.join(' • ')}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Sensitive Pivot
  return (
    <div className="w-full bg-[#231E12] border-2 border-[#FFBE3D] rounded-2xl p-5 shadow-[4px_4px_0px_#FFBE3D] mb-6">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-[#FFBE3D] rounded-xl text-[#121118]">
          <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-[#FFD480]">
              Sensitive Context: De-escalation Active
            </h3>
            <span className="text-[11px] font-black uppercase tracking-wider bg-[#FFBE3D] text-[#121118] px-2 py-0.5 rounded-full border border-[#121118]">
              Protected
            </span>
          </div>
          <p className="mt-1 text-sm text-[#FFE8B8] leading-relaxed">
            {pivotExplanation ||
              'This draft touches on high-stakes interpersonal dynamics (such as a formal dispute, harassment, or delicate emotional boundary). Comedic takes were paused in favor of clear, protected, de-escalating options.'}
          </p>
        </div>
      </div>
    </div>
  );
};
