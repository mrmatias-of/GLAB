#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

// Pattern replacement for adding tenantId
const refactorService = (content) => {
  // Replace method signatures to include tenantId
  // Pattern: async method(userId: string, ...
  // Replace with: async method(userId: string, tenantId: string, ...
  
  let refactored = content
  
  // Replace criar method
  refactored = refactored.replace(
    /async criar\(userId: string,/g,
    'async criar(userId: string, tenantId: string,'
  )
  
  // Replace obter method
  refactored = refactored.replace(
    /async obter\(userId: string,/g,
    'async obter(userId: string, tenantId: string,'
  )
  
  // Replace listar method
  refactored = refactored.replace(
    /async listar\(userId: string,/g,
    'async listar(userId: string, tenantId: string,'
  )
  
  // Replace atualizar method
  refactored = refactored.replace(
    /async atualizar\(userId: string,/g,
    'async atualizar(userId: string, tenantId: string,'
  )
  
  // Replace deletar method
  refactored = refactored.replace(
    /async deletar\(userId: string,/g,
    'async deletar(userId: string, tenantId: string,'
  )
  
  // Replace repository calls to include tenantId
  // this.repository.create(userId -> this.repository.create(userId, tenantId
  refactored = refactored.replace(
    /this\.repository\.create\(userId,/g,
    'this.repository.create(userId, tenantId,'
  )
  
  refactored = refactored.replace(
    /repository\.create\(userId,/g,
    'repository.create(userId, tenantId,'
  )
  
  // Similar for other methods...
  refactored = refactored.replace(
    /this\.repository\.findById\(/g,
    'this.repository.findById('
  )
  
  // Add tenantId to findById calls
  refactored = refactored.replace(
    /findById\((\w+), userId/g,
    'findById($1, userId, tenantId'
  )
  
  return refactored
}

console.log('📝 Services não foram refatorados via script (estratégia manual)\n')
console.log('Razão: Os repositories têm assinaturas variadas')
console.log('Abordagem: Refatorar manualmente cada service com atenção\n')

