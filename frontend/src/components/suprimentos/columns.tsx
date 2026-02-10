import type { ColumnDef } from "@tanstack/react-table"
import type { Suprimento } from "@/services/suprimentos"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<Suprimento>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "idPedido",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Pedido
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "dataPedido",
        header: "Data Pedido",
        cell: ({ row }) => {
            const date = new Date(row.getValue("dataPedido"))
            return <div className="font-medium">{date.toLocaleDateString('pt-BR')}</div>
        },
    },
    {
        accessorKey: "produto",
        header: "Produto",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            let variant: "default" | "secondary" | "destructive" | "outline" | "pending" | "approved" | "rejected" = "default"

            if (status === "Pendente") variant = "pending"
            else if (status === "Aprovado") variant = "approved"
            else if (status === "Rejeitado") variant = "rejected"

            return <Badge variant={variant}>{status}</Badge>
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "curvaABC",
        header: "Curva ABC",
        cell: ({ row }) => {
            const abc = row.getValue("curvaABC") as string
            let variant: any = "outline"
            if (abc === "A") variant = "curvaA"
            if (abc === "B") variant = "curvaB"
            if (abc === "C") variant = "curvaC"

            return <Badge variant={variant}>{abc}</Badge>
        },
    },
    {
        accessorKey: "quantidadePendencia",
        header: "Qtd. Pend.",
    },
    {
        accessorKey: "comprador",
        header: "Comprador",
    },
    {
        accessorKey: "fornecedorRazao",
        header: "Fornecedor",
    },
]
