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

const profissoes = [
    { value: 'arranjo_geral', label: 'Arranjo Geral', img_cor: require('../assets/professions/arranjo_geral_cor.png') },
    { value: 'canalizador', label: 'Canalizador', img_cor: require('../assets/professions/canalizador_cor.png')},
    { value: 'carpinteiro', label: 'Carpinteiro', img_cor: require('../assets/professions/carpinteiro_cor.png')},
    { value: 'eletricista', label: 'Eletricista', img_cor: require('../assets/professions/eletricista_cor.png')},
    { value: 'empreiteiro', label: 'Empreiteiro', img_cor: require('../assets/professions/empreiteiro_cor.png')},
    { value: 'mudancas', label: 'Mudanças', img_cor: require('../assets/professions/mudancas_cor.png')},
    { value: 'pintor', label: 'Pintor', img_cor: require('../assets/professions/pintor_cor.png')},
    { value: 'piscinas', label: 'Piscinas', img_cor: require('../assets/professions/piscinas_cor.png')},
    { value: 'jardineiro', label: 'Jardineiro', img_cor: require('../assets/professions/jardineiro_cor.png')},
]

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
    arranjo_geral : require('../assets/professions/arranjo_geral_cor.png'),
    canalizador : require('../assets/professions/canalizador_cor.png'),
    carpinteiro : require('../assets/professions/carpinteiro_cor.png'),
    eletricista : require('../assets/professions/eletricista_cor.png'),
    empreiteiro : require('../assets/professions/empreiteiro_cor.png'),
    mudancas : require('../assets/professions/mudancas_cor.png'),
    pintor : require('../assets/professions/pintor_cor.png'),
    piscinas : require('../assets/professions/piscinas_cor.png'),
    jardineiro : require('../assets/professions/jardineiro_cor.png'),
}

module.exports = {
    regioes,
    profissoes,
    regioesOptions,
    profissoesOptions,
    profissoesPngs
}