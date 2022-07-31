import React, { useEffect, useState, useRef } from 'react';
import FlashcardList from './FlashcardList';
import './appp.css';
import axios from 'axios';

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [categories, setCategories] = useState([]);
  const categoryEl = useRef()
  const amountEl = useRef()

  useEffect(() => {
    axios.get('https://opentdb.com/api_category.php')
      .then(res => {
        setCategories(res.data.trivia_categories)
      })
  }, [])

  useEffect(() => {
    axios
      .get('https://opentdb.com/api.php?amount=10')
      .then(res => {
        setFlashcards(res.data.results.map((questionItem, index) => {
          const answer = decodeString(questionItem.correct_answer)
          const options = [
            ...questionItem.incorrect_answers.map(a => decodeString(a))
            , answer
          ]
          return {
            id : `${index}-${Date.now()}`,
            question : decodeString(questionItem.question),
            answer : questionItem.correct_answer,
            options: options.sort(()=> Math.random() - 0.5)
          }
        }))
      })
} , [])

  function decodeString(str) {
    const textAreaa = document.createElement('textarea');
    textAreaa.innerHTML = str;
    return textAreaa.value;
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios
    .get('https://opentdb.com/api.php?amount=10', {
      params: {
        amount: amountEl.current.value,
        category: categoryEl.current.value
      }
    })
    .then(res => {
      setFlashcards(res.data.results.map((questionItem, index) => {
        const answer = decodeString(questionItem.correct_answer)
        const options = [
          ...questionItem.incorrect_answers.map(a => decodeString(a))
          , answer
        ]
        return {
          id : `${index}-${Date.now()}`,
          question : decodeString(questionItem.question),
          answer : questionItem.correct_answer,
          options: options.sort(()=> Math.random() - 0.5)
        }
      }))
    })
  }

  return (
    <>
    <form className='header' onSubmit={handleSubmit}>
      <div className='from-group'>
        <label htmlFor='category'>Category</label>
        <select id='category' ref={categoryEl}>
          {categories.map(category => {
            return <option key={category.id} value={category.id}>{category.name}</option>
          }
          )}
        </select>
      </div>
      <div className='from-group'>
        <label htmlFor='amount'>Number Of questions</label>
        <input type='number' id='amount' min='1' step='1' defaultValue={10} ref={amountEl} />
      </div>
      <div className='from-group'>
        <button className='btn'>Generate</button>
      </div>
    </form>
    <div className="container">
     <FlashcardList flashcards={flashcards} />
    </div>
    </>
  );
}

export default App;
