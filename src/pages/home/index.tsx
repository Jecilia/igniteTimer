import { HandPalm, Play } from 'phosphor-react'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './style'
import { NewCycleContainer } from './components/new-cycle-form'
import { Countdown } from './components/countdown'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import * as zod from 'zod'
import { useContext } from 'react'
import { CycleContext } from '../../contexts/cycles-context'

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
  const { activeCycle, CreateNewCycle, InterruptCurrentCycle } =
    useContext(CycleContext)
  const newCycleForm = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleFormValidationshema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })
  const { handleSubmit, watch, reset } = newCycleForm
  function handleCreateNewCycle(data: newCycleFormData) {
    CreateNewCycle(data)
    reset()
  }
  const task = watch('task')
  const isSubmitDisabled = !task

  /** prop Drilling -> quando tem muita propriedade apenas para comunicação
   * Context API -> permite a partilha de informações entre varios componentes ao mesmo tempo
   */
  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleContainer />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={InterruptCurrentCycle} type="button">
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
