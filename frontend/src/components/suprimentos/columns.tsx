import type { ColumnDef } from "@tanstack/react-table"
import type { Suprimento } from "@/services/suprimentos"
import { Badge } from "@/components/ui/badge"
import { ColumnHeader } from "./ColumnHeader";

export const columns: ColumnDef<Suprimento>[] = [
    {
        accessorKey: "idPedido",
        header: ({ column }) => <ColumnHeader column={column} title="Pedido" />,
        cell: ({ row }) => (
            <span className="font-mono text-xs text-muted-foreground">{row.getValue("idPedido")}</span>
        ),
        filterFn: "includesString",
    },
    {
        accessorKey: "dataPedido",
        header: ({ column }) => <ColumnHeader column={column} title="Dt. Pedido" />,
        cell: ({ row }) => {
            const val = row.getValue("dataPedido") as string;
            if (!val) return <span className="text-muted-foreground/50">-</span>;
            const date = new Date(val + "T00:00:00");
            if (isNaN(date.getTime())) return <span className="text-muted-foreground/50">Inválida</span>;
            return <span className="text-xs">{date.toLocaleDateString("pt-BR")}</span>;
        },
        sortingFn: "datetime",
    },
    {
        accessorKey: "dataPendencia",
        header: ({ column }) => <ColumnHeader column={column} title="Dt. Pend." />,
        cell: ({ row }) => {
            const val = row.getValue("dataPendencia") as string;
            if (!val) return <span className="text-muted-foreground/50">-</span>;
            const date = new Date(val + "T00:00:00");
            if (isNaN(date.getTime())) return <span className="text-muted-foreground/50">Inválida</span>;
            return <span className="text-xs">{date.toLocaleDateString("pt-BR")}</span>;
        },
        sortingFn: "datetime",
    },
    {
        accessorKey: "pedidosDataPrevisao",
        header: ({ column }) => <ColumnHeader column={column} title="Previsão" />,
        cell: ({ row }) => {
            const val = row.getValue("pedidosDataPrevisao") as string;
            if (!val) return <span className="text-muted-foreground/50">-</span>;
            const date = new Date(val);
            if (isNaN(date.getTime())) return <span className="text-muted-foreground/50">Inválida</span>;
            return <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{date.toLocaleDateString("pt-BR")}</span>;
        },
        sortingFn: "datetime",
    },
    {
        accessorKey: "pedidosItemStatus",
        header: ({ column }) => <ColumnHeader column={column} title="Item Status" />,
        cell: ({ row }) => {
            const statusRaw = row.getValue("pedidosItemStatus") as string;
            if (!statusRaw) return <span className="text-muted-foreground/50">-</span>;

            // Filter to show only specific statuses
            const validStatuses = ["A Faturar", "Em Transito", "Em Trânsito"];
            const statusList = statusRaw.split(', ').filter(s => validStatuses.includes(s));

            if (statusList.length === 0) return <span className="text-muted-foreground/50">-</span>;

            return (
                <div className="flex flex-wrap gap-1">
                    {statusList.map((status, index) => (
                        <Badge key={index} variant="outline" className="text-[10px] whitespace-nowrap bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                            {status}
                        </Badge>
                    ))}
                </div>
            );
        },
        filterFn: "includesString",
    },
    {
        accessorKey: "cliente",
        header: ({ column }) => <ColumnHeader column={column} title="Cliente" />,
        cell: ({ row }) => (
            <div className="max-w-[180px] truncate text-xs font-medium" title={row.getValue("cliente")}>
                {row.getValue("cliente")}
            </div>
        ),
        filterFn: "includesString",
    },
    {
        accessorKey: "codigo_sku",
        header: ({ column }) => <ColumnHeader column={column} title="SKU" />,
        cell: ({ row }) => (
            <span className="font-mono font-semibold text-primary">{row.getValue("codigo_sku")}</span>
        ),
        filterFn: "includesString",
    },
    {
        accessorKey: "produto",
        header: ({ column }) => <ColumnHeader column={column} title="Produto" />,
        cell: ({ row }) => (
            <div className="min-w-[220px] max-w-[320px] text-xs leading-relaxed line-clamp-2" title={row.getValue("produto")}>
                {row.getValue("produto")}
            </div>
        ),
        filterFn: (row, id, value) => {
            const cellValue = row.getValue(id) as string;
            if (!cellValue) return false;
            return cellValue.toLowerCase().includes((value as string).toLowerCase());
        },
    },
    {
        accessorKey: "marca",
        header: ({ column }) => <ColumnHeader column={column} title="Marca" />,
        cell: ({ row }) => (
            <Badge variant="outline" className="text-[10px] font-medium whitespace-nowrap">
                {row.getValue("marca") || "-"}
            </Badge>
        ),
        filterFn: "includesString",
    },
    {
        accessorKey: "categoria",
        header: ({ column }) => <ColumnHeader column={column} title="Categoria" />,
        cell: ({ row }) => (
            <span className="text-xs max-w-[160px] truncate block" title={row.getValue("categoria")}>
                {row.getValue("categoria") || "-"}
            </span>
        ),
        filterFn: "includesString",
    },
    {
        accessorKey: "grupoCategorias",
        header: ({ column }) => <ColumnHeader column={column} title="Grupo" />,
        cell: ({ row }) => (
            <span className="text-xs max-w-[140px] truncate block" title={row.getValue("grupoCategorias")}>
                {row.getValue("grupoCategorias") || "-"}
            </span>
        ),
        filterFn: "includesString",
    },
    {
        accessorKey: "statusDescricao",
        header: ({ column }) => <ColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.getValue("statusDescricao") as string;
            let className = "bg-muted text-muted-foreground";
            if (status === "Em Aberto") className = "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
            else if (status === "Aprovado") className = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
            else if (status === "Rejeitado") className = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";

            return (
                <Badge className={`text-[10px] font-medium ${className}`}>
                    {status || "-"}
                </Badge>
            );
        },
        filterFn: (row, id, value) => {
            if (!value || (value as string[]).length === 0) return true;
            return (value as string[]).includes(row.getValue(id) as string);
        },
    },
    {
        accessorKey: "curvaABC",
        header: ({ column }) => <ColumnHeader column={column} title="ABC" />,
        cell: ({ row }) => {
            const abc = row.getValue("curvaABC") as string;
            if (!abc) return <span className="text-muted-foreground/50">-</span>;

            const colors: Record<string, string> = {
                A: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                B: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
                C: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
            };

            return (
                <Badge className={`text-[10px] font-bold ${colors[abc] || "bg-muted text-muted-foreground"}`}>
                    {abc}
                </Badge>
            );
        },
        filterFn: (row, id, value) => {
            if (!value || (value as string[]).length === 0) return true;
            return (value as string[]).includes(row.getValue(id) as string);
        },
    },
    {
        accessorKey: "situacaoCompra",
        header: ({ column }) => <ColumnHeader column={column} title="Situação" />,
        cell: ({ row }) => {
            const val = row.getValue("situacaoCompra") as string;
            if (!val) return <span className="text-muted-foreground/50">-</span>;
            const isOk = val === "OK";
            return (
                <Badge variant={isOk ? "default" : "destructive"} className={`text-[10px] font-bold tabular-nums ${isOk ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-900 hover:bg-blue-950"}`}>
                    {val}
                </Badge>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "quantidadePendencia",
        header: ({ column }) => <ColumnHeader column={column} title="Qtd. Pend." />,
        cell: ({ row }) => (
            <div className="text-center font-semibold tabular-nums text-amber-600 dark:text-amber-400">
                {row.getValue("quantidadePendencia")}
            </div>
        ),
    },
    {
        accessorKey: "saldoPendente",
        header: ({ column }) => <ColumnHeader column={column} title="Saldo Pend." />,
        cell: ({ row }) => {
            const val = row.getValue("saldoPendente") as number;
            return (
                <div className={`text-center font-bold tabular-nums ${val > 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}>
                    {val}
                </div>
            );
        },
    },
    {
        accessorKey: "estoque",
        header: ({ column }) => <ColumnHeader column={column} title="Estoque" />,
        cell: ({ row }) => {
            const val = row.getValue("estoque") as number;
            const isEmpty = val === 0 || val === undefined || val === null;
            return (
                <div className={`text-center font-semibold tabular-nums ${isEmpty ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                    {val ?? 0}
                </div>
            );
        },
    },
    {
        accessorKey: "quantidadeCompra",
        header: ({ column }) => <ColumnHeader column={column} title="Qtd. Compra" />,
        cell: ({ row }) => (
            <div className="text-center font-medium tabular-nums text-muted-foreground">
                {row.getValue("quantidadeCompra") || 0}
            </div>
        ),
    },
    {
        accessorKey: "qtdPedidos",
        header: ({ column }) => <ColumnHeader column={column} title="Qtd. Pedidos" />,
        cell: ({ row }) => (
            <div className="text-center font-medium tabular-nums text-blue-600 dark:text-blue-400">
                {row.getValue("qtdPedidos") || 0}
            </div>
        ),
    },
    {
        accessorKey: "qtdAChegar",
        header: ({ column }) => <ColumnHeader column={column} title="Qtd. A Chegar" />,
        cell: ({ row }) => (
            <div className="text-center font-medium tabular-nums text-purple-600 dark:text-purple-400">
                {row.getValue("qtdAChegar") || 0}
            </div>
        ),
    },
    {
        accessorKey: "diasPendentes",
        header: ({ column }) => <ColumnHeader column={column} title="Dias Pend." />,
        cell: ({ row }) => {
            const dias = row.getValue("diasPendentes") as number;
            if (dias === undefined || dias === null) return <span className="text-muted-foreground/50">-</span>;

            let colorClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
            if (dias >= 3 && dias <= 7) colorClass = "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
            else if (dias > 7 && dias <= 14) colorClass = "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
            else if (dias > 14) colorClass = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";

            return <Badge className={`text-[10px] font-bold tabular-nums ${colorClass}`}>{dias}d</Badge>;
        },
    },
    {
        accessorKey: "comprador",
        header: ({ column }) => <ColumnHeader column={column} title="Comprador" />,
        cell: ({ row }) => (
            <span className="text-xs max-w-[140px] truncate block" title={row.getValue("comprador")}>
                {row.getValue("comprador") || "-"}
            </span>
        ),
        filterFn: "includesString",
    },
    {
        accessorKey: "consultor",
        header: ({ column }) => <ColumnHeader column={column} title="Consultor" />,
        cell: ({ row }) => (
            <span className="text-xs max-w-[140px] truncate block" title={row.getValue("consultor")}>
                {row.getValue("consultor") || "-"}
            </span>
        ),
        filterFn: "includesString",
    },
    {
        accessorKey: "fornecedorRazao",
        header: ({ column }) => <ColumnHeader column={column} title="Fornecedor" />,
        cell: ({ row }) => (
            <span className="text-xs max-w-[180px] truncate block" title={row.getValue("fornecedorRazao")}>
                {row.getValue("fornecedorRazao") || "-"}
            </span>
        ),
        filterFn: (row, id, value) => {
            const cellValue = row.getValue(id) as string;
            if (!cellValue) return false;
            return cellValue.toLowerCase().includes((value as string).toLowerCase());
        },
    },
    {
        accessorKey: "precoVenda",
        header: ({ column }) => <ColumnHeader column={column} title="Preço Venda" />,
        cell: ({ row }) => {
            const val = row.getValue("precoVenda") as number;
            return (
                <span className="text-xs font-medium tabular-nums">
                    {val ? `R$ ${val.toFixed(2)}` : "-"}
                </span>
            );
        },
    },
];
