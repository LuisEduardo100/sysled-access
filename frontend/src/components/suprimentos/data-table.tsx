import * as React from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FilterBar } from "@/components/suprimentos/FilterBar"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onMetricsChange?: (metrics: { totalPendentes: number; uniqueClients: number }) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onMetricsChange,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [globalFilter, setGlobalFilter] = React.useState("")

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: "includesString",
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 50,
            },
        },
    })

    const filteredRowsModel = table.getFilteredRowModel().rows;
    const filteredRowsCount = filteredRowsModel.length

    React.useEffect(() => {
        if (onMetricsChange) {
            const uniqueClients = new Set(
                filteredRowsModel.map(r => (r.original as any).cliente || (r.original as any).clienteFantasia || (r.original as any).idCliente)
            ).size;

            onMetricsChange({
                totalPendentes: filteredRowsCount,
                uniqueClients
            });
        }
    }, [filteredRowsModel, onMetricsChange, filteredRowsCount]);

    const totalRows = data.length
    const pageIndex = table.getState().pagination.pageIndex
    const pageCount = table.getPageCount()

    return (
        <div className="space-y-4">
            {/* Filter Bar */}
            <FilterBar
                table={table}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                totalRows={totalRows}
                filteredRows={filteredRowsCount}
            />

            {/* Table Container */}
            <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm bg-card">
                <div className="overflow-x-auto custom-scrollbar">
                    <Table className="min-w-full">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="bg-muted/30 hover:bg-muted/30 border-b border-border/60">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="h-10 px-3">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row, index) => (
                                    <TableRow
                                        key={row.id}
                                        className={`
                                            transition-colors duration-100
                                            hover:bg-primary/[0.03] dark:hover:bg-primary/[0.06]
                                            ${index % 2 === 0 ? "" : "bg-muted/[0.15]"}
                                        `}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-2.5 px-3">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-32 text-center text-muted-foreground"
                                    >
                                        Nenhum resultado encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-1">
                <div className="text-xs text-muted-foreground tabular-nums">
                    Mostrando{" "}
                    <span className="font-semibold text-foreground">
                        {pageIndex * table.getState().pagination.pageSize + 1}
                    </span>
                    {" - "}
                    <span className="font-semibold text-foreground">
                        {Math.min(
                            (pageIndex + 1) * table.getState().pagination.pageSize,
                            filteredRowsCount
                        )}
                    </span>
                    {" de "}
                    <span className="font-semibold text-foreground">{filteredRowsCount}</span>
                    {" registros"}
                    {filteredRowsCount < totalRows && (
                        <span className="text-muted-foreground/70">
                            {" "}(filtrados de {totalRows})
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1.5">
                    <div className="text-xs text-muted-foreground mr-2 tabular-nums">
                        Página {pageIndex + 1} de {pageCount || 1}
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronsLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronsRight className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
