import React, { useState, useEffect, useCallback } from 'react'
import Choice from '../components/Choice'
import { question, IExaminationResultQuestion, IAnswerOptionList } from 'types/'
import { getQuestionMenu, selfExamination, IExamination, reportSelfExamination, IExaminationAnswer, IReportSelfExaminationResult } from '../../api/question'
import { onOptionConfirm } from '../components/Choice'
import { Button, Popover } from 'antd';
import { EditOutlined, AppstoreOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import './style.scss'

export interface IExamProps {

}

const Exam: React.FC<IExamProps> = () => {
    const [questionList, examId] = useExam()
    const [count, setCount] = useState(0)
    const [step, setStep] = useState(0)
    const [answerOptionList, answerList, handleOptionConfirm] = useReportAnswer()
    const [scoreInfo, setScoreInfo] = useState({} as IReportSelfExaminationResult)

    async function handleExamFinish () {
        try {
            let resp = await reportSelfExamination({
                examination_id: examId,
                answer: answerList
            })
            setScoreInfo(resp.data)
        } catch (err) {
            console.log(err)
        }
        setStep(2)
    }

    function getUsedTime(start: string, end: string) {
        const used = (new Date(end).getTime() - new Date(start).getTime())/1000
        return Math.floor(used/60) + 1
        
    }

    const questionListBlock = <div className="question-list">
        {questionList.map((v, i) => {
            const className = classNames(
                'question-item',
                {
                    'done': answerList[v.id] !== undefined,
                    'current': questionList[count] === v
                }
            )
            return <div className={className} key={v.id} onClick={() => setCount(i)}>
                {i + 1}
            </div>
        })}
    </div>

    return (
        <div>
            {step === 0 && (<div className="exam-info">
                <h2>模拟考试</h2>
                <div className="exam-item">
                    <span className="exam-label">总分：</span>
                    <span>
                        <i style={{fontSize: 24, color: '#52c41a'}}>100</i>
                    分</span>
                </div>
                <div className="exam-item">
                    <span className="exam-label">时长：</span>
                    <span>
                        <i style={{fontSize: 24, color: '#1890ff'}}>60</i>
                    分钟</span>
                </div>
                <Button className="exam-btn" size="large" block type="primary" icon={<EditOutlined/>} onClick={() => setStep(1)}>开始考试</Button>
            </div>)}
            {step === 1 && (<div>
                <Choice
                    type={2}
                    defaultOptions={answerOptionList[questionList[count]?.id]}
                    isChecked={false}
                    autoNext={false}
                    count={count}
                    examQuestion={questionList[count] as question}
                    onCountChange={(count: number) => setCount(count)}
                    onOptionConfirm={handleOptionConfirm}
                    size={questionList.length}
                    onFinish={handleExamFinish}
                />
                <div className="select-question">
                    <Popover placement="bottomLeft" title="选择题目" content={questionListBlock} trigger="click">
                        <Button type="primary" icon={<AppstoreOutlined />}></Button>
                    </Popover>
                </div>
            </div>)
            }
            {step === 2 && <div className="exam-info"   >
                <h2>考试结束</h2>
                <div className="exam-item">
                    <span className="exam-label">得分：</span>
                    <span>
                        <i style={{fontSize: 24, color: '#52c41a'}}>{scoreInfo.examination.score}</i>
                        / 100</span>
                </div>
                <div className="exam-item">
                    <span className="exam-label">耗时：</span>
                    <span>
                        
                        <i style={{fontSize: 24, color: '#1890ff'}}>{getUsedTime(scoreInfo.examination.created_at, scoreInfo.examination.updated_at)}</i>
                    分钟</span>
                </div>
            </div>}
        </div>
    )
}

export type judgeOption = '正确' | '错误';

const useReportAnswer = (): [ IAnswerOptionList, IExaminationAnswer[], onOptionConfirm ] => {
    function handleOptionConfirm (question: question, options: string[]) {
        let _options: IExaminationAnswer = question.type === 2 ? options : options.toString()
        if (!Array.isArray(_options) && question.type === 0) {
            // @ts-ignore
            _options = {'正确': 0, '错误': 1}[_options as judgeOption]
        }
        setAnswerList({
            ...answerList,
            [question.id]: _options
        })
        const answerOption = {
            [question.id]: options.map(v => ({name: v, is_false: 0}))
        } as IAnswerOptionList
        setAnswerOptionList({
            ...answerOptionList,
            ...answerOption
        })
    }

    const [answerList, setAnswerList] = useState([] as IExaminationAnswer[])
    const [answerOptionList, setAnswerOptionList] = useState({} as IAnswerOptionList)

    return [answerOptionList, answerList, handleOptionConfirm]
}

const useExam = (): [IExaminationResultQuestion[], number] => {
    const [exam, setExam] = useState({} as IExamination)

    const _getQuestionMenu = useCallback(getQuestionMenu, [])

    useEffect(() => {
        _getQuestionMenu().then(result => {
            setExam(result.data.list[0].speciality[0].examination[0]!)
        })
    }, [_getQuestionMenu])

    const [questionList, questionId] = useQuestionList(exam)

    return [questionList, questionId]
}

const useQuestionList = (exam: IExamination): [ IExaminationResultQuestion[], number ] => {
    const [questionList, setQuestionList] = useState([] as IExaminationResultQuestion[])
    const [questionId, setQuestionId] = useState(0)

    const _selfExamination = useCallback(selfExamination, [exam])

    useEffect(() => {
        exam && exam.id && _selfExamination().then(result => {
            setQuestionList(result.data.questions)
            setQuestionId(result.data.examination.id)
        })
    }, [exam, _selfExamination])

    return [questionList, questionId]
}

export default Exam