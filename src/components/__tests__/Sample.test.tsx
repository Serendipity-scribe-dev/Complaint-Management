import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

function Sample() {
  return <h1>Hello Complaint App</h1>
}

describe('Sample Component', () => {
  it('renders correctly', () => {
    render(<Sample />)
    expect(screen.getByText(/Hello Complaint App/i)).toBeInTheDocument()
  })
})
