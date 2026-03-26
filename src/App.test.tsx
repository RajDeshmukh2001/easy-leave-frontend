import { render, screen } from '@testing-library/react'
import App from "./App"
import { describe, expect, test } from 'vitest'
const renderApp = () => {
    render(
        <App />
    )
}
describe('app test',()=>{
    test("app",()=>{
        renderApp()
        expect(screen.getByText('Leave Management System'))
    })
})