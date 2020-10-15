import React from 'react'
import Choice from '../components/Choice'
import { getDiffcultQuestion } from '../../api/question'


export default () => <Choice type={3} dataAction={ getDiffcultQuestion }/>