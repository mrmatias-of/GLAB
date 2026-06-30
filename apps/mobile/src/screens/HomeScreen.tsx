import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { financeiroService, ordensService } from '../services/api'

export default function HomeScreen() {
  const [dashboard, setDashboard] = useState<any>(null)
  const [ordens, setOrdens] = useState<any[]>([])

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [dashRes, ordensRes] = await Promise.all([
        financeiroService.dashboard(),
        ordensService.listar(),
      ])
      setDashboard(dashRes.data)
      setOrdens(ordensRes.data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
      </View>

      {dashboard && (
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Receita</Text>
            <Text style={styles.metricValue}>R$ {dashboard.totalReceita?.toFixed(2)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Despesa</Text>
            <Text style={styles.metricValue}>R$ {dashboard.totalDespesa?.toFixed(2)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Lucro</Text>
            <Text style={styles.metricValue}>R$ {dashboard.lucroLiquido?.toFixed(2)}</Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Últimas Ordens</Text>
        {ordens.slice(0, 5).map((ordem) => (
          <TouchableOpacity key={ordem.id} style={styles.orderCard}>
            <Text style={styles.orderNumber}>OS #{ordem.numero}</Text>
            <Text style={styles.orderStatus}>{ordem.status}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  metricsContainer: {
    padding: 15,
    gap: 10,
  },
  metricCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#000',
  },
  metricLabel: {
    fontSize: 12,
    color: '#999',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderStatus: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
})
