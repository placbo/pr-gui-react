export interface Community {
  id: string;
  name: string;
  note: string;
  imageName: string;
}

export const emptyCommunity: Community = {
  id: '',
  name: '',
  note: '',
  imageName: '',
};
