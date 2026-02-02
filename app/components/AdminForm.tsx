'use client'

import { useState } from 'react'
import { updatePollConfig } from '../actions'

interface AdminFormProps {
  companyId: string
  initialQuestion: string
  initialOptionA: string
  initialOptionB: string
}

export default function AdminForm({
  companyId,
  initialQuestion,
  initialOptionA,
  initialOptionB,
}: AdminFormProps) {
  const [question, setQuestion] = useState(initialQuestion)
  const [optionA, setOptionA] = useState(initialOptionA)
  const [optionB, setOptionB] = useState(initialOptionB)
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updatePollConfig(companyId, question, optionA, optionB)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (error) {
      console.error('Failed to update poll:', error)
      alert('Failed to update poll')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className='relative'>
      <form onSubmit={handleSave} className='space-y-6'>
        <div>
          <label htmlFor='question' className='block text-sm font-medium text-gray-300'>
            Question
          </label>
          <input
            type='text'
            id='question'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className='mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2'
            required
          />
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <div>
            <label htmlFor='optionA' className='block text-sm font-medium text-gray-300'>
              Option A Label
            </label>
            <input
              type='text'
              id='optionA'
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              className='mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2'
              required
            />
          </div>

          <div>
            <label htmlFor='optionB' className='block text-sm font-medium text-gray-300'>
              Option B Label
            </label>
            <input
              type='text'
              id='optionB'
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              className='mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2'
              required
            />
          </div>
        </div>

        <div>
          <button
            type='submit'
            disabled={isSaving}
            className={`flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isSaving
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>

      {/* Toast Notification */}
      {showToast && (
        <div className='fixed bottom-4 right-4 z-50 flex items-center rounded-lg bg-green-500 px-4 py-2 text-white shadow-lg transition-opacity duration-300'>
          <svg
            className='mr-2 h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 13l4 4L19 7'
            />
          </svg>
          Poll Updated
        </div>
      )}
    </div>
  )
}
