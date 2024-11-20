export type Donation = {
  amount: number;
  created_at: string;
  updated_at: string;
  donator_name: string;
  donator_email?: string;
  id: string;
  message: string;
};

export type Donations = Donation[];

export type User = {
  id: string;
  email: string;
  name: string;
  username: string;
};
