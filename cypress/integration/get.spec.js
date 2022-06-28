describe('GET /characters', () => {
    const characters = [
        {
            name: 'Charles Xavier',
            alias: 'Professor X',
            team: ['x-men'],
            active: true
        },
        {
            name: 'Logan',
            alias: 'Wolverine',
            team: ['x-men'],
            active: true
        },
        {
            name: 'Peter Parker',
            alias: 'Homem Aranha',
            team: ['novos vingadores'],
            active: true
        }
    ]

    before(() => {
        cy.populateCharacters(characters)
    })

    it('deve retornar uma lista de personagens', () => {
        cy.getCharacters().then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body).to.be.a('array')
            expect(response.body.length).greaterThan(0)
        })
    })

    it('deve buscar personagem por nome', () => {
        cy.searchCharacters('Logan').then((response) => {
            expect(response.status).to.eql(200)
            expect(response.body.length).to.eql(1)
            expect(response.body[0].alias).to.eql('Wolverine')
            expect(response.body[0].team).to.eql(['x-men'])
            expect(response.body[0].active).to.eql(true)
        })
    })
})

describe('GET /characters/id', () => {
    const tonyStark = {
        name: 'Tony Stark',
        alias: 'Homem de Ferro',
        team: [
            'Vingadores'
        ],
        active: true
    }

    context('quando tenho um personagem cadastrado', () => {
        before(() => {
            //todo
            cy.postCharacter(tonyStark).then((response) => {
                Cypress.env('characterId', response.body.character_id)
            })
        })

        it('deve buscar o personagem pelo id', () => {
            const id = Cypress.env('characterId')
            cy.getCharacterById(id).then((response) => {
                expect(response.status).to.eql(200)
                expect(response.body.alias).to.eql('Homem de Ferro')
                expect(response.body.team).to.eql(['Vingadores'])
                expect(response.body.active).to.eql(true)
            })
        })
    })

    it('deve retornar 404 ao buscar por id não cadastrado', () => {
        const id = '62ba25b58d688507220f1c4a'
        cy.getCharacterById(id).then((response) => {
            expect(response.status).to.eql(404)
        })
    })
})