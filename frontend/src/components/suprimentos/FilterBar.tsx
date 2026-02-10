import type { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FilterBarProps<TData> {
    table: Table<TData>
}

export function FilterBar<TData>({ table }: FilterBarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card mb-4 shadow-sm">
            <div className="flex flex-wrap gap-4">
                {/* Global Search / Product Filter */}
                <div className="flex-1 min-w-[200px]">
                    <Input
                        placeholder="Buscar por produto..."
                        value={(table.getColumn("produto")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("produto")?.setFilterValue(event.target.value)
                        }
                        className="w-full"
                    />
                </div>

                {/* Status Filter */}
                <div className="w-[180px]">
                    <Select
                        value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) =>
                            table.getColumn("status")?.setFilterValue(value === "all" ? undefined : value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                            <SelectItem value="Aprovado">Aprovado</SelectItem>
                            <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Curva ABC Filter */}
                <div className="w-[150px]">
                    <Select
                        value={(table.getColumn("curvaABC")?.getFilterValue() as string) ?? "all"}
                        onValueChange={(value) =>
                            table.getColumn("curvaABC")?.setFilterValue(value === "all" ? undefined : value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Curva ABC" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="A">Curva A</SelectItem>
                            <SelectItem value="B">Curva B</SelectItem>
                            <SelectItem value="C">Curva C</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Reset Filters */}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => table.resetColumnFilters()}
                        title="Limpar filtros"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}
