import { render, screen } from '@testing-library/react'
import { MemoryRouter } from "react-router-dom"
import App from "../src/App"
import { describe, expect, test } from 'vitest'
const renderApp = () => {
    render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    )
}
describe('app test',()=>{
    test("app",()=>{
        renderApp()
        expect(screen.getByText('Leave Management System'))
    })
})