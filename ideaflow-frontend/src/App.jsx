import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  Lightbulb, 
  Target, 
  BarChart3, 
  Plus, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Users,
  Filter,
  Search,
  Bell,
  Settings,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Timer,
  Zap
} from 'lucide-react'
import './App.css'

// Dados iniciais vazios para produção - usuário começará do zero
const initialIdeas = []

const statusColors = {
  'BACKLOG': 'bg-gray-100 text-gray-800',
  'REFINAMENTO': 'bg-blue-100 text-blue-800',
  'ESTIMATIVA': 'bg-yellow-100 text-yellow-800',
  'CUSTO': 'bg-orange-100 text-orange-800',
  'DESENVOLVIMENTO': 'bg-purple-100 text-purple-800',
  'CONCLUSAO': 'bg-green-100 text-green-800'
}

const priorityColors = {
  'BAIXA': 'bg-green-100 text-green-800',
  'MEDIA': 'bg-yellow-100 text-yellow-800',
  'ALTA': 'bg-orange-100 text-orange-800',
  'CRITICA': 'bg-red-100 text-red-800'
}

const typeIcons = {
  'IDEIA': Lightbulb,
  'OBJETIVO': Target,
  'META': BarChart3
}

function App() {
  const [ideas, setIdeas] = useState(initialIdeas)
  const [selectedTab, setSelectedTab] = useState('dashboard')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    type: 'IDEIA',
    category: '',
    priority: 'MEDIA'
  })

  // Métricas calculadas dinamicamente
  const totalIdeas = ideas.length
  const completedIdeas = ideas.filter(idea => idea.status === 'CONCLUSAO').length
  const completionRate = totalIdeas > 0 ? Math.round((completedIdeas / totalIdeas) * 100) : 0
  
  // ROI médio calculado baseado nas ideias com custo estimado
  const ideasWithCost = ideas.filter(idea => idea.estimatedCost && idea.estimatedCost > 0)
  const averageROI = ideasWithCost.length > 0 
    ? Math.round(ideasWithCost.reduce((acc, idea) => acc + (idea.estimatedROI || 200), 0) / ideasWithCost.length)
    : 0
  
  // Tempo médio calculado baseado nas ideias com tempo estimado
  const ideasWithTime = ideas.filter(idea => idea.estimatedTime && idea.estimatedTime > 0)
  const averageTime = ideasWithTime.length > 0
    ? Math.round(ideasWithTime.reduce((acc, idea) => acc + idea.estimatedTime, 0) / ideasWithTime.length)
    : 0

  const handleAddIdea = () => {
    const idea = {
      ...newIdea,
      id: Date.now().toString(),
      status: 'BACKLOG',
      tags: [],
      sourceChannel: 'WEB',
      createdAt: new Date().toISOString().split('T')[0],
      estimatedROI: 200, // ROI padrão de 200% para novas ideias
      estimatedCost: newIdea.estimatedCost || 0,
      estimatedTime: newIdea.estimatedTime || 30 // Tempo padrão de 30 dias
    }
    setIdeas([...ideas, idea])
    setNewIdea({ title: '', description: '', type: 'IDEIA', category: '', priority: 'MEDIA' })
    setIsAddDialogOpen(false)
  }

  const handleStatusChange = (ideaId, newStatus) => {
    setIdeas(ideas.map(idea => 
      idea.id === ideaId ? { ...idea, status: newStatus } : idea
    ))
  }

  const MetricCard = ({ title, value, trend, icon: Icon, color = "text-blue-600" }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className={`text-sm ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {trend} vs mês anterior
              </p>
            )}
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  )

  const IdeaCard = ({ idea }) => {
    const TypeIcon = typeIcons[idea.type]
    return (
      <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <TypeIcon className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">{idea.title}</CardTitle>
            </div>
            <Badge className={priorityColors[idea.priority]}>
              {idea.priority}
            </Badge>
          </div>
          <CardDescription className="text-sm">
            {idea.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge className={statusColors[idea.status]}>
                {idea.status}
              </Badge>
              <span className="text-sm text-muted-foreground">{idea.category}</span>
            </div>
            
            {idea.estimatedCost && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4" />
                <span>R$ {idea.estimatedCost.toLocaleString()}</span>
              </div>
            )}
            
            {idea.estimatedTime && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>{idea.estimatedTime} dias</span>
              </div>
            )}
            
            {idea.deadline && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{new Date(idea.deadline).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
            
            <div className="flex flex-wrap gap-1">
              {idea.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const KanbanBoard = () => {
    const statuses = ['BACKLOG', 'REFINAMENTO', 'ESTIMATIVA', 'CUSTO', 'DESENVOLVIMENTO', 'CONCLUSAO']
    
    return (
      <div className="grid grid-cols-6 gap-4 h-full">
        {statuses.map(status => (
          <div key={status} className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-4 text-center">{status}</h3>
            <div className="space-y-3">
              {ideas.filter(idea => idea.status === status).map(idea => (
                <div key={idea.id} className="bg-white p-3 rounded-lg shadow-sm border">
                  <div className="flex items-center gap-2 mb-2">
                    {React.createElement(typeIcons[idea.type], { className: "h-4 w-4 text-blue-600" })}
                    <span className="font-medium text-sm">{idea.title}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{idea.description.substring(0, 60)}...</p>
                  <Badge className={`${priorityColors[idea.priority]} text-xs`}>
                    {idea.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">IdeaFlow Pro</h1>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Sistema de Gestão de Ideias
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Calendários
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="kanban">Pipeline</TabsTrigger>
            <TabsTrigger value="ideas">Ideias</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* KPIs Row */}
            <div className="grid grid-cols-4 gap-6">
              <MetricCard 
                title="Ideias Ativas" 
                value={totalIdeas} 
                trend="+12%" 
                icon={Lightbulb}
                color="text-blue-600"
              />
              <MetricCard 
                title="Taxa de Conclusão" 
                value={`${completionRate}%`} 
                trend="+5%" 
                icon={CheckCircle}
                color="text-green-600"
              />
              <MetricCard 
                title="ROI Médio" 
                value={averageROI > 0 ? `${averageROI}%` : "0%"} 
                trend={averageROI > 0 ? "+18%" : "0%"} 
                icon={TrendingUp}
                color="text-purple-600"
              />
              <MetricCard 
                title="Tempo Médio" 
                value={averageTime > 0 ? `${averageTime}d` : "0d"} 
                trend={averageTime > 0 ? "-3d" : "0d"} 
                icon={Timer}
                color="text-orange-600"
              />
            </div>

            {/* Main Dashboard Content */}
            <div className="grid grid-cols-12 gap-6">
              {/* Quick Actions */}
              <div className="col-span-4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Ações Rápidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full justify-start">
                          <Lightbulb className="h-4 w-4 mr-2" />
                          Nova Ideia
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adicionar Nova Ideia</DialogTitle>
                          <DialogDescription>
                            Capture sua nova ideia e organize-a no pipeline
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            placeholder="Título da ideia"
                            value={newIdea.title}
                            onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                          />
                          <Textarea
                            placeholder="Descrição detalhada"
                            value={newIdea.description}
                            onChange={(e) => setNewIdea({...newIdea, description: e.target.value})}
                          />
                          <Select value={newIdea.type} onValueChange={(value) => setNewIdea({...newIdea, type: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IDEIA">💡 Ideia</SelectItem>
                              <SelectItem value="OBJETIVO">🎯 Objetivo</SelectItem>
                              <SelectItem value="META">📊 Meta</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Categoria"
                            value={newIdea.category}
                            onChange={(e) => setNewIdea({...newIdea, category: e.target.value})}
                          />
                          <Select value={newIdea.priority} onValueChange={(value) => setNewIdea({...newIdea, priority: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BAIXA">Baixa</SelectItem>
                              <SelectItem value="MEDIA">Média</SelectItem>
                              <SelectItem value="ALTA">Alta</SelectItem>
                              <SelectItem value="CRITICA">Crítica</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button onClick={handleAddIdea} className="w-full">
                            Adicionar Ideia
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="h-4 w-4 mr-2" />
                      Novo Objetivo
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Nova Meta
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Atividade Recente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Ideia "App Delivery" movida para Desenvolvimento</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Nova ideia adicionada via WhatsApp</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Prazo de "Curso IA" se aproximando</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Overview */}
              <div className="col-span-8">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Visão Geral do Pipeline</CardTitle>
                    <CardDescription>
                      Acompanhe o progresso das suas ideias através do pipeline
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {['BACKLOG', 'REFINAMENTO', 'ESTIMATIVA', 'CUSTO', 'DESENVOLVIMENTO', 'CONCLUSAO'].map(status => {
                        const count = ideas.filter(idea => idea.status === status).length
                        const percentage = totalIdeas > 0 ? (count / totalIdeas) * 100 : 0
                        return (
                          <div key={status} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{status}</span>
                              <span>{count} ideias ({Math.round(percentage)}%)</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="kanban" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Pipeline de Ideias</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrar
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>
            <div className="h-[600px] overflow-x-auto">
              <KanbanBoard />
            </div>
          </TabsContent>

          <TabsContent value="ideas" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Todas as Ideias</h2>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Ideia
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map(idea => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <h2 className="text-2xl font-bold">Relatórios e Analytics</h2>
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Produtividade Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Gráficos de produtividade em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>ROI por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Análise de ROI em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App
