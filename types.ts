interface TaskStatus {
  status: string;
  color: string;
  type: string;
  orderindex: number;
}

interface Task {
  id: string;
  custom_id: string;
  name: string;
  status: TaskStatus;
  custom_type: any;
}

interface User {
  id: number;
  username: string;
  email: string;
  color: string;
  initials: string;
  profilePicture: string;
}

interface TaskLocation {
  list_id: number;
  folder_id: number;
  space_id: number;
  list_name: string;
  folder_name: string;
  space_name: string;
}

interface TaskTag {
  name: string;
  tag_fg: string;
  tag_bg: string;
  creator: number;
}

export interface TaskData {
  id: string;
  task: Task;
  wid: string;
  user: User;
  billable: boolean;
  start: number;
  end: number;
  duration: string;
  description: string;
  tags: any[];
  source: string;
  at: string;
  task_location: TaskLocation;
  task_tags: TaskTag[];
  task_url: string;
}

export interface TaskResponse {
  data: TaskData[];
}

