interface Props {
  title: string
}


export default function TitleComponent({ title }: Props) {
    return (
      <div className="w-screen">
        <div className="border-b border-gray-200 w-full">
          <h3 className="text-base font-semibold leading-6 text-gray-900 pb-2">{title}</h3>
        </div>
        <div className="pb-5 sm:flex sm:items-center sm:justify-between mb-10">
          <div className="mt-3 sm:ml-4 sm:mt-0">
          </div>
        </div>
      </div>
    );
  }
  