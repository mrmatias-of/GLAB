import Link from 'next/link'
import { Clock, Users, Star } from 'lucide-react'

const courses = [
  {
    id: 1,
    title: 'Reparo de Smartphones',
    description: 'Aprenda técnicas profissionais de reparo de telas, baterias e componentes internos.',
    duration: '12 horas',
    students: '2.3k',
    rating: 4.9,
    level: 'Intermediário',
    color: 'from-blue-600 to-blue-400',
  },
  {
    id: 2,
    title: 'Manutenção de Laptops',
    description: 'Guia completo sobre limpeza, upgrade de hardware e resolução de problemas comuns.',
    duration: '10 horas',
    students: '1.8k',
    rating: 4.8,
    level: 'Intermediário',
    color: 'from-cyan-600 to-cyan-400',
  },
  {
    id: 3,
    title: 'Eletrônica Básica',
    description: 'Fundamentos de eletrônica para iniciantes com foco prático em circuitos.',
    duration: '8 horas',
    students: '3.1k',
    rating: 4.9,
    level: 'Iniciante',
    color: 'from-blue-500 to-cyan-500',
  },
]

export default function CoursesPreview() {
  return (
    <section id="courses" className="py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-50 mb-4">
            Cursos em Destaque
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Comece com os cursos mais populares e avance para especialidades avançadas
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href="/login"
              className="group flex flex-col rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-600/50 hover:bg-slate-800/80 overflow-hidden transition-all hover:shadow-lg hover:shadow-blue-600/10"
            >
              {/* Course Header */}
              <div className={`h-40 bg-gradient-to-br ${course.color} opacity-90 group-hover:opacity-100 transition-opacity`} />

              {/* Course Content */}
              <div className="flex flex-col flex-1 p-6">
                {/* Level Badge */}
                <div className="inline-flex w-fit mb-3">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-600/20 text-blue-300">
                    {course.level}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-semibold text-slate-50 mb-2 group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-slate-400 text-sm mb-6 flex-1">
                  {course.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-700/50 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/login"
            className="inline-block px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold transition-colors border border-slate-700 hover:border-slate-600"
          >
            Ver Todos os Cursos
          </Link>
        </div>
      </div>
    </section>
  )
}
