const regioes = [
    { value: 'acores', label: 'Açores' },
    { value: 'aveiro', label: 'Aveiro' },
    { value: 'beja', label: 'Beja' },
    { value: 'braga', label: 'Braga' },
    { value: 'braganca', label: 'Bragança' },
    { value: 'castelo_branco', label: 'Castelo Branco' },
    { value: 'coimbra', label: 'Coimbra' },
    { value: 'evora', label: 'Évora' },
    { value: 'faro', label: 'Faro' },
    { value: 'guarda', label: 'Guarda' },
    { value: 'leiria', label: 'Leiria' },
    { value: 'lisboa', label: 'Lisboa' },
    { value: 'madeira', label: 'Madeira' },
    { value: 'portalegre', label: 'Portalegre' },
    { value: 'porto', label: 'Porto' },
    { value: 'santarem', label: 'Santarém' },
    { value: 'setubal', label: 'Setúbal' },
    { value: 'viana_do_castelo', label: 'Viana do Castelo' },
    { value: 'vila_real', label: 'Vila Real' },
    { value: 'viseu', label: 'Viseu' }
]
const regioesOptions = {
    acores : 'Açores',
    aveiro : 'Aveiro',
    beja : 'Beja',
    braga : 'Braga',
    braganca : 'Bragança',
    castelo_branco : 'Castelo Branco',
    coimbra : 'Coimbra',
    evora : 'Évora',
    faro : 'Faro',
    guarda : 'Guarda',
    leiria : 'Leiria',
    lisboa : 'Lisboa',
    madeira : 'Madeira',
    portalegre : 'Portalegre',
    porto : 'Porto',
    santarem : 'Santarém',
    setubal : 'Setúbal',
    viana_do_castelo : 'Viana do Castelo',
    vila_real : 'Vila Real',
    viseu : 'Viseu'
}

const profissoesOptions = {
    arranjo_geral : 'Arranjo Geral',
    canalizador : 'Canalizador',
    carpinteiro : 'Carpinteiro',
    eletricista : 'Eletricista',
    empreiteiro : 'Empreiteiro',
    mudancas : 'Mudanças',
    pintor : 'Pintor',
    piscinas : 'Piscinas',
    jardineiro : 'Jardineiro',
}

const profissoesPngs = {
    // arranjo_geral : require('../assets/professions/arranjo_geral_cor.png'),
    canalizador : require('../assets/professions/canalizador_cor.png'),
    carpinteiro : require('../assets/professions/carpinteiro_cor.png'),
    eletricista : require('../assets/professions/eletricista_cor.png'),
    build : require('../assets/professions/empreiteiro_cor.png'),
    mudancas : require('../assets/professions/mudancas_cor.png'),
    pintor : require('../assets/professions/pintor_cor.png'),
    piscinas : require('../assets/professions/piscinas_cor.png'),
    jardineiro : require('../assets/professions/jardineiro_cor.png'),
    animal: require('../assets/professions/paw-print.png'),
    auto: require('../assets/professions/car.png'),
    advogado: require('../assets/professions/line.png'),
    arquiteto: require('../assets/professions/blueprint.png'),
    clothes: require('../assets/professions/clothes.png'),
    advogado: require('../assets/professions/line.png'),
}

const profissoes = [
    { value: 'canalizador', label: 'Canalizador', img: profissoesPngs['canalizador']},
    { value: 'carpinteiro', label: 'Carpinteiro', img: profissoesPngs['carpinteiro']},
    { value: 'eletricista', label: 'Eletricista', img: profissoesPngs['eletricista']},
    { value: 'empreiteiro', label: 'Empreiteiro', img: profissoesPngs['empreiteiro']},
    { value: 'jardineiro', label: 'Jardineiro', img: profissoesPngs['jardineiro']},
    { value: 'mudancas', label: 'Mudanças', img: profissoesPngs['mudancas']},
    { value: 'pintor', label: 'Pintor', img: profissoesPngs['pintor']},
    { value: 'piscinas', label: 'Piscinas', img: profissoesPngs['piscinas']},
]

const profissoes_animais = [
    { value: 'lavagem_e_tosquia', label: 'Lavagem e Tosquia', img: profissoesPngs['animal']},
    { value: 'passear', label: 'Passear', img: profissoesPngs['animal']},
    { value: 'geral', label: 'Geral', img: profissoesPngs['animal']},
]

const profissoes_financas = [
    { value: 'contabilista', label: 'Contabilista', img: profissoesPngs['finance']},
    { value: 'credito_e_emprestimos', label: 'Credito e Empréstimos', img: profissoesPngs['finance']},
    { value: 'geral', label: 'Geral', img: profissoesPngs['finance']},
]

const profissoes_construcao = [
    { value: 'azulejos', label: 'Azulejos', img: profissoesPngs['build']},
    { value: 'demolicao', label: 'Demolição', img: profissoesPngs['build']},
    { value: 'estucador', label: 'Estucador', img: profissoesPngs['build']},
    { value: 'pequenos_arranjos', label: 'Pequenos Arranjos', img: profissoesPngs['build']},
    { value: 'pintor', label: 'Pintor', img: profissoesPngs['build']},
    { value: 'remocao_de_entulho', label: 'Remoção de Entulho', img: profissoesPngs['build']},
    { value: 'geral', label: 'Geral', img: profissoesPngs['build']},
]

