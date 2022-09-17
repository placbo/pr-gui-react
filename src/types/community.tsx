export interface Community {
  id: string;
  name: string;
  note: string;
  imageURL: string;
}

export const emptyCommunity: Community = {
  id: '',
  name: '',
  note: '',
  imageURL: '',
};
