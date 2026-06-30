import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { ordensService } from '../services/api'

export default function OrdensScreen() {
  const [ordens, setOrdens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarOrdens()
  }, [])

  const carregarOrdens = async () => {
    try {
      const res = await ordensService.listar()
      setOrdens(res.data)
    } catch (error) {
      console.error('Erro ao carregar ordens:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ordens}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.ordemCard}>
            <View style={styles.ordemHeader}>
              <Text style={styles.ordemNumber}>OS #{item.numero}</Text>
              <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
                {item.status}
              </Text>
            </View>
            <Text style={styles.ordemDesc}>{item.descricao}</Text>
            <Text style={styles.ordemClient}>Cliente: {item.cliente?.nome}</Text>
            <Text style={styles.ordemTecnico}>Técnico: {item.tecnico?.nome}</Text>
          </TouchableOpacity>
        )}
        onRefresh={carregarOrdens}
        refreshing={loading}
      />
    </View>
  )
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    aberto: '#ff9800',
    em_progresso: '#2196f3',
    finalizado: '#4caf50',
    cancelado: '#f44336',
  }
  return colors[status] || '#999'
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  ordemCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
  },
  ordemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ordemNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  ordemDesc: {
    fontSize: 14,
    marginBottom: 5,
  },
  ordemClient: {
    fontSize: 12,
    color: '#666',
  },
  ordemTecnico: {
    fontSize: 12,
    color: '#666',
  },
})