const profissoes_automoveis = [
    { value: 'bate_chapa', label: 'Bate-Chapa', img: profissoesPngs['auto']},
    { value: 'estofador', label: 'Estofador', img: profissoesPngs['auto']},
    { value: 'mecanico', label: 'Mecânico', img: profissoesPngs['auto']},
    { value: 'vidros', label: 'Vidros', img: profissoesPngs['auto']},
    { value: 'geral', label: 'Geral', img: profissoesPngs['auto']},
]

const profissoes_vestuario = [
    { value: 'costura', label: 'Costura', img: profissoesPngs['clothes']},
    { value: 'lavagem_e_engomacao', label: 'Lavagem e Engomação', img: profissoesPngs['clothes']},
    { value: 'sapateiro', label: 'Sapateiro', img: profissoesPngs['clothes']},
    { value: 'geral', label: 'Geral', img: profissoesPngs['clothes']},
]

const profissoes_limpeza = [
    { value: 'chamines', label: 'Chaminés', img: profissoesPngs['clean']},
    { value: 'domestica', label: 'Doméstica', img: profissoesPngs['clean']},
    { value: 'fachadas', label: 'Fachadas', img: profissoesPngs['clean']},
    { value: 'geral', label: 'Geral', img: profissoesPngs['clean']},
]

const profissoesGrouped = [
    {
        label: 'no-label',
        options: [{ value: 'advogado', label: 'Advogado',  img: profissoesPngs['advogado'], solo: true}],
    },
    {
        label: 'Animais',
        options: profissoes_animais,
        img: profissoesPngs['animal']
    },
    {
        label: 'no-label',
        options: [{ value: 'arquiteto', label: 'Arquiteto', img: profissoesPngs['arquiteto'], solo: true}],
    },
    {
        label: 'Auto',
        options: profissoes_automoveis,
        img: profissoesPngs['auto']
    },
    {
        label: 'no-label',
        options: [{ value: 'ar_condicionados', label: 'Ar-Condicionados' }],
    },
    {
        label: 'no-label',
        options: [{ value: 'babysitter', label: 'Baby-sitter' }],
    },
    {
        label: 'no-label',
        options: [{ value: 'canalizador', label: 'Canalizador' }],
    },
    {
        label: 'no-label',
        options: [{ value: 'carpinteiro', label: 'Carpinteiro' }],
    },
    {
        label: 'Construção',
        options: profissoes_construcao,
        img: profissoesPngs['build']
    },
    {
        label: 'no-label',
        options: [{ value: 'culinaria_e_catering', label: 'Culinaria e Catering' }],
    },
    {
        label: 'no-label',
        options: [{ value: 'decoracao_e_interiores', label: 'Decoração e Interiores' }],
    },
    {
        label: 'no-label',
        options: [{ value: 'desenho_e_ilustracao', label: 'Desenho e Ilustração' }],
    },
    {
        label: 'no-label',
        options: [{ value: 'designer_grafico', label: 'Designer Gráfico' }],
    },
    {
        label: 'no-label',
        options: [{ value: 'desporto', label: 'Desporto' }],
    },
    {
        label: 'no-label',
        options: [{ value: 'eletricista', label: 'Eletricista', img: profissoesPngs['eletricista'] }],
    },
    {
        label: 'no-label',
        options: [{ value: 'energias_verdes', label: 'Energias Verdes' }],
    },
    {
        label: 'no-label',
        options: [{ value: 'estofador', label: 'Estofador' }],
    },
    {
        label: 'no-label',
        options: [{ value: 'explicador', label: 'Explicador' }],
    },
    {
        label: 'Finanças',
        options: profissoes_financas,
        img: profissoesPngs['finance']
    },
    {
        label: 'no-label',
        options: [{ value: 'fotografia', label: 'Fotografia' }],
    },
    {
        label: 'no-label',
        options: [{ value: 'informatica', label: 'Informática' }],
    },
    {
        label: 'no-label',
        options: [{ value: 'jardinagem', label: 'Jardinagem', img: profissoesPngs['jardineiro'] }],
    },
    {
        label: 'no-label',
        options: [{ value: 'joelheria', label: 'Joelheria' }],
    },
    {
        label: 'Limpeza',
        options: profissoes_limpeza,
        img: profissoesPngs['clean']
    },
    {
        label: 'no-label',
        options: [{ value: 'motorista', label: 'Motorista' }],
    },
    {
        label: 'no-label',
        options: [{ value: 'mudancas', label: 'Mudanças', img: profissoesPngs['mudancas'] }],
    },
    {
        label: 'no-label',
        options: [{ value: 'musica', label: 'Música' }],
    },
    {
        label: 'no-label',
        options: [{ value: 'piscinas', label: 'Piscinas', img: profissoesPngs['piscinas'] }],
    },
    {
        label: 'no-label',
        options: [{ value: 'publicidade', label: 'Publicidade' }],
    },
    {
        label: 'no-label',
        options: [{ value: 'serralheiro', label: 'Serralheiro' }],
    },
    {
        label: 'no-label',
        options: [{ value: 'soldador', label: 'Soldador' }],
    },
    {
        label: 'no-label',
        options: [{ value: 'traducao', label: 'Tradução' }],
    },
    {
        label: 'no-label',
        options: [{ value: 'turismo', label: 'Turismo' }],
    },
    {
        label: 'Vestuário',
        options: profissoes_vestuario,
        img: profissoesPngs['clothes']
    },
    {
        label: 'no-label',
        options: [{ value: 'outros', label: 'Outros' }],
    },
]

module.exports = {
    regioes,
    profissoes,
    regioesOptions,
    profissoesOptions,
    profissoesPngs,
    profissoesGrouped
}