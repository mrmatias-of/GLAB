export type CursoCatalogo = { id: string; slug: string; titulo: string; descricao: string; trilha: "fundamentos" | "diagnostico" | "gestao" | "performance"; nivel: string; imagem: string; destaque?: boolean; modulos: string[] }

const curso = (id: string, slug: string, titulo: string, descricao: string, trilha: CursoCatalogo["trilha"], nivel: string, imagem: string, modulos: string[], destaque = false): CursoCatalogo => ({ id, slug, titulo, descricao, trilha, nivel, imagem, modulos, destaque })

export const CATALOGO: CursoCatalogo[] = [
  curso("01", "combo-iniciante-mobile", "Combo Iniciante Mobile", "A base completa para começar na assistência técnica com segurança e método.", "fundamentos", "Iniciante", "/images/combo/combo-iniciante.webp", ["Montagem da bancada", "Ferramentas essenciais", "Diagnóstico inicial", "Boas práticas"], true),
  curso("02", "guia-troca-de-tela", "Troca de Tela Profissional", "Desmontagem, preparação, aplicação e testes com acabamento premium.", "fundamentos", "Iniciante", "/images/course-troca-tela-v2.png", ["Triagem", "Desmontagem segura", "Aplicação e vedação", "Testes de qualidade"]),
  curso("03", "guia-troca-de-bateria", "Troca de Bateria Segura", "Remoção, instalação, calibração e validação de baterias.", "fundamentos", "Iniciante", "/images/samsung.png", ["Segurança com lítio", "Remoção", "Instalação", "Calibração"]),
  curso("04", "guia-conectores-carga", "Conectores de Carga", "Diagnóstico e substituição com soldagem e controle térmico.", "fundamentos", "Intermediário", "/images/diagnostico.png", ["Diagnóstico", "Remoção", "Preparação das ilhas", "Soldagem"]),
  curso("05", "guia-software-celular", "Software para Celulares", "Atualização, restauração, backup e correção das falhas mais frequentes.", "fundamentos", "Iniciante", "/images/samsung.png", ["Backup", "Firmware", "Restauração", "Testes"]),
  curso("06", "guia-diagnostico-avancado", "Diagnóstico Avançado", "Método técnico para isolar falhas, medir circuitos e decidir com precisão.", "diagnostico", "Avançado", "/images/diagnostico.png", ["Raciocínio", "Medições", "Leitura de sintomas", "Confirmação"], true),
  curso("07", "guia-consumo-eletrico", "Análise de Consumo Elétrico", "Interprete padrões na fonte e encontre setores defeituosos rapidamente.", "diagnostico", "Avançado", "/images/diagnostico.png", ["Fonte assimétrica", "Padrões", "Sequência de start", "Casos reais"]),
  curso("08", "guia-curto-em-placa", "Curto em Placa", "Localização de curto com medições e técnicas térmicas.", "diagnostico", "Avançado", "/hero-tech-pcb.jpg", ["Mapeamento", "Injeção de tensão", "Detecção térmica", "Validação"]),
  curso("09", "guia-esquema-eletrico", "Leitura de Esquema Elétrico", "Navegue em esquemas e boardviews para rastrear sinais e alimentações.", "diagnostico", "Intermediário", "/hero-tech-pcb.jpg", ["Símbolos", "Alimentação", "Sinais", "Boardview"]),
  curso("10", "guia-pmic-alimentacao", "PMIC e Alimentação", "Arquitetura de alimentação, sequência de start e gerenciamento de energia.", "diagnostico", "Avançado", "/hero-tech-pcb.jpg", ["Arquitetura", "Tensões primárias", "Start", "Falhas"]),
  curso("11", "guia-radiofrequencia", "Radiofrequência Mobile", "Diagnóstico dos setores de rede, Wi‑Fi, Bluetooth e comunicação RF.", "diagnostico", "Avançado", "/images/diagnostico.png", ["Fundamentos", "Caminho do sinal", "Antenas", "Diagnóstico"]),
  curso("12", "guia-falhas-intermitentes", "Falhas Intermitentes", "Estratégias para reproduzir, monitorar e confirmar defeitos instáveis.", "diagnostico", "Avançado", "/images/iphone.png", ["Evidências", "Estresse", "Inspeção", "Validação"]),
  curso("13", "guia-perifericos", "Periféricos e Sensores", "Câmeras, áudio, biometria, sensores e outros subsistemas.", "diagnostico", "Intermediário", "/images/samsung.png", ["Câmeras", "Áudio", "Biometria", "Testes"]),
  curso("14", "guia-precificacao-profissional", "Precificação Profissional", "Preços sustentáveis considerando custos, risco, margem e posicionamento.", "gestao", "Iniciante", "/images/gestao.png", ["Custos", "Margem e risco", "Tabela", "Valor"], true),
  curso("15", "guia-padronizacao-bancada", "Padronização da Bancada", "Checklists, organização e controle de qualidade para profissionalizar a operação.", "gestao", "Intermediário", "/images/gestao.png", ["Atendimento", "Organização", "Checklists", "Qualidade"]),
  curso("16", "guia-otimizacao-pc-gamer", "Otimização de PC Gamer", "Diagnóstico, estabilidade e performance para computadores otimizados.", "performance", "Intermediário", "/images/pc.png", ["Gargalos", "Temperatura", "Sistema e drivers", "Benchmarks"]),
]

export const encontrarCurso = (slug: string) => CATALOGO.find((item) => item.slug === slug)
