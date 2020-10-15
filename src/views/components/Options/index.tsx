import React, { useState, useEffect } from 'react'
import classNames from 'classnames';
import './style.scss'
import Option from '../Option'
import { IOption } from 'types/question'
import { answerTypes } from '../../../utilities/configs'
import { xor } from 'lodash'
import { Tag } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

type onChecked = (isCorrent: boolean) => void;

type onChange = (answer: string[]) => void

export interface IChoiceProps {
    options: IOption[];
    type: number;
    isChecked: boolean;
    answer: string | string[];
    onChecked?: onChecked;
    onChange?: onChange;
}

const Options: React.FC<IChoiceProps> = (props: IChoiceProps) => {
    const {options, isChecked, type, answer, onChecked, onChange} = props

    const [choosedOption, setChoosedOption, isCustomerCorrect] = useCustomerOption(answer, type, onChecked, isChecked, options)

    const className = classNames('options')

    function handleOptionChoosed (option: IOption) {
        if (isChecked) return
        const hasOptionChoosed = !!choosedOption.find(o => option.name === o.name)
        if (hasOptionChoosed) {
            setChoosedOption(choosedOption.filter(o => option.name !== o.name))
        } else {
            let newOption
            if (type === 2) {
                newOption = [option, ...choosedOption]
            } else {
                newOption = [option]
            }
            onChange && onChange(newOption.map(v => v.name))
            setChoosedOption(newOption)
        }
    }

    function renderAnswer (answer: string | string[], customerAnswer: string[]) {
        answer = typeof answer === 'string' ? answer : answer.join(', ')
        answer = ['0', '1'].includes(answer) ? answerTypes[+answer] : answer
        answer = answer.replace(/, /g, '\n')
        return (<div>
            <div>正确答案：{answer}</div>
            <div>你的答案：{customerAnswer.join('\n')}</div>
        </div>)
    }

    return (
        <div className={className}>
            {options && options.map((option, optionIndex) => (
                <Option
                    key={option.name}
                    isChoosed={!!choosedOption.find(o => option.name === o.name)}
                    isChecked={isChecked}
                    option={option}
                    onChoosed={handleOptionChoosed}
                    prefix={'ABCDEFG'[optionIndex]}
                />
            ))}
            {isChecked && !isCustomerCorrect && renderAnswer(answer, choosedOption.map(v => v.name))}
            {isChecked && isCustomerCorrect && <Tag icon={<CheckCircleOutlined />} color="success">回答正确！</Tag>}
        </div>
    )
}

const useCustomerOption = (answer: string | string[], type: number, onChecked: onChecked | undefined, isChecked: boolean, options: IOption[]): [IOption[], React.Dispatch<React.SetStateAction<IOption[]>>, boolean] => {

    const [choosedOption, setChoosedOption] = useState([] as IOption[])

    const [isCustomerCorrect, setIsCustomerCorrect] = useState(false)

    function judgeCustomerCorrect (answer: string | string[], choosedOption: IOption[], type: number) {
        if (!choosedOption.length) return false
        switch(type) {
            case 0:
                return answerTypes[+answer] === choosedOption[0].name;
            case 1:
                return answer === choosedOption[0].name;
            case 2:
                if (answer && answer.length !== choosedOption.length) {
                    return false
                }
                if (xor(answer, choosedOption.map(v => v.name)).length) {
                    return false
                }
                return true
        }
        return false
    }

    useEffect(() => {
        const isCorrect = judgeCustomerCorrect(answer, choosedOption, type)
        setIsCustomerCorrect(isCorrect)
        if (isChecked === false) {
            setChoosedOption([] as IOption[])
        } else {
            onChecked && onChecked(isCorrect)
        }
        // eslint-disable-next-line
    }, [isChecked, answer, type, options])

    return [choosedOption, setChoosedOption, isCustomerCorrect]
}

export default Options