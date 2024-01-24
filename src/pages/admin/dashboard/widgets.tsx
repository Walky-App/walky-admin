export function TaskList() {
  return (
    <div className="mx-0 mb-4 sm:ml-4 xl:mr-4">
      <div className="w-full bg-zinc-50 shadow-lg rounded-2xl">
        <p className="p-4 font-bold text-zinc-950 text-md">
          My Jobs
        </p>
        <ul>
          <li className="flex items-center justify-between py-3 text-zinc-600 border-b-2 border-zinc-100">
            <div className="flex items-center justify-start text-sm">
              <span className="mx-4">12/03</span>
              <span>Preston Farms: Trimming</span>
            </div>
            <svg
              width="20"
              height="20"
              fill="currentColor"
              className="mx-4 text-zinc-400"
              viewBox="0 0 1024 1024">
              <path
                d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0 0 51.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z"
                fill="currentColor"></path>
              <path
                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372z"
                fill="currentColor"></path>
            </svg>
          </li>
          <li className="flex items-center justify-between py-3 text-zinc-600 border-b-2 border-zinc-100">
            <div className="flex items-center justify-start text-sm">
              <span className="mx-4">12/08</span>
              <span>Preston Farms: Harvest</span>
              <span className="flex items-center ml-2 text-zinc-400 lg:ml-6">
                3
                <svg
                  width="15"
                  height="15"
                  fill="currentColor"
                  className="ml-1"
                  viewBox="0 0 512 512">
                  <path
                    d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2l-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29c7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1l-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160s-93.3 160-208 160z"
                    fill="currentColor"></path>
                </svg>
              </span>
            </div>
            <svg
              width="20"
              height="20"
              fill="currentColor"
              className="mx-4 text-zinc-400"
              viewBox="0 0 1024 1024">
              <path
                d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0 0 51.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z"
                fill="currentColor"></path>
              <path
                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372z"
                fill="currentColor"></path>
            </svg>
          </li>
          <li className="flex items-center justify-between py-3 text-zinc-600 border-b-2 border-zinc-100">
            <div className="flex items-center justify-start text-sm">
              <span className="mx-4">12/10</span>
              <span>Bodine: Trimming</span>
              <span className="flex items-center ml-2 text-zinc-400 lg:ml-6">
                3
                <svg
                  width="15"
                  height="15"
                  fill="currentColor"
                  className="ml-1"
                  viewBox="0 0 512 512">
                  <path
                    d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2l-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29c7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1l-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160s-93.3 160-208 160z"
                    fill="currentColor"></path>
                </svg>
              </span>
            </div>
            <svg
              width="20"
              height="20"
              fill="currentColor"
              className="mx-4 text-zinc-400"
              viewBox="0 0 1024 1024">
              <path
                d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0 0 51.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z"
                fill="currentColor"></path>
              <path
                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372z"
                fill="currentColor"></path>
            </svg>
          </li>
          <li className="flex items-center justify-between py-3 text-zinc-400 border-b-2 border-zinc-100">
            <div className="flex items-center justify-start text-sm">
              <span className="mx-4">12/11</span>
              <span className="line-through">Bodine: Trimming</span>
            </div>
            <svg
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 1024 1024"
              className="mx-4 text-green-500">
              <path
                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8l157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"
                fill="currentColor"></path>
            </svg>
          </li>
          <li className="flex items-center justify-between py-3 text-zinc-400 border-b-2 border-zinc-100">
            <div className="flex items-center justify-start text-sm">
              <span className="mx-4">12/12</span>
              <span className="line-through">Hammond: Harvesting</span>
            </div>
            <svg
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 1024 1024"
              className="mx-4 text-green-500">
              <path
                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8l157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"
                fill="currentColor"></path>
            </svg>
          </li>
          <li className="flex items-center justify-between py-3 text-zinc-600 border-b-2 border-zinc-100">
            <div className="flex items-center justify-start text-sm">
              <span className="mx-4">12/13</span>
              <span>Hammond: Trimming</span>
              <span className="flex items-center ml-2 text-zinc-400 lg:ml-6">
                3
                <svg
                  width="15"
                  height="15"
                  fill="currentColor"
                  className="ml-1"
                  viewBox="0 0 512 512">
                  <path
                    d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2l-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29c7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1l-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160s-93.3 160-208 160z"
                    fill="currentColor"></path>
                </svg>
              </span>
            </div>
            <svg
              width="20"
              height="20"
              fill="currentColor"
              className="mx-4 text-zinc-400"
              viewBox="0 0 1024 1024">
              <path
                d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0 0 51.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z"
                fill="currentColor"></path>
              <path
                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372z"
                fill="currentColor"></path>
            </svg>
          </li>
          <li className="flex items-center justify-between py-3 text-zinc-600">
            <div className="flex items-center justify-start text-sm">
              <span className="mx-4">12/14</span>
              <span>Hammond: Trimming</span>
            </div>
            <svg
              width="20"
              height="20"
              fill="currentColor"
              className="mx-4 text-zinc-400"
              viewBox="0 0 1024 1024">
              <path
                d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0 0 51.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z"
                fill="currentColor"></path>
              <path
                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372z"
                fill="currentColor"></path>
            </svg>
          </li>
        </ul>
      </div>
    </div>
  )
}

