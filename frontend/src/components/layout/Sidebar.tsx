
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    activeTab: "pendencias" | "produtos"
    onTabChange: (tab: "pendencias" | "produtos") => void
}

export function Sidebar({ className, activeTab, onTabChange }: SidebarProps) {
    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Gestão
                    </h2>
                    <div className="space-y-1">
                        <Button
                            variant={activeTab === "pendencias" ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => onTabChange("pendencias")}
                        >
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Pendências
                        </Button>
                        <Button
                            variant={activeTab === "produtos" ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => onTabChange("produtos")}
                        >
                            <Package className="mr-2 h-4 w-4" />
                            Produtos
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
