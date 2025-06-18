export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      fornecedor: {
        Row: {
          codfornecedor: number
          contato: string | null
          nome: string
        }
        Insert: {
          codfornecedor?: number
          contato?: string | null
          nome: string
        }
        Update: {
          codfornecedor?: number
          contato?: string | null
          nome?: string
        }
        Relationships: []
      }
      ingrediente: {
        Row: {
          codingrediente: number
          descricao: string | null
          estoque_atual: number | null
          estoque_minimo: number | null
          nome: string
          unidade_medida: string | null
        }
        Insert: {
          codingrediente?: number
          descricao?: string | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          nome: string
          unidade_medida?: string | null
        }
        Update: {
          codingrediente?: number
          descricao?: string | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          nome?: string
          unidade_medida?: string | null
        }
        Relationships: []
      }
      ingrediente_receita: {
        Row: {
          cod: number
          codingrediente: number
          codreceita: number
          quantidade_necessaria: number | null
        }
        Insert: {
          cod?: number
          codingrediente: number
          codreceita: number
          quantidade_necessaria?: number | null
        }
        Update: {
          cod?: number
          codingrediente?: number
          codreceita?: number
          quantidade_necessaria?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_ingrediente_ingrediente_receita"
            columns: ["codingrediente"]
            isOneToOne: false
            referencedRelation: "ingrediente"
            referencedColumns: ["codingrediente"]
          },
          {
            foreignKeyName: "fk_ingrediente_ingrediente_receita"
            columns: ["codingrediente"]
            isOneToOne: false
            referencedRelation: "vw_avisos_estoque_baixo"
            referencedColumns: ["codingrediente"]
          },
          {
            foreignKeyName: "fk_ingrediente_ingrediente_receita"
            columns: ["codingrediente"]
            isOneToOne: false
            referencedRelation: "vw_estoque_atual"
            referencedColumns: ["codingrediente"]
          },
          {
            foreignKeyName: "fk_receita_ingrediente_receita"
            columns: ["codreceita"]
            isOneToOne: false
            referencedRelation: "receita"
            referencedColumns: ["codreceita"]
          },
        ]
      }
      item_ordem_compra: {
        Row: {
          codingrediente: number
          coditem: number
          codordem: number
          preco_unitario: number | null
          quantidade: number
        }
        Insert: {
          codingrediente: number
          coditem?: number
          codordem: number
          preco_unitario?: number | null
          quantidade: number
        }
        Update: {
          codingrediente?: number
          coditem?: number
          codordem?: number
          preco_unitario?: number | null
          quantidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_item_ingrediente"
            columns: ["codingrediente"]
            isOneToOne: false
            referencedRelation: "ingrediente"
            referencedColumns: ["codingrediente"]
          },
          {
            foreignKeyName: "fk_item_ingrediente"
            columns: ["codingrediente"]
            isOneToOne: false
            referencedRelation: "vw_avisos_estoque_baixo"
            referencedColumns: ["codingrediente"]
          },
          {
            foreignKeyName: "fk_item_ingrediente"
            columns: ["codingrediente"]
            isOneToOne: false
            referencedRelation: "vw_estoque_atual"
            referencedColumns: ["codingrediente"]
          },
          {
            foreignKeyName: "fk_item_ordem"
            columns: ["codordem"]
            isOneToOne: false
            referencedRelation: "ordem_compra"
            referencedColumns: ["codordem"]
          },
        ]
      }
      movimentacao_estoque: {
        Row: {
          codingrediente: number
          codmovimentacao: number
          codsetor: number | null
          data_movimentacao: string
          origem: string | null
          quantidade: number
          tipo_movimentacao: string | null
        }
        Insert: {
          codingrediente: number
          codmovimentacao?: number
          codsetor?: number | null
          data_movimentacao: string
          origem?: string | null
          quantidade: number
          tipo_movimentacao?: string | null
        }
        Update: {
          codingrediente?: number
          codmovimentacao?: number
          codsetor?: number | null
          data_movimentacao?: string
          origem?: string | null
          quantidade?: number
          tipo_movimentacao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_movimentacao_ingrediente"
            columns: ["codingrediente"]
            isOneToOne: false
            referencedRelation: "ingrediente"
            referencedColumns: ["codingrediente"]
          },
          {
            foreignKeyName: "fk_movimentacao_ingrediente"
            columns: ["codingrediente"]
            isOneToOne: false
            referencedRelation: "vw_avisos_estoque_baixo"
            referencedColumns: ["codingrediente"]
          },
          {
            foreignKeyName: "fk_movimentacao_ingrediente"
            columns: ["codingrediente"]
            isOneToOne: false
            referencedRelation: "vw_estoque_atual"
            referencedColumns: ["codingrediente"]
          },
          {
            foreignKeyName: "fk_movimentacao_setor"
            columns: ["codsetor"]
            isOneToOne: false
            referencedRelation: "setor"
            referencedColumns: ["codsetor"]
          },
        ]
      }
      ordem_compra: {
        Row: {
          codfornecedor: number
          codordem: number
          codsetor: number | null
          data_ordem: string
          status: string | null
        }
        Insert: {
          codfornecedor: number
          codordem?: number
          codsetor?: number | null
          data_ordem: string
          status?: string | null
        }
        Update: {
          codfornecedor?: number
          codordem?: number
          codsetor?: number | null
          data_ordem?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_ordem_fornecedor"
            columns: ["codsetor"]
            isOneToOne: false
            referencedRelation: "setor"
            referencedColumns: ["codsetor"]
          },
          {
            foreignKeyName: "fk_ordem_setor"
            columns: ["codfornecedor"]
            isOneToOne: false
            referencedRelation: "fornecedor"
            referencedColumns: ["codfornecedor"]
          },
        ]
      }
      receita: {
        Row: {
          codreceita: number
          descricao: string | null
          nome: string
        }
        Insert: {
          codreceita?: number
          descricao?: string | null
          nome: string
        }
        Update: {
          codreceita?: number
          descricao?: string | null
          nome?: string
        }
        Relationships: []
      }
      setor: {
        Row: {
          codsetor: number
          nome: string
        }
        Insert: {
          codsetor?: number
          nome: string
        }
        Update: {
          codsetor?: number
          nome?: string
        }
        Relationships: []
      }
    }
    Views: {
      vw_avisos_estoque_baixo: {
        Row: {
          codingrediente: number | null
          estoque_atual: number | null
          estoque_minimo: number | null
          nome: string | null
        }
        Insert: {
          codingrediente?: number | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          nome?: string | null
        }
        Update: {
          codingrediente?: number | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          nome?: string | null
        }
        Relationships: []
      }
      vw_compras_por_fornecedor: {
        Row: {
          fornecedor: string | null
          total_compras: number | null
        }
        Relationships: []
      }
      vw_estoque_atual: {
        Row: {
          codingrediente: number | null
          estoque_atual: number | null
          estoque_minimo: number | null
          nome: string | null
          unidade_medida: string | null
        }
        Insert: {
          codingrediente?: number | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          nome?: string | null
          unidade_medida?: string | null
        }
        Update: {
          codingrediente?: number | null
          estoque_atual?: number | null
          estoque_minimo?: number | null
          nome?: string | null
          unidade_medida?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      fn_ajustar_estoque: {
        Args: {
          p_codingrediente: number
          p_quantidade: number
          p_observacao: string
        }
        Returns: string
      }
      fn_calcular_custo_receita: {
        Args: { cod_receita: number }
        Returns: number
      }
      fn_inserir_ordem_compra: {
        Args: {
          p_data: string
          p_codfornecedor: number
          p_codsetor: number
          p_status: string
          p_ingredientes: number[]
          p_quantidades: number[]
          p_precos: number[]
        }
        Returns: number
      }
      fn_previsao_reposicao: {
        Args: { id: number }
        Returns: string
      }
      fn_processar_receita: {
        Args: { p_codreceita: number; p_codsetor: number }
        Returns: string
      }
      fn_quantidade_disponivel: {
        Args: { id: number }
        Returns: number
      }
      fn_registrar_movimentacao: {
        Args: {
          p_codingrediente: number
          p_codsetor: number
          p_data: string
          p_tipo: string
          p_quantidade: number
          p_origem: string
        }
        Returns: string
      }
      fn_repor_estoque_minimo: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
