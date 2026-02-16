/**
 * CacheManager Service
 * Gerencia operações de dados e regras de negócio
 * @module services/CacheManager
 */

/**
 * Serviço para gerenciamento de CacheManager
 */
class CacheManager {
  /**
   * Cria instância do serviço
   */
  constructor() {
    this.data = [];
    this.nextId = 1;
  }
  
  /**
   * Cria novo item
   * @param {Object} item - Dados do item a criar
   * @returns {Object} Item criado com ID
   */
  create(item) {
    const newItem = { ...item, id: this.nextId++, createdAt: new Date() };
    this.data.push(newItem);
    return newItem;
  }
  
  /**
   * Retorna todos os itens
   * @returns {Array} Lista de todos os itens
   */
  findAll() {
    return [...this.data];
  }
  
  /**
   * Busca item por ID
   * @param {number} id - ID do item
   * @returns {Object|undefined} Item encontrado
   */
  findById(id) {
    return this.data.find(item => item.id === id);
  }
}

module.exports = CacheManager;
