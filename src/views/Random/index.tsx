import React from 'react'
import Choice from '../components/Choice'
import { getRandomQuestion } from '../../api/question'


export default () => <Choice type={1} dataAction={ getRandomQuestion }/>