import { render, screen } from '@testing-library/react'
import App from "./App"
import { describe, expect, test } from 'vitest'
const renderApp = () => {
    render(
        <App />
    )
}
describe('App Component',()=>{
    test("renders App component content",()=>{
        renderApp()
        expect(screen.getByText('EasyLeave - Leave Management System'))
    })
})