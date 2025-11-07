import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ComplaintForm from '../ComplaintForm'

describe('ComplaintForm', () => {
  it('renders form fields', () => {
   render(<ComplaintForm userId="test-user-id" onSuccess={vi.fn()} />)
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    const onSuccess = vi.fn()
    render(<ComplaintForm userId="test-user-id" onSuccess={onSuccess} />)
    
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Complaint' }
    })

    // ❗️ FIX: Fill in the required description field
  fireEvent.change(screen.getByLabelText(/description/i), {
    target: { value: 'This is a detailed test description.' }
  })
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
    })
  })
})
