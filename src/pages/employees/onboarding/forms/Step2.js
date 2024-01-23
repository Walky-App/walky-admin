import Select from '@/components/shared/forms/Select'
import TextInput from '@/components/shared/forms/TextInput'
import {accountTypes} from '@/variables'

export default function Step2({ setContinueStyle, stepComplete, setStepComplete }) {
  const handleStepComplete = () => {
    setContinueStyle(true)
    setStepComplete({ ...stepComplete, form2: 'complete' })
  }
  
  return (
    <section className="h-[calc(100vh-250px)] overflow-y-scroll pb-16">
      <div className="flex flex-col">
        <h1 className="text-3xl flex justify-center mr-auto">Direct Deposit</h1>
        <p className="flex justify-center mt-3">
          Please enter the below information so we can set up a direct deposit of your paycheck into your checking or savings account.
        </p>
      </div>
      <div className="mx-auto mt-8 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
  <TextInput
    label="Allocation Method*"
    name="allocationMethod"
    placeholder="Allocation Method*"
    required
  />
  <TextInput
    label="Allocation Amount*"
    name="allocationAmount"
    placeholder="Allocation Amount*"
    required
  />
<Select
  options={accountTypes}
  label="Account Type*"
  name="accountType"
  placeholder="Account Type*"
  required
/>
  <TextInput
    label="Bank Name*"
    name="bankName"
    placeholder="Bank Name*"
    required
  />
  <TextInput
    label="Routing Number*"
    name="routingNumber"
    placeholder="Routing Number*"
    required
  />
  <TextInput
    label="Re-Enter Routing Number*"
    name="reenterRoutingNumber"
    placeholder="Reenter Routing Number*"
    required
  />
  <TextInput
    label="Account Number*"
    name="accountNumber"
    placeholder="Account Number*"
    required
  />
  <TextInput
    label="Re-Enter Account Number*"
    name="reenterAccountNumber"
    placeholder="Reenter Account Number*"
    required
  />
</div>
</div>
</div>
</section>
  )
}