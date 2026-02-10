import * as React from "react"
import { columns } from "./components/suprimentos/columns"
import { DataTable } from "./components/suprimentos/data-table"
import { Sidebar } from "./components/layout/Sidebar"
import { useSuprimentos } from "./hooks/useSuprimentos"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"


function App() {
  const { data, isLoading, isError, error, refetch, isFetching } = useSuprimentos()
  const [activeTab, setActiveTab] = React.useState<"pendencias" | "produtos">("pendencias")
  const [metrics, setMetrics] = React.useState({ totalPendentes: 0, uniqueClients: 0 })

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="w-64 border-r border-border/60 hidden md:block bg-card/50">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6 lg:p-8 max-w-[1920px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {activeTab === "pendencias" ? "Pendências de Suprimentos" : "Gestão de Produtos"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {activeTab === "pendencias"
                  ? "Visualize e gerencie pendências de compra com dados cruzados"
                  : "Módulo de gestão de produtos"
                }
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="gap-1.5 text-xs"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          {activeTab === "pendencias" && !isLoading && !isError && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl border border-border/60 bg-card shadow-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Pedidos Pendentes
                </span>
                <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                  {metrics.totalPendentes}
                </div>
              </div>
              <div className="p-4 rounded-xl border border-border/60 bg-card shadow-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Clientes Afetados
                </span>
                <div className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                  {metrics.uniqueClients}
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {isError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>
                Não foi possível carregar os dados: {(error as Error).message}
              </AlertDescription>
            </Alert>
          )}

          {/* Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
              <span className="text-sm text-muted-foreground">Carregando dados...</span>
            </div>
          ) : (
            <>
              {activeTab === "pendencias" && (
                <DataTable
                  columns={columns}
                  data={data || []}
                  onMetricsChange={setMetrics}
                />
              )}

              {activeTab === "produtos" && (
                <div className="p-8 border border-border/60 rounded-xl bg-card text-center">
                  <p className="text-muted-foreground">Módulo de produtos em desenvolvimento...</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
