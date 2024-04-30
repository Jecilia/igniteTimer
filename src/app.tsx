import { ThemeProvider } from 'styled-components'
import { defaultTheme } from './styles/themes/default'
import { GlobalStyle } from './styles/global'

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <p>ik</p>
      <h1>yh</h1>

      <GlobalStyle />
    </ThemeProvider>
  )
}
