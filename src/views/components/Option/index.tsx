import React from 'react'
import classNames from 'classnames';
import { IOption } from 'types/question'
import './style.scss'

export interface IOptionProps {
    isChoosed: boolean;
    isChecked: boolean;
    option: IOption;
    onChoosed?: Function;
    prefix?: string;
}

const Option: React.FC<IOptionProps> = (props: IOptionProps) => {
    const { isChoosed, isChecked, option, onChoosed, prefix } = props

    const className = classNames(
        'option',
        {
            'isChoosed': isChoosed,
            'isChecked': isChecked,
            'isCorrect': !option.is_false
        }
    )

    const onClickHandle = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
        if (onChoosed) {
            onChoosed(props.option)
        }
    }



    return (
        <div className={className} onClick={onClickHandle}>
            {prefix ? `${prefix}. ` : ''}{option.name}
        </div>
    )
}

export default Option