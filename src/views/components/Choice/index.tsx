import React, { useState, useEffect, useCallback } from 'react'
import { question, IOption } from 'types/question'
import Options from '../Options'
import { AxiosPromise } from 'axios'
import { IGetQuestionResult, reportQuestion } from '../../../api/question'
import { questionTypes, answerTypes } from '../../../utilities/configs'
import { inject, observer } from 'mobx-react';
import { AppStore } from '../../../store';
import { Result, Button } from 'antd';
import './style.scss'

export type IDataAction = (data?: any) => AxiosPromise<IGetQuestionResult>
export type onCountChange = (count: number) => void;
export type onOptionConfirm = (question: question, answer: string[]) => void
export type onFinish = () => void

export interface IChoiceProps {
    // ['顺序做题', '随机做题', '考试模式']
    type: number;
    count?: number;
    isChecked?: boolean;
    autoNext?: boolean;
    store?: AppStore;
    dataAction?: IDataAction;
    dataActiomParams?: any;
    examQuestion?: question;
    onCountChange?: onCountChange;
    onOptionConfirm?: onOptionConfirm;
    size?: number;
    onFinish?: onFinish;
}

const Choice: React.FC<IChoiceProps> = inject('store')(
    observer(({isChecked: parentIsChecked, type, autoNext: parentAutoNext, store, dataAction, dataActiomParams, examQuestion, onCountChange, onOptionConfirm, count, size, onFinish}) => {
        // 获取题目
        const [ isEmpty, question, nextHandle, autoNextHandle ] = useQuestions(store!.getMenuId, dataAction, dataActiomParams, examQuestion, onCountChange, count, size, onFinish)
        // 自动生成判断题选项
        const options = useOptions(question)
        // 整合父类的批阅状态
        const [ isChecked, checkSelf ] = useIsChecked(question, parentIsChecked)
        // 整合父类的答对自动继续
        const autoNext = getAutoNext(parentAutoNext, type)

        function confirmHandle () {
            if (type === 2) {
                nextHandle()
            } else {
                checkSelf()
            }
        }

        function HandleOnChecked (isCorrent: boolean) {
            autoNext && isCorrent && autoNextHandle()
            question && question.id && type !== 2 && reportQuestion({
                question_id: question.id,
                answer: +isCorrent
            })
        }

        function HandleOptionChange (options: string[]) {
            onOptionConfirm && onOptionConfirm(question, options)
        }

        return (
            <div className="choice">
                {!isEmpty && question && <div>
                    <div className="choice-title">{question.id && `${question.id}. `}【{questionTypes[question.type] || '加载题目中...'}】</div>
                    <div className="choice-dry">{question?.question}</div>
                    <Options
                        options={options}
                        type={question.type}
                        isChecked={isChecked as boolean}
                        answer={question.answer!}
                        onChecked={HandleOnChecked}
                        onChange={HandleOptionChange}
                    ></Options>
                    {!isChecked && <Button size="large" className="choice-btn" block type="primary" onClick={confirmHandle}>确定</Button>}
                    {isChecked && <Button size="large" className="choice-btn" block type="primary" onClick={nextHandle}>下一题</Button>}
                </div>}
                {isEmpty && <Result
                    status="success"
                    title="完成所有题目!"
                    subTitle="您已经完成了该模式下的所有题目。"
                    extra={[
                        <Button type="primary" key="console" onClick={() => window.location.replace('/')}>
                            返回首页
                        </Button>
                    ]}
                />}
            </div>
        )
    })
)

function getAutoNext (next: boolean | undefined, type: number): boolean {
    // ['顺序做题', '随机做题', '考试模式']
    if (typeof next === 'undefined') {
        switch (type) {
            case 0:
                return true;
            case 1:
                return true;
            case 2:
                return false;
        }
    }
    return !!next
}

function useQuestions (menuId: number, dataAction?: IDataAction, dataActiomParams?: any, examQuestion?: question | undefined, onCountChange?: onCountChange, parentCount?: number, size?: number, onFinish?: () => void): [ boolean, question, () => void, () => void ] {
    const [count, setCount] = useState(parentCount || 0)
    const [question, setQuestion] = useState({} as question)
    const [isEmpty, setIsEmpty] = useState(false)

    useEffect(() => {
        if (examQuestion) {
            setQuestion(examQuestion)
        } else {
            dataAction && dataAction(dataActiomParams).then(question => {
                if (!question.data.total) {
                    setIsEmpty(true)
                }
                setQuestion(question.data.question)
            })
        }
    }, [count, menuId, dataAction, examQuestion, dataActiomParams])

    const nextHandle = () => {
        const newCount = count + 1
        if (size && size <= newCount) {
            onFinish && onFinish()
            return
        }
        setCount(newCount)
        onCountChange && onCountChange(newCount)
    }

    return [ isEmpty, question, nextHandle, () => { setTimeout(nextHandle, 300) } ]
}

function useIsChecked (question: question, isChecked: boolean | undefined): [boolean, () => void] {
    const [isCheckedSelf, setIsCheckedSelf] = useState(false)

    function getIsChecked () {
        if (typeof isChecked === 'undefined') {
            return isCheckedSelf
        }
        return isChecked
    }

    function checkSelf () {
        setIsCheckedSelf(true)
    }

    useEffect(() => {
        setIsCheckedSelf(false)
        // eslint-disable-next-line
    }, [question])

    return [getIsChecked(), checkSelf]
}

function useOptions (question: question) {
    function getOptionsValue () {
        if (!question) return []
        if (question.type === 0) {
            return answerTypes.map((v, i) => ({name: v, is_false: +(i !== +question.answer!) }))
        } else if (question.type === 2) {
            return question.items && question.items.map(v => ({name: v, is_false: +(question.answer?.includes(v) || 1) }))
        } else {
            return question.items && question.items.map(v => ({name: v, is_false: +(v !== question.answer) }))
        }
    }

    const [optionsValue, setOptionsValue] = useState([] as IOption[])
    const _getOptionsValue = useCallback(getOptionsValue, [question])

    useEffect(() => {
        setOptionsValue(_getOptionsValue())
    },  [question, _getOptionsValue])

    return optionsValue
}

export default Choice
