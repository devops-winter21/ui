import {Organization} from '../../../src/types'
import {points} from '../../support/commands'

describe('simple table interactions', () => {
  const simpleSmall = 'simple-small'
  const simpleLarge = 'simple-large'
  const simpleOverflow = 'simple-overflow'
  beforeEach(() => {
    cy.flush().then(() =>
      cy.signin().then(() => {
        cy.get('@org').then(({id: orgID}: Organization) => {
          cy.fixture('routes').then(({orgs, explorer}) => {
            cy.visit(`${orgs}/${orgID}${explorer}`)
            cy.getByTestID('tree-nav')
            cy.createBucket(orgID, name, simpleLarge)
            cy.writeData(points(300), simpleLarge)
            cy.createBucket(orgID, name, simpleSmall)
            cy.writeData(points(30), simpleSmall)
            cy.createBucket(orgID, name, simpleOverflow)
            cy.writeData(points(31), simpleOverflow)
            cy.reload()
          })
        })
      })
    )
  })

  it('should render correctly after switching from a dataset with more pages to one with fewer', () => {
    cy.getByTestID('query-builder').should('exist')

    // show raw data view of data with 100 pages
    cy.getByTestID(`selector-list ${simpleLarge}`).should('be.visible')
    cy.getByTestID(`selector-list ${simpleLarge}`).click()

    cy.getByTestID('selector-list m').should('be.visible')
    cy.getByTestID('selector-list m').clickAttached()

    cy.getByTestID('selector-list v').should('be.visible')
    cy.getByTestID('selector-list v').clickAttached()

    cy.getByTestID('selector-list tv1').clickAttached()

    cy.getByTestID('time-machine-submit-button').click()

    cy.getByTestID('raw-data--toggle').click()
    cy.getByTestID('simple-table').should('exist')

    // click last page
    cy.getByTestID('pagination-item')
      .last()
      .should('be.visible')
    cy.getByTestID('pagination-item')
      .last()
      .click()
    // verify correct number of pages
    cy.getByTestID('pagination-item')
      .last()
      .contains('50')

    // show raw data view of data with 10 pages
    cy.getByTestID(`selector-list ${simpleSmall}`).should('be.visible')
    cy.getByTestID(`selector-list ${simpleSmall}`).click()

    cy.getByTestID('selector-list m').should('be.visible')
    cy.getByTestID('selector-list m').clickAttached()

    cy.getByTestID('selector-list v').should('be.visible')
    cy.getByTestID('selector-list v').clickAttached()

    cy.getByTestID('selector-list tv1').clickAttached()

    cy.getByTestID('time-machine-submit-button').click()

    // verify table still exists
    cy.getByTestID('simple-table').should('exist')
    // verify page 1 is selected
    cy.getByTestID('pagination-item')
      .first()
      .within(() => {
        cy.getByTestID('button').should(
          'have.class',
          'cf-button cf-button-md cf-button-tertiary active'
        )
      })
    // verify correct number of pages
    cy.getByTestID('pagination-item')
      .last()
      .should('be.visible')
    cy.getByTestID('pagination-item')
      .last()
      .contains('5')
  })

  it('should render correctly after switching from a dataset with fewer pages to one with more', () => {
    cy.getByTestID('query-builder').should('exist')

    // show raw data view of data with 10 pages
    cy.getByTestID(`selector-list ${simpleSmall}`).should('be.visible')
    cy.getByTestID(`selector-list ${simpleSmall}`).click()

    cy.getByTestID('selector-list m').should('be.visible')
    cy.getByTestID('selector-list m').clickAttached()

    cy.getByTestID('selector-list v').should('be.visible')
    cy.getByTestID('selector-list v').clickAttached()

    cy.getByTestID('selector-list tv1').clickAttached()

    cy.getByTestID('time-machine-submit-button').click()

    cy.getByTestID('raw-data--toggle').click()
    cy.getByTestID('simple-table').should('exist')

    // click last page
    cy.getByTestID('pagination-item')
      .last()
      .should('be.visible')
    cy.getByTestID('pagination-item')
      .last()
      .click()
    // verify correct number of pages
    cy.getByTestID('pagination-item')
      .last()
      .contains('5')

    // show raw data view of data with 100 pages
    cy.getByTestID(`selector-list ${simpleLarge}`).should('be.visible')
    cy.getByTestID(`selector-list ${simpleLarge}`).click()

    cy.getByTestID('selector-list m').should('be.visible')
    cy.getByTestID('selector-list m').clickAttached()

    cy.getByTestID('selector-list v').should('be.visible')
    cy.getByTestID('selector-list v').clickAttached()

    cy.getByTestID('selector-list tv1').clickAttached()

    cy.getByTestID('time-machine-submit-button').click()

    // verify table still exists
    cy.getByTestID('simple-table').should('exist')
    // verify page 1 is selected
    cy.getByTestID('pagination-item')
      .first()
      .within(() => {
        cy.getByTestID('button').should(
          'have.class',
          'cf-button cf-button-md cf-button-tertiary active'
        )
      })
    // verify correct number of pages
    cy.getByTestID('pagination-item')
      .last()
      .should('be.visible')
    cy.getByTestID('pagination-item')
      .last()
      .contains('50')
  })

  it('should not duplicate records from the n-1 page on the nth page', () => {
    cy.getByTestID('query-builder').should('exist')

    // show raw data view of data with 10 pages
    cy.getByTestID(`selector-list ${simpleOverflow}`).should('be.visible')
    cy.getByTestID(`selector-list ${simpleOverflow}`).click()

    cy.getByTestID('selector-list m').should('be.visible')
    cy.getByTestID('selector-list m').clickAttached()

    cy.getByTestID('selector-list v').should('be.visible')
    cy.getByTestID('selector-list v').clickAttached()

    cy.getByTestID('selector-list tv1').clickAttached()

    cy.getByTestID('time-machine-submit-button').click()

    cy.getByTestID('raw-data--toggle').click()
    cy.getByTestID('simple-table').should('exist')

    // click last page
    cy.getByTestID('pagination-item')
      .last()
      .should('be.visible')
    cy.getByTestID('pagination-item')
      .last()
      .click()
    // verify correct number of pages
    cy.getByTestID('pagination-item')
      .last()
      .contains('6')
    // verify only record 31 is on last page
    cy.getByTestID('table-cell 30').should('not.exist')
    cy.getByTestID('table-cell 31').should('be.visible')
  })

  it('should not jump to an incorrect page when going from the last page to any other page via clicking the page number or left button.', () => {
    cy.getByTestID('query-builder').should('exist')

    // show raw data view of data with 10 pages
    cy.getByTestID(`selector-list ${simpleOverflow}`).should('be.visible')
    cy.getByTestID(`selector-list ${simpleOverflow}`).click()

    cy.getByTestID('selector-list m').should('be.visible')
    cy.getByTestID('selector-list m').clickAttached()

    cy.getByTestID('selector-list v').should('be.visible')
    cy.getByTestID('selector-list v').clickAttached()

    cy.getByTestID('selector-list tv1').clickAttached()

    cy.getByTestID('time-machine-submit-button').click()

    cy.getByTestID('raw-data--toggle').click()
    cy.getByTestID('simple-table').should('exist')

    // click last page
    cy.getByTestID('pagination-item')
      .last()
      .should('be.visible')
    cy.getByTestID('pagination-item')
      .last()
      .click()

    // doing 10-7 to be exhaustive
    // click page 10
    cy.getByTestID('pagination-item')
      .eq(4)
      .click()
    cy.getByTestID('table-cell 25').should('be.visible')
    cy.getByTestID('table-cell 26').should('be.visible')
    cy.getByTestID('table-cell 27').should('be.visible')
    cy.getByTestID('table-cell 28').should('be.visible')
    cy.getByTestID('table-cell 29').should('be.visible')
    cy.getByTestID('table-cell 30').should('be.visible')
    cy.getByTestID('pagination-item')
      .last()
      .click()

    // click page 9
    cy.getByTestID('pagination-item')
      .eq(3)
      .click()
    cy.getByTestID('table-cell 19').should('be.visible')
    cy.getByTestID('table-cell 20').should('be.visible')
    cy.getByTestID('table-cell 21').should('be.visible')
    cy.getByTestID('table-cell 22').should('be.visible')
    cy.getByTestID('table-cell 23').should('be.visible')
    cy.getByTestID('table-cell 24').should('be.visible')
    cy.getByTestID('pagination-item')
      .last()
      .click()

    // click page 8
    cy.getByTestID('pagination-item')
      .eq(2)
      .click()
    cy.getByTestID('table-cell 13').should('be.visible')
    cy.getByTestID('table-cell 14').should('be.visible')
    cy.getByTestID('table-cell 15').should('be.visible')
    cy.getByTestID('table-cell 16').should('be.visible')
    cy.getByTestID('table-cell 17').should('be.visible')
    cy.getByTestID('table-cell 18').should('be.visible')
    cy.getByTestID('pagination-item')
      .last()
      .click()

    // click page 7
    cy.getByTestID('pagination-item')
      .eq(1)
      .click()
    cy.getByTestID('table-cell 7').should('be.visible')
    cy.getByTestID('table-cell 8').should('be.visible')
    cy.getByTestID('table-cell 9').should('be.visible')
    cy.getByTestID('table-cell 10').should('be.visible')
    cy.getByTestID('table-cell 11').should('be.visible')
    cy.getByTestID('table-cell 12').should('be.visible')
    cy.getByTestID('pagination-item')
      .last()
      .click()

    // click left button
    cy.getByTestID('pagination-direction-item')
      .eq(0)
      .click()
    cy.getByTestID('table-cell 25').should('be.visible')
    cy.getByTestID('table-cell 26').should('be.visible')
    cy.getByTestID('table-cell 27').should('be.visible')
    cy.getByTestID('table-cell 28').should('be.visible')
    cy.getByTestID('table-cell 29').should('be.visible')
    cy.getByTestID('table-cell 30').should('be.visible')
    cy.getByTestID('pagination-item')
      .last()
      .click()
  })
})
