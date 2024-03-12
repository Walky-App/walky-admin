export const AddPaymentMethodCard: React.FC = () => {
  const paymentMethods: { name: string; label: string; icon: string }[] = [
    { name: 'Credit Card', label: 'Credit Card', icon: 'pi pi-credit-card' },
    { name: 'Bank Account', label: 'Bank Account', icon: 'pi pi-briefcase' },
    { name: 'Terms', label: 'Terms Credit', icon: 'pi pi-file' },
  ]

  return (
    <div className="flex flex-col gap-8 rounded-lg bg-white p-8">
      <div className="flex flex-col gap-6">
        <div className="flex h-14 flex-col gap-3">
          <div className="text-xl font-semibold text-black">Add Payment Method</div>
        </div>
        <div className="inline-flex gap-5">
          {paymentMethods.map((method, index) => (
            <div key={index} className="inline-flex w-64 flex-col gap-5 rounded-lg border p-5">
              <div className="relative h-6 w-6">
                <i className={method.icon} />
              </div>
              <div className="flex h-5 flex-col gap-2 self-stretch">
                <div className="text-sm font-normal leading-tight text-black">{method.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
