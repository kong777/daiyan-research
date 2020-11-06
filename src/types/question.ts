export interface question {
    id: number;
    question: string;
    answer?: string | string[];
    analysis?: null;
    items: string[];
    value?: IOption[];
    type: number;
    is_easy_false?: number;
    source_type?: number;
    status?: number;
    created_at?: string;
    updated_at?: string;
    answer_count?: number;
    user_collect?: null;
}

export interface IOption {
    name: string;
    is_false: number;
}

export interface IAnswerOptionList {
    [index: number]: IOption[]
}


export interface IExaminationResultAnswer {
    examination_id: number;
    user_id: number;
    status: number;
    updated_at: string;
    created_at: string;
    id: number;
}

export interface IExaminationResultQuestion {
    id: number;
    question: string;
    type: number;
    items: string[];
    answer_count: number;
}