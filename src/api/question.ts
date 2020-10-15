import service from './'
import { AxiosPromise } from 'axios'
import { question, IExaminationResultQuestion } from '../types/question'
import store from '../store'

export interface IGetRandomQuestionInput {
    speciality_id: number
}

export interface IGetOrderQuestionInput extends IGetRandomQuestionInput{
    type?: number
}

export interface IGetQuestionResult {
    question: question;
    total: number;
}

export interface IPivot {
    category_id: number;
    speciality_id: number;
}

export interface IExamination {
    id: number;
    speciality_id: number;
    type: number;
    name: string;
    start_datetime: string;
    end_datetime: string;
}

export interface ISpeciality {
    id: number;
    name: string;
    description: string | null;
    status: number;
    created_at: string;
    updated_at: string;
    pivot: IPivot;
    examination: IExamination[];
}

export interface IProItem {
    id: number;
    sort: number;
    pid: number;
    name: string;
    description: string | null;
    status: number;
    created_at: string;
    updated_at: string;
    speciality: ISpeciality[]
}

export interface IProListResult {
    list: IProItem[]
}

export interface IReportQuestionInput {
    question_id: number;
    answer: number;
}

export interface ISimulationExaminationInput {
    examination_id: number;
}

export interface IExaminationAnswer {
    [index: number]: number | string | string[]
}

export interface IExaminationReportInput {
    answer_id: number;
    value: IExaminationAnswer[]
}

export interface IExaminationListAnswer {
    created_at: string;
    updated_at: string;
    examination_id: number;
    id: number;
    status: number;
    user_id: number;
}

export interface IExaminationResult {
    answer: IExaminationListAnswer;
    questions: IExaminationResultQuestion[];
    answerTime: number;
}

export interface IReportExaminationResultAnswer {
    answer: string;
    created_at: string;
    updated_at: string;
    answer_count: number;
    examination_id: number;
    id: number;
    score: number;
    status: number;
    used_minute: number;
}

export interface IReportExaminationResult {
    totalScore: number;
    answer: IReportExaminationResultAnswer
}

export interface ISelfExamination {
    answer_minute: number;
    checkbox_count: number;
    checkbox_score: number;
    complete_count: number;
    complete_score: number;
    id: number;
    judge_count: number;
    judge_score: number;
    radio_count: number;
    radio_score: number;
    speciality_id: number;
    status: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    question_ids: string;
}

export interface ISelfExaminationResult {
    examination: ISelfExamination;
    questions: IExaminationResultQuestion[];
}

export interface ISelfExaminationReportInput {
    examination_id: number;
    answer: IExaminationAnswer[]
}

export interface IReportSelfExaminationResultInfo {
    answer_minute: number;
    checkbox_count: number;
    checkbox_score: number;
    complete_count: number;
    complete_score: number;
    id: number;
    judge_count: number;
    judge_score: number;
    radio_count: number;
    radio_score: number;
    score: number;
    speciality_id: number;
    status: number;
    user_id: number;
    answer: string;
    updated_at: string;
    created_at: string;
    question_ids: string;
}

export interface IReportSelfExaminationResult {
    examination: IReportSelfExaminationResultInfo;
}

export const getQuestionMenu = ():AxiosPromise<IProListResult> => {
    return service({
        url: '/question/list',
        method: 'post'
    })
}

export const getRandomQuestion = ():AxiosPromise<IGetQuestionResult> => {
    return service({
        url: '/question/randExamination',
        method: 'post',
        data: { speciality_id: store.getMenuId } as IGetRandomQuestionInput
    })
}

export const getOrderQuestion = ():AxiosPromise<IGetQuestionResult> => {
    return service({
        url: '/question/orderExamination',
        method: 'post',
        data: { speciality_id: store.getMenuId } as IGetOrderQuestionInput
    })
}

export const getReviewQuestion = ():AxiosPromise<IGetQuestionResult> => {
    return service({
        url: '/question/falseExamination',
        method: 'post',
        data: { speciality_id: store.getMenuId } as IGetOrderQuestionInput
    })
}

export const getDiffcultQuestion = ():AxiosPromise<IGetQuestionResult> => {
    return service({
        url: '/question/easyFalseExamination',
        method: 'post',
        data: { speciality_id: store.getMenuId } as IGetOrderQuestionInput
    })
}

export const reportQuestion = (data: IReportQuestionInput):AxiosPromise<undefined> => {
    return service({
        url: '/question/addQuestionResult',
        method: 'post',
        data
    })
}

export const simulationExamination = (data: ISimulationExaminationInput):AxiosPromise<IExaminationResult> => {
    return service({
        url: '/question/simulationExamination',
        method: 'post',
        data
    })
}

export const selfExamination = ():AxiosPromise<ISelfExaminationResult> => {
    return service({
        url: '/question/selfExamination',
        method: 'post',
        data: {
            speciality_id: store.getMenuId,
            judeCount: 4,
            judeScore: 10,
            radioCount: 4,
            radioScore: 10,
            checkboxCount: 2,
            checkboxScore: 10,
            minute: 60
        }
    })
}

export const reportExamination = (data: IExaminationReportInput):AxiosPromise<IReportExaminationResult> => {
    return service({
        url: '/question/simulationExaminationAnswer',
        method: 'post',
        data: {
            answer_id: data.answer_id,
            value: JSON.stringify(data.value)
        }
    })
}

export const reportSelfExamination = (data: ISelfExaminationReportInput):AxiosPromise<IReportSelfExaminationResult> => {
    return service({
        url: '/question/selfExaminationAnswer',
        method: 'post',
        data: {
            examination_id: data.examination_id,
            answer: JSON.stringify(data.answer)
        }
    })
}