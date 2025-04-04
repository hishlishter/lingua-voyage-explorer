
import { WordSetData } from '@/components/WordSetCard';

// Data for word sets
export const wordSetsData: WordSetData[] = [
  {
    id: 'idioms',
    title: 'Английские идиомы',
    icon: '📚',
    gradientClass: 'card-gradient-pink',
    words: [
      { id: '1', word: 'Break a leg', translation: 'Ни пуха, ни пера (пожелание удачи)' },
      { id: '2', word: 'Piece of cake', translation: 'Проще простого' },
      { id: '3', word: 'Hit the books', translation: 'Приступить к учебе' },
      { id: '4', word: 'Under the weather', translation: 'Неважно себя чувствовать' },
      { id: '5', word: 'Cost an arm and a leg', translation: 'Стоить очень дорого' },
    ]
  },
  {
    id: 'countries',
    title: 'Страны и города',
    icon: '🌎',
    gradientClass: 'card-gradient-purple',
    words: [
      { id: '1', word: 'United Kingdom', translation: 'Соединенное Королевство' },
      { id: '2', word: 'France', translation: 'Франция' },
      { id: '3', word: 'Germany', translation: 'Германия' },
      { id: '4', word: 'London', translation: 'Лондон' },
      { id: '5', word: 'Paris', translation: 'Париж' },
    ]
  },
  {
    id: 'time',
    title: 'Который час?',
    icon: '🕒',
    gradientClass: 'card-gradient-blue',
    words: [
      { id: '1', word: 'It\'s half past two', translation: 'Половина третьего' },
      { id: '2', word: 'It\'s quarter to nine', translation: 'Без четверти девять' },
      { id: '3', word: 'It\'s ten o\'clock', translation: 'Десять часов' },
      { id: '4', word: 'It\'s midday', translation: 'Полдень' },
      { id: '5', word: 'It\'s midnight', translation: 'Полночь' },
    ]
  }
];
