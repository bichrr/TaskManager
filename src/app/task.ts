export interface Task {
    id?: string;
    title: string;
    description?: string;
    dueDate?: Date;
    priority?: 'Low' | 'Medium' | 'High';
    status: 'Pending' | 'Completed';
  }
  
   