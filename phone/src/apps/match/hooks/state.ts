import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  FormattedMatch,
  FormattedProfile,
  MatchEvents,
  Profile,
} from '../../../../../typings/match';
import { fetchNui } from '../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../typings/common';
import LogDebugEvent from '../../../os/debug/LogDebugEvents';
import { MockMyProfileData, MockProfilesData } from '../utils/constants';
import { isEnvBrowser } from '../../../utils/misc';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

export const matchState = {
  // Same problem as in 'useMatchService', we need to format these profiles. This also goes for myProfiles, below.
  // I don't have time since Taso told me to do CI.
  profiles: atom<FormattedProfile[]>({
    key: 'profiles',
    default: selector({
      key: 'defaultMatchProfiles',
      get: async () => {
        try {
          const resp = await fetchNui<ServerPromiseResp<FormattedProfile[]>>(
            MatchEvents.GET_PROFILES,
          );
          LogDebugEvent({ action: 'ProfilesFetch', data: resp.data });
          return resp.data;
        } catch (e) {
          console.error(e);
          if (isEnvBrowser()) {
            return MockProfilesData;
          }
          return [];
        }
      },
    }),
  }),
  errorLoadingProfiles: atom({
    key: 'errorLoadingProfiles',
    default: false,
  }),
  matches: atom<FormattedMatch[]>({
    key: 'matches',
    default: null,
  }),
  errorLoadingMatches: atom<boolean>({
    key: 'errorLoadingMatches',
    default: false,
  }),
  myProfile: atom<FormattedProfile>({
    key: 'myProfile',
    default: selector({
      key: 'myProfileDefault',
      get: async () => {
        try {
          const resp = await fetchNui<ServerPromiseResp<FormattedProfile>>(
            MatchEvents.GET_MY_PROFILE,
          );
          LogDebugEvent({ action: 'MyProfileFetch', data: resp.data });
          return resp.data;
        } catch (e) {
          console.error(e);
          if (isEnvBrowser()) {
            return MockMyProfileData;
          }
          return null;
        }
      },
    }),
  }),
  noProfileExists: atom<boolean>({
    key: 'noProfileExists',
    default: false,
  }),
};

export const useFormattedProfiles = () => useRecoilState(matchState.profiles);
export const useFormattedProfilesValue = () => useRecoilValue(matchState.profiles);
export const useSetFormattedProfiles = () => useSetRecoilState(matchState.profiles);

export const useMyProfile = () => useRecoilState(matchState.myProfile);
export const useMyProfileValue = () => useRecoilValue(matchState.myProfile);
export const useSetMyProfile = () => useSetRecoilState(matchState.myProfile);
