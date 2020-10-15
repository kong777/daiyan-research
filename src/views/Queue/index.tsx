import React from 'react'
import Choice from '../components/Choice'
import { getOrderQuestion } from '../../api/question'


export default () => <Choice type={1} dataAction={ getOrderQuestion }/>