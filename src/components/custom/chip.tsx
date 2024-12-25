export default function Chip() {
  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700">
        <span>Chip Label</span>
        <button
          type="button"
          className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-gray-300 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-gray-50"
        >
          <XIcon className="h-3 w-3" />
          <span className="sr-only">Dismiss</span>
        </button>
      </div>
    </div>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
