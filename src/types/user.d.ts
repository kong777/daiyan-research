export interface ILoginInput {
    username: string,
    password: string
}

export interface IUser {
    id: number | string;
    username: number | string;
    name: number | string;
    avatar: string;
    tel: number | string;
    gender: number | string;
    company_category_id: number | string;
    company_id: number | string;
    openid: number | string;
    oa_openid: number | string;
    unionid: number | string;
    session_key: number | string;
    password: number | string;
    salt: number | string;
    token: string;
    created_at: number | string;
    updated_at: number | string;
}

export interface ILoginResult {
    token?: string;
    user?: IUser;
}
