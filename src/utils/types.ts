export type Donation = {
  amount: number;
  created_at: string;
  updated_at: string;
  donator_name: string;
  donator_email?: string;
  id: string;
  message: string;
  tts?: string[];
};

export type Donations = Donation[];

export type User = {
  id: string;
  email: string;
  name: string;
  username: string;
  balance: number;
};

export type Bank = {
  verified_at: number | null;
  number: number;
  bank: string;
  id: string;
};

export type Banks = Bank[];

export type OverlayBasicCss = {
  background: string;
  border_color: string;
  text_color: string;
  text_color_highlight: string;
};

export type DomFormat = {
  donatorName: string;
  templateText: string;
  message: string;
  amount: string;
};

export type F1RadioSettings = {
  driver_name: string;
  team: string;
};
