import { HandPalm, Play } from 'phosphor-react'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './style'
import { createContext, useState } from 'react'
import { NewCycleContainer } from './components/new-cycle-form'
import { Countdown } from './components/countdown'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'

interface cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}
interface CyclesContextType {
  activeCycle: cycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
}

export const CycleContext = createContext({} as CyclesContextType)

const newCycleFormValidationshema = zod.object({
  task: zod.string().min(1, 'informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O ciclo precisa ser de no mínimo 5 min')
    .max(60, 'O ciclo precisa ser de no máximo 60 min'),
})

// inferir retirar
type newCycleFormData = zod.infer<typeof newCycleFormValidationshema>
export function Home() {
  const [cycles, setCycles] = useState<cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  const newCycleForm = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleFormValidationshema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }
  function handleCreateNewCycle(data: newCycleFormData) {
    const id = String(new Date().getTime())
    const newCycle: cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    setCycles((state) => [newCycle, ...state])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)
    reset()
  }
  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }

  const task = watch('task')
  const isSubmitDisabled = !task

  /** prop Drilling -> quando tem muita propriedade apenas para comunicação
   * Context API -> permite a partilha de informações entre varios componentes ao mesmo tempo
   */
  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <CycleContext.Provider
          value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished }}
        >
          <NewCycleContainer />
          <Countdown />
        </CycleContext.Provider>
        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
