/**
 * Placeholder legal copy carried over from the design kit. Replace with the
 * reviewed documents before release.
 */

const FILLER =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod " +
  "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim " +
  "veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea " +
  "commodo consequat.";

export interface LegalDocument {
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
}

export const TERMS_DOCUMENT: LegalDocument = {
  title: "Terms of Use",
  intro: `By creating an account and using Rosemarry, you agree to the following terms. Please read them carefully. ${FILLER}`,
  sections: [
    {
      heading: "Eligibility",
      body: `You must be at least 18 years old to use Rosemarry. ${FILLER}`,
    },
    {
      heading: "Your account",
      body: `You are responsible for the activity on your account and for keeping it secure. ${FILLER}`,
    },
    {
      heading: "Acceptable use",
      body: `You agree not to harass, spam, or impersonate others on the platform. ${FILLER}`,
    },
    {
      heading: "Subscriptions & billing",
      body: `Paid plans renew automatically unless cancelled at least 24 hours before the period ends. ${FILLER}`,
    },
    {
      heading: "Termination",
      body: `We may suspend or terminate accounts that violate these terms. ${FILLER}`,
    },
  ],
};

export const PRIVACY_DOCUMENT: LegalDocument = {
  title: "Privacy Policy",
  intro: `This policy explains what information we collect, how we use it, and the choices you have. ${FILLER}`,
  sections: [
    {
      heading: "Information we collect",
      body: `We collect the details you provide during onboarding, such as your name, photos and preferences. ${FILLER}`,
    },
    {
      heading: "How we use data",
      body: `We use your information to suggest matches and improve the service. ${FILLER}`,
    },
    {
      heading: "Sharing",
      body: `We do not sell your personal data. Limited data may be shared with service providers. ${FILLER}`,
    },
    {
      heading: "Your choices",
      body: `You can edit or delete your profile information at any time from settings. ${FILLER}`,
    },
    {
      heading: "Contact",
      body: `Questions about this policy can be sent to privacy@rosemarry.example. ${FILLER}`,
    },
  ],
};
