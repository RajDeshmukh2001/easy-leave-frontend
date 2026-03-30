import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Leave from './Leave'

const renderLeavePage = () => {
    render(
        <MemoryRouter>
            <Leave />
        </MemoryRouter>
    )
}

describe('Leave Page Component',()=>{
    test("renders Leave component content",()=>{
        renderLeavePage()
        expect(screen.getByText('Coming Soon')).toBeInTheDocument()
    })
})