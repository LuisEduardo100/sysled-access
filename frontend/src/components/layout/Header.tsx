import { Package } from 'lucide-react'

export function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-background px-6 border-b">
            <div className="flex items-center gap-2 font-semibold text-lg text-primary">
                <Package className="h-6 w-6" />
                <span>Gestão de Suprimentos</span>
            </div>
            <div className="ml-auto flex items-center gap-4">
                {/* Connection status or other indicators could go here */}
                <span className="text-sm text-muted-foreground">Online</span>
            </div>
        </header>
    )
}
