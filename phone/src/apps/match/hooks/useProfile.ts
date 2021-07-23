import { useRecoilValue } from 'recoil';
import { matchState, useMyProfile } from './state';

import { FormattedProfile } from '../../../../../typings/match';

interface IUseProfiles {
  profile: FormattedProfile | null;
  setProfile: (profile: FormattedProfile) => void;
  noProfileExists: boolean;
}

export const useProfile = (): IUseProfiles => {
  const [profile, setProfile] = useMyProfile();
  const noProfileExists = useRecoilValue(matchState.noProfileExists);
  return { profile, setProfile, noProfileExists };
};
