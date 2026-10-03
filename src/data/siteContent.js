import { galleryServices } from './services';

export const defaultSiteSettings = {
  hero: {
    tagline: 'A network of ventures built for people and businesses to grow.',
    title: 'P.Sonkar',
    titleLine: 'House Of',
    titleAccent: 'Ventures.',
    sideTitle: 'A founder-led ecosystem.',
    sideText: 'Built around the ventures I build, the people I work with, and the opportunities I create. Based in Bangalore.',
    portraitUrl: '/images/founder.webp',
  },
  services: galleryServices.map((service) => ({
    ...service,
    name: service.name || service.title || 'Events & Experiences',
    graphic: service.graphic || 'events',
    image: service.image || '',
  })),
  pages: {
    about: {
      heroLabel: 'About Pratap Sonkar', heroTitle: 'Builder. Operator. Founder.', heroSubtitle: 'Here is my story and what I am building.',
      storyLabel: 'My Story', storyTitle: 'The Story',
      storyOne: 'P.Sonkar House Of Ventures did not come together through a single plan. It came together through years of working on things I genuinely believed needed to exist, starting from scratch, figuring things out on the ground, and building across areas I found myself drawn to.',
      storyTwo: 'Over time, what started as individual projects began to take shape as a connected ecosystem. P.Sonkar House Of Ventures is the formal structure that holds all of it together. It is the parent entity behind every venture I build and every collaboration I am part of.',
      principlesLabel: 'Working Principles', principlesTitle: 'How I Work',
      principleOneTitle: 'Start With Clarity', principleOneText: 'Every venture I work on begins with a clear understanding of the problem being solved, who it is being solved for, and whether there is a sustainable model behind it. Clarity before action, always.',
      principleTwoTitle: 'Stay Close to the Work', principleTwoText: 'I stay operationally close to what I build. Not from a distance. I am inside the decisions, the conversations, and the details that actually determine whether something works or not.',
      principleThreeTitle: 'Build Systems, Not Dependencies', principleThreeText: 'The goal is always to build something that does not depend entirely on me. Systems and teams are built alongside what we are building, not after it.',
    },
    services: {
      label: 'The Portfolio', title: 'Collaborated Services.',
      intro: 'Services and businesses I am part of through active collaborations. These are managed independently but connected to this ecosystem through shared work and partnerships built over time.',
      tailTitle: 'See something that interests you?', tailText: 'Reach out whether you want to invest, join a team, or collaborate. I personally review every message.', tailButton: 'Get Involved',
    },
    ventures: {
      introLabel: 'The Portfolio', introTitle: 'What I am building.',
      introText: 'Two categories. In-House Ventures are built and operated by me directly. Collaborated Services are engagements I am part of through active partnerships.',
      tailTitle: 'See something that interests you?', tailText: 'Reach out whether you want to invest, join a team, or collaborate. I personally review every message.',
    },
    contact: {
      heroLabel: 'Get Involved', heroTitle: 'Tell Me What You Are Looking For.',
      heroText: 'Three ways to be part of what I am building. Pick the one that fits and fill in the form below.',
      pillarInvestTitle: 'Back A Venture', pillarInvestText: 'I am building a small, focused set of ventures. If something in the portfolio interests you and you want to be part of it, let us talk.',
      pillarWorkTitle: 'Join The Team', pillarWorkText: 'Internships, part-time, and full-time roles across active ventures. Real work, real ownership, no corporate layers.',
      pillarGrowTitle: 'Grow Your Business', pillarGrowText: 'Need a growth partner with real resources and hands-on experience? I work with founders and businesses who are serious about growing.',
      formTitle: 'Drop Your Details and I Will Get Back to You.',
    },
  },
};

export function mergeSiteSettings(value) {
  return {
    ...defaultSiteSettings,
    ...(value || {}),
    hero: { ...defaultSiteSettings.hero, ...(value?.hero || {}) },
    services: Array.isArray(value?.services) && value.services.length ? value.services : defaultSiteSettings.services,
    pages: {
      ...defaultSiteSettings.pages,
      ...(value?.pages || {}),
      about: { ...defaultSiteSettings.pages.about, ...(value?.pages?.about || {}) },
      services: { ...defaultSiteSettings.pages.services, ...(value?.pages?.services || {}) },
      ventures: { ...defaultSiteSettings.pages.ventures, ...(value?.pages?.ventures || {}) },
      contact: { ...defaultSiteSettings.pages.contact, ...(value?.pages?.contact || {}) },
    },
  };
}