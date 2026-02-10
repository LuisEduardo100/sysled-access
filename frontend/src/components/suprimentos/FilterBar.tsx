/**
 * FilterBar — Barra de filtros globais com busca universal,
 * filtros rápidos com chips, e contadores
 */
import type { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter, RotateCcw } from "lucide-react"

interface FilterBarProps<TData> {
    table: Table<TData>
    globalFilter: string
    setGlobalFilter: (value: string) => void
    totalRows: number
    filteredRows: number
}

export function FilterBar<TData>({
    table,
    globalFilter,
    setGlobalFilter,
    totalRows,
    filteredRows,
}: FilterBarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0 || globalFilter.length > 0
    const activeFilterCount = table.getState().columnFilters.length + (globalFilter.length > 0 ? 1 : 0)

    // Quick filters — get unique values from specific columns
    const getColumnUniqueValues = (columnId: string): string[] => {
        const column = table.getColumn(columnId)
        if (!column) return []
        const values = new Set<string>()
        table.getPreFilteredRowModel().rows.forEach((row) => {
            const val = row.getValue(columnId)
            if (val && String(val).trim()) values.add(String(val))
        })
        return Array.from(values).sort()
    }

    const compradores = getColumnUniqueValues("comprador")
    const curvas = getColumnUniqueValues("curvaABC")
    const situacoes = getColumnUniqueValues("situacaoCompra")

    const handleQuickFilter = (columnId: string, value: string) => {
        const column = table.getColumn(columnId)
        if (!column) return

        const currentFilter = column.getFilterValue() as string[] | undefined
        if (currentFilter?.includes(value)) {
            const newFilter = currentFilter.filter((v) => v !== value)
            column.setFilterValue(newFilter.length > 0 ? newFilter : undefined)
        } else {
            column.setFilterValue([...(currentFilter || []), value])
        }
    }

    const isQuickFilterActive = (columnId: string, value: string): boolean => {
        const column = table.getColumn(columnId)
        if (!column) return false
        const filter = column.getFilterValue() as string[] | undefined
        return filter?.includes(value) || false
    }

    return (
        <div className="space-y-3">
            {/* Top Row: Search + Counter + Reset */}
            <div className="flex items-center gap-3">
                {/* Global Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input
                        placeholder="Buscar em todos os campos..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="pl-9 h-9 text-sm bg-background border-border/60 focus:border-primary/40"
                    />
                    {globalFilter && (
                        <button
                            onClick={() => setGlobalFilter("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* Fornecedor filter */}
                <div className="relative max-w-[200px]">
                    <Input
                        placeholder="Fornecedor..."
                        value={(table.getColumn("fornecedorRazao")?.getFilterValue() as string) ?? ""}
                        onChange={(e) => table.getColumn("fornecedorRazao")?.setFilterValue(e.target.value)}
                        className="h-9 text-sm bg-background border-border/60"
                    />
                </div>

                {/* Produto filter */}
                <div className="relative max-w-[200px]">
                    <Input
                        placeholder="Produto..."
                        value={(table.getColumn("produto")?.getFilterValue() as string) ?? ""}
                        onChange={(e) => table.getColumn("produto")?.setFilterValue(e.target.value)}
                        className="h-9 text-sm bg-background border-border/60"
                    />
                </div>

                {/* Counters */}
                <div className="flex items-center gap-2 ml-auto">
                    {isFiltered && (
                        <Badge variant="secondary" className="gap-1 text-[10px] font-medium">
                            <Filter className="h-3 w-3" />
                            {activeFilterCount} filtro{activeFilterCount > 1 ? "s" : ""}
                        </Badge>
                    )}

                    <Badge variant="outline" className="text-[10px] font-medium tabular-nums">
                        {filteredRows === totalRows
                            ? `${totalRows} registros`
                            : `${filteredRows} / ${totalRows}`
                        }
                    </Badge>

                    {/* Reset */}
                    {isFiltered && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                table.resetColumnFilters()
                                setGlobalFilter("")
                            }}
                            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Limpar
                        </Button>
                    )}
                </div>
            </div>

            {/* Quick Filters Row */}
            <div className="flex items-center gap-4 flex-wrap">
                {/* Situação */}
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Situação:</span>
                    {situacoes.map((s) => (
                        <button
                            key={s}
                            onClick={() => handleQuickFilter("situacaoCompra", s)}
                            className={`
                                px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all duration-150 cursor-pointer
                                ${isQuickFilterActive("situacaoCompra", s)
                                    ? s === "OK"
                                        ? "bg-emerald-500 text-white shadow-sm"
                                        : "bg-red-500 text-white shadow-sm"
                                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                                }
                            `}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Curva ABC */}
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Curva:</span>
                    {curvas.filter(Boolean).map((c) => (
                        <button
                            key={c}
                            onClick={() => handleQuickFilter("curvaABC", c)}
                            className={`
                                px-2.5 py-1 rounded-full text-[10px] font-bold transition-all duration-150 cursor-pointer
                                ${isQuickFilterActive("curvaABC", c)
                                    ? c === "A"
                                        ? "bg-red-500 text-white shadow-sm"
                                        : c === "B"
                                            ? "bg-amber-500 text-white shadow-sm"
                                            : "bg-emerald-500 text-white shadow-sm"
                                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                                }
                            `}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {/* Comprador - dropdown style */}
                {compradores.length > 0 && (
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Comprador:</span>
                        <div className="flex gap-1 flex-wrap">
                            {compradores.slice(0, 8).map((c) => (
                                <button
                                    key={c}
                                    onClick={() => {
                                        const column = table.getColumn("comprador")
                                        if (!column) return
                                        const currentVal = column.getFilterValue() as string
                                        column.setFilterValue(currentVal === c ? undefined : c)
                                    }}
                                    className={`
                                        px-2.5 py-1 rounded-full text-[10px] font-medium transition-all duration-150 cursor-pointer
                                        ${(table.getColumn("comprador")?.getFilterValue() as string) === c
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "bg-muted/60 text-muted-foreground hover:bg-muted"
                                        }
                                    `}
                                >
                                    {c.split(" ").slice(0, 2).join(" ")}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
