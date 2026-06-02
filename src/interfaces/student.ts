export interface Student {
  id: string
  status: PhotoStatus
}

export enum PhotoStatus {
  Done = 2,
  Pending = 0,
}
