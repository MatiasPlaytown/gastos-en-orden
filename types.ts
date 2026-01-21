
export interface Tip {
  tag: string;
  title: string;
  text: string;
  icon: string;
  emotion: string;
  img: string;
  learned?: boolean;
}

export interface Challenge {
  title: string;
  time: string;
  desc: string;
  quote: string;
  icon: string;
  img: string;
  progress?: number;
}

export interface Insight {
  id: string;
  type: 'alert' | 'success' | 'info';
  title: string;
  description: string;
  icon: string;
  color: string;
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  TIPS = 'tips',
  CHALLENGES = 'challenges'
}
