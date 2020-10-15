import React from 'react'
import Choice from '../components/Choice'
import { getReviewQuestion } from '../../api/question'


export default () => <Choice type={3} dataAction={ getReviewQuestion }/>