export function ClassList() {
  return (
    <div className="mb-4 sm:ml-4 xl:mr-4">
      <div className="w-full bg-zinc-50 shadow-lg rounded-2xl">
        <div className="flex items-center justify-between p-4">
          <p className="font-bold text-zinc-950 text-md">Learn</p>
          <button className="p-1 mr-4 text-sm text-zinc-400 border border-zinc-400 rounded">
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
              <g fill="none">
                <path
                  d="M17.222 8.685a1.5 1.5 0 0 1 0 2.628l-10 5.498A1.5 1.5 0 0 1 5 15.496V4.502a1.5 1.5 0 0 1 2.223-1.314l10 5.497z"
                  fill="currentColor"></path>
              </g>
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-between px-4 py-2 text-zinc-600 bg-blue-100 border-l-4 border-blue-500">
          <p className="flex items-center text-xs">
            <svg
              width="20"
              height="20"
              fill="currentColor"
              className="mr-2 text-blue-500"
              viewBox="0 0 24 24">
              <g fill="none">
                <path
                  d="M12 5a8.5 8.5 0 1 1 0 17a8.5 8.5 0 0 1 0-17zm0 3a.75.75 0 0 0-.743.648l-.007.102v4.5l.007.102a.75.75 0 0 0 1.486 0l.007-.102v-4.5l-.007-.102A.75.75 0 0 0 12 8zm7.17-2.877l.082.061l1.149 1a.75.75 0 0 1-.904 1.193l-.081-.061l-1.149-1a.75.75 0 0 1 .903-1.193zM14.25 2.5a.75.75 0 0 1 .102 1.493L14.25 4h-4.5a.75.75 0 0 1-.102-1.493L9.75 2.5h4.5z"
                  fill="currentColor"></path>
              </g>
            </svg>
            Harvesting
          </p>
          <div className="flex items-center">
            <span className="ml-2 mr-2 text-xs font-bold md:ml-4">25 min 20s</span>
            <button className="p-1 mr-4 text-sm text-zinc-400 bg-blue-500 border rounded">
              <svg
                width="17"
                height="17"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="text-zinc-50">
                <g fill="none">
                  <path
                    d="M9 6a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1zm6 0a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1z"
                    fill="currentColor"></path>
                </g>
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2 text-zinc-600 border-b-2 border-zinc-100">
          <p className="flex items-center text-xs">
            <svg width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 24 24">
              <g fill="none">
                <path
                  d="M12 5a8.5 8.5 0 1 1 0 17a8.5 8.5 0 0 1 0-17zm0 3a.75.75 0 0 0-.743.648l-.007.102v4.5l.007.102a.75.75 0 0 0 1.486 0l.007-.102v-4.5l-.007-.102A.75.75 0 0 0 12 8zm7.17-2.877l.082.061l1.149 1a.75.75 0 0 1-.904 1.193l-.081-.061l-1.149-1a.75.75 0 0 1 .903-1.193zM14.25 2.5a.75.75 0 0 1 .102 1.493L14.25 4h-4.5a.75.75 0 0 1-.102-1.493L9.75 2.5h4.5z"
                  fill="currentColor"></path>
              </g>
            </svg>
            Packaging
          </p>
          <div className="flex items-center">
            <span className="ml-2 mr-2 text-xs text-zinc-400 md:ml-4">30 min</span>
            <button className="p-1 mr-4 text-sm text-zinc-400 border border-zinc-400 rounded">
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
                <g fill="none">
                  <path
                    d="M17.222 8.685a1.5 1.5 0 0 1 0 2.628l-10 5.498A1.5 1.5 0 0 1 5 15.496V4.502a1.5 1.5 0 0 1 2.223-1.314l10 5.497z"
                    fill="currentColor"></path>
                </g>
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2 text-zinc-600 border-b-2 border-zinc-100">
          <p className="flex items-center text-xs">
            <svg width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 24 24">
              <g fill="none">
                <path
                  d="M12 5a8.5 8.5 0 1 1 0 17a8.5 8.5 0 0 1 0-17zm0 3a.75.75 0 0 0-.743.648l-.007.102v4.5l.007.102a.75.75 0 0 0 1.486 0l.007-.102v-4.5l-.007-.102A.75.75 0 0 0 12 8zm7.17-2.877l.082.061l1.149 1a.75.75 0 0 1-.904 1.193l-.081-.061l-1.149-1a.75.75 0 0 1 .903-1.193zM14.25 2.5a.75.75 0 0 1 .102 1.493L14.25 4h-4.5a.75.75 0 0 1-.102-1.493L9.75 2.5h4.5z"
                  fill="currentColor"></path>
              </g>
            </svg>
            BudTending
          </p>
          <div className="flex items-center">
            <span className="ml-2 mr-2 text-xs text-zinc-400 md:ml-4">30 min</span>
            <button className="p-1 mr-4 text-sm text-zinc-400 border border-zinc-400 rounded">
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
                <g fill="none">
                  <path
                    d="M17.222 8.685a1.5 1.5 0 0 1 0 2.628l-10 5.498A1.5 1.5 0 0 1 5 15.496V4.502a1.5 1.5 0 0 1 2.223-1.314l10 5.497z"
                    fill="currentColor"></path>
                </g>
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2 text-zinc-600">
          <p className="flex items-center text-xs">
            <svg width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 24 24">
              <g fill="none">
                <path
                  d="M12 5a8.5 8.5 0 1 1 0 17a8.5 8.5 0 0 1 0-17zm0 3a.75.75 0 0 0-.743.648l-.007.102v4.5l.007.102a.75.75 0 0 0 1.486 0l.007-.102v-4.5l-.007-.102A.75.75 0 0 0 12 8zm7.17-2.877l.082.061l1.149 1a.75.75 0 0 1-.904 1.193l-.081-.061l-1.149-1a.75.75 0 0 1 .903-1.193zM14.25 2.5a.75.75 0 0 1 .102 1.493L14.25 4h-4.5a.75.75 0 0 1-.102-1.493L9.75 2.5h4.5z"
                  fill="currentColor"></path>
              </g>
            </svg>
            Clone Care
          </p>
          <div className="flex items-center">
            <span className="ml-2 mr-2 text-xs text-zinc-400 md:ml-4">30 min</span>
            <button className="p-1 mr-4 text-sm text-zinc-400 border border-zinc-400 rounded">
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
                <g fill="none">
                  <path
                    d="M17.222 8.685a1.5 1.5 0 0 1 0 2.628l-10 5.498A1.5 1.5 0 0 1 5 15.496V4.502a1.5 1.5 0 0 1 2.223-1.314l10 5.497z"
                    fill="currentColor"></path>
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CalendarWidget() {
  return (
    <div className="mb-4">
      <div className="p-4 bg-zinc-50 shadow-lg rounded-2xl">
        <div className="flex flex-wrap overflow-hidden">
          <div className="w-full rounded shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-bold text-left text-zinc-950">Dec 2023</div>
              <div className="flex space-x-4">
                <button className="p-2 text-zinc-50 bg-blue-500 rounded-full">
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M13.83 19a1 1 0 0 1-.78-.37l-4.83-6a1 1 0 0 1 0-1.27l5-6a1 1 0 0 1 1.54 1.28L10.29 12l4.32 5.36a1 1 0 0 1-.78 1.64z"></path>
                  </svg>
                </button>
                <button className="p-2 text-zinc-50 bg-blue-500 rounded-full">
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M10 19a1 1 0 0 1-.64-.23a1 1 0 0 1-.13-1.41L13.71 12L9.39 6.63a1 1 0 0 1 .15-1.41a1 1 0 0 1 1.46.15l4.83 6a1 1 0 0 1 0 1.27l-5 6A1 1 0 0 1 10 19z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="-mx-2">
              <table className="w-full">
                <tr>
                  <th className="px-2 py-3 md:px-3 ">S</th>
                  <th className="px-2 py-3 md:px-3 ">M</th>
                  <th className="px-2 py-3 md:px-3 ">T</th>
                  <th className="px-2 py-3 md:px-3 ">W</th>
                  <th className="px-2 py-3 md:px-3 ">T</th>
                  <th className="px-2 py-3 md:px-3 ">F</th>
                  <th className="px-2 py-3 md:px-3 ">S</th>
                </tr>
                <tr className="text-zinc-400">
                  <td className="px-2 py-3 text-center text-zinc-300 md:px-3">25</td>
                  <td className="px-2 py-3 text-center text-zinc-300 md:px-3">26</td>
                  <td className="px-2 py-3 text-center text-zinc-300 md:px-3">27</td>
                  <td className="px-2 py-3 text-center text-zinc-300 md:px-3">28</td>
                  <td className="px-2 py-3 text-center text-zinc-300 md:px-3">29</td>
                  <td className="px-2 py-3 text-center text-zinc-300 md:px-3">30</td>
                  <td className="px-2 py-3 text-center text-zinc-800 cursor-pointer md:px-3 hover:text-blue-500">
                    1
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    2
                  </td>
                  <td className="relative px-1 py-3 text-center cursor-pointer hover:text-blue-500">
                    3
                    <span className="absolute bottom-0 w-2 h-2 transform -translate-x-1/2 bg-blue-500 rounded-full left-1/2"></span>
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    4
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    5
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    6
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    7
                  </td>
                  <td className="relative px-2 py-3 text-center cursor-pointer md:px-3 lg:px-3 hover:text-blue-500">
                    8
                    <span className="absolute bottom-0 w-2 h-2 transform -translate-x-1/2 bg-yellow-500 rounded-full left-1/2"></span>
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    9
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    10
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    11
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    12
                  </td>
                  <td className="px-2 py-3 text-center text-zinc-50 cursor-pointer md:px-3">
                    <span className="p-2 bg-blue-500 rounded-full">13</span>
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    14
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    15
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    16
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    17
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    18
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    19
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    20
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    21
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    22
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    23
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    24
                  </td>
                  <td className="relative px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    25
                    <span className="absolute bottom-0 w-2 h-2 transform -translate-x-1/2 bg-red-500 rounded-full left-1/2"></span>
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    26
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    27
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    28
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    29
                  </td>
                </tr>
                <tr>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    30
                  </td>
                  <td className="px-2 py-3 text-center cursor-pointer md:px-3 hover:text-blue-500">
                    31
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MessagesWidget() {
  return (
    <div className="mb-4">
      <div className="w-full p-4 bg-zinc-50 shadow-lg rounded-2xl">
        <p className="font-bold text-zinc-950 text-md">Messages</p>
        <ul>
          <li className="flex items-center my-6 space-x-2">
            <a href="#" className="relative block">
              <img
                alt="profil"
                src="https://www.tailwind-kit.com/images/person/1.jpg"
                className="mx-auto object-cover rounded-full h-10 w-10 "
              />
            </a>
            <div className="flex flex-col">
              <span className="ml-2 text-sm font-semibold text-zinc-900">Charlie Rabiller</span>
              <span className="ml-2 text-sm text-zinc-400">
                Hey John ! Do you read the NextJS doc ?
              </span>
            </div>
          </li>
          <li className="flex items-center my-6 space-x-2">
            <a href="#" className="relative block">
              <img
                alt="profil"
                src="https://www.tailwind-kit.com/images/person/5.jpg"
                className="mx-auto object-cover rounded-full h-10 w-10 "
              />
            </a>
            <div className="flex flex-col">
              <span className="ml-2 text-sm font-semibold text-zinc-900">Marie Lou</span>
              <span className="ml-2 text-sm text-zinc-400">No I think the dog is better...</span>
            </div>
          </li>
          <li className="flex items-center my-6 space-x-2">
            <a href="#" className="relative block">
              <img
                alt="profil"
                src="https://www.tailwind-kit.com/images/person/6.jpg"
                className="mx-auto object-cover rounded-full h-10 w-10 "
              />
            </a>
            <div className="flex flex-col">
              <span className="ml-2 text-sm font-semibold text-zinc-900">Ivan Buck</span>
              <span className="ml-2 text-sm text-zinc-400">
                Seriously ? haha Bob is not a child !
              </span>
            </div>
          </li>
          <li className="flex items-center my-6 space-x-2">
            <a href="#" className="relative block">
              <img
                alt="profil"
                src="https://www.tailwind-kit.com/images/person/7.jpg"
                className="mx-auto object-cover rounded-full h-10 w-10 "
              />
            </a>
            <div className="flex flex-col">
              <span className="ml-2 text-sm font-semibold text-zinc-900">Marina Farga</span>
              <span className="ml-2 text-sm text-zinc-400">Do you need that design ?</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}
