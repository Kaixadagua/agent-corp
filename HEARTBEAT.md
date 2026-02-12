# Agent-Corp Heartbeat - Qualidade do Código
# Este arquivo é lido pelo agente a cada heartbeat (30 min)

## Checklist de Verificação

### Código e Qualidade
- [ ] Verificar se há arquivos criados sem testes
- [ ] Verificar se há código duplicado ou redundante
- [ ] Verificar se documentação JSDoc está presente
- [ ] Verificar se ESLint passa sem erros

### Git e Workflow
- [ ] Verificar se há branches antigas (>> 1 dia) não mergeadas
- [ ] Verificar se há PRs abertos pendentes
- [ ] Verificar se há conflitos de merge não resolvidos
- [ ] Verificar se auto-commit está funcionando

### Métricas do Projeto
- [ ] Contar quantos utils foram criados hoje
- [ ] Contar quantos testes foram adicionados
- [ ] Verificar cobertura de código (se disponível)
- [ ] Verificar se dashboard está atualizado

### Progresso
- [ ] Verificar se fases do projeto estão avançando
- [ ] Identificar gargalos ou bloqueios
- [ ] Sugerir próximas prioridades

## Ações Automáticas

Se encontrar arquivos não commitados:
→ Executar auto-commit

Se encontrar código sem testes:
→ Criar testes automaticamente

Se encontrar branches antigas:
→ Sugerir merge ou cleanup

## Resposta

Se tudo estiver funcionando corretamente:
→ Responder HEARTBEAT_OK

Se houver problemas ou oportunidades de melhoria:
→ Criar tasks de correção ou otimização
