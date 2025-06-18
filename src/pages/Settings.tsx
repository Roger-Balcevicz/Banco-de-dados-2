
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Settings, User, Bell, Shield, Database, Printer, Mail, Smartphone, Monitor } from 'lucide-react';

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    lowStock: true,
    expiring: true,
    deliveryDelay: false,
    qualityIssue: true,
    orderConfirm: true,
    supplierUpdates: false,
  });
  
  const [preferences, setPreferences] = useState({
    autoReorder: false,
    darkMode: false,
    compactView: false,
    soundAlerts: true,
    emailReports: true,
    mobileNotifications: true,
  });
  
  const [profile, setProfile] = useState({
    restaurantName: 'Prato Cheio',
    managerName: 'João Silva',
    email: 'joao@pratocheio.com',
    phone: '(11) 99999-1234',
    address: 'Rua dos Sabores, 123',
    city: 'São Paulo',
    zipCode: '01234-567',
  });

  return (
    <PageLayout title="Configurações do Sistema">
      <div className="space-y-6 max-w-4xl">
        {/* Perfil do Restaurante */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-orange-600" />
              Perfil do Restaurante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Nome do Restaurante
                </label>
                <Input
                  value={profile.restaurantName}
                  onChange={(e) => setProfile(prev => ({ ...prev, restaurantName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Nome do Responsável
                </label>
                <Input
                  value={profile.managerName}
                  onChange={(e) => setProfile(prev => ({ ...prev, managerName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  E-mail
                </label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Telefone
                </label>
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Endereço
                </label>
                <Input
                  value={profile.address}
                  onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Cidade
                </label>
                <Input
                  value={profile.city}
                  onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  CEP
                </label>
                <Input
                  value={profile.zipCode}
                  onChange={(e) => setProfile(prev => ({ ...prev, zipCode: e.target.value }))}
                />
              </div>
            </div>
            <div className="pt-4">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Salvar Perfil
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              Configurações de Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Alertas do Sistema</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Estoque Baixo</p>
                    <p className="text-sm text-gray-500">Alertas quando ingredientes atingem o estoque mínimo</p>
                  </div>
                  <Switch
                    checked={notifications.lowStock}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, lowStock: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Produtos Vencendo</p>
                    <p className="text-sm text-gray-500">Notificações sobre produtos próximos ao vencimento</p>
                  </div>
                  <Switch
                    checked={notifications.expiring}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, expiring: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Atraso nas Entregas</p>
                    <p className="text-sm text-gray-500">Alertas sobre atrasos de fornecedores</p>
                  </div>
                  <Switch
                    checked={notifications.deliveryDelay}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, deliveryDelay: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Problemas de Qualidade</p>
                    <p className="text-sm text-gray-500">Notificações sobre issues de qualidade dos produtos</p>
                  </div>
                  <Switch
                    checked={notifications.qualityIssue}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, qualityIssue: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Confirmação de Pedidos</p>
                    <p className="text-sm text-gray-500">Notificações sobre status de pedidos</p>
                  </div>
                  <Switch
                    checked={notifications.orderConfirm}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, orderConfirm: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Atualizações de Fornecedores</p>
                    <p className="text-sm text-gray-500">Notificações sobre mudanças nos fornecedores</p>
                  </div>
                  <Switch
                    checked={notifications.supplierUpdates}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, supplierUpdates: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Preferências do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-orange-600" />
              Preferências de Interface
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Reposição Automática</p>
                  <p className="text-sm text-gray-500">Criar pedidos automaticamente quando estoque estiver baixo</p>
                </div>
                <Switch
                  checked={preferences.autoReorder}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, autoReorder: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Modo Escuro</p>
                  <p className="text-sm text-gray-500">Usar tema escuro para reduzir fadiga visual</p>
                </div>
                <Switch
                  checked={preferences.darkMode}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, darkMode: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Visualização Compacta</p>
                  <p className="text-sm text-gray-500">Mostrar mais informações em menos espaço</p>
                </div>
                <Switch
                  checked={preferences.compactView}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, compactView: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Alertas Sonoros</p>
                  <p className="text-sm text-gray-500">Reproduzir sons para alertas importantes</p>
                </div>
                <Switch
                  checked={preferences.soundAlerts}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, soundAlerts: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-700">Relatórios por E-mail</p>
                    <p className="text-sm text-gray-500">Receber relatórios semanais por e-mail</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.emailReports}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, emailReports: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-700">Notificações Mobile</p>
                    <p className="text-sm text-gray-500">Receber notificações no celular</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.mobileNotifications}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, mobileNotifications: checked }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Segurança e Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-600" />
              Segurança e Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Button variant="outline" className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Fazer Backup dos Dados
                </Button>
              </div>
              <div>
                <Button variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Alterar Senha
                </Button>
              </div>
              <div>
                <Button variant="outline" className="w-full">
                  <Printer className="h-4 w-4 mr-2" />
                  Configurar Impressora
                </Button>
              </div>
              <div>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações Avançadas
                </Button>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Último backup:</strong> 15/06/2024 às 23:30</p>
                <p><strong>Versão do sistema:</strong> 2.1.4</p>
                <p><strong>Usuários ativos:</strong> 3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Ações de Salvamento */}
        <div className="flex gap-4 pt-6">
          <Button className="bg-orange-600 hover:bg-orange-700">
            Salvar Todas as Configurações
          </Button>
          <Button variant="outline">
            Restaurar Padrões
          </Button>
          <Button variant="outline">
            Exportar Configurações
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
