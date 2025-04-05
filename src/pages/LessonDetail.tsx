
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, CheckCircle, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from "sonner";
import TestResult from '@/components/TestResult';

// Demo lesson content
const lessonContents = {
  '1': {
    title: 'Английский алфавит и фонетика',
    content: `
      <h2>Английский алфавит</h2>
      <p>Английский алфавит состоит из 26 букв: A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z.</p>
      
      <h3>Гласные звуки</h3>
      <p>В английском языке 5 гласных букв (A, E, I, O, U), но они могут произноситься по-разному, образуя около 20 различных гласных звуков.</p>
      
      <p>Например:</p>
      <ul>
        <li><strong>A</strong> может звучать как [æ] (cat), [eɪ] (make), [ɑː] (car)</li>
        <li><strong>E</strong> может звучать как [e] (bed), [iː] (me)</li>
        <li><strong>I</strong> может звучать как [ɪ] (sit), [aɪ] (fine)</li>
        <li><strong>O</strong> может звучать как [ɒ] (hot), [əʊ] (go)</li>
        <li><strong>U</strong> может звучать как [ʌ] (cup), [juː] (tune)</li>
      </ul>
      
      <h3>Согласные звуки</h3>
      <p>Согласные буквы также могут произноситься по-разному в зависимости от их положения в слове или сочетания с другими буквами.</p>
      
      <p>Некоторые особенности произношения согласных:</p>
      <ul>
        <li><strong>Th</strong> может произноситься как [θ] (think) или [ð] (this)</li>
        <li><strong>Ch</strong> обычно произносится как [tʃ] (church)</li>
        <li><strong>Sh</strong> произносится как [ʃ] (ship)</li>
        <li><strong>Ph</strong> произносится как [f] (photo)</li>
      </ul>
      
      <h3>Правила чтения</h3>
      <p>В английском языке существуют определённые правила чтения, которые помогают понять, как произносить слова:</p>
      
      <ol>
        <li>Открытый и закрытый слог: в открытом слоге гласная обычно произносится как в алфавите, в закрытом - кратко.</li>
        <li>Немая "e" в конце слова часто делает предыдущую гласную долгой.</li>
        <li>Сочетания гласных могут давать специфические звуки: "ea" часто произносится как [iː].</li>
      </ol>
    `,
    test: {
      title: 'Тест по алфавиту и фонетике',
      questions: [
        {
          id: '1-1',
          text: 'Сколько букв в английском алфавите?',
          options: [
            { id: '1-1-1', text: '24', isCorrect: false },
            { id: '1-1-2', text: '26', isCorrect: true },
            { id: '1-1-3', text: '28', isCorrect: false },
            { id: '1-1-4', text: '33', isCorrect: false }
          ]
        },
        {
          id: '1-2',
          text: 'Какой звук обозначает сочетание букв "th" в слове "think"?',
          options: [
            { id: '1-2-1', text: '[f]', isCorrect: false },
            { id: '1-2-2', text: '[ð]', isCorrect: false },
            { id: '1-2-3', text: '[θ]', isCorrect: true },
            { id: '1-2-4', text: '[s]', isCorrect: false }
          ]
        },
        {
          id: '1-3',
          text: 'Сколько гласных букв в английском алфавите?',
          options: [
            { id: '1-3-1', text: '5', isCorrect: true },
            { id: '1-3-2', text: '6', isCorrect: false },
            { id: '1-3-3', text: '8', isCorrect: false },
            { id: '1-3-4', text: '10', isCorrect: false }
          ]
        }
      ]
    }
  },
  '2': {
    title: 'Present Simple (Настоящее простое время)',
    content: `
      <h2>Present Simple</h2>
      <p>Present Simple (настоящее простое время) используется для описания регулярных действий, фактов, привычек, а также общих истин.</p>
      
      <h3>Образование Present Simple</h3>
      <p>Для большинства глаголов форма Present Simple совпадает с базовой формой глагола (инфинитивом без частицы "to").</p>
      
      <h4>Утвердительные предложения:</h4>
      <ul>
        <li>I / You / We / They + глагол основной формы: <em>I work every day.</em></li>
        <li>He / She / It + глагол + -s/-es: <em>She works every day.</em></li>
      </ul>
      
      <p>Правила добавления окончаний -s/-es:</p>
      <ul>
        <li>Обычно добавляется -s: work → works</li>
        <li>После s, z, x, ch, sh добавляется -es: watch → watches</li>
        <li>Если глагол оканчивается на -y после согласной, -y меняется на -i и добавляется -es: study → studies</li>
      </ul>
      
      <h4>Отрицательные предложения:</h4>
      <p>Для образования отрицания используется вспомогательный глагол do/does + not + основная форма глагола.</p>
      <ul>
        <li>I / You / We / They + do not (don't) + глагол: <em>I don't work on Sundays.</em></li>
        <li>He / She / It + does not (doesn't) + глагол: <em>She doesn't work on Sundays.</em></li>
      </ul>
      
      <h4>Вопросительные предложения:</h4>
      <p>Для образования вопроса используется инверсия с вспомогательным глаголом do/does.</p>
      <ul>
        <li>Do + I / you / we / they + глагол...? <em>Do you work on Mondays?</em></li>
        <li>Does + he / she / it + глагол...? <em>Does she work on Mondays?</em></li>
      </ul>
      
      <h3>Случаи употребления Present Simple</h3>
      <ol>
        <li>Регулярные, повторяющиеся действия: <em>I go to the gym three times a week.</em></li>
        <li>Постоянные ситуации и состояния: <em>She lives in London.</em></li>
        <li>Общие истины и факты: <em>The Earth rotates around the Sun.</em></li>
        <li>Расписания и программы: <em>The train leaves at 5 pm.</em></li>
      </ol>
      
      <h3>Маркеры времени в Present Simple</h3>
      <p>Часто Present Simple используется со следующими наречиями и выражениями:</p>
      <ul>
        <li>always, usually, often, sometimes, seldom, rarely, never</li>
        <li>every day/week/month/year</li>
        <li>once/twice a week/month</li>
        <li>on Mondays, in the morning</li>
      </ul>
    `,
    test: {
      title: 'Тест по Present Simple',
      questions: [
        {
          id: '2-1',
          text: 'Какое окончание добавляется к глаголу в 3-м лице единственного числа (he/she/it)?',
          options: [
            { id: '2-1-1', text: '-ing', isCorrect: false },
            { id: '2-1-2', text: '-s/-es', isCorrect: true },
            { id: '2-1-3', text: '-ed', isCorrect: false },
            { id: '2-1-4', text: 'никакое', isCorrect: false }
          ]
        },
        {
          id: '2-2',
          text: 'Выберите правильную форму глагола "study" в 3-м лице единственного числа:',
          options: [
            { id: '2-2-1', text: 'studys', isCorrect: false },
            { id: '2-2-2', text: 'studyes', isCorrect: false },
            { id: '2-2-3', text: 'studies', isCorrect: true },
            { id: '2-2-4', text: 'studying', isCorrect: false }
          ]
        },
        {
          id: '2-3',
          text: 'Какая форма используется для образования отрицания с "he"?',
          options: [
            { id: '2-3-1', text: 'he do not', isCorrect: false },
            { id: '2-3-2', text: 'he does not', isCorrect: true },
            { id: '2-3-3', text: 'he not', isCorrect: false },
            { id: '2-3-4', text: 'he is not', isCorrect: false }
          ]
        }
      ]
    }
  },
  '3': {
    title: 'Present Continuous (Настоящее длительное время)',
    content: `
      <h2>Present Continuous</h2>
      <p>Present Continuous (настоящее длительное время) используется для описания действий, происходящих в данный момент, временных ситуаций, а также запланированных действий в ближайшем будущем.</p>
      
      <h3>Образование Present Continuous</h3>
      <p>Present Continuous образуется при помощи вспомогательного глагола be (am/is/are) и причастия настоящего времени основного глагола (с окончанием -ing).</p>
      
      <h4>Утвердительные предложения:</h4>
      <ul>
        <li>I + am + глагол с -ing: <em>I am reading a book.</em></li>
        <li>He / She / It + is + глагол с -ing: <em>She is reading a book.</em></li>
        <li>You / We / They + are + глагол с -ing: <em>They are reading books.</em></li>
      </ul>
      
      <p>Правила добавления окончания -ing:</p>
      <ul>
        <li>Обычно просто добавляется -ing: read → reading</li>
        <li>Если глагол оканчивается на -e, оно опускается: write → writing</li>
        <li>Если односложный глагол оканчивается на согласную с предшествующей ударной гласной, последняя согласная удваивается: run → running</li>
        <li>Если глагол оканчивается на -ie, эти буквы меняются на -y: lie → lying</li>
      </ul>
      
      <h4>Отрицательные предложения:</h4>
      <p>Для образования отрицания частица not ставится после вспомогательного глагола.</p>
      <ul>
        <li>I am not (I'm not) + глагол с -ing: <em>I am not reading.</em></li>
        <li>He / She / It is not (isn't) + глагол с -ing: <em>She isn't reading.</em></li>
        <li>You / We / They are not (aren't) + глагол с -ing: <em>They aren't reading.</em></li>
      </ul>
      
      <h4>Вопросительные предложения:</h4>
      <p>Для образования вопроса используется инверсия с вспомогательным глаголом be.</p>
      <ul>
        <li>Am + I + глагол с -ing...? <em>Am I reading correctly?</em></li>
        <li>Is + he / she / it + глагол с -ing...? <em>Is she reading a novel?</em></li>
        <li>Are + you / we / they + глагол с -ing...? <em>Are they reading magazines?</em></li>
      </ul>
      
      <h3>Случаи употребления Present Continuous</h3>
      <ol>
        <li>Действия, происходящие в момент речи: <em>I am studying English now.</em></li>
        <li>Временные ситуации: <em>She is living with her parents until she finds an apartment.</em></li>
        <li>Запланированные действия в ближайшем будущем: <em>We are meeting John tomorrow.</em></li>
        <li>Раздражающие привычки с наречием always: <em>He is always talking during movies!</em></li>
      </ol>
      
      <h3>Маркеры времени в Present Continuous</h3>
      <p>Часто Present Continuous используется со следующими наречиями и выражениями:</p>
      <ul>
        <li>now, at the moment, at present</li>
        <li>today, this week/month</li>
        <li>currently, right now</li>
        <li>still, nowadays</li>
      </ul>
      
      <h3>Глаголы, не используемые в Continuous</h3>
      <p>Некоторые глаголы, обозначающие состояние, а не действие, обычно не используются в Continuous:</p>
      <ul>
        <li>Глаголы чувственного восприятия: see, hear, smell, taste, feel</li>
        <li>Глаголы мыслительной деятельности: know, understand, believe, think (в значении "считать")</li>
        <li>Глаголы эмоционального состояния: love, hate, like, prefer</li>
        <li>Глаголы обладания: have (в значении "иметь"), own, possess, belong</li>
      </ul>
    `,
    test: {
      title: 'Тест по Present Continuous',
      questions: [
        {
          id: '3-1',
          text: 'Как образуется Present Continuous?',
          options: [
            { id: '3-1-1', text: 'глагол + -ed', isCorrect: false },
            { id: '3-1-2', text: 'do/does + глагол', isCorrect: false },
            { id: '3-1-3', text: 'be (am/is/are) + глагол с -ing', isCorrect: true },
            { id: '3-1-4', text: 'have/has + глагол с -ing', isCorrect: false }
          ]
        },
        {
          id: '3-2',
          text: 'Выберите правильную форму глагола "write" в Present Continuous для "he":',
          options: [
            { id: '3-2-1', text: 'he write', isCorrect: false },
            { id: '3-2-2', text: 'he is writing', isCorrect: true },
            { id: '3-2-3', text: 'he writing', isCorrect: false },
            { id: '3-2-4', text: 'he writes', isCorrect: false }
          ]
        },
        {
          id: '3-3',
          text: 'Какие глаголы обычно НЕ используются в форме Continuous?',
          options: [
            { id: '3-3-1', text: 'Глаголы движения (run, walk)', isCorrect: false },
            { id: '3-3-2', text: 'Глаголы чувственного восприятия (see, hear)', isCorrect: true },
            { id: '3-3-3', text: 'Глаголы речи (say, tell)', isCorrect: false },
            { id: '3-3-4', text: 'Глаголы действия (do, make)', isCorrect: false }
          ]
        }
      ]
    }
  },
  '4': {
    title: 'Past Simple (Простое прошедшее время)',
    content: `
      <h2>Past Simple</h2>
      <p>Past Simple (простое прошедшее время) используется для описания завершенных действий в прошлом, последовательности действий в прошлом, а также для описания состояний и привычек в прошлом.</p>
      
      <h3>Образование Past Simple</h3>
      <p>В Past Simple правильные глаголы образуются путем добавления окончания -ed к базовой форме глагола, а неправильные глаголы имеют особые формы, которые нужно запомнить.</p>
      
      <h4>Правильные глаголы:</h4>
      <ul>
        <li>work → worked</li>
        <li>play → played</li>
        <li>study → studied</li>
      </ul>
      
      <p>Правила добавления -ed:</p>
      <ul>
        <li>Обычно просто добавляется -ed: work → worked</li>
        <li>Если глагол оканчивается на -e, добавляется только -d: like → liked</li>
        <li>Если глагол оканчивается на согласную + y, y меняется на i и добавляется -ed: study → studied</li>
        <li>Если односложный глагол оканчивается на согласную с предшествующей краткой гласной, согласная удваивается: stop → stopped</li>
      </ul>
      
      <h4>Неправильные глаголы:</h4>
      <p>Неправильные глаголы имеют особые формы прошедшего времени, которые нужно запомнить:</p>
      <ul>
        <li>go → went</li>
        <li>see → saw</li>
        <li>do → did</li>
        <li>have → had</li>
        <li>be → was/were</li>
      </ul>
      
      <h4>Утвердительные предложения:</h4>
      <ul>
        <li>Подлежащее + глагол в прошедшем времени: <em>I worked yesterday. She went to school.</em></li>
        <li>Особая форма для глагола be: I/he/she/it + was, you/we/they + were. <em>I was at home. They were happy.</em></li>
      </ul>
      
      <h4>Отрицательные предложения:</h4>
      <ul>
        <li>Подлежащее + did not (didn't) + базовая форма глагола: <em>I didn't work yesterday. She didn't go to school.</em></li>
        <li>Для глагола be: I/he/she/it + was not (wasn't), you/we/they + were not (weren't). <em>I wasn't at home. They weren't happy.</em></li>
      </ul>
      
      <h4>Вопросительные предложения:</h4>
      <ul>
        <li>Did + подлежащее + базовая форма глагола? <em>Did you work yesterday? Did she go to school?</em></li>
        <li>Для глагола be: Was + I/he/she/it...? Were + you/we/they...? <em>Was she at home? Were they happy?</em></li>
      </ul>
      
      <h3>Случаи употребления Past Simple</h3>
      <ol>
        <li>Завершенные действия в прошлом: <em>I visited Paris last year.</em></li>
        <li>Последовательность действий в прошлом: <em>I got up, had breakfast and went to work.</em></li>
        <li>Привычные действия в прошлом: <em>When I was a child, I played tennis every day.</em></li>
        <li>Состояния в прошлом: <em>She was happy in her old job.</em></li>
      </ol>
      
      <h3>Маркеры времени в Past Simple</h3>
      <p>Часто Past Simple используется со следующими наречиями и выражениями:</p>
      <ul>
        <li>yesterday, last week/month/year</li>
        <li>ago (two days ago, a long time ago)</li>
        <li>in 2010, in the past</li>
        <li>when I was young</li>
      </ul>
    `,
    test: {
      title: 'Тест по Past Simple',
      questions: [
        {
          id: '4-1',
          text: 'Как образуется прошедшее время правильных глаголов?',
          options: [
            { id: '4-1-1', text: 'глагол + -ing', isCorrect: false },
            { id: '4-1-2', text: 'глагол + -s', isCorrect: false },
            { id: '4-1-3', text: 'глагол + -ed', isCorrect: true },
            { id: '4-1-4', text: 'did + глагол', isCorrect: false }
          ]
        },
        {
          id: '4-2',
          text: 'Выберите правильную форму прошедшего времени глагола "go":',
          options: [
            { id: '4-2-1', text: 'goed', isCorrect: false },
            { id: '4-2-2', text: 'went', isCorrect: true },
            { id: '4-2-3', text: 'going', isCorrect: false },
            { id: '4-2-4', text: 'gone', isCorrect: false }
          ]
        },
        {
          id: '4-3',
          text: 'Как образуется отрицание в Past Simple (кроме глагола "be")?',
          options: [
            { id: '4-3-1', text: 'no + глагол', isCorrect: false },
            { id: '4-3-2', text: "don't + глагол", isCorrect: false },
            { id: '4-3-3', text: "didn't + глагол", isCorrect: true },
            { id: '4-3-4', text: 'not + глагол с -ed', isCorrect: false }
          ]
        }
      ]
    }
  },
  '5': {
    title: 'Условные предложения (Conditionals)',
    content: `
      <h2>Условные предложения (Conditionals)</h2>
      <p>Условные предложения используются для описания ситуаций, в которых одно действие зависит от другого. В английском языке существует несколько типов условных предложений, каждый из которых используется для определённых ситуаций.</p>
      
      <h3>Структура условных предложений</h3>
      <p>Условные предложения обычно состоят из двух частей:</p>
      <ul>
        <li>Условие (if-clause) - часть предложения, содержащая условие</li>
        <li>Результат (main clause) - часть предложения, описывающая результат выполнения условия</li>
      </ul>
      
      <h3>Типы условных предложений</h3>
      
      <h4>Zero Conditional (Нулевой тип)</h4>
      <p>Используется для описания общих истин, научных фактов, закономерностей.</p>
      <p><strong>If + Present Simple, Present Simple</strong></p>
      <p>Пример: <em>If you heat water to 100 degrees Celsius, it boils.</em></p>
      
      <h4>First Conditional (Первый тип)</h4>
      <p>Используется для описания реальных или возможных ситуаций в будущем.</p>
      <p><strong>If + Present Simple, will + инфинитив</strong></p>
      <p>Пример: <em>If it rains tomorrow, I will stay at home.</em></p>
      
      <h4>Second Conditional (Второй тип)</h4>
      <p>Используется для описания нереальных, маловероятных или гипотетических ситуаций в настоящем или будущем.</p>
      <p><strong>If + Past Simple, would + инфинитив</strong></p>
      <p>Пример: <em>If I had a million dollars, I would travel around the world.</em></p>
      
      <h4>Third Conditional (Третий тип)</h4>
      <p>Используется для описания нереальных ситуаций в прошлом (то, что могло бы произойти, но не произошло).</p>
      <p><strong>If + Past Perfect, would + have + причастие прошедшего времени</strong></p>
      <p>Пример: <em>If I had studied harder, I would have passed the exam.</em></p>
      
      <h3>Смешанный тип условных предложений</h3>
      <p>Иногда используются смешанные типы условных предложений, когда условие относится к одному времени, а результат — к другому.</p>
      <p>Пример: <em>If I had saved money when I was young (прошлое), I would be rich now (настоящее).</em></p>
      
      <h3>Альтернативы слову "if"</h3>
      <p>Вместо if можно использовать другие союзы и конструкции:</p>
      <ul>
        <li>unless (если не): <em>Unless you hurry, you will miss the train.</em></li>
        <li>provided/providing (that) (при условии, что): <em>I'll lend you the money provided (that) you pay me back next week.</em></li>
        <li>as long as / so long as (при условии, что): <em>You can use my car as long as you drive carefully.</em></li>
        <li>on condition that (при условии, что): <em>I'll help you on condition that you help me later.</em></li>
      </ul>
      
      <h3>Инверсия в условных предложениях</h3>
      <p>В формальном английском вместо if иногда используется инверсия:</p>
      <ul>
        <li>If I were you... = Were I you...</li>
        <li>If he had known... = Had he known...</li>
        <li>If she should call... = Should she call...</li>
      </ul>
    `,
    test: {
      title: 'Тест по условным предложениям',
      questions: [
        {
          id: '5-1',
          text: 'Какая структура используется в First Conditional?',
          options: [
            { id: '5-1-1', text: 'If + Past Simple, would + инфинитив', isCorrect: false },
            { id: '5-1-2', text: 'If + Present Simple, Present Simple', isCorrect: false },
            { id: '5-1-3', text: 'If + Present Simple, will + инфинитив', isCorrect: true },
            { id: '5-1-4', text: 'If + Past Perfect, would have + причастие', isCorrect: false }
          ]
        },
        {
          id: '5-2',
          text: 'Для каких ситуаций используется Second Conditional?',
          options: [
            { id: '5-2-1', text: 'Для научных фактов', isCorrect: false },
            { id: '5-2-2', text: 'Для реальных ситуаций в будущем', isCorrect: false },
            { id: '5-2-3', text: 'Для нереальных ситуаций в настоящем или будущем', isCorrect: true },
            { id: '5-2-4', text: 'Для нереальных ситуаций в прошлом', isCorrect: false }
          ]
        },
        {
          id: '5-3',
          text: 'Выберите правильную форму условного предложения третьего типа:',
          options: [
            { id: '5-3-1', text: 'If I study, I will pass the exam.', isCorrect: false },
            { id: '5-3-2', text: 'If I studied, I would pass the exam.', isCorrect: false },
            { id: '5-3-3', text: 'If I had studied, I would have passed the exam.', isCorrect: true },
            { id: '5-3-4', text: 'If I am studying, I pass the exam.', isCorrect: false }
          ]
        }
      ]
    }
  }
};

const LessonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('theory');
  
  // State for test
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [showTestResult, setShowTestResult] = useState(false);
  const [isPerfectScore, setIsPerfectScore] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    // Load completed lessons from localStorage
    const storedCompletedLessons = localStorage.getItem('completedLessons');
    if (storedCompletedLessons) {
      setCompletedLessons(JSON.parse(storedCompletedLessons));
    }
  }, []);

  const lesson = id ? lessonContents[id as keyof typeof lessonContents] : null;
  const test = lesson?.test;
  const questions = test?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Handle selecting an answer
  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  // Go to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Go to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Submit test and calculate results
  const handleSubmitTest = () => {
    if (!test || !questions.length) return;
    
    let score = 0;
    questions.forEach(question => {
      const selectedOptionId = selectedAnswers[question.id];
      if (selectedOptionId) {
        const correctOption = question.options.find(option => option.isCorrect);
        if (correctOption && correctOption.id === selectedOptionId) {
          score++;
        }
      }
    });
    
    setTestScore(score);
    setIsTestSubmitted(true);
    setShowTestResult(true);
    
    const isPerfect = score === questions.length;
    setIsPerfectScore(isPerfect);
    
    // If perfect score, mark lesson as completed
    if (isPerfect && id) {
      const updatedCompletedLessons = [...completedLessons];
      if (!updatedCompletedLessons.includes(id)) {
        updatedCompletedLessons.push(id);
        setCompletedLessons(updatedCompletedLessons);
        localStorage.setItem('completedLessons', JSON.stringify(updatedCompletedLessons));
        
        toast.success("Урок успешно завершен!", {
          description: "Вы прошли тест на 100% и можете продолжить обучение."
        });
      }
    }
  };

  // Reset test for retaking
  const handleResetTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsTestSubmitted(false);
  };

  // Close test results
  const handleCloseTestResult = () => {
    setShowTestResult(false);
  };

  // Render a test question with options
  const renderQuestion = () => {
    if (!currentQuestion) return null;
    
    const selectedOptionId = selectedAnswers[currentQuestion.id];
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{currentQuestion.text}</h3>
        <div className="space-y-2">
          {currentQuestion.options.map(option => {
            const isSelected = selectedOptionId === option.id;
            const isCorrect = option.isCorrect;
            let optionClass = "p-4 border rounded-md cursor-pointer hover:bg-gray-50";
            
            if (isTestSubmitted) {
              if (isCorrect) {
                optionClass = "p-4 border rounded-md bg-green-50 border-green-200";
              } else if (isSelected && !isCorrect) {
                optionClass = "p-4 border rounded-md bg-red-50 border-red-200";
              }
            } else if (isSelected) {
              optionClass = "p-4 border rounded-md bg-primary/10 border-primary";
            }
            
            return (
              <div 
                key={option.id}
                className={optionClass}
                onClick={() => !isTestSubmitted && handleAnswerSelect(currentQuestion.id, option.id)}
              >
                <div className="flex items-center justify-between">
                  <div>{option.text}</div>
                  {isTestSubmitted && (
                    <div>
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (isSelected && !isCorrect ? (
                        <XCircle className="h-5 w-5 text-red-500" />
                      ) : null)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // If lesson not found
  if (!lesson) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Урок не найден" />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="container mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold mb-4">Урок не найден</h2>
                    <p className="text-muted-foreground mb-6">
                      Запрашиваемый урок не существует или был удален
                    </p>
                    <Button onClick={() => navigate('/lessons')}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Вернуться к списку уроков
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={lesson.title} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="container mx-auto">
            <div className="mb-6">
              <Button variant="outline" onClick={() => navigate('/lessons')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к урокам
              </Button>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {lesson.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs 
                  defaultValue="theory" 
                  value={activeTab} 
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="mb-4">
                    <TabsTrigger value="theory">Теория</TabsTrigger>
                    <TabsTrigger value="practice">Тест</TabsTrigger>
                  </TabsList>
                  <TabsContent value="theory">
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />
                    
                    <div className="mt-8 border-t pt-6">
                      <Button 
                        onClick={() => setActiveTab('practice')}
                        className="w-full"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        ПРОЙТИ ТЕСТ
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="practice">
                    {test ? (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">{test.title}</h3>
                          <div className="text-sm text-muted-foreground">
                            Вопрос {currentQuestionIndex + 1} из {questions.length}
                          </div>
                        </div>
                        
                        {renderQuestion()}
                        
                        <div className="flex justify-between mt-6 pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={handlePrevQuestion}
                            disabled={currentQuestionIndex === 0 || isTestSubmitted}
                          >
                            Предыдущий
                          </Button>
                          
                          <div className="space-x-2">
                            {isTestSubmitted ? (
                              <Button 
                                onClick={handleResetTest}
                                variant="outline"
                              >
                                Пройти снова
                              </Button>
                            ) : (
                              <>
                                {currentQuestionIndex < questions.length - 1 ? (
                                  <Button 
                                    onClick={handleNextQuestion}
                                    disabled={!selectedAnswers[currentQuestion?.id]}
                                  >
                                    Следующий
                                  </Button>
                                ) : (
                                  <Button 
                                    onClick={handleSubmitTest}
                                    disabled={!Object.keys(selectedAnswers).length || 
                                      Object.keys(selectedAnswers).length < questions.length}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Завершить тест
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground p-8">
                        <p className="mb-4">Тест для этого урока отсутствует.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Test results dialog */}
            {test && (
              <TestResult
                open={showTestResult}
                onClose={handleCloseTestResult}
                score={testScore}
                totalQuestions={questions.length}
                testTitle={test.title}
                isPerfectScore={isPerfectScore}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LessonDetail;
