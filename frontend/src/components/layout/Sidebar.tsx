import { Button } from "@/components/ui/button"
import { LayoutDashboard, ShoppingCart, Archive, Users } from 'lucide-react'

export function Sidebar() {
    return (
        <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
            <nav className="flex flex-col gap-2 p-4">
                <Button variant="secondary" className="justify-start gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                </Button>
                <Button variant="ghost" className="justify-start gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Pedidos
                </Button>
                <Button variant="ghost" className="justify-start gap-2">
                    <Archive className="h-4 w-4" />
                    Estoques
                </Button>
                <Button variant="ghost" className="justify-start gap-2">
                    <Users className="h-4 w-4" />
                    Fornecedores
                </Button>
            </nav>
        </aside>
    )
}
