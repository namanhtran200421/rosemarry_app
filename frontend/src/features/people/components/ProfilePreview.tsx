import { useState } from "react";
import { View } from "react-native";

import type { Profile } from "../../social/types/social.types";

import { CardHero } from "./CardHero";
import { ProfileDetail } from "./ProfileDetail";

interface ProfilePreviewProps {
  profile: Profile;
  myInterests: string[];
  heroHeight?: number;
  onBack?: () => void;
  hideLocation?: boolean;
}

/**
 * Read-only profile: a bounded photo hero with the details beneath. Used for
 * "how others see you" and for people opened from chats and likes sent.
 */
export function ProfilePreview({
  profile,
  myInterests,
  heroHeight = 500,
  onBack,
  hideLocation = false,
}: ProfilePreviewProps) {
  const [photoIndex, setPhotoIndex] = useState(0);

  return (
    <View>
      <CardHero
        height={heroHeight}
        hideLocation={hideLocation}
        onBack={onBack}
        onPhotoIndex={setPhotoIndex}
        photoIndex={photoIndex}
        profile={profile}
      />
      <ProfileDetail hideActions myInterests={myInterests} profile={profile} />
    </View>
  );
}
