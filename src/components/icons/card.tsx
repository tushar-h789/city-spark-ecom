import * as React from "react"
import { SVGProps } from "react"
const CreditOrDebitIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={41}
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      d="M3.334 33.834h33.333v3.333H3.334v-3.333Zm3.333-13.333h3.334v11.666H6.667V20.501Zm8.334 0h3.333v11.666h-3.333V20.501Zm6.666 0h3.334v11.666h-3.334V20.501Zm8.334 0h3.333v11.666h-3.333V20.501ZM3.334 12.167l16.667-8.333 16.666 8.333v6.667H3.334v-6.667Zm16.667 1.667a1.667 1.667 0 1 0 0-3.333 1.667 1.667 0 0 0 0 3.333Z"
    />
  </svg>
)
export default CreditOrDebitIcon
