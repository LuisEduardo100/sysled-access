/**
 * ColumnHeader — Header interativo com sorting multi-direcional
 * Cada coluna possui botão para alternar: Asc → Desc → Sem sort
 */
import type { Column } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
} from "lucide-react"

interface ColumnHeaderProps<TData, TValue> {
    column: Column<TData, TValue>
    title: string
}

export function ColumnHeader<TData, TValue>({
    column,
    title,
}: ColumnHeaderProps<TData, TValue>) {
    const sorted = column.getIsSorted()

    const handleClick = () => {
        if (sorted === false) {
            column.toggleSorting(false) // asc
        } else if (sorted === "asc") {
            column.toggleSorting(true)  // desc
        } else {
            column.clearSorting()       // clear
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleClick}
            className="h-8 px-2 text-xs font-semibold tracking-tight hover:bg-muted/80 -ml-2 whitespace-nowrap group"
        >
            {title}
            <span className="ml-1.5 transition-opacity">
                {sorted === "asc" ? (
                    <ArrowUp className="h-3.5 w-3.5 text-primary" />
                ) : sorted === "desc" ? (
                    <ArrowDown className="h-3.5 w-3.5 text-primary" />
                ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 opacity-30 group-hover:opacity-60 transition-opacity" />
                )}
            </span>
        </Button>
    )
}
