import Ajv from "ajv"
const ajv = new Ajv()

describe('POST /characters', function () {

    before(function () {
        cy.back2ThePast()
        cy.setToken()
    })

    it('deve cadastrar um personagem', function () {
        const character = {
            name: 'Wanda Maximoff',
            alias: 'Feiticeira Escarlate',
            team: ['vingadores'],
            active: true
        }

        cy.postCharacter(character)
            .then(function(response) {
                expect(response.status).to.eql(201)
                cy.log(response.body.character_id)
                expect(response.body.character_id.length).to.eql(24)
            })
    })

    context('quando o personagem já existe', function () {
        const character = {
            name: 'Pietro Maximoff',
            alias: 'Mercurio',
            team: [
                'vingadores da costa oeste',
                'irmandade de mutantes'
            ],
            active: true
        }

        before(function () {
            cy.postCharacter(character)
                .then(function(response){
                    expect(response.status).to.eql(201)
                })
            })
        
        it('não deve cadastrar duplicado', function () {
            cy.postCharacter(character)
            .then(function(response){
                expect(response.status).to.eql(400)
                expect(response.body.error).to.eql('Duplicate character')
            })
        })
    })
})

describe('POST /characters', function () {
    before(function () {
        cy.back2ThePast()
        cy.setToken()
    })

    it('validar campos obrigatórios', function () {
        const character = {
            name: 'Pietro Maximoff',
            alias: 'Mercurio',
            team: [
            'vingadores da costa oeste',
            'irmandade de mutantes'
            ],
            active: true
        }
    
        cy.postCharacter(character).then((response) => {
            cy.fixture('postSchema').then((postSchema) => {
            const valid = ajv.validate(postSchema)
            if (!valid) console.log(ajv.errors)
            cy.log('Campos validados!')
            expect(response.status).to.eql(201)
            })
        })
    })
})