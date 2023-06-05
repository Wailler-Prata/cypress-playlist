import {functionsDevfinance} from '../../funcoes/devfinance'

context('Dev Finances', () => {

    beforeEach(() => {
        cy.visit('/')        
    })

    it('Cadastrar uma entrada positiva', () => {      
        
        cy.fixture('devFinance/entradas.json')
        .then((entrances)=>{

            const positiveEntrance = entrances.filter(item => item.amount >= 0)[0]

            cy.registerEntranceInDevFinance(positiveEntrance.description, positiveEntrance.amount, positiveEntrance.date)
            
            cy.getVisibeElement('#data-table > tbody > tr').its('length', {timeout:0}).should('to.eq', 1)
            cy.verifyEntranceInDataTable( {description: positiveEntrance.description, amount: positiveEntrance.amount, date: positiveEntrance.date})
            cy.verifyCardsValueOfSumValues([positiveEntrance])
        })
    })    

        
    it('Cadastrar uma entrada negativa', () => {

        cy.fixture('devFinance/entradas.json')
        .then((entrances)=>{

            const negativeEntrance = entrances.filter(item => item.amount < 0)[0]
        
            cy.registerEntranceInDevFinance(negativeEntrance.description, negativeEntrance.amount, negativeEntrance.date)
    
            cy.getVisibeElement('#data-table > tbody > tr').its('length', {timeout:0}).should('to.eq', 1)
            cy.verifyEntranceInDataTable( {description: negativeEntrance.description, amount: negativeEntrance.amount, date: negativeEntrance.date})
            cy.verifyCardsValueOfSumValues([negativeEntrance])
        })
    })

    it('Validação de valores dos cards (entradas, saidas e totais) após inserir multiplas entradas', () => {

        cy.fixture('devFinance/entradas.json')
        .then((entrances)=>{

            const negativeEntrance = entrances.filter(item => item.amount < 0)[0]
            const positiveEntrance = entrances.filter(item => item.amount >= 0)[0]

            cy.registerEntranceInDevFinance(negativeEntrance.description, negativeEntrance.amount, negativeEntrance.date)
            cy.registerEntranceInDevFinance(positiveEntrance.description, positiveEntrance.amount, positiveEntrance.date)
            cy.getVisibeElement('#data-table > tbody > tr').its('length', {timeout:0}).should('to.eq', 2)

            cy.verifyCardsValueOfSumValues([negativeEntrance, positiveEntrance])
        })         
    })

    describe('Carregamento das informações em cahe para execução do teste de remoção de entradas', () => {
        
        before(() => {
            cy.fixture('devFinance/entradas.json')
            .then((entrances)=>{
                functionsDevfinance.setLocalStorange('dev.finances:transactions', entrances)
            })            
        })

        it('Remoção de entradas', () => {
            cy.fixture('devFinance/entradas.json')
            .then((entrances)=>{

                cy.getVisibeElement('#data-table > tbody > tr').its('length', {timeout:0}).should('to.gt', 1)
                cy.wrap(entrances).each(()=>{
                    cy.getVisibeElement('#data-table > tbody > tr > td> img ').first().click()
                })
    
                cy.get('#data-table > tbody > tr').should('not.exist')
                cy.verifyCardsValueOfSumValues([{...entrances[0], amount:0}])
            })
        })     
    });
})