import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { CiclesReducer, cycle } from '../reducers/cycles/reducer'
import {
  AddNewCyclesActions,
  MarkCurrentCycleAsFinishedAction,
  interruptedCurrentCycleAction,
} from '../reducers/cycles/actions'
interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: cycle[]
  activeCycle: cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  CreateNewCycle: (data: CreateCycleData) => void
  InterruptCurrentCycle: () => void
}
export const CycleContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    CiclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const storedStateAsJSON = localStorage.getItem(
        '@igniteTimer: cycles-state-1.0.0',
      )
      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }
    },
  )

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)
    localStorage.setItem('@igniteTimer: cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }
  function markCurrentCycleAsFinished() {
    dispatch(MarkCurrentCycleAsFinishedAction())
  }
  function CreateNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())
    const newCycle: cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    dispatch(AddNewCyclesActions(newCycle))

    setAmountSecondsPassed(0)
  }
  function InterruptCurrentCycle() {
    dispatch(interruptedCurrentCycleAction())
  }
  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        CreateNewCycle,
        InterruptCurrentCycle,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}
