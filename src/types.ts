export interface MenuType {
  id: number;
  father_id: number;
  status: number;
  name: string;
  _child?: MenuType[];
}
