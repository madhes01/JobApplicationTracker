export interface JobApplication {
    id: string;        // _id → id
    company: string;
    position: string;
    location?: string;
    status: string;
    notes?: string;
    salary?: string;
    jobUrl?: string;
    order: number;
    columnId?: string;
    tags?: string[];
    description?: string;
}

export interface Column {
    id: string;        // _id → id
    name: string;
    order: number;
    jobApplications: JobApplication[];
}

export interface Board {
    id: string;        // _id → id
    name: string;
    columns: Column[];
}