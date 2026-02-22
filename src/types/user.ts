export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export interface FetchUsersResponse {
  data: User[];
  hasMore: boolean;
  page: number;
}
