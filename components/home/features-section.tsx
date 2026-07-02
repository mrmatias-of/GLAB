import { BookOpen, Zap, Users, Trophy } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Guias Detalhados',
    description: 'Documentação técnica completa e atualizada sobre reparos eletrônicos e manutenção de dispositivos.',
  },
  {
    icon: Zap,
    title: 'Aprendizado Prático',
    description: 'Cursos hands-on com passo a passo, vídeos e exemplos reais para acelerar sua aprendizagem.',
  },
  {
    icon: Users,
    title: 'Comunidade Ativa',
    description: 'Conecte-se com outros técnicos, compartilhe conhecimento e resolva problemas juntos.',
  },
  {
    icon: Trophy,
    title: 'Certificação',
    description: 'Ganhe certificados reconhecidos após completar os cursos e demonstrar suas habilidades.',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-32 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-50 mb-4">
            Por Que Escolher G•Lab?
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Recursos completos para transformar você em um especialista técnico
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-600/50 hover:bg-slate-800/80 transition-all hover:shadow-lg hover:shadow-blue-600/10"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 group-hover:bg-blue-600/20 flex items-center justify-center mb-4 transition-colors">
                  <Icon size={24} className="text-blue-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-slate-50 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
