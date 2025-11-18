import type { ReactNode } from "react"

type LayoutProps = {
    children: ReactNode
}

const DashboardLayout = ({ children }: LayoutProps) => {
    return (
        <div>{children}</div>
    )
}

export default DashboardLayout